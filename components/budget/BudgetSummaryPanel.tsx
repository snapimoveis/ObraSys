import React from 'react';
import { Budget } from '../../types';
import { formatCurrency, getRiskLevel } from '../../utils/budgetUtils';
import { AlertTriangle, Calculator, Copy, History, Download } from 'lucide-react';

interface BudgetSummaryPanelProps {
  budget: Budget;
  onSave: () => void;
}

const BudgetSummaryPanel: React.FC<BudgetSummaryPanelProps> = ({ budget, onSave }) => {
  const risk = getRiskLevel(budget.marginPercent);

  // Stats calculation
  const totalChapters = budget.chapters.length;
  const totalItems = budget.chapters.reduce(
    (acc, c) => acc + c.items.length + c.subChapters.reduce((sAcc, s) => sAcc + s.items.length, 0), 
    0
  );

  return (
    <div className="w-80 flex-shrink-0 flex flex-col gap-4">
      
      {/* Main Financial Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 p-4 text-white">
          <h3 className="font-bold text-sm uppercase tracking-wide opacity-80 mb-1">Total Orçamento</h3>
          <div className="text-3xl font-bold">{formatCurrency(budget.totalPrice)}</div>
          <div className="text-xs opacity-70 mt-1 flex justify-between">
             <span>+IVA (23%):</span>
             <span>{formatCurrency(budget.totalTax)}</span>
          </div>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-sm text-slate-500">Custo Estimado</span>
            <span className="font-bold text-slate-700">{formatCurrency(budget.totalCost)}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-sm text-slate-500">Margem Bruta</span>
            <div className="text-right">
              <span className={`font-bold block ${risk.color}`}>{formatCurrency(budget.totalMargin)}</span>
              <span className={`text-xs ${risk.color} font-medium`}>{budget.marginPercent.toFixed(1)}%</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg flex items-center gap-3 ${risk.bg} border ${risk.border}`}>
            <AlertTriangle size={20} className={risk.color} />
            <div>
              <p className={`text-xs font-bold uppercase ${risk.color}`}>Risco Financeiro</p>
              <p className="text-xs text-slate-600 font-medium">{risk.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs & Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <Calculator size={16} className="text-[#00609C]" /> Indicadores (KPIs)
        </h4>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-slate-500">Capítulos</span>
            <span className="font-medium text-slate-800">{totalChapters}</span>
          </li>
          <li className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-slate-500">Total Artigos</span>
            <span className="font-medium text-slate-800">{totalItems}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-500">Desvio (vs v{budget.version - 1 || 1})</span>
            <span className="font-medium text-green-600">+0.0%</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Ações Rápidas</p>
        <div className="space-y-2">
          <button className="w-full bg-white border border-slate-300 hover:border-[#00609C] text-slate-600 hover:text-[#00609C] py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
            <Copy size={14} /> Duplicar Orçamento
          </button>
          <button className="w-full bg-white border border-slate-300 hover:border-[#00609C] text-slate-600 hover:text-[#00609C] py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
            <History size={14} /> Comparar Versões
          </button>
           <button className="w-full bg-white border border-slate-300 hover:border-[#00609C] text-slate-600 hover:text-[#00609C] py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
            <Download size={14} /> Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryPanel;
