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

// --- FIM ORÇAMENTAÇÃO ---

export interface SiteReport {
  id: string;
  date: string;
  author: string;
  rawNotes: string;
  summary: string;
  issues: string[];
  weather: string;
}

export interface ComplianceItem {
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

export interface Task {
  id: string;
  title: string;
  description?: string;
  project: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  progress: number;
  createdAt: string;
}