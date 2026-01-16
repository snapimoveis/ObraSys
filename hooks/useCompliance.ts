import { useState, useMemo, useEffect } from 'react';
import { ComplianceItem, ComplianceStatus, AuditLog } from '../types';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, QuerySnapshot } from 'firebase/firestore';

export const useCompliance = (workId: string | undefined) => {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const companyId = getCurrentCompanyId();

  // Load items from Firestore
  useEffect(() => {
    if (!workId || !companyId) {
      setItems([]);
      return;
    }
    
    setLoading(true);
    const q = query(
      collection(db, 'complianceItems'), 
      where('workId', '==', workId),
      where('companyId', '==', companyId)
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplianceItem));
      setItems(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workId, companyId]);

  const updateStatus = async (itemId: string, newStatus: ComplianceStatus, user: string, reason?: string, evidence?: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const log: AuditLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        user,
        action: 'UPDATE_STATUS',
        previousValue: item.status,
        newValue: newStatus,
        reason: reason || 'Atualização manual'
    };

    const updates: Partial<ComplianceItem> = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        auditTrail: [log, ...item.auditTrail]
    };

    if (evidence !== undefined) {
        updates.evidence = evidence;
    }

    try {
        await updateDoc(doc(db, 'complianceItems', itemId), updates);
    } catch (e) {
        console.error("Error updating compliance status:", e);
    }
  };

  const addEvidence = async (itemId: string, note: string, user: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const log: AuditLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        user,
        action: 'ADD_EVIDENCE',
        newValue: note,
    };

    try {
        await updateDoc(doc(db, 'complianceItems', itemId), {
            evidence: note,
            lastUpdated: new Date().toISOString(),
            auditTrail: [log, ...item.auditTrail]
        });
    } catch (e) {
        console.error("Error adding evidence:", e);
    }
  };

  const stats = useMemo(() => {
    const total = items.length;
    const compliant = items.filter(i => i.status === 'COMPLIANT' || i.status === 'WAIVED').length;
    const pending = items.filter(i => i.status === 'PENDING').length;
    const criticalIssues = items.filter(i => i.critical && (i.status === 'NON_COMPLIANT' || i.status === 'PENDING')).length;
    const percentage = total > 0 ? (compliant / total) * 100 : 100;

    return { total, compliant, pending, criticalIssues, percentage };
  }, [items]);

  return {
    items,
    loading,
    stats,
    updateStatus,
    addEvidence
  };
};