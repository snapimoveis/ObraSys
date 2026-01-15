import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { AuditLog, ComplianceItem } from "./types";

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

/**
 * Trigger: On User Create
 * Sets Custom Claims for RBAC and Multi-tenancy isolation.
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  // Logic to find user invitation or default assignment
  // For safety, start with no access until Admin assigns
  const customClaims = {
    companyId: null, 
    role: null
  };
  
  // In a real app, you'd look up an 'invitations' collection here
  
  await admin.auth().setCustomUserClaims(user.uid, customClaims);
  
  await db.collection("users").doc(user.uid).set({
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'PENDING_ASSIGNMENT'
  });
});

// --- 2. APPROVAL ENGINE (GATEKEEPER) ---

/**
 * Callable: Process Approval
 * Central function to approve Budgets, Autos, RDOs.
 * strictly enforces Compliance checks.
 */
export const processApproval = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  
  const { approvalId, decision, note } = data; // decision: 'APPROVE' | 'REJECT'
  const userId = context.auth.uid;
  const companyId = context.auth.token.companyId;

  const approvalRef = db.collection("approvals").doc(approvalId);
  const approvalSnap = await approvalRef.get();

  if (!approvalSnap.exists) throw new functions.https.HttpsError("not-found", "Approval request not found.");
  const approvalData = approvalSnap.data();

  if (approvalData?.companyId !== companyId) throw new functions.https.HttpsError("permission-denied", "Wrong tenant.");
  if (approvalData?.status !== 'PENDING') throw new functions.https.HttpsError("failed-precondition", "Request already processed.");

  // CRITICAL: Compliance Check
  if (decision === 'APPROVE') {
    const isBlocked = await isBlockedByCompliance(approvalData.workId, companyId);
    if (isBlocked) {
      throw new functions.https.HttpsError("failed-precondition", "Action blocked by CRITICAL COMPLIANCE issues.");
    }
  }

  const batch = db.batch();

  // 1. Update Approval Doc
  batch.update(approvalRef, {
    status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
    processedBy: userId,
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
    note: note || ''
  });

  // 2. Trigger Domain Logic based on Type
  const entityRef = db.collection(approvalData.collectionName).doc(approvalData.entityId);
  
  if (decision === 'APPROVE') {
    batch.update(entityRef, { status: 'APPROVED', approvedAt: admin.firestore.FieldValue.serverTimestamp() });
  } else {
    batch.update(entityRef, { status: 'REJECTED', rejectedAt: admin.firestore.FieldValue.serverTimestamp() });
  }

  // 3. Audit Log
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

// --- 3. EVENT: BUDGET APPROVED -> CREATE WORK (AUTOMATION) ---

export const onBudgetApproved = functions.firestore
  .document('budgets/{budgetId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    // Trigger only on status change to APPROVED
    if (newData.status === 'APPROVED' && previousData.status !== 'APPROVED') {
      const budgetId = context.params.budgetId;
      const companyId = newData.companyId;

      const batch = db.batch();

      // 1. Create Work Entity
      const workRef = db.collection('works').doc(); // Auto ID
      const workData = {
        companyId,
        budgetId,
        title: newData.title,
        client: newData.client,
        location: newData.projectLocation,
        totalBudget: newData.totalPrice,
        status: 'PLANNING', // Initial state
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        executedValue: 0,
        physicalProgress: 0,
        financialProgress: 0
      };
      batch.set(workRef, workData);

      // 2. Generate Initial Schedule Structure
      // Maps Budget Chapters -> Schedule Phases
      if (newData.chapters) {
        const scheduleRef = db.collection('schedules').doc(workRef.id); // Same ID as Work for 1:1
        const phases = newData.chapters.map((chap: any) => ({
          id: db.collection('tmp').doc().id,
          name: chap.name,
          budgetChapterId: chap.id,
          tasks: chap.subChapters.map((sub: any) => ({
             id: db.collection('tmp').doc().id,
             name: sub.name,
             budgetRefId: sub.id,
             status: 'PENDING',
             progress: 0,
             weight: sub.totalPrice, // Weighted by cost
             totalValue: sub.totalPrice
          }))
        }));
        
        batch.set(scheduleRef, {
          companyId,
          workId: workRef.id,
          phases: phases,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // 3. Generate Initial Compliance Checklist (Standard Template)
      const complianceTemplate = [
        { requirement: 'Alvará de Construção', type: 'LEGAL', critical: true },
        { requirement: 'Seguro de Obra', type: 'FINANCIAL', critical: true },
        { requirement: 'PSS (Plano de Segurança)', type: 'LEGAL', critical: true },
      ];

      complianceTemplate.forEach(item => {
        const compRef = db.collection('complianceItems').doc();
        batch.set(compRef, {
          companyId,
          workId: workRef.id,
          ...item,
          status: 'PENDING',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`Work created for Budget ${budgetId}`);
    }
});

// --- 4. EVENT: MEASUREMENT APPROVED -> UPDATE FINANCIALS ---

export const onMeasurementApproved = functions.firestore
  .document('measurements/{measureId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    if (newData.status === 'APPROVED' && change.before.data().status !== 'APPROVED') {
      const { workId, companyId, totalCurrentValue } = newData;

      // Update Work KPI (Executed Value)
      await db.runTransaction(async (t) => {
        const workRef = db.collection('works').doc(workId);
        const workDoc = await t.get(workRef);
        if (!workDoc.exists) return;

        const currentExecuted = workDoc.data()?.executedValue || 0;
        const newExecuted = currentExecuted + totalCurrentValue;

        t.update(workRef, { 
          executedValue: newExecuted,
          lastMeasurementDate: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Also Aggregate to Financial Execution Collection
        const finRef = db.collection('financialExecution').doc(workId);
        t.set(finRef, {
           totalExecutedValue: newExecuted,
           lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      });
    }
});

// --- 5. EVENT: REAL COST CREATED -> AGGREGATE ---

export const onRealCostCreated = functions.firestore
  .document('realCosts/{costId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const { workId, amount } = data;

    const finRef = db.collection('financialExecution').doc(workId);
    
    await db.runTransaction(async (t) => {
       const doc = await t.get(finRef);
       const currentCost = doc.exists ? (doc.data()?.totalActualCost || 0) : 0;
       
       t.set(finRef, {
         workId,
         totalActualCost: currentCost + amount,
         lastUpdated: admin.firestore.FieldValue.serverTimestamp()
       }, { merge: true });
    });
});

// --- 6. EVENT: RDO SUBMITTED -> LOCK & UPDATE ---

export const onRDOSubmitted = functions.firestore
  .document('rdoEntries/{rdoId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    if (newData.status === 'SUBMITTED' && change.before.data().status === 'DRAFT') {
       // Logic to process RDO
       // 1. If RDO has Critical Occurrences -> Trigger Compliance Alert
       const criticalOccurrences = (newData.occurrences || []).filter((o: any) => o.critical);
       
       if (criticalOccurrences.length > 0) {
          const batch = db.batch();
          criticalOccurrences.forEach((occ: any) => {
             const compRef = db.collection('complianceItems').doc();
             batch.set(compRef, {
                companyId: newData.companyId,
                workId: newData.workId,
                requirement: `RDO #${newData.number}: ${occ.type} - ${occ.description}`,
                type: 'TECHNICAL',
                status: 'NON_COMPLIANT',
                critical: true,
                source: 'RDO'
             });
          });
          await batch.commit();
       }

       // 2. Log Audit
       await logAudit({
         companyId: newData.companyId,
         entity: 'RDO',
         entityId: context.params.rdoId,
         action: 'SUBMIT',
         userId: newData.responsible, // Ideally from context if available or field
         timestamp: new Date().toISOString()
       });
    }
});
