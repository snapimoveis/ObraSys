import { useState, useMemo, useEffect } from 'react';
import { ApprovalRequest, ApprovalStatus, ApprovalHistory } from '../types';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, QuerySnapshot } from 'firebase/firestore';

export const useApprovals = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const companyId = getCurrentCompanyId();

  useEffect(() => {
    if (!companyId) return;

    const q = query(collection(db, 'approvals'), where('companyId', '==', companyId));
    
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApprovalRequest));
      setApprovals(data);
    });

    return () => unsubscribe();
  }, [companyId]);

  const processApproval = async (id: string, action: 'APPROVE' | 'REJECT' | 'HOLD', note: string, user: string) => {
    const req = approvals.find(a => a.id === id);
    if (!req) return;

    let newStatus: ApprovalStatus = req.status;
    if (action === 'APPROVE') newStatus = 'APPROVED';
    if (action === 'REJECT') newStatus = 'REJECTED';
    if (action === 'HOLD') newStatus = 'ON_HOLD';

    const newHistoryItem: ApprovalHistory = {
      id: Date.now().toString(),
      action: action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'ON_HOLD',
      user,
      date: new Date().toISOString(),
      note
    };

    try {
      await updateDoc(doc(db, 'approvals', id), {
        status: newStatus,
        history: [newHistoryItem, ...req.history]
      });
    } catch (e) {
      console.error("Error processing approval:", e);
    }
  };

  const pendingCount = useMemo(() => approvals.filter(a => a.status === 'PENDING').length, [approvals]);
  const urgentCount = useMemo(() => approvals.filter(a => a.status === 'PENDING' && (a.priority === 'HIGH' || a.priority === 'CRITICAL')).length, [approvals]);

  return {
    approvals,
    pendingCount,
    urgentCount,
    processApproval
  };
};