import { useState, useMemo, useEffect } from 'react';
import { RDO, Work } from '../types';
import { generateEmptyRDO } from '../utils/rdoUtils';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, QuerySnapshot } from 'firebase/firestore';

export const useRDO = (work: Work | null) => {
  const [rdos, setRdos] = useState<RDO[]>([]);
  const [currentRDO, setCurrentRDO] = useState<RDO | null>(null);
  const companyId = getCurrentCompanyId();

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

  const sortedRDOs = useMemo(() => {
    return [...rdos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rdos]);

  const createDraftRDO = () => {
    if (!work) return;
    const nextNumber = rdos.length + 1;
    const today = new Date().toISOString();
    const newRDO = generateEmptyRDO(work.id, today, nextNumber);
    // Temporary ID until saved
    setCurrentRDO({ ...newRDO, id: 'temp_draft' }); 
  };

  const updateDraftRDO = (field: keyof RDO, value: any) => {
    if (!currentRDO) return;
    setCurrentRDO({ ...currentRDO, [field]: value });
  };

  const saveDraft = async () => {
    if (!currentRDO || !companyId) return;
    
    try {
      if (currentRDO.id === 'temp_draft') {
        const { id, ...data } = currentRDO;
        const docRef = await addDoc(collection(db, 'rdoEntries'), { ...data, companyId });
        setCurrentRDO({ ...currentRDO, id: docRef.id });
      } else {
        await updateDoc(doc(db, 'rdoEntries', currentRDO.id), currentRDO);
      }
    } catch (e) {
      console.error("Error saving RDO:", e);
    }
  };

  const submitRDO = async () => {
    if (!currentRDO || !companyId) return;
    
    const submittedRDO: any = {
      ...currentRDO,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      companyId
    };

    try {
      if (currentRDO.id === 'temp_draft') {
        await addDoc(collection(db, 'rdoEntries'), submittedRDO);
      } else {
        await updateDoc(doc(db, 'rdoEntries', currentRDO.id), submittedRDO);
      }
      setCurrentRDO(null);
    } catch (e) {
      console.error("Error submitting RDO:", e);
    }
  };

  const viewRDO = (rdo: RDO) => {
    setCurrentRDO(rdo);
  };

  return {
    rdos: sortedRDOs,
    currentRDO,
    createDraftRDO,
    updateDraftRDO,
    saveDraft,
    submitRDO,
    viewRDO,
    cancelEdit: () => setCurrentRDO(null)
  };
};