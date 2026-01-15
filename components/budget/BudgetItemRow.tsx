import React, { memo } from 'react';
import { BudgetItem, BudgetStatus } from '../../types';
import { formatCurrency } from '../../utils/budgetUtils';
import { Trash2, FileText, AlertCircle } from 'lucide-react';

interface BudgetItemRowProps {
  item: BudgetItem;
  status: BudgetStatus;
  onUpdate: (item: BudgetItem) => void;
  onDelete: (id: string) => void;
  onOpenDetail: (item: BudgetItem) => void;
}

const BudgetItemRow = memo(({ item, status, onUpdate, onDelete, onOpenDetail }: BudgetItemRowProps) => {
  const isEditable = status === 'DRAFT';

  const handleChange = (field: keyof BudgetItem, value: string | number) => {
    if (!isEditable) return;
    onUpdate({ ...item, [field]: value });
  };

  return (
    <div className="grid grid-cols-12 gap-2 py-2 px-4 border-b border-slate-100 hover:bg-blue-50/30 transition-colors items-center text-sm group">
      {/* Description & Type Indicator */}
      <div className="col-span-4 pl-4 flex items-center gap-2">
        <div 
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            item.type === 'MATERIAL' ? 'bg-blue-400' : 
            item.type === 'LABOR' ? 'bg-orange-400' : 
            item.type === 'EQUIPMENT' ? 'bg-purple-400' : 'bg-slate-400'
          }`}
          title={item.type}
        />
        <div className="flex-1 min-w-0">
          <input
            type="text"
            disabled={!isEditable}
            value={item.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-[#00609C] rounded px-1 truncate font-medium text-slate-700 disabled:text-slate-500"
            placeholder="Descrição do artigo"
          />
        </div>
        {item.notes && <FileText size={12} className="text-slate-400 flex-shrink-0" />}
      </div>

      {/* Unit */}
      <div className="col-span-1">
        <input 
          type="text"
          disabled={!isEditable}
          value={item.unit}
          onChange={(e) => handleChange('unit', e.target.value)}
          className="w-full text-center bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-[#00609C] rounded px-1 text-slate-500 disabled:text-slate-400"
        />
      </div>

      {/* Quantity */}
      <div className="col-span-1">
        <input 
          type="number"
          disabled={!isEditable}
          value={item.quantity}
          onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
          className="w-full text-center font-bold bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-[#00609C] rounded px-1 text-slate-700 disabled:text-slate-500"
        />
      </div>

      {/* Unit Cost */}
      <div className="col-span-2 text-right">
        <input 
          type="number"
          disabled={!isEditable}
          value={item.unitCost}
          onChange={(e) => handleChange('unitCost', parseFloat(e.target.value) || 0)}
          className="w-full text-right bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-[#00609C] rounded px-1 text-slate-600 disabled:text-slate-500"
        />
      </div>

      {/* Margin */}
      <div className="col-span-1 flex justify-center">
        <input 
          type="number"
          disabled={!isEditable}
          value={item.marginPercent}
          onChange={(e) => handleChange('marginPercent', parseFloat(e.target.value) || 0)}
          className={`w-12 text-center text-xs font-bold rounded border ${
            item.marginPercent < 15 ? 'text-red-600 bg-red-50 border-red-200' : 
            'text-green-600 bg-green-50 border-green-200'
          } outline-none focus:ring-2 disabled:opacity-70`}
        />
      </div>

      {/* Total Price & Actions */}
      <div className="col-span-3 flex justify-end items-center gap-3">
        <div className="text-right">
           <span className="font-bold text-slate-800">{formatCurrency(item.totalPrice)}</span>
           <div className="text-[10px] text-slate-400">Unit: {formatCurrency(item.unitPrice)}</div>
        </div>
        
        {isEditable && (
          <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
            <button 
              onClick={() => onOpenDetail(item)}
              className="p-1 hover:bg-slate-200 rounded text-slate-500"
              title="Detalhes"
            >
              <FileText size={14} />
            </button>
            <button 
              onClick={() => onDelete(item.id)}
              className="p-1 hover:bg-red-100 rounded text-red-500"
              title="Remover"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default BudgetItemRow;
