import React from 'react';
import { Work } from '../../types';
import { formatCurrency } from '../../utils/budgetUtils';
import { TrendingUp, AlertTriangle, DollarSign, Activity } from 'lucide-react';

interface WorkKPIsProps {
  work: Work;
}

const KPICard = ({ label, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start">
       <div>
         <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
         <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
       </div>
       <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={18} className="text-slate-700 opacity-70" />
       </div>
    </div>
    <div className="mt-3 text-xs">
       {subtext}
    </div>
  </div>
);

const WorkKPIs: React.FC<WorkKPIsProps> = ({ work }) => {
  // Safe calculation for visual progress bar
  const progressColor = work.physicalProgress >= 100 ? 'bg-green-500' : work.physicalProgress > 50 ? 'bg-[#00609C]' : 'bg-orange-500';
  
  // Calculate delay (mock logic for demo: if execution < planning)
  const isDelayed = work.schedule.some(p => p.tasks.some(t => t.status === 'DELAYED'));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-200">
       <KPICard 
         label="Execução Física" 
         value={`${work.physicalProgress.toFixed(1)}%`}
         icon={Activity}
         color="bg-blue-100"
         subtext={
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
               <div className={`h-1.5 rounded-full ${progressColor}`} style={{ width: `${work.physicalProgress}%` }}></div>
            </div>
         }
       />
       
       <KPICard 
         label="Orçamento Total" 
         value={formatCurrency(work.totalBudget)}
         icon={DollarSign}
         color="bg-slate-100"
         subtext={<span className="text-slate-500">Valor Base Aprovado</span>}
       />

       <KPICard 
         label="Valor Executado" 
         value={formatCurrency(work.executedValue)}
         icon={TrendingUp}
         color="bg-green-100"
         subtext={<span className="text-green-600 font-medium">{(work.executedValue / work.totalBudget * 100).toFixed(1)}% do Orçamento</span>}
       />

       <KPICard 
         label="Estado Cronograma" 
         value={isDelayed ? "Atraso" : "No Prazo"}
         icon={AlertTriangle}
         color={isDelayed ? "bg-red-100" : "bg-green-100"}
         subtext={
            isDelayed 
            ? <span className="text-red-600 font-bold flex items-center gap-1">⚠ Atenção Necessária</span> 
            : <span className="text-green-600 font-medium">Cronograma alinhado</span>
         }
       />
    </div>
  );
};

export default WorkKPIs;