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

// --- TICKET TYPES ---

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TicketCategory = 'TECHNICAL' | 'FINANCIAL' | 'FEATURE' | 'OTHER';

export interface Ticket {
  id: string;
  readableId: string; // TCK-2023-001
  companyId: string;
  requesterId: string;
  requesterEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  aiGenerated: boolean;
  transcriptSummary?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string; // 'SYSTEM', 'SUPPORT' or UserUID
  senderType: 'USER' | 'SUPPORT' | 'SYSTEM' | 'AI';
  content: string;
  createdAt: string;
  attachments?: string[];
}