import React from 'react';
import { ShieldCheck, AlertTriangle, FileCheck, Lock } from 'lucide-react';

interface Props {
  stats: {
    total: number;
    compliant: number;
    pending: number;
    criticalIssues: number;
    percentage: number;
  };
}

const StatCard = ({ label, value, subtext, icon: Icon, colorClass, iconColor }: any) => (
  <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between ${colorClass}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold uppercase opacity-70 tracking-wide">{label}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg bg-white/50 backdrop-blur-sm ${iconColor}`}>
        <Icon size={20} />
      </div>
    </div>
    {subtext && <p className="text-xs mt-2 font-medium opacity-80">{subtext}</p>}
  </div>
);

const ComplianceOverview: React.FC<Props> = ({ stats }) => {
  const isHealthy = stats.criticalIssues === 0 && stats.percentage > 80;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard 
        label="Índice Global" 
        value={`${stats.percentage.toFixed(0)}%`}
        subtext={isHealthy ? "Obra em conformidade" : "Atenção requerida"}
        icon={ShieldCheck}
        colorClass={isHealthy ? "bg-green-50 border-green-200 text-green-900" : "bg-orange-50 border-orange-200 text-orange-900"}
        iconColor={isHealthy ? "text-green-600" : "text-orange-600"}
      />
      <StatCard 
        label="Itens Críticos" 
        value={stats.criticalIssues}
        subtext="Bloqueios ativos"
        icon={Lock}
        colorClass={stats.criticalIssues > 0 ? "bg-red-50 border-red-200 text-red-900" : "bg-slate-50 border-slate-200 text-slate-800"}
        iconColor={stats.criticalIssues > 0 ? "text-red-600" : "text-slate-500"}
      />
      <StatCard 
        label="Pendentes" 
        value={stats.pending}
        subtext="A aguardar ação"
        icon={AlertTriangle}
        colorClass="bg-white border-slate-200 text-slate-800"
        iconColor="text-yellow-500"
      />
      <StatCard 
        label="Conformes" 
        value={stats.compliant}
        subtext={`De um total de ${stats.total}`}
        icon={FileCheck}
        colorClass="bg-white border-slate-200 text-slate-800"
        iconColor="text-blue-500"
      />
    </div>
  );
};

export default ComplianceOverview;
