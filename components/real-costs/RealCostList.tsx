import React, { useState } from 'react';
import { RealCost } from '../../types';
import { formatCurrency } from '../../utils/financialUtils';
import { Trash2, Search, Filter } from 'lucide-react';

interface Props {
  costs: RealCost[];
  onDelete: (id: string) => void;
}

const RealCostList: React.FC<Props> = ({ costs, onDelete }) => {
  const [filter, setFilter] = useState('');

  const filteredCosts = costs.filter(c => 
    c.description.toLowerCase().includes(filter.toLowerCase()) || 
    c.supplier?.toLowerCase().includes(filter.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'MATERIAL': return <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">Material</span>;
      case 'LABOR': return <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs font-bold">Mão de Obra</span>;
      case 'SUBCONTRACT': return <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold">Subemp.</span>;
      case 'EQUIPMENT': return <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-700 text-xs font-bold">Equip.</span>;
      default: return <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold">Outro</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* List Actions */}
      <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
        <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 flex items-center shadow-sm">
           <Search size={16} className="text-slate-400 mr-2" />
           <input 
             type="text" 
             placeholder="Pesquisar despesa..."
             className="flex-1 bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400"
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
           />
        </div>
        <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
           <Filter size={16} />
           <span>Filtros</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">Fornecedor</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Doc. Ref</th>
              <th className="px-6 py-3 text-right">Valor</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredCosts.map((cost) => (
              <tr key={cost.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                  {new Date(cost.date).toLocaleDateString('pt-PT')}
                </td>
                <td className="px-6 py-3 font-medium text-slate-800">
                  {cost.description}
                </td>
                <td className="px-6 py-3 text-slate-500">
                  {cost.supplier || '-'}
                </td>
                <td className="px-6 py-3">
                  {getTypeLabel(cost.type)}
                </td>
                <td className="px-6 py-3 text-slate-500 text-xs font-mono">
                  {cost.documentRef || '-'}
                </td>
                <td className="px-6 py-3 text-right font-bold text-slate-700">
                  {formatCurrency(cost.amount)}
                </td>
                <td className="px-6 py-3 text-right">
                  <button 
                    onClick={() => onDelete(cost.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCosts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  Nenhuma despesa encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealCostList;