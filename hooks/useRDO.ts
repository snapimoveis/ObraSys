import { useState, useMemo } from 'react';
import { RDO, Work, ScheduleTask } from '../types';
import { generateEmptyRDO } from '../utils/rdoUtils';

export const useRDO = (work: Work | null) => {
  // Mock Database
  const [rdos, setRdos] = useState<RDO[]>([
    {
      id: 'rdo-1',
      workId: 'WORK-123',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      number: 1,
      status: 'SUBMITTED',
      weatherMorning: 'SUNNY',
      weatherAfternoon: 'CLOUDY',
      responsible: 'Ana Silva',
      resources: [{ id: 'res-1', type: 'LABOR', description: 'Pedreiro 1ª', quantity: 2 }],
      execution: [{ id: 'exe-1', scheduleTaskId: 'task-1', taskName: 'Montagem de Estaleiro', percentageIncrement: 10, notes: 'Concluída vedação' }],
      occurrences: [],
      submittedAt: new Date(Date.now() - 40000000).toISOString(),
      scheduleUpdated: true,
      costsGenerated: true,
      createdAt: new Date(Date.now() - 100000000).toISOString()
    }
  ]);

  const [currentRDO, setCurrentRDO] = useState<RDO | null>(null);

  // Computed: RDOs sorted by date desc
  const sortedRDOs = useMemo(() => {
    return [...rdos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rdos]);

  // Actions
  const createDraftRDO = () => {
    if (!work) return;
    const nextNumber = rdos.length + 1;
    const today = new Date().toISOString();
    const newRDO = generateEmptyRDO(work.id, today, nextNumber);
    setCurrentRDO(newRDO);
  };

  const updateDraftRDO = (field: keyof RDO, value: any) => {
    if (!currentRDO || currentRDO.status !== 'DRAFT') return;
    setCurrentRDO({ ...currentRDO, [field]: value });
  };

  const saveDraft = () => {
    if (!currentRDO) return;
    // Check if exists in array to update or add
    const exists = rdos.find(r => r.id === currentRDO.id);
    if (exists) {
      setRdos(prev => prev.map(r => r.id === currentRDO.id ? currentRDO : r));
    } else {
      setRdos(prev => [currentRDO, ...prev]);
    }
    // Stay in form
  };

  const submitRDO = () => {
    if (!currentRDO) return;
    
    // 1. Lock the RDO
    const submittedRDO: RDO = {
      ...currentRDO,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      submittedBy: 'Utilizador Atual',
      // AUTOMATION FLAGS (Simulating backend triggers)
      scheduleUpdated: currentRDO.execution.length > 0,
      costsGenerated: currentRDO.resources.length > 0
    };

    // 2. Save
    const exists = rdos.find(r => r.id === submittedRDO.id);
    if (exists) {
      setRdos(prev => prev.map(r => r.id === submittedRDO.id ? submittedRDO : r));
    } else {
      setRdos(prev => [submittedRDO, ...prev]);
    }

    // 3. Clear current (go back to list usually)
    setCurrentRDO(null);
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
