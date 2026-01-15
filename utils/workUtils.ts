import { Budget, Work, SchedulePhase, ScheduleTask, WorkStatus } from '../types';

/**
 * Generates a new Work entity and initial Schedule from an Approved Budget.
 * Maps Chapters -> Phases and Subchapters -> Tasks.
 */
export const createWorkFromBudget = (budget: Budget): Work => {
  const today = new Date();
  const defaultDuration = 5; // days

  // Generate Schedule Structure
  const schedule: SchedulePhase[] = budget.chapters.map((chapter, cIdx) => {
    // Determine phase start date (staggered by weeks for demo purposes)
    const phaseStartDate = new Date(today);
    phaseStartDate.setDate(today.getDate() + (cIdx * 7));

    const tasks: ScheduleTask[] = chapter.subChapters.map((sub, sIdx) => {
      const taskStart = new Date(phaseStartDate);
      taskStart.setDate(phaseStartDate.getDate() + (sIdx * defaultDuration));
      
      const taskEnd = new Date(taskStart);
      taskEnd.setDate(taskStart.getDate() + defaultDuration);

      return {
        id: `task-${sub.id}`,
        name: sub.name,
        budugetRefId: sub.id,
        budgetRefType: 'SUBCHAPTER',
        startDate: taskStart.toISOString().split('T')[0],
        endDate: taskEnd.toISOString().split('T')[0],
        durationDays: defaultDuration,
        progress: 0,
        status: 'PENDING',
        weight: sub.totalPrice, // Using Sales Price as weight
        totalValue: sub.totalPrice
      };
    });

    // If chapter has no subchapters but has direct items, create a catch-all task
    if (tasks.length === 0 && chapter.items.length > 0) {
      const taskStart = new Date(phaseStartDate);
      const taskEnd = new Date(taskStart);
      taskEnd.setDate(taskStart.getDate() + defaultDuration);
      
      tasks.push({
        id: `task-direct-${chapter.id}`,
        name: 'Execução Geral do Capítulo',
        budugetRefId: chapter.id,
        budgetRefType: 'SUBCHAPTER', // Treating as pseudo-sub
        startDate: taskStart.toISOString().split('T')[0],
        endDate: taskEnd.toISOString().split('T')[0],
        durationDays: defaultDuration,
        progress: 0,
        status: 'PENDING',
        weight: chapter.totalPrice,
        totalValue: chapter.totalPrice
      });
    }

    return {
      id: `phase-${chapter.id}`,
      name: chapter.name,
      budgetChapterId: chapter.id,
      tasks: tasks,
      isExpanded: true
    };
  });

  // Calculate End Date based on last task
  let maxDate = today.getTime();
  schedule.forEach(p => p.tasks.forEach(t => {
     const end = new Date(t.endDate).getTime();
     if(end > maxDate) maxDate = end;
  }));

  return {
    id: `WORK-${budget.id}`,
    budgetId: budget.id,
    budgetTitle: budget.title,
    title: `Obra: ${budget.projectLocation}`,
    client: budget.client,
    location: budget.projectLocation,
    status: 'PLANNING',
    startDate: today.toISOString().split('T')[0],
    expectedEndDate: new Date(maxDate).toISOString().split('T')[0],
    schedule,
    totalBudget: budget.totalPrice,
    executedValue: 0,
    physicalProgress: 0,
    financialProgress: 0
  };
};

/**
 * Recalculates KPIs for a Work entity based on its schedule state.
 * Physical Progress = Weighted Average of Task Progress based on Financial Weight.
 */
export const calculateWorkKPIs = (work: Work): Work => {
  let totalValue = 0;
  let earnedValue = 0;
  let hasLateTasks = false;
  const today = new Date().toISOString().split('T')[0];

  const updatedSchedule = work.schedule.map(phase => {
    const updatedTasks = phase.tasks.map(task => {
      totalValue += task.totalValue;
      earnedValue += (task.totalValue * (task.progress / 100));

      // Determine Status
      let status = task.status;
      if (task.progress === 100) status = 'DONE';
      else if (task.progress > 0) status = 'IN_PROGRESS';
      else if (task.endDate < today && task.progress < 100) {
        status = 'DELAYED';
        hasLateTasks = true;
      } else {
        status = 'PENDING';
      }

      return { ...task, status };
    });
    return { ...phase, tasks: updatedTasks };
  });

  const physicalProgress = totalValue > 0 ? (earnedValue / totalValue) * 100 : 0;

  return {
    ...work,
    schedule: updatedSchedule,
    executedValue: earnedValue,
    physicalProgress,
    // Financial progress would usually come from Invoices, here we stub it or map 1:1 for now
    financialProgress: physicalProgress * 0.9 // Simulating a 10% retention/gap
  };
};

/**
 * Helpers
 */
export const getStatusColor = (status: WorkStatus) => {
  switch (status) {
    case 'CREATED': return 'bg-slate-100 text-slate-600';
    case 'PLANNING': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'EXECUTION': return 'bg-green-50 text-green-700 border-green-100';
    case 'SUSPENDED': return 'bg-orange-50 text-orange-700 border-orange-100';
    case 'COMPLETED': return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'CLOSED': return 'bg-slate-800 text-white';
    default: return 'bg-slate-100';
  }
};
