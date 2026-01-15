export type Role = 'admin' | 'gestor' | 'tecnico' | 'financeiro' | 'leitura';

export interface AuditLog {
  companyId: string;
  entity: string;
  entityId: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  userId: string;
  timestamp: string;
}

export interface ComplianceItem {
  id: string;
  workId: string;
  status: 'PENDING' | 'IN_REVIEW' | 'COMPLIANT' | 'NON_COMPLIANT' | 'WAIVED';
  critical: boolean;
}

export interface ApprovalRequest {
  id: string;
  type: 'BUDGET' | 'MEASUREMENT' | 'RDO' | 'INVOICE';
  entityId: string;
  workId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
