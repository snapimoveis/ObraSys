import React from 'react';
import { ReportKPIs } from '../../hooks/useWorkReports';
import { Budget } from '../../types';
import { formatCurrency } from '../../utils/financialUtils';
import { BarChart3, TrendingDown, ArrowUpRight, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Props {
  kpis: ReportKPIs;
  budget: Budget;
}

const WorkFinancialReport: React.FC<Props> = ({ kpis, budget }) => {
  
  // Prepare Chart Data (Mocking distribution for demo)
  const chartData = [
    { name: 'Total', Orçado: kpis.totalBudget, Executado: kpis.earnedValue, Real: kpis.actualCost },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 size={20}/></div>
              <span className="text-sm font-medium text-slate-500">Valor Executado (EV)</span>
           </div>
           <p className="text-3xl font-bold text-slate-800">{formatCurrency(kpis.earnedValue)}</p>
           <p className="text-xs text-slate-400 mt-1">Valor produzido conforme orçamento</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><TrendingDown size={20}/></div>
              <span className="text-sm font-medium text-slate-500">Custo Real (AC)</span>
           </div>
           <p className="text-3xl font-bold text-slate-800">{formatCurrency(kpis.actualCost)}</p>
           <p className="text-xs text-slate-400 mt-1">Total de despesas registadas</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${kpis.costVariance >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                 <DollarSign size={20}/>
              </div>
              <span className="text-sm font-medium text-slate-500">Desvio de Custo (CV)</span>
           </div>
           <p className={`text-3xl font-bold ${kpis.costVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
             {kpis.costVariance > 0 ? '+' : ''}{formatCurrency(kpis.costVariance)}
           </p>
           <p className="text-xs text-slate-400 mt-1">EV - AC</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Comparativo Financeiro Global</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" barSize={40}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(val) => `€${val/1000}k`} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="Orçado" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Executado" fill="#00609C" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Real" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Detallhe por Capítulo</h3>
         </div>
         <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
               <tr>
                  <th className="px-6 py-3">Capítulo</th>
                  <th className="px-6 py-3 text-right">Orçamento</th>
                  <th className="px-6 py-3 text-right">Peso %</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {budget.chapters.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                     <td className="px-6 py-3 font-medium text-slate-700">{c.name}</td>
                     <td className="px-6 py-3 text-right text-slate-600">{formatCurrency(c.totalPrice)}</td>
                     <td className="px-6 py-3 text-right text-slate-500">{((c.totalPrice / budget.totalPrice) * 100).toFixed(1)}%</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default WorkFinancialReport;