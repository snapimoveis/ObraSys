import React from 'react';
import { HardHat, FileText, TrendingUp, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/financialUtils';

export interface DashboardMetrics {
  activeWorks: number;
  budgetsInReview: number;
  financialDeviation: number;
  complianceRate: number;
  overdueTasks: number;
}

interface Props {
  metrics: DashboardMetrics;
}

const KPICard = ({ label, value, subtext, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color.bg} ${color.text}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-3 flex items-center gap-2">
      {trend && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
      <p className="text-xs text-slate-400 font-medium truncate">
        {subtext}
      </p>
    </div>
  </div>
);

const DashboardKPIs: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <KPICard 
        label="Obras Ativas" 
        value={metrics.activeWorks} 
        subtext="Em fase de execução" 
        icon={HardHat}
        color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
      />
      
      <KPICard 
        label="Em Revisão" 
        value={metrics.budgetsInReview} 
        subtext="Orçamentos pendentes" 
        icon={FileText}
        color={{ bg: 'bg-orange-50', text: 'text-orange-600' }}
      />

      <KPICard 
        label="Desvio Global" 
        value={`${metrics.financialDeviation >= 0 ? '+' : ''}${formatCurrency(metrics.financialDeviation)}`} 
        subtext="Executado vs Real" 
        icon={TrendingUp}
        color={{ bg: metrics.financialDeviation >= 0 ? 'bg-green-50' : 'bg-red-50', text: metrics.financialDeviation >= 0 ? 'text-green-600' : 'text-red-600' }}
        trend={metrics.financialDeviation >= 0 ? 'up' : 'down'}
      />

      <KPICard 
        label="Conformidade" 
        value={`${metrics.complianceRate}%`} 
        subtext="Índice médio global" 
        icon={CheckCircle2}
        color={{ bg: metrics.complianceRate > 90 ? 'bg-emerald-50' : 'bg-yellow-50', text: metrics.complianceRate > 90 ? 'text-emerald-600' : 'text-yellow-600' }}
      />

      <KPICard 
        label="Tarefas Atrasadas" 
        value={metrics.overdueTasks} 
        subtext="Requerem ação imediata" 
        icon={AlertOctagon}
        color={{ bg: metrics.overdueTasks > 0 ? 'bg-red-50' : 'bg-slate-50', text: metrics.overdueTasks > 0 ? 'text-red-600' : 'text-slate-400' }}
      />
    </div>
  );
};

export default DashboardKPIs;
