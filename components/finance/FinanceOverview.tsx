import React from 'react';
import { FinancialTransaction, CashFlowData } from '../../types';
import CashFlow from './CashFlow';
import { formatCurrency } from '../../utils/financialUtils';
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, AlertCircle, Building, Calendar, ArrowRight } from 'lucide-react';

interface Props {
  onSelectProject: (id: string) => void;
}

const FinanceOverview: React.FC<Props> = ({ onSelectProject }) => {
  
  // MOCK DATA
  const cashFlow: CashFlowData[] = [
    { period: 'Jun', income: 45000, expense: 32000, balance: 13000 },
    { period: 'Jul', income: 52000, expense: 38000, balance: 14000 },
    { period: 'Ago', income: 48000, expense: 41000, balance: 7000 },
    { period: 'Set', income: 61000, expense: 35000, balance: 26000 },
    { period: 'Out', income: 55000, expense: 42000, balance: 13000 },
    { period: 'Nov', income: 22000, expense: 15000, balance: 7000 }, // Current partial
  ];

  const transactions: FinancialTransaction[] = [
    { id: 't1', date: '2023-11-12', dueDate: '2023-11-12', description: 'Adiantamento Obra Cascais', entity: 'Ana Pereira', amount: 15000, type: 'INCOME', status: 'PAID', category: 'Adiantamento', workId: 'WORK-1', workName: 'Moradia V4 - Cascais' },
    { id: 't2', date: '2023-11-10', dueDate: '2023-11-30', description: 'Fatura Cimento', entity: 'MatConstroi Lda', amount: 2450, type: 'EXPENSE', status: 'PENDING', category: 'Materiais', workId: 'WORK-1', workName: 'Moradia V4 - Cascais' },
    { id: 't3', date: '2023-11-05', dueDate: '2023-11-05', description: 'Pagamento Subempreiteiro', entity: 'João Ferreira', amount: 1200, type: 'EXPENSE', status: 'PAID', category: 'Mão de Obra', workId: 'WORK-2', workName: 'Reabilitação Baixa' },
    { id: 't4', date: '2023-11-01', dueDate: '2023-10-30', description: 'Seguro Acidentes Trabalho', entity: 'Seguradora X', amount: 850, type: 'EXPENSE', status: 'OVERDUE', category: 'Seguros' },
  ];

  const projectResults = [
    { id: 'WORK-1', name: 'Moradia V4 - Cascais', billed: 125000, cost: 98000, margin: 27000, marginPercent: 21.6, status: 'EXECUTION' },
    { id: 'WORK-2', name: 'Reabilitação Baixa', billed: 45000, cost: 48000, margin: -3000, marginPercent: -6.6, status: 'DELAYED' },
    { id: 'WORK-3', name: 'Escritórios TechHub', billed: 0, cost: 1500, margin: -1500, marginPercent: 0, status: 'PLANNING' },
  ];

  const pendingReceivables = 45000;
  const pendingPayables = 18500;
  const currentBalance = 124500;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Saldo Atual</p>
                 <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(currentBalance)}</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={20}/></div>
           </div>
           <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={12}/> +5.2% este mês
           </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">A Receber</p>
                 <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(pendingReceivables)}</h3>
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ArrowDownLeft size={20}/></div>
           </div>
           <p className="text-xs text-slate-400 mt-2">Próximos 30 dias</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">A Pagar</p>
                 <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(pendingPayables)}</h3>
              </div>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ArrowUpRight size={20}/></div>
           </div>
           <p className="text-xs text-slate-400 mt-2">Próximos 30 dias</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Margem Média</p>
                 <h3 className="text-2xl font-bold text-slate-800 mt-1">18.4%</h3>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={20}/></div>
           </div>
           <p className="text-xs text-slate-400 mt-2">Em obras ativas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Cash Flow Chart */}
         <div className="lg:col-span-2">
            <CashFlow data={cashFlow} />
         </div>

         {/* Project Performance */}
         <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Building size={18} className="text-slate-500" />
                  Rentabilidade por Obra
               </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
               {projectResults.map(p => (
                  <div key={p.id} className="p-3 border border-slate-100 rounded-md hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => onSelectProject(p.id)}>
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-700 text-sm truncate max-w-[150px]" title={p.name}>{p.name}</span>
                        <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${p.margin >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {p.marginPercent.toFixed(1)}%
                        </div>
                     </div>
                     <div className="flex justify-between text-xs text-slate-500">
                        <span>Faturado: <span className="text-slate-800">{formatCurrency(p.billed)}</span></span>
                        <span>Margem: <span className={`${p.margin >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>{formatCurrency(p.margin)}</span></span>
                     </div>
                  </div>
               ))}
            </div>
            <div className="p-3 border-t border-slate-100 text-center">
               <button className="text-xs font-bold text-[#00609C] hover:underline">Ver Relatório Completo</button>
            </div>
         </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Movimentos Recentes</h3>
            <button className="text-sm text-[#00609C] font-medium hover:underline flex items-center gap-1">
               Ver Extrato <ArrowRight size={14} />
            </button>
         </div>
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
               <tr>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Descrição / Entidade</th>
                  <th className="px-6 py-3">Obra</th>
                  <th className="px-6 py-3 text-center">Estado</th>
                  <th className="px-6 py-3 text-right">Valor</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 text-slate-600">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-slate-400"/>
                           {new Date(t.date).toLocaleDateString('pt-PT')}
                        </div>
                     </td>
                     <td className="px-6 py-3">
                        <div className="font-medium text-slate-800">{t.description}</div>
                        <div className="text-xs text-slate-500">{t.entity} • {t.category}</div>
                     </td>
                     <td className="px-6 py-3 text-slate-600 text-xs">
                        {t.workName || '-'}
                     </td>
                     <td className="px-6 py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                           t.status === 'PAID' ? 'bg-green-100 text-green-700' :
                           t.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                           'bg-orange-100 text-orange-700'
                        }`}>
                           {t.status === 'PAID' ? 'Pago' : t.status === 'OVERDUE' ? 'Vencido' : 'Pendente'}
                        </span>
                     </td>
                     <td className={`px-6 py-3 text-right font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-slate-700'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

    </div>
  );
};

export default FinanceOverview;