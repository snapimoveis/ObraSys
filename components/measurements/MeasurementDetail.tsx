import React, { useState } from 'react';
import { Measurement, Budget, MeasurementStatus } from '../../types';
import { formatCurrency } from '../../utils/financialUtils';
import { getStatusBadgeColor } from '../../utils/measurementUtils';
import { ArrowLeft, Save, Send, CheckCircle, Printer, Calendar, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import MeasurementItemRow from './MeasurementItemRow';

interface Props {
  measurement: Measurement;
  budget: Budget;
  onUpdate: (m: Measurement) => void;
  onBack: () => void;
}

const MeasurementDetail: React.FC<Props> = ({ measurement, budget, onUpdate, onBack }) => {
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  
  const readOnly = measurement.status === 'APPROVED' || measurement.status === 'INVOICED';

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateItemQty = (budgetItemId: string, qty: number) => {
    if (readOnly) return;
    const newItem = { ...measurement.items[budgetItemId], currentQuantity: qty };
    onUpdate({
      ...measurement,
      items: { ...measurement.items, [budgetItemId]: newItem }
    });
  };

  const handleStatusChange = (newStatus: MeasurementStatus) => {
    onUpdate({ ...measurement, status: newStatus });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">{measurement.reference}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusBadgeColor(measurement.status)}`}>
                {measurement.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
              <Calendar size={12} /> 
              Período: 
              <input 
                type="date" 
                value={measurement.periodStart.split('T')[0]} 
                onChange={(e) => !readOnly && onUpdate({...measurement, periodStart: e.target.value})}
                disabled={readOnly}
                className="bg-transparent border-b border-slate-200 text-slate-600 px-1 text-xs focus:outline-none"
              />
              a
              <input 
                type="date" 
                value={measurement.periodEnd.split('T')[0]} 
                onChange={(e) => !readOnly && onUpdate({...measurement, periodEnd: e.target.value})}
                disabled={readOnly}
                className="bg-transparent border-b border-slate-200 text-slate-600 px-1 text-xs focus:outline-none"
              />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2 hidden md:block">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Valor a Faturar</p>
            <p className="text-2xl font-bold text-[#00609C]">{formatCurrency(measurement.totalCurrentValue)}</p>
          </div>

          {!readOnly && (
            <>
              {measurement.status === 'DRAFT' && (
                <button 
                  onClick={() => handleStatusChange('REVIEW')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
                >
                  <Send size={16} /> Enviar p/ Validação
                </button>
              )}
              {measurement.status === 'REVIEW' && (
                <button 
                  onClick={() => handleStatusChange('APPROVED')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
                >
                  <CheckCircle size={16} /> Aprovar Auto
                </button>
              )}
            </>
          )}
          
          <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* Content Table */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">Artigo / Descrição</th>
                <th className="px-4 py-3 text-center">Un</th>
                <th className="px-4 py-3 text-right">P. Unit</th>
                <th className="px-4 py-3 text-right">Orçamento</th>
                <th className="px-4 py-3 text-right">Anterior</th>
                <th className="px-4 py-3 text-center bg-blue-50 text-blue-700 border-b border-blue-100">Quantidade Atual</th>
                <th className="px-4 py-3 text-right text-blue-700 border-b border-blue-100">Valor Atual</th>
                <th className="px-4 py-3 text-right">Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {budget.chapters.map(chapter => (
                <React.Fragment key={chapter.id}>
                  {/* Chapter Header */}
                  <tr className="bg-slate-100/50 hover:bg-slate-100 cursor-pointer" onClick={() => toggleChapter(chapter.id)}>
                    <td colSpan={8} className="py-2 px-4 font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        {expandedChapters[chapter.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        {chapter.name}
                      </div>
                    </td>
                  </tr>

                  {expandedChapters[chapter.id] && (
                    <>
                      {/* SubChapters */}
                      {chapter.subChapters.map(sub => (
                        <React.Fragment key={sub.id}>
                          <tr className="bg-slate-50/50">
                            <td colSpan={8} className="py-2 px-8 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                              {sub.name}
                            </td>
                          </tr>
                          {sub.items.map(item => measurement.items[item.id] && (
                            <MeasurementItemRow 
                              key={item.id} 
                              item={measurement.items[item.id]} 
                              readOnly={readOnly}
                              onUpdate={(q) => updateItemQty(item.id, q)}
                            />
                          ))}
                        </React.Fragment>
                      ))}

                      {/* Direct Items */}
                      {chapter.items.map(item => measurement.items[item.id] && (
                        <MeasurementItemRow 
                          key={item.id} 
                          item={measurement.items[item.id]} 
                          readOnly={readOnly}
                          onUpdate={(q) => updateItemQty(item.id, q)}
                        />
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MeasurementDetail;
