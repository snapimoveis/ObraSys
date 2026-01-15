import React from 'react';
import { CostType } from '../../types';
import { formatCurrency } from '../../utils/financialUtils';
import { PieChart, Hammer, Truck, HardHat, Package, FileText } from 'lucide-react';

interface Props {
  stats: {
    total: number;
    byType: Record<CostType, number>;
  };
}

const CategoryBar = ({ label, value, total, color, icon: Icon }: any) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-4 py-2">
      <div className={`p-2 rounded-lg bg-slate-50 text-slate-500`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-bold text-slate-900">{formatCurrency(value)}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
      <div className="w-12 text-right text-xs text-slate-500 font-medium">
        {percentage.toFixed(0)}%
      </div>
    </div>
  );
};

const RealCostSummary: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      
      {/* Total Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <PieChart size={20} />
            <h3 className="text-sm font-medium uppercase tracking-wide">Total Custos Reais</h3>
          </div>
          <p className="text-4xl font-bold text-slate-800">{formatCurrency(stats.total)}</p>
          <p className="text-xs text-slate-400 mt-2">Valor acumulado registado até à data.</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-slate-600">Dentro da margem esperada (Simulação)</span>
           </div>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Distribuição por Tipo</h3>
        <div className="space-y-1">
          <CategoryBar 
            label="Materiais" 
            value={stats.byType['MATERIAL'] || 0} 
            total={stats.total} 
            color="bg-blue-500" 
            icon={Package}
          />
          <CategoryBar 
            label="Mão de Obra" 
            value={stats.byType['LABOR'] || 0} 
            total={stats.total} 
            color="bg-orange-500" 
            icon={HardHat}
          />
          <CategoryBar 
            label="Subempreitadas" 
            value={stats.byType['SUBCONTRACT'] || 0} 
            total={stats.total} 
            color="bg-purple-500" 
            icon={FileText}
          />
          <CategoryBar 
            label="Equipamentos" 
            value={stats.byType['EQUIPMENT'] || 0} 
            total={stats.total} 
            color="bg-cyan-500" 
            icon={Truck}
          />
          <CategoryBar 
            label="Outros" 
            value={stats.byType['OTHER'] || 0} 
            total={stats.total} 
            color="bg-slate-500" 
            icon={Hammer}
          />
        </div>
      </div>
    </div>
  );
};

export default RealCostSummary;