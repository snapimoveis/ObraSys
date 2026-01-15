import { Budget, Work, FinancialExecution, FinancialChapterSnapshot, FinancialItemSnapshot, BudgetItem } from '../types';

/**
 * Calculates the deviation status based on margin.
 */
const getDeviationStatus = (deviation: number, budget: number): 'ON_TRACK' | 'OVER_BUDGET' | 'UNDER_BUDGET' => {
  if (budget === 0) return 'ON_TRACK';
  const percent = (deviation / budget); 
  // If deviation is positive (saved money/profit) -> Under Budget (Good) or On Track
  // If deviation is negative (lost money) -> Over Budget (Bad)
  
  if (percent < -0.05) return 'OVER_BUDGET'; // 5% cost overrun
  if (percent > 0.10) return 'UNDER_BUDGET'; // 10% savings
  return 'ON_TRACK';
};

/**
 * Helper to find progress of an item or subchapter in the work schedule.
 */
const findProgress = (work: Work, refId: string): number => {
  if (!work || !work.schedule) return 0;
  
  for (const phase of work.schedule) {
    const task = phase.tasks.find(t => t.budugetRefId === refId);
    if (task) return task.progress || 0;
  }
  return 0;
};

/**
 * Generates a financial snapshot.
 * In a real app, 'actualCost' would come from an Invoicing/Expenses module.
 * Here, we simulate 'actualCost' with a variation factor to demonstrate the UI.
 */
export const calculateFinancialExecution = (budget: Budget, work: Work): FinancialExecution => {
  let totalBudget = 0;
  let totalExecutedValue = 0;
  let totalActualCost = 0;

  const chapters: FinancialChapterSnapshot[] = budget.chapters.map(chapter => {
    let cBudget = 0;
    let cExecuted = 0;
    let cActualCost = 0;

    // 1. Process Subchapters
    const subChapters: FinancialChapterSnapshot[] = chapter.subChapters.map(sub => {
      const progress = findProgress(work, sub.id);
      
      // Rollup items inside subchapter
      let sBudget = 0;
      let sExecuted = 0;
      let sActualCost = 0;

      const subItems: FinancialItemSnapshot[] = sub.items.map(item => {
        const itemBudget = item.totalPrice;
        const itemExecuted = itemBudget * (progress / 100);
        
        // SIMULATION: Actual Cost. 
        // In reality: Query invoices linked to this item.
        // Simulation: Cost is roughly (UnitCost * Qty * Progress) +/- random variance
        const theoreticalCost = (item.unitCost * item.quantity) * (progress / 100);
        const variance = (Math.random() * 0.2) - 0.05; // -5% to +15% variance
        const itemActualCost = theoreticalCost * (1 + variance);

        const deviation = itemExecuted - itemActualCost; // Gross Margin on execution

        sBudget += itemBudget;
        sExecuted += itemExecuted;
        sActualCost += itemActualCost;

        return {
          id: item.id,
          description: item.description,
          budgetTotal: itemBudget,
          executedPercent: progress,
          executedValue: itemExecuted,
          actualCost: itemActualCost,
          deviation: deviation,
          status: getDeviationStatus(deviation, itemExecuted)
        };
      });

      cBudget += sBudget;
      cExecuted += sExecuted;
      cActualCost += sActualCost;

      return {
        id: sub.id,
        name: sub.name,
        budgetTotal: sBudget,
        executedValue: sExecuted,
        actualCost: sActualCost,
        deviation: sExecuted - sActualCost,
        items: subItems,
        subChapters: []
      };
    });

    // 2. Process Direct Items in Chapter
    const directItems: FinancialItemSnapshot[] = chapter.items.map(item => {
      // Find generic chapter progress or default to 0 if no specific task links item
      // For simplicity, we assume items in root chapter follow a "Direct Execution" task if it exists, or 0.
      const directTask = work.schedule.find(p => p.budgetChapterId === chapter.id)?.tasks.find(t => t.budgetRefType === 'SUBCHAPTER' && t.budugetRefId === chapter.id);
      const progress = directTask ? directTask.progress : 0;

      const itemBudget = item.totalPrice;
      const itemExecuted = itemBudget * (progress / 100);
      
      const theoreticalCost = (item.unitCost * item.quantity) * (progress / 100);
      const variance = (Math.random() * 0.2) - 0.05; 
      const itemActualCost = theoreticalCost * (1 + variance);
      const deviation = itemExecuted - itemActualCost;

      cBudget += itemBudget;
      cExecuted += itemExecuted;
      cActualCost += itemActualCost;

      return {
        id: item.id,
        description: item.description,
        budgetTotal: itemBudget,
        executedPercent: progress,
        executedValue: itemExecuted,
        actualCost: itemActualCost,
        deviation: deviation,
        status: getDeviationStatus(deviation, itemExecuted)
      };
    });

    totalBudget += cBudget;
    totalExecutedValue += cExecuted;
    totalActualCost += cActualCost;

    return {
      id: chapter.id,
      name: chapter.name,
      budgetTotal: cBudget,
      executedValue: cExecuted,
      actualCost: cActualCost,
      deviation: cExecuted - cActualCost,
      items: directItems,
      subChapters: subChapters
    };
  });

  const grossMargin = totalExecutedValue - totalActualCost;
  const grossMarginPercent = totalExecutedValue > 0 ? (grossMargin / totalExecutedValue) * 100 : 0;

  return {
    workId: work.id,
    totalBudget,
    totalExecutedValue,
    totalActualCost,
    grossMargin,
    grossMarginPercent,
    chapters
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);
};

export const formatPercent = (val: number) => {
  return `${val.toFixed(1)}%`;
};
