import React, { useState, useEffect } from 'react';
import { 
  Plus, Filter, Download, HardHat, CheckCircle2, 
  AlertTriangle, TrendingUp, DollarSign, ArrowRight, BookOpen, Loader2
} from 'lucide-react';
import { Work, WorkStatus } from '../types';
import WorkDetail from './works/WorkDetail';
import SiteLogOverview from './site-log/SiteLogOverview';
import { getStatusColor } from '../utils/workUtils';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, QuerySnapshot } from 'firebase/firestore';

const SiteManagement: React.FC = () => {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SITE_LOG'>('DASHBOARD');
  
  // Firestore State
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const companyId = getCurrentCompanyId();

  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, 'works'), 
      where('companyId', '==', companyId)
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Work));
      setWorks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const handleUpdateWork = async (updated: Work) => {
     try {
       await updateDoc(doc(db, 'works', updated.id), updated as any);
       if (selectedWork?.id === updated.id) {
          setSelectedWork(updated);
       }
     } catch (e) {
       console.error("Error updating work:", e);
       alert("Erro ao atualizar obra.");
     }
  };

  // If viewing a specific work's details
  if (selectedWork && activeTab === 'DASHBOARD') {
     return (
        <WorkDetail 
           work={selectedWork} 
           onUpdateWork={handleUpdateWork} 
           onBack={() => setSelectedWork(null)} 
        />
     );
  }

  // If viewing Site Log for a work
  if (selectedWork && activeTab === 'SITE_LOG') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setActiveTab('DASHBOARD')}
          className="text-sm text-slate-500 hover:text-[#00609C] flex items-center gap-1 font-medium"
        >
          ← Voltar à Lista de Obras
        </button>
        <SiteLogOverview work={selectedWork} />
      </div>
    );
  }

  // Dashboard View (List of Works)
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00609C]">Gestão de Obras</h1>
          <p className="text-slate-500 text-sm mt-1">Acompanhamento de execução e cronogramas</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => alert("Para criar uma obra, aprove um orçamento na secção 'Orçamentos'.")}
             className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
           >
              <Plus size={16} />
              <span>Gerar de Orçamento</span>
           </button>
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Download size={16} />
              <span>Relatório Global</span>
           </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Obras Ativas</p>
              <h3 className="text-2xl font-bold text-slate-800">{works.filter(w => w.status === 'EXECUTION').length}</h3>
           </div>
           <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><HardHat size={20}/></div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Concluídas</p>
              <h3 className="text-2xl font-bold text-slate-800">{works.filter(w => w.status === 'COMPLETED').length}</h3>
           </div>
           <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={20}/></div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Em Atraso</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {works.filter(w => w.schedule.some(p => p.tasks.some(t => t.status === 'DELAYED'))).length}
              </h3>
           </div>
           <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={20}/></div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Volume em Execução</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                  works.reduce((acc, w) => acc + (w.status === 'EXECUTION' ? w.totalBudget : 0), 0)
                )}
              </h3>
           </div>
           <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><DollarSign size={20}/></div>
        </div>
      </div>

      {/* Works List */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Lista de Obras</h2>
          <button className="text-sm text-[#00609C] font-medium hover:underline">Ver todas</button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-[#00609C]" size={32} />
          </div>
        ) : works.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
             <HardHat size={48} className="mb-4 opacity-50"/>
             <p className="text-sm font-medium">Nenhuma obra registada.</p>
             <p className="text-xs">Aprove um orçamento para criar automaticamente uma obra.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Obra</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 w-48">Execução Física</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {works.map((work) => (
                <tr key={work.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedWork(work)}>
                    <p className="text-sm font-bold text-slate-800">{work.title}</p>
                    <p className="text-xs text-slate-500">{work.client}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                     {work.location}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${getStatusColor(work.status)}`}>
                        {work.status === 'PLANNING' ? 'Planeamento' : work.status === 'EXECUTION' ? 'Em Execução' : work.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${work.physicalProgress >= 100 ? 'bg-green-500' : 'bg-[#00609C]'}`} 
                          style={{ width: `${work.physicalProgress}%` }}
                        ></div>
                     </div>
                     <p className="text-xs text-slate-500 text-right">{work.physicalProgress.toFixed(0)}%</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => { setSelectedWork(work); setActiveTab('SITE_LOG'); }}
                         className="p-2 bg-slate-100 hover:bg-[#00609C] hover:text-white rounded-lg text-slate-500 transition-colors"
                         title="Livro de Obras"
                       >
                          <BookOpen size={18} />
                       </button>
                       <button 
                         onClick={() => setSelectedWork(work)}
                         className="p-2 bg-slate-100 hover:bg-[#00609C] hover:text-white rounded-lg text-slate-500 transition-colors"
                         title="Detalhes"
                       >
                          <ArrowRight size={18} />
                       </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default SiteManagement;