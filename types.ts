export enum View {
  DASHBOARD = 'DASHBOARD',
  BUDGETING = 'BUDGETING',
  SITE_MANAGEMENT = 'SITE_MANAGEMENT',
  SCHEDULE = 'SCHEDULE',
  TEAM = 'TEAM',
  COMPLIANCE = 'COMPLIANCE',
  APPROVALS = 'APPROVALS',
  FINANCIAL = 'FINANCIAL',
  REPORTS = 'REPORTS',
  PLANS = 'PLANS',
  PRICES = 'PRICES',
  ARTICLES = 'ARTICLES',
  AUTOMATION = 'AUTOMATION',
  COMPANY_SETTINGS = 'COMPANY_SETTINGS',
  TASKS = 'TASKS', 
  INVOICING = 'INVOICING',
  SUPPORT = 'SUPPORT',
}

// --- SUPPORT ---

export interface Ticket {
  id: string;
  subject: string;
  category: 'TECHNICAL' | 'FINANCIAL' | 'FEATURE' | 'OTHER';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  lastUpdate: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  sender: 'USER' | 'SUPPORT';
  text: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- BUDGET ---

export type BudgetStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'EXECUTION' | 'CLOSED';
export type BudgetItemType = 'MATERIAL' | 'LABOR' | 'EQUIPMENT' | 'SUBCONTRACT';

export interface BudgetItem {
  id: string;
  code: string;
  description: string;
  type: BudgetItemType;
  unit: string;
  quantity: number;
  unitCost: number;
  marginPercent: number;
  totalCost: number;
  totalPrice: number;
  unitPrice: number;
  supplier?: string;
  notes?: string;
}

export interface BudgetChapter {
  id: string;
  name: string;
  items: BudgetItem[];
  subChapters: BudgetChapter[];
  totalCost: number;
  totalPrice: number;
}

export type BudgetSubChapter = BudgetChapter;

export interface Budget {
  id: string;
  reference: string;
  title: string;
  client: string;
  projectLocation: string;
  version: number;
  status: BudgetStatus;
  date: string;
  chapters: BudgetChapter[];
  totalCost: number;
  totalPrice: number;
  totalMargin: number;
  marginPercent: number;
  totalTax: number;
  companyId?: string;
}

// --- WORK / SCHEDULE ---

export type WorkStatus = 'CREATED' | 'PLANNING' | 'EXECUTION' | 'SUSPENDED' | 'COMPLETED' | 'CLOSED' | 'DELAYED';

export interface ScheduleTask {
  id: string;
  name: string;
  budugetRefId?: string;
  budgetRefType?: 'CHAPTER' | 'SUBCHAPTER' | 'ITEM';
  startDate: string;
  endDate: string;
  durationDays: number;
  progress: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'DELAYED';
  weight: number;
  totalValue: number;
}

export interface SchedulePhase {
  id: string;
  name: string;
  budgetChapterId?: string;
  tasks: ScheduleTask[];
  isExpanded?: boolean;
}

export interface Work {
  id: string;
  budgetId: string;
  budgetTitle: string;
  title: string;
  client: string;
  location: string;
  status: WorkStatus;
  startDate: string;
  expectedEndDate: string;
  schedule: SchedulePhase[];
  totalBudget: number;
  executedValue: number;
  physicalProgress: number;
  financialProgress: number;
}

// --- TASKS (Team) ---

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  checklist?: ChecklistItem[];
  project: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  progress: number;
  createdAt: string;
}

// --- SITE REPORT ---

export interface SiteReport {
  id: string;
  date: string;
  author: string;
  rawNotes: string;
  summary: string;
  issues: string[];
  weather: string;
}

// --- TEAM ---

export type Role = 'ADMIN' | 'ENGINEER' | 'ARCHITECT' | 'FOREMAN' | 'WORKER' | 'SUBCONTRACTOR' | 'CLIENT';
export type MemberStatus = 'ACTIVE' | 'INVITED' | 'INACTIVE';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  assignedWorks: string[];
  joinedAt: string;
  lastActive?: string;
  phone?: string;
}

// --- MEASUREMENTS ---

export type MeasurementStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'INVOICED';

export interface MeasurementItem {
  budgetItemId: string;
  description: string;
  unit: string;
  unitPrice: number;
  budgetQuantity: number;
  previousQuantity: number;
  currentQuantity: number;
  totalQuantity: number;
  currentValue: number;
  totalValue: number;
  executionPercent: number;
}

export interface Measurement {
  id: string;
  workId: string;
  reference: string;
  date: string;
  periodStart: string;
  periodEnd: string;
  status: MeasurementStatus;
  items: Record<string, MeasurementItem>;
  totalCurrentValue: number;
  totalAccumulatedValue: number;
  companyId?: string;
}

// --- FINANCIAL ---

export type CostType = 'MATERIAL' | 'LABOR' | 'EQUIPMENT' | 'SUBCONTRACT' | 'OTHER';

export interface FinancialTransaction {
  id: string;
  date: string;
  dueDate?: string;
  description: string;
  entity: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  category?: string;
  workId?: string;
  workName?: string;
}

export interface CashFlowData {
  period: string;
  income: number;
  expense: number;
  balance: number;
}

export interface RealCost {
  id: string;
  workId: string;
  date: string;
  description: string;
  amount: number;
  type: CostType;
  supplier?: string;
  documentRef?: string;
  budgetChapterId?: string;
  notes?: string;
}

export interface FinancialItemSnapshot {
  id: string;
  description: string;
  budgetTotal: number;
  executedPercent: number;
  executedValue: number;
  actualCost: number;
  deviation: number;
  status: 'ON_TRACK' | 'OVER_BUDGET' | 'UNDER_BUDGET';
}

export interface FinancialChapterSnapshot {
  id: string;
  name: string;
  budgetTotal: number;
  executedValue: number;
  actualCost: number;
  deviation: number;
  items: FinancialItemSnapshot[];
  subChapters: FinancialChapterSnapshot[];
}

export interface FinancialExecution {
  workId: string;
  totalBudget: number;
  totalExecutedValue: number;
  totalActualCost: number;
  grossMargin: number;
  grossMarginPercent: number;
  chapters: FinancialChapterSnapshot[];
}

// --- COMPLIANCE ---

export type ComplianceType = 'LEGAL' | 'TECHNICAL' | 'CONTRACTUAL' | 'FINANCIAL';
export type ComplianceStatus = 'PENDING' | 'IN_REVIEW' | 'COMPLIANT' | 'NON_COMPLIANT' | 'WAIVED';

export interface AuditLog {
  id: string;
  date: string;
  user: string;
  action: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
}

export interface ComplianceItem {
  id: string;
  workId: string;
  requirement: string;
  type: ComplianceType;
  source: string;
  relatedModule?: string;
  status: ComplianceStatus;
  critical: boolean;
  lastUpdated: string;
  responsible: string;
  auditTrail: AuditLog[];
  evidence?: string;
  companyId?: string;
}

// --- RDO ---

export type RDOStatus = 'DRAFT' | 'SUBMITTED' | 'VALIDATED' | 'RECTIFIED';
export type WeatherCondition = 'SUNNY' | 'CLOUDY' | 'RAIN' | 'STORM';

export interface RDOResource {
  id: string;
  type: 'LABOR' | 'EQUIPMENT' | 'MATERIAL' | 'SUBCONTRACT';
  description: string;
  quantity: number;
}

export interface RDOExecution {
  id: string;
  scheduleTaskId: string;
  taskName: string;
  percentageIncrement: number;
  notes?: string;
}

export interface RDOOccurrence {
  id: string;
  type: 'DELAY' | 'ACCIDENT' | 'NON_COMPLIANCE' | 'VISIT' | 'OTHER';
  description: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  critical: boolean;
}

export interface RDO {
  id: string;
  workId: string;
  date: string;
  number: number;
  status: RDOStatus;
  weatherMorning: WeatherCondition;
  weatherAfternoon: WeatherCondition;
  responsible: string;
  resources: RDOResource[];
  execution: RDOExecution[];
  occurrences: RDOOccurrence[];
  observations?: string;
  createdAt: string;
  submittedAt?: string;
  submittedBy?: string;
  scheduleUpdated: boolean;
  costsGenerated: boolean;
  companyId?: string;
}

// --- APPROVALS ---

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ON_HOLD';

export interface ApprovalHistory {
  id: string;
  action: string;
  user: string;
  date: string;
  note?: string;
}

export interface ApprovalRequest {
  id: string;
  type: 'BUDGET' | 'MEASUREMENT' | 'RDO' | 'INVOICE';
  reference: string;
  description: string;
  workId: string;
  workName: string;
  requester: string;
  requesterRole: string;
  requestedAt: string;
  amount?: number;
  status: ApprovalStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceStatus: 'OK' | 'BLOCKED';
  complianceIssues?: string[];
  history: ApprovalHistory[];
  companyId?: string;
  collectionName?: string;
  entityId?: string;
}