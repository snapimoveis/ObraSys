import React from 'react';
import { UserPlus, Search, Users, Clock, UserCheck } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className="text-slate-400">
      <Icon size={24} />
    </div>
  </div>
);

const Team: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Colaboradores</h1>
          <p className="text-slate-500 text-sm mt-1">Gerir convites e colaboradores do sistema</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
          <UserPlus size={16} />
          <span>Convidar Colaborador</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2.5 flex items-center shadow-sm">
           <Search size={18} className="text-slate-400 mr-2" />
           <input 
             type="text" 
             placeholder="Pesquisar por nome ou email..."
             className="flex-1 bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400"
           />
        </div>
        <select className="bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-600 outline-none shadow-sm min-w-[180px]">
          <option>Filtrar por função</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Colaboradores" value="0" icon={Users} />
        <StatCard label="Convites Pendentes" value="0" icon={Clock} />
        <StatCard label="Convites Aceitos" value="0" icon={UserCheck} />
      </div>

      {/* Main Content Area */}
      <div>
        {/* Tabs */}
        <div className="inline-flex gap-1 bg-slate-100 p-1 rounded-t-lg">
          <button className="px-4 py-2 text-sm font-medium bg-white text-slate-800 rounded shadow-sm">
            Colaboradores Ativos
          </button>
          <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">
            Convites
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl shadow-sm min-h-[400px] p-6">
           <h2 className="text-xl font-medium text-slate-800 mb-6">Colaboradores Ativos</h2>
           
           {/* Table Header */}
           <div className="grid grid-cols-5 gap-4 pb-3 border-b border-slate-200 mb-4">
             <div className="text-xs font-semibold text-slate-500 uppercase">Nome</div>
             <div className="text-xs font-semibold text-slate-500 uppercase text-center">Função</div>
             <div className="text-xs font-semibold text-slate-500 uppercase text-center">Obra</div>
             <div className="text-xs font-semibold text-slate-500 uppercase text-center">Data Início</div>
             <div className="text-xs font-semibold text-slate-500 uppercase text-center">Ações</div>
           </div>

           {/* Empty State */}
           <div className="flex flex-col items-center justify-center h-64 text-center">
             {/* Icon could go here if needed, keeping it clean as per screenshot */}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Team;