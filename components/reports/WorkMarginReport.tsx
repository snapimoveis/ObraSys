import React from 'react';
import { ReportKPIs } from '../../hooks/useWorkReports';
import { formatCurrency } from '../../utils/financialUtils';
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  kpis: ReportKPIs;
}

const WorkMarginReport: React.FC<Props> = ({ kpis }) => {
  return (
    <div className="space-y-8 animate-fade-in">
       {/* Main Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500">Margem Bruta (Valor)</p>
                <h3 className={`text-4xl font-bold mt-2 ${kpis.grossMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {formatCurrency(kpis.grossMargin)}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Executado - Custos Reais</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-full text-slate-400">
                <PieChart size={32} />
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500">Margem Bruta (%)</p>
                <h3 className={`text-4xl font-bold mt-2 ${kpis.marginPercent >= 20 ? 'text-green-600' : kpis.marginPercent > 0 ? 'text-orange-500' : 'text-red-600'}`}>
                   {kpis.marginPercent.toFixed(1)}%
                </h3>
                <p className="text-xs text-slate-400 mt-1">Sobre o valor executado</p>
             </div>
             <div className={`p-4 rounded-full ${kpis.marginPercent >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {kpis.marginPercent >= 0 ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
             </div>
          </div>
       </div>

       {/* Analysis */}
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Análise de Rentabilidade</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
             Com base nos dados atuais, a obra apresenta uma rentabilidade de <strong>{kpis.marginPercent.toFixed(1)}%</strong>. 
             O valor total executado até ao momento é de <strong>{formatCurrency(kpis.earnedValue)}</strong> com um custo real suportado de <strong>{formatCurrency(kpis.actualCost)}</strong>.
          </p>
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex">
             <div className="bg-slate-400 h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${100 - kpis.marginPercent}%` }} title="Custos">Custos</div>
             <div className="bg-green-500 h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${kpis.marginPercent}%` }} title="Margem">Margem</div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
             <span>0%</span>
             <span>100% (Receita)</span>
          </div>
       </div>
    </div>
  );
};

export default WorkMarginReport;
