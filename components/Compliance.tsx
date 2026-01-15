import React, { useState } from 'react';
import { View } from '../types';
import { useCompliance } from '../hooks/useCompliance';
import ComplianceOverview from './compliance/ComplianceOverview';
import ComplianceItemRow from './compliance/ComplianceItemRow';
import { Filter, Search, Loader2, Download, AlertOctagon } from 'lucide-react';

interface ComplianceProps {
  setCurrentView: (view: View) => void;
}

// Mock Work ID for demo context
const WORK_ID = 'WORK-123';

const Compliance: React.FC<ComplianceProps> = ({ setCurrentView }) => {
  const { items, loading, stats, updateStatus, addEvidence } = useCompliance(WORK_ID);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.requirement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type === filterType || (filterType === 'CRITICAL' && item.critical);
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
        <Loader2 size={32} className="animate-spin mb-4 text-[#00609C]" />
        <p className="font-medium">A carregar requisitos de conformidade...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Conformidade e Auditoria</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão centralizada de requisitos legais, técnicos e contratuais.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Download size={16} />
              <span>Relatório de Auditoria</span>
           </button>
        </div>
      </div>

      {/* Overview Cards */}
      <ComplianceOverview stats={stats} />

      {/* Main Checklist Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[500px] flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 rounded-t-xl">
          <div className="flex-1 w-full relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar requisito..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-[#00609C]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            <button 
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilterType('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${filterType === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-white border border-slate-200 text-red-600 hover:bg-red-50'}`}
            >
              <AlertOctagon size={12} /> Críticos
            </button>
            <button 
              onClick={() => setFilterType('LEGAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${filterType === 'LEGAL' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-purple-50'}`}
            >
              Legais
            </button>
            <button 
              onClick={() => setFilterType('FINANCIAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${filterType === 'FINANCIAL' ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-green-50'}`}
            >
              Financeiros
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-6 bg-slate-50 flex-1">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Filter size={32} className="mb-2 opacity-50" />
              <p>Nenhum requisito encontrado para os filtros atuais.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map(item => (
                <ComplianceItemRow 
                  key={item.id} 
                  item={item} 
                  onUpdateStatus={updateStatus}
                  onAddEvidence={addEvidence}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-200 text-xs text-slate-400 text-center bg-white rounded-b-xl">
          Mostrando {filteredItems.length} de {items.length} requisitos. Todas as alterações são auditadas.
        </div>
      </div>
    </div>
  );
};

export default Compliance;
