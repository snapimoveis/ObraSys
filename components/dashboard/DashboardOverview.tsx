import React from 'react';
import DashboardKPIs, { DashboardMetrics } from './DashboardKPIs';
import DashboardAlerts, { Alert } from './DashboardAlerts';
import DashboardProjects, { ProjectSummary } from './DashboardProjects';
import { Plus, Calculator, HardHat, FileText, Upload } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  // MOCK DATA AGGREGATION
  // In a real app, this would come from a Context or React Query fetching from multiple endpoints.
  
  const kpis: DashboardMetrics = {
    activeWorks: 4,
    budgetsInReview: 2,
    financialDeviation: 12500, // Positive means under budget (savings) in this context, or profit
    complianceRate: 94,
    overdueTasks: 3
  };

  const alerts: Alert[] = [
    { id: '1', type: 'CRITICAL', message: 'Alvará da obra "Vila Nova" expira em 5 dias.', timestamp: 'Há 2h', module: 'Conformidade' },
    { id: '2', type: 'WARNING', message: 'Atraso na entrega de betão (Obra Cascais).', timestamp: 'Há 4h', module: 'Logística' },
    { id: '3', type: 'INFO', message: 'Novo orçamento aprovado pelo cliente TechCorp.', timestamp: 'Ontem', module: 'Comercial' },
  ];

  const projects: ProjectSummary[] = [
    { id: '1', name: 'Moradia V4 - Cascais', client: 'Ana Pereira', location: 'Cascais, Lisboa', status: 'EXECUTION', progress: 15, nextMilestone: 'Betonagem Piso 0', financialStatus: 'ON_TRACK' },
    { id: '2', name: 'Reabilitação Baixa', client: 'InvestProp', location: 'Lisboa', status: 'DELAYED', progress: 45, nextMilestone: 'Acabamentos WC', financialStatus: 'OVER_BUDGET' },
    { id: '3', name: 'Escritórios TechHub', client: 'TechCorp SA', location: 'Oeiras', status: 'PLANNING', progress: 0, nextMilestone: 'Início Estaleiro', financialStatus: 'ON_TRACK' },
    { id: '4', name: 'Vivenda Algarve', client: 'John Smith', location: 'Faro', status: 'EXECUTION', progress: 78, nextMilestone: 'Entrega Provisória', financialStatus: 'ON_TRACK' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00609C]">Painel de Controlo</h1>
          <p className="text-slate-500 mt-1">Visão geral executiva da empresa e operações.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs text-slate-400 font-medium px-3">Última atualização: Hoje, 09:41</span>
        </div>
      </div>

      {/* KPI Section */}
      <DashboardKPIs metrics={kpis} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Left Column (Projects & Actions) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <DashboardProjects projects={projects} />
          
          {/* Quick Actions Bar */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Acesso Rápido</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group">
                   <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <HardHat size={20} className="text-[#00609C]" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">Nova Obra</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group">
                   <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Calculator size={20} className="text-[#00609C]" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">Novo Orçamento</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group">
                   <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <FileText size={20} className="text-[#00609C]" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">Registar RDO</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group">
                   <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Upload size={20} className="text-[#00609C]" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">Importar Fatura</span>
                </button>
             </div>
          </div>
        </div>

        {/* Right Column (Alerts & Activity) */}
        <div className="space-y-6">
           <DashboardAlerts alerts={alerts} />
           
           {/* Mini Financial Summary */}
           <div className="bg-[#00609C] rounded-xl shadow-md p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Calculator size={100} />
              </div>
              <h3 className="font-bold text-lg relative z-10">Faturação do Mês</h3>
              <p className="text-blue-200 text-sm mb-4 relative z-10">Acumulado Novembro 2023</p>
              <div className="text-4xl font-bold mb-2 relative z-10">€ 42.500</div>
              <div className="w-full bg-blue-800 rounded-full h-1.5 mb-2 relative z-10">
                 <div className="bg-blue-300 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-blue-200 relative z-10">65% da meta mensal (€ 65.000)</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
