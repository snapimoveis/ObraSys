import React from 'react';
import { Measurement } from '../../types';
import { formatCurrency } from '../../utils/financialUtils';
import { getStatusBadgeColor } from '../../utils/measurementUtils';
import { FileText, Calendar, ArrowRight, Plus } from 'lucide-react';

interface Props {
  measurements: Measurement[];
  onCreate: () => void;
  onSelect: (m: Measurement) => void;
}

const MeasurementList: React.FC<Props> = ({ measurements, onCreate, onSelect }) => {
  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div>
          <h3 className="text-blue-900 font-bold">Autos de Medição</h3>
          <p className="text-blue-700 text-sm">Gira os pagamentos baseados na produção real.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Novo Auto
        </button>
      </div>

      {measurements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Nenhum auto de medição criado.</p>
          <p className="text-xs text-slate-400">Inicie o processo de faturação criando o primeiro auto.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Referência</th>
                <th className="px-6 py-4">Período</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Valor Total</th>
                <th className="px-6 py-4 text-right">Acumulado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelect(m)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded text-slate-500 group-hover:bg-[#00609C] group-hover:text-white transition-colors">
                        <FileText size={18} />
                      </div>
                      <span className="font-bold text-slate-800">{m.reference}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(m.periodStart).toLocaleDateString('pt-PT')} - {new Date(m.periodEnd).toLocaleDateString('pt-PT')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${getStatusBadgeColor(m.status)}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#00609C]">
                    {formatCurrency(m.totalCurrentValue)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-500">
                    {formatCurrency(m.totalAccumulatedValue)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-[#00609C]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MeasurementList;
