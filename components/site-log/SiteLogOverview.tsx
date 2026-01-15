import React from 'react';
import { Work } from '../../types';
import { useRDO } from '../../hooks/useRDO';
import SiteLogDayCard from './SiteLogDayCard';
import RDOForm from '../rdo/RDOForm';
import RDODetail from '../rdo/RDODetail';
import { Plus, Search, Calendar, FileText, Filter } from 'lucide-react';

interface Props {
  work: Work | null;
}

const SiteLogOverview: React.FC<Props> = ({ work }) => {
  const { rdos, currentRDO, createDraftRDO, updateDraftRDO, saveDraft, submitRDO, viewRDO, cancelEdit } = useRDO(work);

  // If editing/viewing, show Detail or Form
  if (currentRDO) {
    if (currentRDO.status === 'DRAFT') {
      return (
        <RDOForm 
          rdo={currentRDO} 
          work={work!} 
          onUpdate={updateDraftRDO} 
          onSave={saveDraft}
          onSubmit={submitRDO}
          onCancel={cancelEdit}
        />
      );
    } else {
      return (
        <div className="space-y-4">
          <button onClick={cancelEdit} className="text-slate-500 hover:text-[#00609C] flex items-center gap-2 text-sm font-medium">
             ← Voltar ao Livro de Obras
          </button>
          <RDODetail rdo={currentRDO} />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Livro de Obras Digital</h1>
          <p className="text-slate-500 text-sm mt-1">Registo diário oficial e controlo de ocorrências da obra.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Calendar size={16} />
              <span>Ver Calendário</span>
           </button>
           <button 
             onClick={createDraftRDO}
             className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
           >
              <Plus size={16} />
              <span>Novo RDO</span>
           </button>
        </div>
      </div>

      {/* Stats / Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-blue-800 uppercase">Total Registos</p>
             <p className="text-2xl font-bold text-blue-900">{rdos.length}</p>
           </div>
           <FileText size={24} className="text-blue-300" />
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-green-800 uppercase">Dias Conformes</p>
             <p className="text-2xl font-bold text-green-900">{rdos.filter(r => !r.occurrences.some(o => o.critical)).length}</p>
           </div>
           <FileText size={24} className="text-green-300" />
        </div>
        {/* Missing RDO Alert Logic (Mock) */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
           <div>
             <p className="text-xs font-bold text-slate-500 uppercase">RDO Hoje</p>
             <p className="text-sm font-bold text-orange-500">Pendente</p>
           </div>
           <button onClick={createDraftRDO} className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100 hover:bg-orange-100">Criar Agora</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Pesquisar por responsável, notas..." className="w-full pl-9 pr-4 py-2 text-sm outline-none text-slate-600" />
         </div>
         <div className="h-6 w-px bg-slate-200"></div>
         <button className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium">
            <Filter size={16} /> Filtros
         </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rdos.map(rdo => (
          <SiteLogDayCard key={rdo.id} rdo={rdo} onClick={() => viewRDO(rdo)} />
        ))}
        {rdos.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p>Ainda não existem registos no Livro de Obras.</p>
            <button onClick={createDraftRDO} className="mt-2 text-[#00609C] hover:underline text-sm font-bold">Criar o primeiro RDO</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteLogOverview;
