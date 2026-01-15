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
}

// --- FINANCE (GLOBAL) ---

export interface FinancialTransaction {
  id: string;
  date: string;
  dueDate: string;
  description: string;
  entity: string; // Client or Supplier
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  workId?: string; // Optional link to project
  workName?: string; // Denormalized for list view
  category: string;
}

export interface CashFlowData {
  period: string;
  income: number;
  expense: number;
  balance: number;
}

// --- APPROVALS ---

export type ApprovalType = 'BUDGET' | 'MEASUREMENT' | 'RDO' | 'INVOICE' | 'PAYMENT';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ON_HOLD';
export type ApprovalPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ApprovalHistory {
  id: string;
  action: 'CREATED' | 'APPROVED' | 'REJECTED' | 'ON_HOLD' | 'COMMENT';
  user: string;
  date: string;
  note?: string;
}

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  reference: string; // e.g., "Orçamento #23"
  description: string;
  workId: string;
  workName: string;
  requester: string;
  requesterRole: string;
  requestedAt: string;
  amount?: number; // Optional financial value
  status: ApprovalStatus;
  priority: ApprovalPriority;
  
  // Rules Engine
  complianceStatus: 'OK' | 'BLOCKED'; // If BLOCKED, cannot approve
  complianceIssues?: string[];
  
  history: ApprovalHistory[];
}

// --- TEAM & COLLABORATORS ---

export type Role = 'ADMIN' | 'ENGINEER' | 'ARCHITECT' | 'FOREMAN' | 'WORKER' | 'SUBCONTRACTOR' | 'CLIENT';
export type MemberStatus = 'ACTIVE' | 'INVITED' | 'INACTIVE';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: MemberStatus;
  avatarUrl?: string; // Initials if null
  assignedWorks: string[]; // Work IDs linked to this user
  joinedAt: string;
  lastActive?: string;
}

// --- ORÇAMENTAÇÃO AVANÇADA (Budgeting) ---

export type BudgetStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'EXECUTION' | 'CLOSED';
export type BudgetItemType = 'MATERIAL' | 'LABOR' | 'EQUIPMENT' | 'SUBCONTRACT';

export interface BudgetItem {
  id: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unitCost: number; // Cost to company
  marginPercent: number; // Desired margin %
  
  // Calculated Fields (Read-only derivation)
  totalCost: number; 
  unitPrice: number; // Sale price
  totalPrice: number; 
  
  type: BudgetItemType;
  supplier?: string;
  notes?: string;
}

export interface BudgetSubChapter {
  id: string;
  name: string;
  items: BudgetItem[];
  
  // Rollups
  totalCost: number;
  totalPrice: number;
}

export interface BudgetChapter {
  id: string;
  name: string;
  items: BudgetItem[]; // Direct items in chapter
  subChapters: BudgetSubChapter[];
  
  // Rollups
  totalCost: number;
  totalPrice: number;
}

export interface Budget {
  id: string;
  reference: string;
  title: string;
  client: string;
  projectLocation: string; // Acts as Project Name
  version: number;
  status: BudgetStatus;
  date: string;
  validityDate?: string;
  
  chapters: BudgetChapter[];
  
  // Global KPIs
  totalCost: number;
  totalPrice: number; // Sales value w/o Tax
  totalMargin: number; // Cash margin
  marginPercent: number; // % margin
  totalTax: number; // IVA
}

// --- GESTÃO DE OBRA E CRONOGRAMA (Work & Schedule) ---

export type WorkStatus = 'CREATED' | 'PLANNING' | 'EXECUTION' | 'SUSPENDED' | 'COMPLETED' | 'CLOSED';

export interface ScheduleTask {
  id: string;
  name: string;
  budugetRefId: string; // Link to SubChapter or Item ID
  budgetRefType: 'SUBCHAPTER' | 'ITEM';
  
  startDate: string;
  endDate: string;
  durationDays: number;
  progress: number; // 0-100
  
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'DELAYED';
  weight: number; // Financial weight for KPI calculation
  totalValue: number; // Value from budget
}

export interface SchedulePhase {
  id: string;
  name: string;
  budgetChapterId: string; // Link to BudgetChapter
  tasks: ScheduleTask[];
  isExpanded?: boolean;
}

export interface Work {
  id: string;
  budgetId: string; // Origin Budget
  budgetTitle: string; // Denormalized for display
  title: string;
  client: string;
  location: string;
  
  status: WorkStatus;
  startDate: string;
  expectedEndDate: string;
  
  schedule: SchedulePhase[];
  
  // KPIs
  totalBudget: number;
  executedValue: number; // Calculated from progress
  physicalProgress: number; // Weighted %
  financialProgress: number; // Actually paid (stub)
}

// --- MEDIÇÕES E AUTOS (Measurements) ---

export type MeasurementStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'INVOICED';

export interface MeasurementItem {
  budgetItemId: string;
  description: string; // Snapshot
  unit: string;
  unitPrice: number; // Snapshot from budget
  
  budgetQuantity: number;
  previousQuantity: number; // Cumulative from previous approved measurements
  currentQuantity: number; // The value being measured now
  
  // Calculated
  totalQuantity: number; // Prev + Current
  currentValue: number; // Current * UnitPrice
  totalValue: number; // Total * UnitPrice
  executionPercent: number;
}

export interface Measurement {
  id: string;
  workId: string;
  reference: string; // e.g., "Auto #1"
  date: string;
  periodStart: string;
  periodEnd: string;
  status: MeasurementStatus;
  
  items: Record<string, MeasurementItem>; // Keyed by budgetItemId for O(1) access
  
  totalCurrentValue: number;
  totalAccumulatedValue: number;
}

// --- CUSTOS REAIS (Real Costs) ---

export type CostType = 'MATERIAL' | 'LABOR' | 'EQUIPMENT' | 'SUBCONTRACT' | 'OTHER';

export interface RealCost {
  id: string;
  workId: string;
  date: string;
  description: string;
  amount: number;
  type: CostType;
  budgetItemId?: string; // Link to specific item
  budgetChapterId?: string; // Link to chapter
  supplier?: string;
  documentRef?: string; // Invoice number e.g. "FAT-2023/001"
  notes?: string;
}

// --- LIVRO DE OBRAS & RDO (Site Log) ---

export type RDOStatus = 'DRAFT' | 'SUBMITTED' | 'VALIDATED' | 'RECTIFIED';
export type WeatherCondition = 'SUNNY' | 'CLOUDY' | 'RAIN' | 'STORM';

export interface RDOResource {
  id: string;
  type: CostType;
  description: string; // e.g. "Pedreiro 1ª", "Camião Grue"
  quantity: number;
  hours?: number;
  costEstimate?: number; // Stub for auto-cost generation
}

export interface RDOExecution {
  id: string;
  scheduleTaskId: string; // Link to ScheduleTask
  taskName: string; // Snapshot
  percentageIncrement: number; // How much progress was made today (e.g. +5%)
  notes: string;
}

export interface RDOOccurrence {
  id: string;
  type: 'DELAY' | 'ACCIDENT' | 'VISIT' | 'NON_COMPLIANCE' | 'OTHER';
  description: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  critical: boolean; // Triggers compliance module
}

export interface RDO {
  id: string;
  workId: string;
  date: string;
  number: number; // Sequential number
  status: RDOStatus;
  
  // General Info
  weatherMorning: WeatherCondition;
  weatherAfternoon: WeatherCondition;
  responsible: string;
  
  // Sections
  resources: RDOResource[];
  execution: RDOExecution[];
  occurrences: RDOOccurrence[];
  
  // Audit & Meta
  createdAt: string;
  submittedAt?: string;
  submittedBy?: string;
  observations?: string;
  
  // Integration Flags (Visual feedback)
  scheduleUpdated: boolean;
  costsGenerated: boolean;
}

// --- EXECUÇÃO FINANCEIRA (Financial Execution) ---

export interface FinancialItemSnapshot {
  id: string;
  description: string;
  budgetTotal: number; // Baseline (Price)
  executedPercent: number; // From Schedule
  executedValue: number; // budgetTotal * executedPercent
  actualCost: number; // Real cost incurred (Invoices/Timesheets)
  deviation: number; // executedValue - actualCost (Profit/Loss on execution)
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
  totalExecutedValue: number; // Revenue Recognized
  totalActualCost: number; // Cost Incurred
  grossMargin: number; // Executed Value - Actual Cost
  grossMarginPercent: number;
  chapters: FinancialChapterSnapshot[];
}

// --- FIM OBRA ---

export interface SiteReport {
  id: string;
  date: string;
  author: string;
  rawNotes: string;
  summary: string;
  issues: string[];
  weather: string;
}

// --- CONFORMIDADE (Compliance) ---

export type ComplianceType = 'LEGAL' | 'TECHNICAL' | 'CONTRACTUAL' | 'FINANCIAL';
export type ComplianceStatus = 'PENDING' | 'IN_REVIEW' | 'COMPLIANT' | 'NON_COMPLIANT' | 'WAIVED';
export type ComplianceSource = 'LAW' | 'CONTRACT' | 'INTERNAL_POLICY' | 'ISO_STANDARD';
export type ComplianceModule = 'SITE' | 'FINANCIAL' | 'MEASUREMENT' | 'BUDGET';

export interface AuditLog {
  id: string;
  date: string;
  user: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
}

export interface ComplianceItem {
  id: string;
  workId: string;
  requirement: string; // The rule description
  type: ComplianceType;
  source: ComplianceSource;
  
  // Linkage
  relatedModule: ComplianceModule;
  relatedEntityId?: string; // E.g., Measurement ID, Task ID
  
  // Status
  status: ComplianceStatus;
  critical: boolean; // If true, blocks related actions
  
  // Evidence
  evidence?: string; // Text note or link reference
  lastUpdated: string;
  responsible: string;
  
  // Audit
  auditTrail: AuditLog[];
}

// Deprecated simplified interface (kept for backward compat if any, but superseded by ComplianceItem)
export interface ComplianceItemSimple {
  id: string;
  category: string;
  task: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  dueDate: string;
}

export interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'DRAFT' | 'SENT' | 'PAID';
  date: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  checklist?: ChecklistItem[];
  project: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  progress: number;
  createdAt: string;
}