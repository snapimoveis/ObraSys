import React, { useState } from 'react';
import { FinancialChapterSnapshot, FinancialItemSnapshot } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/financialUtils';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  chapter: FinancialChapterSnapshot;
  level?: number;
}

const DeviationBadge = ({ value, status }: { value: number, status: string }) => {
  if (status === 'ON_TRACK') return <span className="text-slate-400 text-xs font-medium">-</span>;
  
  const isPositive = value > 0;
  const colorClass = isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  const Icon = isPositive ? CheckCircle2 : AlertCircle;

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full w-fit ml-auto ${colorClass}`}>
      <Icon size={12} />
      <span className="text-xs font-bold">{formatCurrency(value)}</span>
    </div>
  );
};

const FinancialChapterRow: React.FC<Props> = ({ chapter, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const paddingLeft = level * 20 + 12; // Indentation

  return (
    <>
      {/* Chapter Row */}
      <tr className={`hover:bg-slate-50 transition-colors border-b border-slate-100 ${level === 0 ? 'bg-slate-50/50' : ''}`}>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${paddingLeft}px` }}>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            <span className={`text-sm text-slate-800 ${level === 0 ? 'font-bold' : 'font-medium'}`}>
              {chapter.name}
            </span>
          </div>
        </td>
        <td className="py-3 px-4 text-right text-sm font-medium text-slate-600">
          {formatCurrency(chapter.budgetTotal)}
        </td>
        <td className="py-3 px-4 text-right text-sm text-slate-600">
           {chapter.budgetTotal > 0 ? formatPercent((chapter.executedValue / chapter.budgetTotal) * 100) : '0%'}
        </td>
        <td className="py-3 px-4 text-right text-sm font-bold text-[#00609C]">
          {formatCurrency(chapter.executedValue)}
        </td>
        <td className="py-3 px-4 text-right text-sm text-slate-700">
          {formatCurrency(chapter.actualCost)}
        </td>
        <td className="py-3 px-4 text-right">
          <DeviationBadge value={chapter.deviation} status={chapter.deviation < 0 ? 'OVER_BUDGET' : 'ON_TRACK'} />
        </td>
      </tr>

      {/* Children */}
      {expanded && (
        <>
          {chapter.subChapters.map(sub => (
            <FinancialChapterRow key={sub.id} chapter={sub} level={level + 1} />
          ))}
          {chapter.items.map(item => (
            <FinancialItemRow key={item.id} item={item} level={level + 1} />
          ))}
        </>
      )}
    </>
  );
};

interface FinancialItemRowProps {
  item: FinancialItemSnapshot;
  level: number;
}

const FinancialItemRow: React.FC<FinancialItemRowProps> = ({ item, level }) => {
  const paddingLeft = level * 20 + 36; // Indentation + icon space

  return (
    <tr className="hover:bg-blue-50/30 transition-colors border-b border-slate-50 group">
      <td className="py-2 px-4">
        <div className="flex items-center gap-2" style={{ paddingLeft: `${paddingLeft}px` }}>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
          <span className="text-sm text-slate-600 truncate max-w-[300px]" title={item.description}>
            {item.description}
          </span>
        </div>
      </td>
      <td className="py-2 px-4 text-right text-xs text-slate-500">
        {formatCurrency(item.budgetTotal)}
      </td>
      <td className="py-2 px-4 text-right">
         <div className="flex items-center justify-end gap-2">
            <div className="w-12 bg-slate-100 rounded-full h-1.5">
               <div className="bg-[#00609C] h-1.5 rounded-full" style={{ width: `${item.executedPercent}%` }}></div>
            </div>
            <span className="text-xs text-slate-500">{item.executedPercent.toFixed(0)}%</span>
         </div>
      </td>
      <td className="py-2 px-4 text-right text-xs font-medium text-slate-800">
        {formatCurrency(item.executedValue)}
      </td>
      <td className="py-2 px-4 text-right text-xs text-slate-600">
        {formatCurrency(item.actualCost)}
      </td>
      <td className="py-2 px-4 text-right">
        {item.deviation !== 0 && (
          <span className={`text-xs font-bold ${item.deviation > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {item.deviation > 0 ? '+' : ''}{formatCurrency(item.deviation)}
          </span>
        )}
      </td>
    </tr>
  );
};

export default FinancialChapterRow;