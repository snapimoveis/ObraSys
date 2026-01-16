import React, { useState, useEffect } from 'react';
import { Plus, UserPlus, FolderOpen, MoreVertical, Loader2 } from 'lucide-react';
import BudgetEditor from './budget/BudgetEditor'; 
import { Budget } from '../types';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, setDoc, doc, orderBy, QuerySnapshot } from 'firebase/firestore';

const Budgeting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ORCAMENTOS' | 'CLIENTES' | 'BASE_PRECOS'>('ORCAMENTOS');
  const [viewMode, setViewMode] = useState<'LIST' | 'EDITOR'>('LIST');
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  
  // Real Data State
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const companyId = getCurrentCompanyId();

  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, 'budgets'), 
      where('companyId', '==', companyId)
      // orderBy('date', 'desc') // Requires index in Firestore
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
      // Manual sort until index is ready
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setBudgets(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const handleOpenBudget = (budget?: Budget) => {
    setSelectedBudget(budget || null);
    setViewMode('EDITOR');
  };

  const handleSaveBudget = async (savedBudget: Budget) => {
    if (!companyId) return;

    try {
      // Ensure companyId is attached
      const budgetToSave = { ...savedBudget, companyId };
      
      // Use setDoc to create or overwrite based on ID
      await setDoc(doc(db, 'budgets', savedBudget.id), budgetToSave);
      setViewMode('LIST');
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Erro ao guardar orçamento.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'DRAFT': return <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 uppercase tracking-wide">Rascunho</span>;
        case 'APPROVED': return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-bold border border-green-200 uppercase tracking-wide">Aprovado</span>;
        case 'REVIEW': return <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-[10px] font-bold border border-orange-200 uppercase tracking-wide">Em Revisão</span>;
        default: return <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">{status}</span>;
    }
  };

  if (viewMode === 'EDITOR') {
      return (
          <BudgetEditor 
            budget={selectedBudget} 
            onSave={handleSaveBudget} 
            onBack={() => setViewMode('LIST')} 
          />
      );
  }

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Orçamentação</h1>
           <p className="text-slate-500 text-sm">Gestão profissional de custos e propostas</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => handleOpenBudget()}
            className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
           >
              <Plus size={16} />
              <span>Criar Orçamento</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-100 p-1 rounded-lg inline-flex w-full md:w-auto flex-shrink-0 border border-slate-200">
        <button 
          onClick={() => setActiveTab('ORCAMENTOS')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'ORCAMENTOS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Orçamentos
        </button>
        <button 
          onClick={() => setActiveTab('CLIENTES')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'CLIENTES' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Clientes
        </button>
        <button 
          onClick={() => setActiveTab('BASE_PRECOS')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'BASE_PRECOS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Base de Artigos
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'ORCAMENTOS' && (
        <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-[#00609C]" size={32} />
              </div>
            ) : budgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white rounded-lg border border-dashed border-slate-300">
                 <FolderOpen size={48} className="mb-4 opacity-50"/>
                 <p className="text-sm font-medium">Nenhum orçamento encontrado.</p>
                 <button onClick={() => handleOpenBudget()} className="mt-2 text-[#00609C] hover:underline font-bold text-sm">Criar o primeiro</button>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-white border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                        <tr>
                            <th className="px-6 py-3">Título / Projeto</th>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3 w-24 text-center">Versão</th>
                            <th className="px-6 py-3 w-32">Estado</th>
                            <th className="px-6 py-3 text-right">Total (€)</th>
                            <th className="px-6 py-3 w-32 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-5">
                        {budgets.map((budget) => (
                            <tr key={budget.id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-sm text-slate-700">{budget.title}</div>
                                    <div className="text-xs text-slate-400">{budget.projectLocation}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {budget.client}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">v{budget.version}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(budget.status)}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-800 text-sm">
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(budget.totalPrice)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                          onClick={() => handleOpenBudget(budget)}
                                          className="text-xs bg-[#00609C] text-white px-3 py-1.5 rounded hover:bg-[#005082] font-medium"
                                        >
                                            Abrir
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
              </div>
            )}
        </div>
      )}

      {activeTab === 'CLIENTES' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
               <UserPlus size={32} />
             </div>
             <h3 className="text-lg font-medium text-slate-800 mb-1">Nenhum cliente encontrado</h3>
             <p className="text-slate-500 text-sm mb-6">Comece criando seu primeiro cliente.</p>
             <button className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
                <UserPlus size={16} />
                <span>Criar Cliente</span>
             </button>
        </div>
      )}

      {activeTab === 'BASE_PRECOS' && (
         <div className="bg-white rounded-lg border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <p>Base de preços compartilhada.</p>
        </div>
      )}
    </div>
  );
};

export default Budgeting;