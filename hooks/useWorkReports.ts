import { useMemo } from 'react';
import { Budget, Work, RealCost, Measurement } from '../types';

export interface ReportKPIs {
  totalBudget: number;
  plannedValue: number; // PV (based on timeline)
  earnedValue: number;  // EV (based on physical progress)
  actualCost: number;   // AC (Real Costs)
  invoicedValue: number;
  
  costVariance: number; // EV - AC
  scheduleVariance: number; // EV - PV
  
  cpi: number; // Cost Performance Index (EV/AC)
  spi: number; // Schedule Performance Index (EV/PV)
  
  grossMargin: number;
  marginPercent: number;
}

export const useWorkReports = (
  budget: Budget | null,
  work: Work | null,
  costs: RealCost[],
  measurements: Measurement[]
) => {
  
  const kpis: ReportKPIs = useMemo(() => {
    if (!budget || !work) {
      return {
        totalBudget: 0, plannedValue: 0, earnedValue: 0, actualCost: 0, invoicedValue: 0,
        costVariance: 0, scheduleVariance: 0, cpi: 1, spi: 1, grossMargin: 0, marginPercent: 0
      };
    }

    const totalBudget = budget.totalPrice;
    
    // 1. Actual Cost (Sum of all approved real costs)
    const actualCost = costs.reduce((acc, c) => acc + c.amount, 0);

    // 2. Earned Value (Budget * Physical Progress)
    const earnedValue = work.executedValue; // Already calculated in workUtils

    // 3. Planned Value (Budget * Theoretical Progress based on time)
    // Simplified Linear calculation for demo:
    const start = new Date(work.startDate).getTime();
    const end = new Date(work.expectedEndDate).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    const timeProgress = totalDuration > 0 ? Math.min(1, Math.max(0, elapsed / totalDuration)) : 0;
    const plannedValue = totalBudget * timeProgress;

    // 4. Invoiced (Sum of Approved/Invoiced Measurements)
    const invoicedValue = measurements
      .filter(m => m.status === 'APPROVED' || m.status === 'INVOICED')
      .reduce((acc, m) => acc + m.totalCurrentValue, 0);

    // 5. Variances
    const costVariance = earnedValue - actualCost; // Positive is good (Under budget)
    const scheduleVariance = earnedValue - plannedValue; // Positive is good (Ahead of schedule)

    // 6. Indices
    const cpi = actualCost > 0 ? earnedValue / actualCost : 1; // > 1 Good
    const spi = plannedValue > 0 ? earnedValue / plannedValue : 1; // > 1 Good

    // 7. Margin
    // Theoretical Gross Margin based on Actuals
    // (What we earned vs what we spent)
    const grossMargin = earnedValue - actualCost; 
    const marginPercent = earnedValue > 0 ? (grossMargin / earnedValue) * 100 : 0;

    return {
      totalBudget,
      plannedValue,
      earnedValue,
      actualCost,
      invoicedValue,
      costVariance,
      scheduleVariance,
      cpi,
      spi,
      grossMargin,
      marginPercent
    };
  }, [budget, work, costs, measurements]);

  return { kpis };
};
