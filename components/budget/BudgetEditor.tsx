import React, { useState, useEffect, useCallback } from 'react';
import { Budget, BudgetChapter, BudgetItem, BudgetSubChapter, BudgetStatus, BudgetItemType } from '../../types';
import { calculateBudgetRollups, addItemToBudget, removeItemFromBudget, updateItemInBudget } from '../../utils/budgetUtils';
import BudgetChapterComponent from './BudgetChapter';
import BudgetSummaryPanel from './BudgetSummaryPanel';
import { ArrowLeft, Save, Printer, Plus, ChevronDown, FileText, X } from 'lucide-react';

interface BudgetEditorProps {
  budget: Budget | null;
  onSave: (budget: Budget) => void;
  onBack: () => void;
}

// --- ITEM MODAL ---
const ArticleModal = ({ isOpen, onClose, onSave, initialData }: any) => {
  const [formData, setFormData] = useState<Partial<BudgetItem>>({
     description: '', type: 'MATERIAL', unit: 'un', quantity: 1, unitCost: 0, marginPercent: 25, ...initialData
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-slate-800">{initialData ? 'Editar' : 'Novo'} Artigo</h3>
             <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
          </div>
          <div className="space-y-3">
             <input 
               className="w-full border rounded p-2 text-sm" 
               placeholder="Descrição"
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
             />
             <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  className="border rounded p-2 text-sm" 
                  placeholder="Quantidade" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                />
                 <input 
                  type="number" 
                  className="border rounded p-2 text-sm" 
                  placeholder="Custo Unit." 
                  value={formData.unitCost}
                  onChange={e => setFormData({...formData, unitCost: parseFloat(e.target.value)})}
                />
             </div>
             <button 
                onClick={() => {
                   onSave(formData);
                   onClose();
                }}
                className="w-full bg-[#00609C] text-white py-2 rounded font-bold mt-4"
             >
                Guardar
             </button>
          </div>
       </div>
    </div>
  );
};

const BudgetEditor: React.FC<BudgetEditorProps> = ({ budget: initialBudget, onSave, onBack }) => {
  // --- STATE ---
  const [budget, setBudget] = useState<Budget>(initialBudget || {
    id: Date.now().toString(),
    reference: `ORC-${new Date().getFullYear()}-001`,
    title: 'Novo Orçamento',
    client: 'Cliente Exemplo',
    projectLocation: 'Lisboa',
    version: 1,
    status: 'DRAFT',
    date: new Date().toISOString(),
    chapters: [],
    totalCost: 0,
    totalPrice: 0,
    totalMargin: 0,
    marginPercent: 0,
    totalTax: 0
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<{chap: string, sub?: string} | null>(null);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // --- ACTIONS ---

  const handleUpdateChapter = useCallback((id: string, name: string) => {
    setBudget(prev => ({
      ...prev,
      chapters: prev.chapters.map(c => c.id === id ? { ...c, name } : c)
    }));
  }, []);

  const handleAddChapter = () => {
    const newChapter: BudgetChapter = {
      id: Date.now().toString(),
      name: 'Novo Capítulo',
      items: [],
      subChapters: [],
      totalCost: 0,
      totalPrice: 0
    };
    setBudget(prev => ({ ...prev, chapters: [...prev.chapters, newChapter] }));
  };

  const handleAddSubChapter = (chapterId: string) => {
    const newSub: BudgetSubChapter = {
       id: Date.now().toString(),
       name: 'Novo Subcapítulo',
       items: [],
       totalCost: 0,
       totalPrice: 0
    };
    setBudget(prev => ({
       ...prev,
       chapters: prev.chapters.map(c => c.id === chapterId ? {...c, subChapters: [...c.subChapters, newSub]} : c)
    }));
  };

  const handleOpenAddModal = (chap: string, sub?: string) => {
     setActiveLocation({ chap, sub });
     setEditingItem(null);
     setModalOpen(true);
  };

  const handleOpenEditModal = (item: BudgetItem) => {
     setEditingItem(item);
     setModalOpen(true);
  };

  const handleSaveModalItem = (itemData: Partial<BudgetItem>) => {
     if (editingItem) {
        // Update
        const updated = { ...editingItem, ...itemData } as BudgetItem;
        setBudget(prev => updateItemInBudget(prev, updated));
     } else if (activeLocation) {
        // Create
        const newItem: BudgetItem = {
           id: Date.now().toString(),
           code: '00.00',
           description: itemData.description || 'Novo Item',
           type: itemData.type || 'MATERIAL',
           unit: itemData.unit || 'un',
           quantity: itemData.quantity || 1,
           unitCost: itemData.unitCost || 0,
           marginPercent: itemData.marginPercent || 25,
           totalCost: 0,
           totalPrice: 0,
           unitPrice: 0,
           ...itemData
        } as BudgetItem;
        setBudget(prev => addItemToBudget(prev, newItem, activeLocation.chap, activeLocation.sub));
     }
  };

  const handleDirectUpdateItem = useCallback((item: BudgetItem) => {
     setBudget(prev => updateItemInBudget(prev, item));
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
     if(confirm('Tem a certeza?')) {
        setBudget(prev => removeItemFromBudget(prev, id));
     }
  }, []);

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden animate-fade-in gap-4 relative">
      
      {/* LEFT CONTENT */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 p-4 bg-white flex justify-between items-center sticky top-0 z-20 shadow-sm">
           <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ArrowLeft size={20} /></button>
              <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      {budget.title} 
                      <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">v{budget.version}.0</span>
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{budget.projectLocation || 'Projeto Geral'}</span>
                  </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className={`px-3 py-0.5 rounded-full border text-xs font-bold bg-slate-100 text-slate-600 flex items-center gap-1`}>
                 {budget.status}
              </div>
              <button 
                onClick={() => onSave(budget)}
                className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
              >
                  <Save size={16} /> <span>Guardar</span>
              </button>
           </div>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
           {/* Table Header Row */}
           <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-bold text-slate-400 uppercase border-b border-slate-200 mb-2">
               <div className="col-span-4 pl-4">Descrição</div>
               <div className="col-span-1 text-center">Un</div>
               <div className="col-span-1 text-center">Qtd</div>
               <div className="col-span-2 text-right">Custo Unit</div>
               <div className="col-span-1 text-center">Margem</div>
               <div className="col-span-3 text-right">Preço Total</div>
           </div>

           {budget.chapters.map(chapter => (
              <BudgetChapterComponent
                key={chapter.id}
                chapter={chapter}
                status={budget.status}
                onUpdateChapter={handleUpdateChapter}
                onAddSubChapter={handleAddSubChapter}
                onAddItem={handleOpenAddModal}
                onUpdateItem={handleDirectUpdateItem}
                onDeleteItem={handleDeleteItem}
                onOpenItemDetail={handleOpenEditModal}
              />
           ))}

           <button 
              onClick={handleAddChapter}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#00609C] hover:text-[#00609C] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
           >
               <Plus size={20} /> Adicionar Novo Capítulo
           </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <BudgetSummaryPanel budget={budget} onSave={() => onSave(budget)} />

      {/* MODAL */}
      <ArticleModal 
         isOpen={modalOpen}
         onClose={() => setModalOpen(false)}
         onSave={handleSaveModalItem}
         initialData={editingItem}
      />
    </div>
  );
};

export default BudgetEditor;
