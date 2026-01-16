import { useState, useMemo, useEffect } from 'react';
import { RealCost, CostType } from '../types';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, QuerySnapshot } from 'firebase/firestore';

export const useRealCosts = (workId: string) => {
  const [costs, setCosts] = useState<RealCost[]>([]);
  const companyId = getCurrentCompanyId();

  useEffect(() => {
    if (!workId || !companyId) return;

    const q = query(
      collection(db, 'realCosts'), 
      where('workId', '==', workId),
      where('companyId', '==', companyId)
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RealCost));
      // Sort desc by date
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCosts(data);
    });

    return () => unsubscribe();
  }, [workId, companyId]);

  const addCost = async (cost: Omit<RealCost, 'id'>) => {
    if (!companyId) return;
    try {
      await addDoc(collection(db, 'realCosts'), {
        ...cost,
        companyId,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding cost:", e);
    }
  };

  const deleteCost = async (id: string) => {
    if (confirm("Apagar despesa?")) {
      try {
        await deleteDoc(doc(db, 'realCosts', id));
      } catch (e) {
        console.error("Error deleting cost:", e);
      }
    }
  };

  const stats = useMemo(() => {
    const total = costs.reduce((acc, c) => acc + c.amount, 0);
    const byType = costs.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + c.amount;
      return acc;
    }, {} as Record<CostType, number>);

    return { total, byType };
  }, [costs]);

  return {
    costs,
    addCost,
    deleteCost,
    stats
  };
};