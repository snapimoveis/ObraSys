import { ComplianceItem, ComplianceStatus, ComplianceType } from '../types';

export const getStatusLabel = (status: ComplianceStatus): string => {
  switch (status) {
    case 'PENDING': return 'Pendente';
    case 'IN_REVIEW': return 'Em Verificação';
    case 'COMPLIANT': return 'Conforme';
    case 'NON_COMPLIANT': return 'Não Conforme';
    case 'WAIVED': return 'Dispensado';
    default: return status;
  }
};

export const getStatusColor = (status: ComplianceStatus): string => {
  switch (status) {
    case 'PENDING': return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'IN_REVIEW': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'COMPLIANT': return 'bg-green-50 text-green-700 border-green-200';
    case 'NON_COMPLIANT': return 'bg-red-50 text-red-700 border-red-200';
    case 'WAIVED': return 'bg-gray-50 text-gray-500 border-gray-200 dashed-border';
    default: return 'bg-slate-50 text-slate-500';
  }
};

export const getTypeColor = (type: ComplianceType): string => {
  switch (type) {
    case 'LEGAL': return 'text-purple-600 bg-purple-50';
    case 'TECHNICAL': return 'text-orange-600 bg-orange-50';
    case 'CONTRACTUAL': return 'text-blue-600 bg-blue-50';
    case 'FINANCIAL': return 'text-green-600 bg-green-50';
    default: return 'text-slate-600 bg-slate-50';
  }
};

/**
 * Checks if a set of compliance items blocks a critical action.
 * A critical action is blocked if any CRITICAL item is NON_COMPLIANT or PENDING.
 */
export const isActionBlocked = (items: ComplianceItem[], relatedModule?: string): boolean => {
  return items.some(item => {
    // Filter by module if provided
    if (relatedModule && item.relatedModule !== relatedModule) return false;
    
    // Logic: Critical items must be COMPLIANT or WAIVED. 
    // Anything else (PENDING, IN_REVIEW, NON_COMPLIANT) blocks.
    if (item.critical) {
      return item.status !== 'COMPLIANT' && item.status !== 'WAIVED';
    }
    
    return false;
  });
};

/**
 * Calculates overall compliance percentage.
 */
export const calculateCompliancePercentage = (items: ComplianceItem[]): number => {
  if (items.length === 0) return 100;
  
  const compliantCount = items.filter(i => i.status === 'COMPLIANT' || i.status === 'WAIVED').length;
  return (compliantCount / items.length) * 100;
};

/**
 * Mocks initial compliance data for a new work.
 */
export const generateInitialCompliance = (workId: string): ComplianceItem[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'comp-1', workId, requirement: 'Alvará de Construção Válido', type: 'LEGAL', source: 'LAW', relatedModule: 'SITE', status: 'COMPLIANT', critical: true, lastUpdated: now, responsible: 'Ana Silva', auditTrail: [], evidence: 'Alvará nº 1234/2023'
    },
    {
      id: 'comp-2', workId, requirement: 'Plano de Segurança e Saúde (PSS)', type: 'LEGAL', source: 'LAW', relatedModule: 'SITE', status: 'IN_REVIEW', critical: true, lastUpdated: now, responsible: 'Carlos Mendes', auditTrail: []
    },
    {
      id: 'comp-3', workId, requirement: 'Seguro de Acidentes de Trabalho', type: 'CONTRACTUAL', source: 'CONTRACT', relatedModule: 'FINANCIAL', status: 'PENDING', critical: true, lastUpdated: now, responsible: 'Financeiro', auditTrail: []
    },
    {
      id: 'comp-4', workId, requirement: 'Validação de Betão C25/30', type: 'TECHNICAL', source: 'INTERNAL_POLICY', relatedModule: 'SITE', status: 'PENDING', critical: false, lastUpdated: now, responsible: 'Eng. Civil', auditTrail: []
    },
    {
      id: 'comp-5', workId, requirement: 'Adiantamento 20% Pago', type: 'FINANCIAL', source: 'CONTRACT', relatedModule: 'FINANCIAL', status: 'COMPLIANT', critical: false, lastUpdated: now, responsible: 'Financeiro', auditTrail: [], evidence: 'Comprovativo Transferência #9988'
    }
  ];
};