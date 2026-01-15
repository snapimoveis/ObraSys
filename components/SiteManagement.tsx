import React from 'react';
import { 
  Plus, 
  Filter, 
  Download, 
  HardHat, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  Calendar,
  FileText
} from 'lucide-react';

const StatCard = ({ label, value, subtext, icon: Icon, colorClass, iconColor }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-28">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-1.5 rounded-md ${colorClass}`}>
        <Icon size={16} className={iconColor} />
      </div>
    </div>
    <p className="text-[10px] text-slate-400 font-medium">
      {subtext}
    </p>
  </div>
);

const SiteManagement: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00609C]">Gestão de Obras</h1>
          <p className="text-slate-500 text-sm mt-1">Controlo total da execução, progresso e custos da obra</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Plus size={16} />
              <span>Nova Obra</span>
           </button>
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Filter size={16} />
              <span>Filtros</span>
           </button>
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Download size={16} />
              <span>Exportar</span>
           </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          label="Obras Ativas" 
          value="0" 
          subtext="Em andamento" 
          icon={HardHat} 
          colorClass="bg-blue-50" 
          iconColor="text-blue-600" 
        />
        <StatCard 
          label="Obras Concluídas" 
          value="0" 
          subtext="Finalizadas com sucesso" 
          icon={CheckCircle2} 
          colorClass="bg-green-50" 
          iconColor="text-green-600" 
        />
         <StatCard 
          label="Obras em Atraso" 
          value="0" 
          subtext="Requerem atenção" 
          icon={AlertTriangle} 
          colorClass="bg-orange-50" 
          iconColor="text-orange-600" 
        />
         <StatCard 
          label="Progresso Médio (%)" 
          value="0.0%" 
          subtext="De todas as obras" 
          icon={TrendingUp} 
          colorClass="bg-purple-50" 
          iconColor="text-purple-600" 
        />
         <StatCard 
          label="Desvio de Custos (€)" 
          value="0,00 €" 
          subtext="Total (Real vs Planeado)" 
          icon={DollarSign} 
          colorClass="bg-red-50" 
          iconColor="text-red-600" 
        />
      </div>

      {/* Lista de Obras - Empty State */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[300px] flex flex-col">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Lista de Obras</h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-slate-50 rounded-full mb-4">
             <HardHat size={32} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Nenhuma obra encontrada</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Comece por criar uma nova obra para gerir os seus projetos.</p>
          <button className="bg-white border border-slate-200 hover:border-[#00609C] hover:text-[#00609C] text-slate-600 px-4 py-2 rounded-lg text-xs font-medium transition-colors">
            Nova Obra
          </button>
        </div>
      </div>

       {/* Visão Rápida de Progresso - Empty State */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[250px] flex flex-col">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
           <BarChart3 size={18} className="text-[#00609C]" />
           Visão Rápida de Progresso
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
           <BarChart3 size={32} className="text-slate-300 mb-3" />
           <p className="text-sm font-medium text-slate-700">Gráfico de Progresso Geral (Em breve)</p>
           <p className="text-xs text-slate-500 mt-1">Um gráfico interativo mostrará o progresso de todas as obras ao longo do tempo.</p>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Orçamento */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center justify-center h-48">
          <div className="text-xs font-semibold text-slate-700 w-full text-left mb-4">Ligação com Orçamento</div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <DollarSign size={32} className="text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">Orçamentos Integrados (Em breve)</p>
            <p className="text-[10px] text-slate-500 mt-1">Acompanhe os orçamentos de cada obra diretamente aqui.</p>
          </div>
        </div>

        {/* Cronograma */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center justify-center h-48">
          <div className="text-xs font-semibold text-slate-700 w-full text-left mb-4">Ligação com Cronograma</div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Calendar size={32} className="text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">Funcionalidade não disponível</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">A gestão de cronogramas está disponível apenas para planos Profissional e Empresa.</p>
            <button className="mt-3 bg-white border border-slate-200 hover:border-[#00609C] hover:text-[#00609C] text-slate-500 px-3 py-1.5 rounded text-[10px] font-medium transition-colors">
              Ver Planos
            </button>
          </div>
        </div>

        {/* RDO */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center justify-center h-48">
          <div className="text-xs font-semibold text-slate-700 w-full text-left mb-4">Ligação com RDO</div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <FileText size={32} className="text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">Funcionalidade não disponível</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">A gestão de RDOs está disponível apenas para planos Profissional e Empresa.</p>
             <button className="mt-3 bg-white border border-slate-200 hover:border-[#00609C] hover:text-[#00609C] text-slate-500 px-3 py-1.5 rounded text-[10px] font-medium transition-colors">
              Ver Planos
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
export default SiteManagement;