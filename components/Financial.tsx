import React from 'react';
import { Plus, DollarSign, TrendingUp, CreditCard, Activity } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, valueColor }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
        {label}
        {Icon && <Icon size={14} className="text-slate-400" />}
      </p>
      <h3 className={`text-2xl font-bold ${valueColor || 'text-slate-800'}`}>{value}</h3>
    </div>
  </div>
);

const Financial: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Módulo Financeiro</h1>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
          <Plus size={16} />
          <span>Nova Fatura</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Valor Total Contratos" value="0,00 €" icon={DollarSign} />
        <StatCard label="Total Faturado" value="0,00 €" icon={TrendingUp} />
        <StatCard label="Total Recebido" value="0,00 €" icon={CreditCard} valueColor="text-green-500" />
        <StatCard label="Pendente" value="0,00 €" icon={Activity} valueColor="text-orange-500" />
      </div>

      {/* Tabs & Content */}
      <div className="space-y-4">
        <div className="bg-slate-50 p-1 rounded-lg inline-flex w-full">
          <button className="flex-1 py-2 bg-white text-slate-800 shadow-sm rounded-md text-sm font-medium">
            Financeiro por Obra
          </button>
          <button className="flex-1 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium">
            Contas a Pagar/Receber
          </button>
          <button className="flex-1 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium">
            Relatórios
          </button>
        </div>
        
        {/* Placeholder for table/content */}
        <div className="bg-white rounded-xl h-[400px]"></div>
      </div>
    </div>
  );
};

export default Financial;