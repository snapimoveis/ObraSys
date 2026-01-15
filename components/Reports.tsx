import React from 'react';
import { Filter, Download, FileText, Plus, FileBarChart, Clock, Users, Calendar } from 'lucide-react';

const StatCard = ({ label, value, subtext, icon: Icon, subtextColor }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
      </div>
      <div className="text-slate-400">
        <Icon size={20} />
      </div>
    </div>
    <p className={`text-xs ${subtextColor || 'text-green-600'}`}>
      {subtext}
    </p>
  </div>
);

const Reports: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie e visualize todos os relatórios do sistema</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Filter size={16} />
              <span>Filtrar</span>
           </button>
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Download size={16} />
              <span>Exportar Todos</span>
           </button>
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <FileText size={16} />
              <span>Criar a partir de RDO</span>
           </button>
           <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Plus size={16} />
              <span>Novo Relatório</span>
           </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total de Relatórios" value="0" subtext="+12% em relação ao mês anterior" icon={FileText} />
        <StatCard label="Relatórios este Mês" value="0" subtext="+25% em relação ao mês anterior" icon={FileBarChart} />
        <StatCard label="Categorias Ativas" value="0" subtext="0% em relação ao mês anterior" icon={Clock} subtextColor="text-slate-500" />
        <StatCard label="Relatórios Publicados" value="0" subtext="+8% em relação ao mês anterior" icon={Users} />
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-1">
          <button className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-t-lg border-b-0 text-slate-800 relative top-[1px] z-10">
            Relatórios
          </button>
          <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">
            Dashboard
          </button>
          <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">
            Personalizados
          </button>
        </div>

        {/* Filter Bar & Content */}
        <div className="bg-white border border-slate-200 rounded-lg rounded-tl-none shadow-sm p-6 min-h-[500px]">
           {/* Filters */}
           <div className="flex flex-wrap gap-4 mb-6">
              <button className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg text-slate-400">
                 <div className="w-4 h-4 border-2 border-slate-400 rounded-sm"></div>
              </button>
              <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 outline-none min-w-[150px]">
                <option>Categoria</option>
              </select>
              <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 outline-none min-w-[150px]">
                <option>Status</option>
              </select>
              <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 outline-none min-w-[150px]">
                <option>Obra</option>
              </select>
              <button className="flex items-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 flex-1 justify-start">
                 <Calendar size={16} />
                 <span>Selecionar período</span>
              </button>
           </div>

           {/* Empty State */}
           <div className="border border-slate-200 rounded-xl h-[350px] flex flex-col items-center justify-center text-center">
              <div className="mb-4 text-slate-400">
                <FileText size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-1">Nenhum relatório encontrado</h3>
              <p className="text-sm text-slate-500 mb-6">Não foram encontrados relatórios com os filtros aplicados.</p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
                  <Plus size={16} />
                  <span>Novo Relatório</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;