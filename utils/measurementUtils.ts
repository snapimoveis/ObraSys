import { Budget, Measurement, MeasurementItem } from '../types';

/**
 * Creates a new measurement object based on the budget and previous measurements.
 */
export const createNewMeasurement = (
  workId: string,
  budget: Budget,
  previousMeasurements: Measurement[]
): Measurement => {
  const items: Record<string, MeasurementItem> = {};
  const today = new Date();
  
  // 1. Calculate Accumulated Quantities from APPROVED previous measurements
  const accumulatedQuantities: Record<string, number> = {};
  
  previousMeasurements.forEach(m => {
    if (m.status === 'APPROVED' || m.status === 'INVOICED') {
      Object.values(m.items).forEach(item => {
        accumulatedQuantities[item.budgetItemId] = (accumulatedQuantities[item.budgetItemId] || 0) + item.currentQuantity;
      });
    }
  });

  // 2. Flatten Budget Items to Measurement Items
  const processItems = (chapterItems: any[]) => {
    chapterItems.forEach(item => {
      items[item.id] = {
        budgetItemId: item.id,
        description: item.description,
        unit: item.unit,
        unitPrice: item.unitPrice,
        budgetQuantity: item.quantity,
        previousQuantity: accumulatedQuantities[item.id] || 0,
        currentQuantity: 0,
        totalQuantity: accumulatedQuantities[item.id] || 0,
        currentValue: 0,
        totalValue: (accumulatedQuantities[item.id] || 0) * item.unitPrice,
        executionPercent: item.quantity > 0 ? ((accumulatedQuantities[item.id] || 0) / item.quantity) * 100 : 0
      };
    });
  };

  budget.chapters.forEach(c => {
    processItems(c.items);
    c.subChapters.forEach(s => processItems(s.items));
  });

  // Determine Reference (Auto #X)
  const nextNum = previousMeasurements.length + 1;

  return {
    id: Date.now().toString(),
    workId,
    reference: `Auto #${nextNum}`,
    date: today.toISOString(),
    periodStart: today.toISOString(), // User should adjust
    periodEnd: today.toISOString(),
    status: 'DRAFT',
    items,
    totalCurrentValue: 0,
    totalAccumulatedValue: Object.values(items).reduce((acc, i) => acc + i.totalValue, 0)
  };
};

/**
 * Recalculates totals for a measurement when an item changes.
 */
export const calculateMeasurementTotals = (measurement: Measurement): Measurement => {
  let totalCurrent = 0;
  let totalAccumulated = 0;

  const updatedItems: Record<string, MeasurementItem> = {};

  Object.values(measurement.items).forEach(item => {
    const currentQ = item.currentQuantity || 0;
    const totalQ = item.previousQuantity + currentQ;
    const currentV = currentQ * item.unitPrice;
    const totalV = totalQ * item.unitPrice;
    
    updatedItems[item.budgetItemId] = {
      ...item,
      currentQuantity: currentQ,
      totalQuantity: totalQ,
      currentValue: currentV,
      totalValue: totalV,
      executionPercent: item.budgetQuantity > 0 ? (totalQ / item.budgetQuantity) * 100 : 0
    };

    totalCurrent += currentV;
    totalAccumulated += totalV;
  });

  return {
    ...measurement,
    items: updatedItems,
    totalCurrentValue: totalCurrent,
    totalAccumulatedValue: totalAccumulated
  };
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'REVIEW': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'APPROVED': return 'bg-green-50 text-green-600 border-green-100';
    case 'INVOICED': return 'bg-blue-50 text-blue-600 border-blue-100';
    default: return 'bg-slate-100';
  }
};
