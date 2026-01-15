import { useState, useEffect, useMemo } from 'react';
import { Budget, Work, FinancialExecution } from '../types';
import { calculateFinancialExecution } from '../utils/financialUtils';

export const useFinancialExecution = (budget: Budget | null, work: Work | null) => {
  const [data, setData] = useState<FinancialExecution | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!budget || !work) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Simulate calculation delay
      setTimeout(() => {
        const result = calculateFinancialExecution(budget, work);
        setData(result);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Failed to calculate financial execution", err);
      setError("Erro ao processar dados financeiros.");
      setLoading(false);
    }
  }, [budget, work]);

  return { data, loading, error };
};
