import React from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText, Plus } from 'lucide-react';
import { View } from '../types';

interface ComplianceProps {
  setCurrentView: (view: View) => void;
}

const StatCard = ({ label, value, subtext, icon: Icon, colorClass, iconColor }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-32 flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div>
         <p className="text-sm font-medium text-slate-600 flex items-center gap-1">
           {label} 
           {Icon && <Icon size={14} className={iconColor} />}
         </p>
         <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
      </div>
    </div>
    {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
  </div>
);

const Compliance: React.FC<ComplianceProps> = ({ setCurrentView }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Conformidade e Cliente</h1>
        <p className="text-slate-500 mt-1">Gerir livros de obra, aprovações e documentação para assegurar conformidade legal</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard 
          label="Livros Pendentes" 
          value="3" 
          icon={AlertTriangle} 
          iconColor="text-yellow-500" 
        />
        <StatCard 
          label="Livros Aprovados" 
          value="0" 
          icon={CheckCircle} 
          iconColor="text-green-500" 
        />
        <StatCard 
          label="Aprovações Pendentes" 
          value="0" 
          icon={Clock} 
          iconColor="text-orange-500" 
        />
        <StatCard 
          label="Total Documentos" 
          value="0" 
          icon={FileText} 
          iconColor="text-blue-500" 
        />
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-32 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1">
                Checklist <AlertTriangle size={14} className="text-orange-500" />
              </p>
              <h3 className="text-2xl font-bold text-orange-500 mt-2">Ativo</h3>
            </div>
            <p className="text-xs text-slate-500">Verificação legal</p>
         </div>
      </div>

      {/* Tabs & Content */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 min-h-[400px]">
        {/* Tab Header */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button className="px-6 py-4 text-sm font-medium bg-white text-slate-800 border-r border-slate-100 shadow-sm">
            Livro de Obra Digital
          </button>
          <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700">
            Gestão de Aprovações
          </button>
          <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700">
            Gestão Documental
          </button>
          <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700">
            Checklist
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
           <div className="flex justify-between items-center mb-8">
             <div>
               <h3 className="text-lg font-medium text-slate-800">Livro de Obra Digital</h3>
               <p className="text-sm text-slate-500">Compile RDOs numa folha formal para aprovação fiscal</p>
             </div>
             <button 
               onClick={() => setCurrentView('REPORTS' as any)}
               className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
             >
                <Plus size={16} />
                <span>Novo Livro de Obra</span>
             </button>
           </div>
           
           {/* Empty State / Placeholder Content */}
           <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
             {/* Content would go here */}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;