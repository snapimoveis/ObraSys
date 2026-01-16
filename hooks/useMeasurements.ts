import { useState, useEffect } from 'react';
import { Measurement, Budget } from '../types';
import { createNewMeasurement, calculateMeasurementTotals } from '../utils/measurementUtils';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, QuerySnapshot } from 'firebase/firestore';

export const useMeasurements = (workId: string | undefined, budget: Budget | undefined) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(false);
  const companyId = getCurrentCompanyId();

  useEffect(() => {
    if (!workId || !companyId) return;
    
    setLoading(true);
    const q = query(
      collection(db, 'measurements'), 
      where('workId', '==', workId),
      where('companyId', '==', companyId)
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Measurement));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMeasurements(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workId, companyId]);

  const createAuto = async () => {
    if (!budget || !workId || !companyId) return;
    const newAuto = createNewMeasurement(workId, budget, measurements);
    
    try {
      const docRef = await addDoc(collection(db, 'measurements'), {
        ...newAuto,
        companyId
      });
      return { ...newAuto, id: docRef.id };
    } catch (e) {
      console.error("Error creating measurement:", e);
    }
  };

  const updateMeasurement = async (updated: Measurement) => {
    const recalculated = calculateMeasurementTotals(updated);
    try {
      await updateDoc(doc(db, 'measurements', updated.id), recalculated as any);
    } catch (e) {
      console.error("Error updating measurement:", e);
    }
  };

  const deleteMeasurement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'measurements', id));
    } catch (e) {
      console.error("Error deleting measurement:", e);
    }
  };

  return {
    measurements,
    loading,
    createAuto,
    updateMeasurement,
    deleteMeasurement
  };
};