import { useState, useMemo } from 'react';
import { RealCost, CostType } from '../types';

export const useRealCosts = (workId: string) => {
  const [costs, setCosts] = useState<RealCost[]>([
    // Mock Data
    { id: '1', workId, date: '2023-11-01', description: 'Cimento Portland', amount: 450.00, type: 'MATERIAL', supplier: 'MatConstroi Lda', documentRef: 'FT 2023/102' },
    { id: '2', workId, date: '2023-11-05', description: 'Adiantamento Pedreiros', amount: 1200.00, type: 'LABOR', notes: 'Semana 44' },
    { id: '3', workId, date: '2023-11-10', description: 'Aluguer Giratória', amount: 350.00, type: 'EQUIPMENT', supplier: 'RentMaq', documentRef: 'FT 9928' },
  ]);

  const addCost = (cost: Omit<RealCost, 'id'>) => {
    const newCost = {
      ...cost,
      id: Date.now().toString(),
    };
    setCosts(prev => [newCost, ...prev]);
  };

  const deleteCost = (id: string) => {
    setCosts(prev => prev.filter(c => c.id !== id));
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