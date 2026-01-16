import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { AuditLog, ComplianceItem, Ticket } from "./types";

admin.initializeApp();
const db = admin.firestore();

// --- HELPERS ---

/**
 * Creates an immutable audit log entry.
 */
async function logAudit(entry: AuditLog) {
  await db.collection("auditLogs").add({
    ...entry,
    serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Checks if a Work has blocking compliance issues.
 * Returns true if action should be blocked.
 */
async function isBlockedByCompliance(workId: string, companyId: string): Promise<boolean> {
  const snapshot = await db.collection("complianceItems")
    .where("companyId", "==", companyId)
    .where("workId", "==", workId)
    .where("critical", "==", true)
    .get();

  // Block if any critical item is NOT Compliant or Waived
  const blocked = snapshot.docs.some(doc => {
    const data = doc.data() as ComplianceItem;
    return data.status === 'PENDING' || data.status === 'NON_COMPLIANT';
  });

  return blocked;
}

// --- 1. AUTHENTICATION & MULTI-TENANCY ---

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const customClaims = {
    companyId: null, 
    role: null
  };
  await admin.auth().setCustomUserClaims(user.uid, customClaims);
  await db.collection("users").doc(user.uid).set({
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'PENDING_ASSIGNMENT'
  });
});

// --- 2. APPROVAL ENGINE (GATEKEEPER) ---

export const processApproval = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  
  const { approvalId, decision, note } = data;
  const userId = context.auth.uid;
  const companyId = context.auth.token.companyId;

  const approvalRef = db.collection("approvals").doc(approvalId);
  const approvalSnap = await approvalRef.get();

  if (!approvalSnap.exists) throw new functions.https.HttpsError("not-found", "Approval request not found.");
  const approvalData = approvalSnap.data();

  if (approvalData?.companyId !== companyId) throw new functions.https.HttpsError("permission-denied", "Wrong tenant.");
  if (approvalData?.status !== 'PENDING') throw new functions.https.HttpsError("failed-precondition", "Request already processed.");

  if (decision === 'APPROVE') {
    const isBlocked = await isBlockedByCompliance(approvalData.workId, companyId);
    if (isBlocked) {
      throw new functions.https.HttpsError("failed-precondition", "Action blocked by CRITICAL COMPLIANCE issues.");
    }
  }

  const batch = db.batch();

  batch.update(approvalRef, {
    status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
    processedBy: userId,
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
    note: note || ''
  });

  const entityRef = db.collection(approvalData.collectionName).doc(approvalData.entityId);
  
  if (decision === 'APPROVE') {
    batch.update(entityRef, { status: 'APPROVED', approvedAt: admin.firestore.FieldValue.serverTimestamp() });
  } else {
    batch.update(entityRef, { status: 'REJECTED', rejectedAt: admin.firestore.FieldValue.serverTimestamp() });
  }

  await logAudit({
    companyId,
    entity: 'APPROVAL',
    entityId: approvalId,
    action: decision,
    userId,
    timestamp: new Date().toISOString()
  });

  await batch.commit();
  return { success: true };
});

// --- 3. EXISTING AUTOMATIONS (Work, Measurement, Costs, RDO) ---
// (Kept separate for brevity, assuming they are in the same file as per previous context)
// ... [Previous Automations Code] ...

// --- 7. TICKET SYSTEM AUTOMATIONS ---

/**
 * Ticket Creation Trigger
 * 1. Assigns Readable ID (TCK-YYYY-SEQ)
 * 2. Sets Timestamps
 * 3. Logs Audit
 */
export const onTicketCreated = functions.firestore
  .document('tickets/{ticketId}')
  .onCreate(async (snapshot, context) => {
    const ticket = snapshot.data() as Ticket;
    const ticketId = context.params.ticketId;
    const companyId = ticket.companyId;

    const currentYear = new Date().getFullYear();
    const counterRef = db.collection('counters').doc(`tickets_${companyId}_${currentYear}`);

    try {
      const readableId = await db.runTransaction(async (t) => {
        const doc = await t.get(counterRef);
        let seq = 1;
        if (doc.exists) {
          seq = (doc.data()?.sequence || 0) + 1;
        }
        t.set(counterRef, { sequence: seq }, { merge: true });
        return `TCK-${currentYear}-${String(seq).padStart(4, '0')}`;
      });

      await snapshot.ref.update({
        readableId: readableId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      await logAudit({
        companyId,
        entity: 'TICKET',
        entityId: ticketId,
        action: 'CREATE',
        userId: ticket.requesterId,
        timestamp: new Date().toISOString(),
        newValue: { subject: ticket.subject, readableId }
      });

    } catch (error) {
      console.error("Error creating ticket sequence:", error);
    }
});

/**
 * Ticket Update Trigger
 * 1. Updates 'updatedAt'
 * 2. Logs specific field changes to Audit Logs
 */
export const onTicketUpdated = functions.firestore
  .document('tickets/{ticketId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const ticketId = context.params.ticketId;

    // Prevent infinite loop
    if (newData.updatedAt?.toMillis() === oldData.updatedAt?.toMillis()) {
      return change.after.ref.update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    const changes: Record<string, { old: any, new: any }> = {};
    const monitoredFields = ['status', 'priority', 'category', 'assignedTo'];

    monitoredFields.forEach(field => {
      if (newData[field] !== oldData[field]) {
        changes[field] = { old: oldData[field], new: newData[field] };
      }
    });

    if (Object.keys(changes).length > 0) {
      await logAudit({
        companyId: newData.companyId,
        entity: 'TICKET',
        entityId: ticketId,
        action: 'UPDATE',
        userId: 'SYSTEM', // Difficult to get exact user in onUpdate without auth context, implies system/app action
        timestamp: new Date().toISOString(),
        oldValue: changes,
        newValue: 'Field Updates'
      });
    }
});

/**
 * Message Trigger
 * 1. Updates parent ticket 'lastUpdate'
 * 2. If sender is USER, sets status to OPEN/IN_PROGRESS
 * 3. If sender is SUPPORT, sets status to WAITING_CUSTOMER
 */
export const onTicketMessageCreated = functions.firestore
  .document('tickets/{ticketId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const message = snapshot.data();
    const ticketId = context.params.ticketId;
    const ticketRef = db.collection('tickets').doc(ticketId);

    const updates: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      hasUnreadMessages: true // Flag for UI
    };

    if (message.senderType === 'USER') {
      // Re-open ticket if user replies
      const ticketDoc = await ticketRef.get();
      if (ticketDoc.exists && ticketDoc.data()?.status === 'RESOLVED') {
        updates.status = 'IN_PROGRESS';
      }
    } else if (message.senderType === 'SUPPORT') {
      updates.status = 'WAITING_CUSTOMER';
    }

    await ticketRef.update(updates);
});

/**
 * Callable: Create Ticket from AI Chat
 * Takes a transcript/summary and creates a formal ticket.
 */
export const createTicketFromAI = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");

  const { subject, description, priority, category, chatTranscript } = data;
  const companyId = context.auth.token.companyId;
  const userId = context.auth.uid;
  const userEmail = context.auth.token.email;

  if (!subject || !description) {
    throw new functions.https.HttpsError("invalid-argument", "Subject and Description are required.");
  }

  try {
    const ticketRef = await db.collection('tickets').add({
      companyId,
      requesterId: userId,
      requesterEmail: userEmail || 'unknown',
      subject,
      description, // The AI Summary
      status: 'OPEN',
      priority: priority || 'P3',
      category: category || 'TECHNICAL',
      aiGenerated: true,
      transcriptSummary: chatTranscript, // Full context for support agent
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Add the initial message automatically
    await ticketRef.collection('messages').add({
      ticketId: ticketRef.id,
      senderId: userId,
      senderType: 'USER',
      content: `[Gerado via IA] ${description}\n\nContexto original: ${chatTranscript.substring(0, 200)}...`,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, ticketId: ticketRef.id };
  } catch (error) {
    console.error("Error creating AI ticket:", error);
    throw new functions.https.HttpsError("internal", "Could not create ticket.");
  }
});
