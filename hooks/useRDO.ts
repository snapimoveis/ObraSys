
import { useState, useMemo, useEffect } from 'react';
import { RDO, Work } from '../types';
import { generateEmptyRDO } from '../utils/rdoUtils';
import { db } from '../services/firebase';
import { useSession } from '../contexts/SessionContext';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, QuerySnapshot } from 'firebase/firestore';

export const useRDO = (work: Work | null) => {
  const { companyId } = useSession();
  const [rdos, setRdos] = useState<RDO[]>([]);
  const [currentRDO, setCurrentRDO] = useState<RDO | null>(null);

  useEffect(() => {
    if (!work || !companyId) return;

    const q = query(
      collection(db, 'rdoEntries'), 
      where('workId', '==', work.id),
      where('companyId', '==', companyId)
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RDO));
      setRdos(data);
    });

    return () => unsubscribe();
  }, [work, companyId]);

  const createDraftRDO = () => {
    if (!work) return;
    const nextNumber = rdos.length + 1;
    const today = new Date().toISOString();
    const newRDO = generateEmptyRDO(work.id, today, nextNumber);
    setCurrentRDO({ ...newRDO, id: 'temp_draft' }); 
  };

  /**
   * Fix: Added updateDraftRDO function to meet the requirements of components/site-log/SiteLogOverview.tsx
   */
  const updateDraftRDO = (field: keyof RDO, value: any) => {
    if (!currentRDO) return;
    setCurrentRDO({ ...currentRDO, [field]: value });
  };

  const saveDraft = async () => {
    if (!currentRDO || !companyId) return;
    try {
      if (currentRDO.id === 'temp_draft') {
        const { id, ...data } = currentRDO;
        await addDoc(collection(db, 'rdoEntries'), { ...data, companyId });
      } else {
        await updateDoc(doc(db, 'rdoEntries', currentRDO.id), currentRDO as any);
      }
    } catch (e) {
      console.error("Error saving RDO:", e);
    }
  };

  /**
   * Fix: Added submitRDO function to meet the requirements of components/site-log/SiteLogOverview.tsx
   */
  const submitRDO = async () => {
    if (!currentRDO || !companyId) return;
    
    const submittedRDO: Partial<RDO> = {
      ...currentRDO,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      submittedBy: 'Administrador'
    };

    try {
      if (currentRDO.id === 'temp_draft') {
        const { id, ...data } = submittedRDO as RDO;
        await addDoc(collection(db, 'rdoEntries'), { ...data, companyId });
      } else {
        await updateDoc(doc(db, 'rdoEntries', currentRDO.id), submittedRDO as any);
      }
      setCurrentRDO(null);
    } catch (e) {
      console.error("Error submitting RDO:", e);
    }
  };

  // Fix: Returned updateDraftRDO and submitRDO
  return { rdos, currentRDO, createDraftRDO, updateDraftRDO, saveDraft, submitRDO, viewRDO: setCurrentRDO, cancelEdit: () => setCurrentRDO(null) };
};
