import React from 'react';
import { Plus, Filter, LayoutList, KanbanSquare, GanttChartSquare, AlertTriangle, Calendar } from 'lucide-react';

const StatCard = ({ label, value, subtext }: { label: string, value: string, subtext: string }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24">
    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-[10px] text-slate-400">{subtext}</p>
    </div>
  </div>
);

const Schedule: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <GanttChartSquare size={24} className="text-slate-800" />
             <h1 className="text-2xl font-bold text-slate-800">Cronograma de Obra</h1>
           </div>
           <p className="text-slate-500 text-sm max-w-2xl">
             Gráfico de Gantt completo gerado automaticamente baseado nos orçamentos
           </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
             <button className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded text-sm font-medium shadow-sm">
                <LayoutList size={14} />
                <span>Lista</span>
             </button>
             <button className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded text-sm font-medium">
                <KanbanSquare size={14} />
                <span>Kanban</span>
             </button>
             <button className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded text-sm font-medium">
                <GanttChartSquare size={14} />
                <span>Gantt</span>
             </button>
          </div>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Filter size={14} />
              <span>Filtros</span>
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Plus size={14} />
              <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Obras Ativas" value="0" subtext="Obras Ativas" />
        <StatCard label="Total de Tarefas" value="0" subtext="Total de Tarefas" />
        <StatCard label="Concluídas" value="0" subtext="Concluídas" />
        <StatCard label="Progresso Médio" value="0%" subtext="Progresso Médio" />
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-dashed border-slate-300 min-h-[250px] flex flex-col items-center justify-center p-8 text-center">
        <GanttChartSquare size={48} className="text-slate-400 mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-medium text-slate-800 mb-1">Nenhuma obra encontrada</h3>
        <p className="text-slate-500 text-sm">Não há obras em andamento para gerar o cronograma.</p>
      </div>

      {/* Warning Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-4 items-start">
        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
           <GanttChartSquare size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-yellow-800">Diagnóstico de Problema</h4>
          <p className="text-sm text-yellow-800 mt-1">
            <span className="font-bold">Erro:</span> Nenhuma obra encontrada. Verifique suas permissões.
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Verifique se você tem permissões adequadas e se existem obras ativas na sua empresa.
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-start">
         <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
           <Calendar size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-800">Cronograma Automático</h4>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Este cronograma é gerado automaticamente baseado nos capítulos dos orçamentos das suas obras ativas. As tarefas são sequenciadas logicamente e você pode ajustar datas, dependências e progressos conforme necessário. Marcos importantes são criados automaticamente para facilitar o acompanhamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;