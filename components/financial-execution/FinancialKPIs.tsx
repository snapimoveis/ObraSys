import React from 'react';
import { FinancialExecution } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/financialUtils';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

interface Props {
  data: FinancialExecution;
}

const KPICard = ({ title, value, subValue, subLabel, icon: Icon, type = 'neutral' }: any) => {
  const colors = {
    neutral: 'bg-white border-slate-200 text-slate-800',
    positive: 'bg-green-50 border-green-200 text-green-800',
    negative: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    neutral: 'text-slate-400',
    positive: 'text-green-500',
    negative: 'text-red-500',
    blue: 'text-blue-500'
  };

  return (
    <div className={`p-4 rounded-lg border shadow-sm flex flex-col justify-between ${colors[type]}`}>
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold uppercase opacity-70 tracking-wide">{title}</span>
        <Icon size={18} className={iconColors[type]} />
      </div>
      <div className="mt-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        {subValue && (
          <p className="text-xs mt-1 opacity-80 font-medium">
            {subValue} {subLabel}
          </p>
        )}
      </div>
    </div>
  );
};

const FinancialKPIs: React.FC<Props> = ({ data }) => {
  const isPositiveMargin = data.grossMargin >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <KPICard 
        title="Orçamento Total" 
        value={formatCurrency(data.totalBudget)}
        subValue="Valor Contratado"
        icon={DollarSign}
        type="neutral"
      />
      <KPICard 
        title="Executado (Receita)" 
        value={formatCurrency(data.totalExecutedValue)}
        subValue={formatPercent((data.totalExecutedValue / data.totalBudget) * 100)}
        subLabel="do total"
        icon={PieChart}
        type="blue"
      />
      <KPICard 
        title="Custo Real" 
        value={formatCurrency(data.totalActualCost)}
        subValue="Despesas Lançadas"
        icon={TrendingDown}
        type="neutral"
      />
      <KPICard 
        title="Margem Bruta (Real)" 
        value={formatCurrency(data.grossMargin)}
        subValue={formatPercent(data.grossMarginPercent)}
        subLabel="margem"
        icon={TrendingUp}
        type={isPositiveMargin ? 'positive' : 'negative'}
      />
    </div>
  );
};

export default FinancialKPIs;