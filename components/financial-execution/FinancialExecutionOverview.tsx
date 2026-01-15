import React from 'react';
import { Budget, Work } from '../../types';
import { useFinancialExecution } from '../../hooks/useFinancialExecution';
import FinancialKPIs from './FinancialKPIs';
import FinancialChapterRow from './FinancialChapterRow';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
  budget: Budget;
  work: Work;
}

const FinancialExecutionOverview: React.FC<Props> = ({ budget, work }) => {
  const { data, loading, error } = useFinancialExecution(budget, work);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 size={32} className="animate-spin mb-2 text-[#00609C]" />
        <p className="text-sm">Calculando execução financeira...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 p-6 rounded-lg flex flex-col items-center text-center">
        <AlertCircle size={32} className="text-red-500 mb-2" />
        <h3 className="text-red-800 font-bold">Erro de Processamento</h3>
        <p className="text-red-600 text-sm">{error || "Não foi possível carregar os dados financeiros."}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <FinancialKPIs data={data} />

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
           <h3 className="font-bold text-slate-800">Detalhe por Capítulo</h3>
           <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                 <span className="text-slate-500">Orçado</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-[#00609C]"></div>
                 <span className="text-slate-500">Executado (Receita)</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                 <span className="text-slate-500">Custo Real</span>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3 w-1/3">Descrição</th>
                <th className="px-6 py-3 text-right">Orçamento</th>
                <th className="px-6 py-3 text-right">Execução %</th>
                <th className="px-6 py-3 text-right text-[#00609C]">Executado €</th>
                <th className="px-6 py-3 text-right">Custo Real</th>
                <th className="px-6 py-3 text-right">Desvio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.chapters.map(chapter => (
                <FinancialChapterRow key={chapter.id} chapter={chapter} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialExecutionOverview;