import React from 'react';
import { MeasurementItem } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/financialUtils';
import { AlertTriangle } from 'lucide-react';

interface Props {
  item: MeasurementItem;
  readOnly: boolean;
  onUpdate: (quantity: number) => void;
}

const MeasurementItemRow: React.FC<Props> = ({ item, readOnly, onUpdate }) => {
  const isOverBudget = item.totalQuantity > item.budgetQuantity;
  const remainingQty = item.budgetQuantity - item.previousQuantity;

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 group">
      {/* Description */}
      <td className="py-2 px-4 max-w-xs">
        <div className="flex items-center gap-2">
          {isOverBudget && <AlertTriangle size={14} className="text-red-500 flex-shrink-0" title="Excede o orçamentado" />}
          <span className="text-sm text-slate-700 truncate" title={item.description}>
            {item.description}
          </span>
        </div>
      </td>
      
      {/* Unit & Price */}
      <td className="py-2 px-4 text-center text-xs text-slate-500">{item.unit}</td>
      <td className="py-2 px-4 text-right text-xs text-slate-500">{formatCurrency(item.unitPrice)}</td>
      
      {/* Budget Info */}
      <td className="py-2 px-4 text-right bg-slate-50/50">
        <div className="text-xs font-medium text-slate-700">{item.budgetQuantity}</div>
        <div className="text-[10px] text-slate-400">{formatCurrency(item.budgetQuantity * item.unitPrice)}</div>
      </td>

      {/* Previous Accum */}
      <td className="py-2 px-4 text-right text-xs text-slate-500">
        {item.previousQuantity > 0 ? item.previousQuantity : '-'}
      </td>

      {/* CURRENT INPUT */}
      <td className="py-2 px-4 text-center bg-blue-50/30">
        <input 
          type="number" 
          disabled={readOnly}
          value={item.currentQuantity}
          onChange={(e) => onUpdate(parseFloat(e.target.value) || 0)}
          className={`w-20 text-right text-sm font-bold border rounded px-1 py-0.5 outline-none focus:ring-2 focus:ring-[#00609C] transition-all
            ${isOverBudget ? 'text-red-600 border-red-300 bg-red-50' : 'text-slate-800 border-slate-300 bg-white'}
            disabled:bg-transparent disabled:border-transparent disabled:text-slate-600
          `}
        />
      </td>

      {/* Current Value */}
      <td className="py-2 px-4 text-right font-medium text-[#00609C] text-sm">
        {item.currentValue > 0 ? formatCurrency(item.currentValue) : '-'}
      </td>

      {/* Total Accum */}
      <td className="py-2 px-4 text-right">
        <div className={`text-xs font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-700'}`}>
          {item.totalQuantity}
        </div>
        <div className="text-[10px] text-slate-400">{formatPercent(item.executionPercent)}</div>
      </td>
    </tr>
  );
};

export default MeasurementItemRow;
