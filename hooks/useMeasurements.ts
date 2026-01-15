import { useState, useEffect } from 'react';
import { Measurement, Budget } from '../types';
import { createNewMeasurement, calculateMeasurementTotals } from '../utils/measurementUtils';

export const useMeasurements = (workId: string | undefined, budget: Budget | undefined) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock initial load
  useEffect(() => {
    if (!workId) return;
    
    // Simulate API Fetch
    setLoading(true);
    setTimeout(() => {
      setMeasurements([]); // Start empty for demo
      setLoading(false);
    }, 500);
  }, [workId]);

  const createAuto = () => {
    if (!budget || !workId) return;
    const newAuto = createNewMeasurement(workId, budget, measurements);
    setMeasurements([newAuto, ...measurements]);
    return newAuto;
  };

  const updateMeasurement = (updated: Measurement) => {
    const recalculated = calculateMeasurementTotals(updated);
    setMeasurements(prev => prev.map(m => m.id === updated.id ? recalculated : m));
  };

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  return {
    measurements,
    loading,
    createAuto,
    updateMeasurement,
    deleteMeasurement
  };
};
