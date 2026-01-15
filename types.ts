export enum View {
  DASHBOARD = 'DASHBOARD',
  BUDGETING = 'BUDGETING', // Orçamentos
  SITE_MANAGEMENT = 'SITE_MANAGEMENT', // Obras
  SCHEDULE = 'SCHEDULE', // Cronograma
  TEAM = 'TEAM', // Colaboradores
  COMPLIANCE = 'COMPLIANCE', // Conformidade
  APPROVALS = 'APPROVALS', // Gestão de Aprovações
  FINANCIAL = 'FINANCIAL', // Financeiro
  REPORTS = 'REPORTS', // Relatórios
  PLANS = 'PLANS', // Nossos Planos
  PRICES = 'PRICES', // Base de Preços
  ARTICLES = 'ARTICLES', // Artigos de Trabalho
  AUTOMATION = 'AUTOMATION', // Automação & Inteligência
  COMPANY_SETTINGS = 'COMPANY_SETTINGS', // Gestão da Empresa
  
  // Mappings for existing components
  TASKS = 'TASKS', 
  INVOICING = 'INVOICING',
}

export interface BudgetItem {
  id: string;
  code: string;
  description: string;
  technicalDetails?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

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