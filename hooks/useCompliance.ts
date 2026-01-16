
import { useState, useMemo, useEffect } from 'react';
import { ComplianceItem, ComplianceStatus, AuditLog } from '../types';
import { db } from '../services/firebase';
import { useSession } from '../contexts/SessionContext';
import { collection, query, where, onSnapshot, updateDoc, doc, QuerySnapshot } from 'firebase/firestore';

export const useCompliance = (workId: string | undefined) => {
  const { companyId, userId } = useSession();
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(false);

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
    }, (err) => {
      console.error("Firestore compliance fetch error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workId, companyId]);

  const updateStatus = async (itemId: string, newStatus: ComplianceStatus, userName: string, reason?: string, evidence?: string) => {
    if (!companyId) return;
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const log: AuditLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        user: userName || 'Utilizador',
        action: 'UPDATE_STATUS',
        previousValue: item.status,
        newValue: newStatus,
        reason: reason || 'Atualização manual'
    };

    const updates: any = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        auditTrail: [log, ...item.auditTrail]
    };

    if (evidence !== undefined) updates.evidence = evidence;

    try {
        await updateDoc(doc(db, 'complianceItems', itemId), updates);
    } catch (e) {
        console.error("Error updating compliance status:", e);
    }
  };

  /**
   * Fix: Added addEvidence function to meet the requirements of components/Compliance.tsx
   */
  const addEvidence = async (itemId: string, evidence: string, userName: string) => {
    if (!companyId) return;
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const log: AuditLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        user: userName || 'Utilizador',
        action: 'ADD_EVIDENCE',
        newValue: evidence,
    };

    const updates: any = {
        evidence: evidence,
        lastUpdated: new Date().toISOString(),
        auditTrail: [log, ...item.auditTrail]
    };

    try {
        await updateDoc(doc(db, 'complianceItems', itemId), updates);
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

  // Fix: Returned addEvidence
  return { items, loading, stats, updateStatus, addEvidence };
};
