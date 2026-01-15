import { Budget, BudgetChapter, BudgetItem, BudgetSubChapter } from '../types';

/**
 * Calculates a single item's derived values.
 */
export const calculateItem = (item: BudgetItem): BudgetItem => {
  const unitPrice = item.unitCost * (1 + (item.marginPercent / 100));
  const totalCost = item.quantity * item.unitCost;
  const totalPrice = item.quantity * unitPrice;

  return {
    ...item,
    unitPrice,
    totalCost,
    totalPrice
  };
};

/**
 * Performs a full rollup calculation of the budget tree.
 * Calculates from leaf nodes (Items) -> Up to Root (Budget).
 */
export const calculateBudgetRollups = (budget: Budget): Budget => {
  let bCost = 0;
  let bPrice = 0;

  const chapters = budget.chapters.map(chapter => {
    let cCost = 0;
    let cPrice = 0;

    // 1. Calculate Subchapters
    const subChapters = chapter.subChapters.map(sub => {
      let sCost = 0;
      let sPrice = 0;
      
      const items = sub.items.map(item => {
        const calcItem = calculateItem(item);
        sCost += calcItem.totalCost;
        sPrice += calcItem.totalPrice;
        return calcItem;
      });

      cCost += sCost;
      cPrice += sPrice;

      return { ...sub, items, totalCost: sCost, totalPrice: sPrice };
    });

    // 2. Calculate Direct Items in Chapter
    const items = chapter.items.map(item => {
      const calcItem = calculateItem(item);
      cCost += calcItem.totalCost;
      cPrice += calcItem.totalPrice;
      return calcItem;
    });

    bCost += cCost;
    bPrice += cPrice;

    return { ...chapter, subChapters, items, totalCost: cCost, totalPrice: cPrice };
  });

  return {
    ...budget,
    chapters,
    totalCost: bCost,
    totalPrice: bPrice,
    totalMargin: bPrice - bCost,
    marginPercent: bPrice > 0 ? ((bPrice - bCost) / bPrice) * 100 : 0,
    totalTax: bPrice * 0.23 // Assuming 23% IVA PT
  };
};

/**
 * Immutable update of a specific item within the budget tree.
 */
export const updateItemInBudget = (budget: Budget, updatedItem: BudgetItem): Budget => {
  const newChapters = budget.chapters.map(c => {
    // Check direct items
    const directItemIndex = c.items.findIndex(i => i.id === updatedItem.id);
    if (directItemIndex !== -1) {
      const newItems = [...c.items];
      newItems[directItemIndex] = updatedItem;
      return { ...c, items: newItems };
    }

    // Check subchapters
    const newSubChapters = c.subChapters.map(s => {
      const subItemIndex = s.items.findIndex(i => i.id === updatedItem.id);
      if (subItemIndex !== -1) {
        const newSubItems = [...s.items];
        newSubItems[subItemIndex] = updatedItem;
        return { ...s, items: newSubItems };
      }
      return s;
    });

    return { ...c, subChapters: newSubChapters };
  });

  return calculateBudgetRollups({ ...budget, chapters: newChapters });
};

/**
 * Adds an item to a specific location (Chapter or Subchapter).
 */
export const addItemToBudget = (
  budget: Budget, 
  item: BudgetItem, 
  chapterId: string, 
  subChapterId?: string
): Budget => {
  const newChapters = budget.chapters.map(c => {
    if (c.id !== chapterId) return c;

    if (subChapterId) {
      const newSubChapters = c.subChapters.map(s => {
        if (s.id !== subChapterId) return s;
        return { ...s, items: [...s.items, item] };
      });
      return { ...c, subChapters: newSubChapters };
    }

    return { ...c, items: [...c.items, item] };
  });

  return calculateBudgetRollups({ ...budget, chapters: newChapters });
};

/**
 * Removes an item from the budget.
 */
export const removeItemFromBudget = (budget: Budget, itemId: string): Budget => {
  const newChapters = budget.chapters.map(c => {
    // Filter direct
    const newItems = c.items.filter(i => i.id !== itemId);
    
    // Filter subs
    const newSubChapters = c.subChapters.map(s => ({
      ...s,
      items: s.items.filter(i => i.id !== itemId)
    }));

    return { ...c, items: newItems, subChapters: newSubChapters };
  });

  return calculateBudgetRollups({ ...budget, chapters: newChapters });
};

/**
 * Formatter
 */
export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);
};

export const getRiskLevel = (marginPercent: number) => {
  if (marginPercent < 15) return { label: 'Alto', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  if (marginPercent < 25) return { label: 'Médio', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
  return { label: 'Baixo', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
};
