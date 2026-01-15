import React, { useState } from 'react';
import { Filter, Download, ArrowLeft, Printer } from 'lucide-react';
import { useWorkReports } from '../hooks/useWorkReports';
import { createWorkFromBudget } from '../utils/workUtils';
import WorkReportOverview from './reports/WorkReportOverview';
import WorkFinancialReport from './reports/WorkFinancialReport';
import WorkScheduleReport from './reports/WorkScheduleReport';
import WorkMarginReport from './reports/WorkMarginReport';

// --- MOCK DATA FOR REPORTS DEMO ---
const mockBudget: any = {
  id: '1',
  reference: 'ORC-2023-001',
  title: 'Moradia V4 - Cascais',
  client: 'Ana Pereira',
  projectLocation: 'Cascais, Lisboa',
  totalPrice: 450000,
  chapters: [
    { 
        id: 'c1', name: 'Estaleiro e Trabalhos Preparatórios', totalPrice: 20000,
        subChapters: [{ id: 's1', name: 'Montagem', totalPrice: 5000, items: [] }], items: [] 
    },
    { 
        id: 'c2', name: 'Estruturas', totalPrice: 120000,
        subChapters: [{ id: 's3', name: 'Betão', totalPrice: 120000, items: [] }], items: [] 
    }
  ]
};

const mockWork = createWorkFromBudget(mockBudget);
// Simulate progress
mockWork.schedule[0].tasks[0].progress = 100;
mockWork.executedValue = 25000; 
mockWork.physicalProgress = 15;

const mockCosts = [
  { id: '1', workId: '1', date: '2023-11-01', description: 'Materiais', amount: 15000, type: 'MATERIAL' },
  { id: '2', workId: '1', date: '2023-11-05', description: 'Mão de Obra', amount: 5000, type: 'LABOR' },
] as any[];

const mockMeasurements = [
  { id: 'm1', status: 'APPROVED', totalCurrentValue: 20000 }
] as any[];

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'OVERVIEW' | 'FINANCIAL' | 'SCHEDULE' | 'MARGIN' | 'EXECUTIVE'>('OVERVIEW');
  
  const { kpis } = useWorkReports(mockBudget, mockWork, mockCosts, mockMeasurements);

  const renderContent = () => {
    switch (activeReport) {
      case 'FINANCIAL':
        return <WorkFinancialReport kpis={kpis} budget={mockBudget} />;
      case 'SCHEDULE':
        return <WorkScheduleReport kpis={kpis} work={mockWork} />;
      case 'MARGIN':
        return <WorkMarginReport kpis={kpis} />;
      case 'EXECUTIVE':
        return (
          <div className="space-y-6">
             <WorkFinancialReport kpis={kpis} budget={mockBudget} />
             <WorkMarginReport kpis={kpis} />
          </div>
        );
      default:
        return <WorkReportOverview kpis={kpis} onSelectReport={setActiveReport} />;
    }
  };

  const getTitle = () => {
    switch(activeReport) {
      case 'FINANCIAL': return 'Relatório Financeiro Detalhado';
      case 'SCHEDULE': return 'Análise de Cronograma';
      case 'MARGIN': return 'Relatório de Margem e Rentabilidade';
      case 'EXECUTIVE': return 'Resumo Executivo da Obra';
      default: return 'Central de Relatórios';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {activeReport !== 'OVERVIEW' && (
            <button 
              onClick={() => setActiveReport('OVERVIEW')}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{getTitle()}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {mockBudget.title} • {new Date().toLocaleDateString('pt-PT')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Filter size={16} />
              <span>Filtros</span>
           </button>
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Printer size={16} />
              <span>Imprimir</span>
           </button>
           <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Download size={16} />
              <span>Exportar PDF</span>
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default Reports;
