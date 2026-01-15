import { RDO, RDOStatus, WeatherCondition, RDOOccurrence } from '../types';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

export const getRDOStatusLabel = (status: RDOStatus): string => {
  switch (status) {
    case 'DRAFT': return 'Rascunho';
    case 'SUBMITTED': return 'Submetido';
    case 'VALIDATED': return 'Validado';
    case 'RECTIFIED': return 'Retificado';
    default: return status;
  }
};

export const getRDOStatusColor = (status: RDOStatus): string => {
  switch (status) {
    case 'DRAFT': return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'SUBMITTED': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'VALIDATED': return 'bg-green-50 text-green-700 border-green-200';
    case 'RECTIFIED': return 'bg-orange-50 text-orange-700 border-orange-200';
    default: return 'bg-slate-50 text-slate-500';
  }
};

export const getWeatherIcon = (weather: WeatherCondition) => {
  switch (weather) {
    case 'SUNNY': return Sun;
    case 'CLOUDY': return Cloud;
    case 'RAIN': return CloudRain;
    case 'STORM': return CloudLightning;
    default: return Sun;
  }
};

export const getWeatherLabel = (weather: WeatherCondition): string => {
  switch (weather) {
    case 'SUNNY': return 'Sol';
    case 'CLOUDY': return 'Nublado';
    case 'RAIN': return 'Chuva';
    case 'STORM': return 'Tempestade';
    default: return 'N/D';
  }
};

export const generateEmptyRDO = (workId: string, date: string, number: number): RDO => {
  return {
    id: Date.now().toString(),
    workId,
    date,
    number,
    status: 'DRAFT',
    weatherMorning: 'SUNNY',
    weatherAfternoon: 'SUNNY',
    responsible: 'Eng. Civil Responsável',
    resources: [],
    execution: [],
    occurrences: [],
    createdAt: new Date().toISOString(),
    scheduleUpdated: false,
    costsGenerated: false
  };
};

export const countCriticalOccurrences = (rdo: RDO): number => {
  return rdo.occurrences.filter(o => o.critical || o.impactLevel === 'CRITICAL' || o.type === 'NON_COMPLIANCE').length;
};

// Automations Simulation Helpers
export const calculateAutomationImpact = (rdo: RDO) => {
  const tasksUpdated = rdo.execution.length;
  const costItemsGenerated = rdo.resources.length;
  const complianceAlerts = countCriticalOccurrences(rdo);
  
  return { tasksUpdated, costItemsGenerated, complianceAlerts };
};
