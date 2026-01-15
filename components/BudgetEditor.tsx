import React, { useState, useEffect, useMemo } from 'react';
import { Budget, BudgetChapter, BudgetItem, BudgetStatus, BudgetItemType } from '../types';
import { 
  ArrowLeft, Save, Printer, History, Plus, Trash2, 
  ChevronDown, ChevronRight, AlertTriangle, Calculator,
  MoreVertical, FileText, X, Check, Copy, FolderPlus, Layers
} from 'lucide-react';

interface BudgetEditorProps {
  budget: Budget | null;
  onSave: (budget: Budget) => void;
  onBack: () => void;
}

// Helper: Format Currency
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);
};

// Helper: Status Colors
const getStatusColor = (status: BudgetStatus) => {
  switch (status) {
    case 'DRAFT': return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'REVIEW': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
    case 'EXECUTION': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'CLOSED': return 'bg-slate-800 text-white border-slate-900';
    default: return 'bg-slate-100';
  }
};

// Helper: Risk Calculation
const getRiskLevel = (marginPercent: number) => {
  if (marginPercent < 15) return { label: 'Alto', color: 'text-red-600', bg: 'bg-red-50' };
  if (marginPercent < 25) return { label: 'Médio', color: 'text-orange-600', bg: 'bg-orange-50' };
  return { label: 'Baixo', color: 'text-green-600', bg: 'bg-green-50' };
};

// --- COMPONENTS ---

// 1. Article Modal (Insert/Edit)
interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: BudgetItem) => void;
  initialData?: BudgetItem;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<BudgetItem>>({
    description: '',
    type: 'MATERIAL',
    unit: 'un',
    quantity: 1,
    unitCost: 0,
    marginPercent: 25,
    supplier: '',
    notes: '',
    ...initialData
  });

  const handleSubmit = () => {
    const unitPrice = (formData.unitCost || 0) * (1 + ((formData.marginPercent || 0) / 100));
    const newItem: BudgetItem = {
      id: initialData?.id || Date.now().toString(),
      code: initialData?.code || '00.00',
      description: formData.description || '',
      type: formData.type as BudgetItemType,
      unit: formData.unit || 'un',
      quantity: formData.quantity || 0,
      unitCost: formData.unitCost || 0,
      marginPercent: formData.marginPercent || 0,
      supplier: formData.supplier,
      notes: formData.notes,
      // Calculated
      totalCost: (formData.quantity || 0) * (formData.unitCost || 0),
      unitPrice: unitPrice,
      totalPrice: (formData.quantity || 0) * unitPrice
    };
    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{initialData ? 'Editar Artigo' : 'Inserir Artigo'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição do Artigo</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#00609C]"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-white"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as BudgetItemType})}
                >
                  <option value="MATERIAL">Material</option>
                  <option value="LABOR">Mão de Obra</option>
                  <option value="EQUIPMENT">Equipamento</option>
                  <option value="SUBCONTRACT">Subempreitada</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unidade</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-white"
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="un">un (Unidade)</option>
                  <option value="m2">m² (Metro Quadrado)</option>
                  <option value="m3">m³ (Metro Cúbico)</option>
                  <option value="ml">ml (Metro Linear)</option>
                  <option value="h">h (Horas)</option>
                  <option value="vg">vg (Verba Global)</option>
                  <option value="kg">kg (Quilograma)</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantidade</label>
                <input 
                  type="number" 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm text-center font-bold"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Custo Unit (€)</label>
                <input 
                  type="number" 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm text-center"
                  value={formData.unitCost}
                  onChange={e => setFormData({...formData, unitCost: parseFloat(e.target.value) || 0})}
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Margem (%)</label>
                <input 
                  type="number" 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm text-center text-orange-600 font-medium"
                  value={formData.marginPercent}
                  onChange={e => setFormData({...formData, marginPercent: parseFloat(e.target.value) || 0})}
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fornecedor (Opcional)</label>
               <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none"
                  value={formData.supplier || ''}
                  onChange={e => setFormData({...formData, supplier: e.target.value})}
                  placeholder="Ex: Leroy Merlin"
                />
            </div>
             <div className="flex flex-col justify-end pb-2">
                 <div className="text-right">
                    <span className="text-xs text-slate-500 uppercase mr-2">Preço de Venda Total:</span>
                    <span className="text-xl font-bold text-[#00609C]">
                       {formatCurrency(
                          (formData.quantity || 0) * 
                          ((formData.unitCost || 0) * (1 + ((formData.marginPercent || 0) / 100)))
                       )}
                    </span>
                 </div>
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observações Técnicas</label>
             <textarea 
               className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none h-20 resize-none"
               value={formData.notes || ''}
               onChange={e => setFormData({...formData, notes: e.target.value})}
               placeholder="Especificações técnicas, marcas recomendadas..."
             />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white transition-colors">Cancelar</button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-[#00609C] text-white rounded-lg font-bold hover:bg-[#005082] transition-colors shadow-sm">
             {initialData ? 'Atualizar Artigo' : 'Inserir no Orçamento'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Main Editor Component
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

  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeSubChapterId, setActiveSubChapterId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // --- CALCULATIONS ---
  // Recursively calculate totals
  useEffect(() => {
    const calculateHierarchy = () => {
        let bCost = 0;
        let bPrice = 0;

        const updatedChapters = budget.chapters.map(chapter => {
            let cCost = 0;
            let cPrice = 0;

            // Process Subchapters
            const updatedSubChapters = (chapter.subChapters || []).map(sub => {
                let sCost = 0;
                let sPrice = 0;
                const updatedSubItems = sub.items.map(item => {
                    const unitPrice = item.unitCost * (1 + (item.marginPercent / 100));
                    const totalCost = item.quantity * item.unitCost;
                    const totalPrice = item.quantity * unitPrice;
                    sCost += totalCost;
                    sPrice += totalPrice;
                    return { ...item, unitPrice, totalCost, totalPrice };
                });
                cCost += sCost;
                cPrice += sPrice;
                return { ...sub, items: updatedSubItems, totalCost: sCost, totalPrice: sPrice };
            });

            // Process Direct Items in Chapter
            const updatedItems = chapter.items.map(item => {
                const unitPrice = item.unitCost * (1 + (item.marginPercent / 100));
                const totalCost = item.quantity * item.unitCost;
                const totalPrice = item.quantity * unitPrice;
                cCost += totalCost;
                cPrice += totalPrice;
                return { ...item, unitPrice, totalCost, totalPrice };
            });

            bCost += cCost;
            bPrice += cPrice;

            return { 
                ...chapter, 
                items: updatedItems, 
                subChapters: updatedSubChapters,
                totalCost: cCost, 
                totalPrice: cPrice 
            };
        });

        // Only update state if values changed to avoid loop
        if (Math.abs(bCost - budget.totalCost) > 0.01 || Math.abs(bPrice - budget.totalPrice) > 0.01) {
             setBudget(prev => ({
                ...prev,
                chapters: updatedChapters,
                totalCost: bCost,
                totalPrice: bPrice,
                totalMargin: bPrice - bCost,
                marginPercent: bPrice > 0 ? ((bPrice - bCost) / bPrice) * 100 : 0,
                totalTax: bPrice * 0.23
            }));
        }
    };
    calculateHierarchy();
  }, [budget.chapters]);

  // --- HANDLERS ---

  const toggleExpand = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addChapter = () => {
    const newChapter: BudgetChapter = {
      id: Date.now().toString(),
      name: 'Novo Capítulo',
      items: [],
      subChapters: [],
      totalCost: 0,
      totalPrice: 0
    };
    setBudget(prev => ({ ...prev, chapters: [...prev.chapters, newChapter] }));
    setExpandedChapters(prev => ({ ...prev, [newChapter.id]: true }));
  };

  const addSubChapter = (chapterId: string) => {
      const newSub: BudgetChapter = {
          id: Date.now().toString(),
          name: 'Novo Subcapítulo',
          items: [],
          subChapters: [],
          totalCost: 0,
          totalPrice: 0
      };
      setBudget(prev => ({
          ...prev,
          chapters: prev.chapters.map(c => 
              c.id === chapterId ? { ...c, subChapters: [...(c.subChapters || []), newSub] } : c
          )
      }));
      setExpandedChapters(prev => ({ ...prev, [newSub.id]: true }));
  };

  const openAddItemModal = (chapterId: string, subChapterId?: string) => {
      setActiveChapterId(chapterId);
      setActiveSubChapterId(subChapterId || null);
      setEditingItem(null);
      setModalOpen(true);
  };

  const handleSaveItem = (item: BudgetItem) => {
      // Logic to find where to insert/update the item
      setBudget(prev => {
          const newChapters = prev.chapters.map(c => {
              // 1. If we are editing/adding to a subchapter
              if (activeSubChapterId) {
                 if (c.subChapters?.some(s => s.id === activeSubChapterId)) {
                     return {
                         ...c,
                         subChapters: c.subChapters.map(s => {
                             if (s.id === activeSubChapterId) {
                                 const itemExists = s.items.find(i => i.id === item.id);
                                 if (itemExists) {
                                     return { ...s, items: s.items.map(i => i.id === item.id ? item : i) };
                                 }
                                 return { ...s, items: [...s.items, item] };
                             }
                             return s;
                         })
                     };
                 }
                 return c;
              }
              // 2. If we are editing/adding to a chapter directly
              if (c.id === activeChapterId) {
                  const itemExists = c.items.find(i => i.id === item.id);
                  if (itemExists) {
                      return { ...c, items: c.items.map(i => i.id === item.id ? item : i) };
                  }
                  return { ...c, items: [...c.items, item] };
              }
              return c;
          });
          return { ...prev, chapters: newChapters };
      });
  };

  const deleteItem = (chapterId: string, itemId: string, subChapterId?: string) => {
      setBudget(prev => {
          const newChapters = prev.chapters.map(c => {
              if (subChapterId) {
                  return {
                      ...c,
                      subChapters: c.subChapters.map(s => 
                          s.id === subChapterId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
                      )
                  };
              }
              if (c.id === chapterId) {
                  return { ...c, items: c.items.filter(i => i.id !== itemId) };
              }
              return c;
          });
          return { ...prev, chapters: newChapters };
      });
  };

  const risk = getRiskLevel(budget.marginPercent);

  // --- RENDER HELPERS ---

  const renderItems = (items: BudgetItem[], chapterId: string, subChapterId?: string) => (
      items.map(item => (
          <div key={item.id} className="grid grid-cols-12 gap-2 py-2 px-4 border-b border-slate-100 hover:bg-blue-50/30 transition-colors items-center text-sm group">
              <div className="col-span-5 pl-4 flex items-center gap-2">
                   <span className={`w-1.5 h-1.5 rounded-full ${item.type === 'MATERIAL' ? 'bg-blue-400' : item.type === 'LABOR' ? 'bg-orange-400' : 'bg-purple-400'}`}></span>
                   <span className="truncate font-medium text-slate-700" title={item.description}>{item.description}</span>
                   {item.notes && <FileText size={12} className="text-slate-400" />}
              </div>
              <div className="col-span-1 text-center text-slate-500">{item.unit}</div>
              <div className="col-span-1 text-center font-bold text-slate-700">{item.quantity}</div>
              <div className="col-span-2 text-right text-slate-600">{formatCurrency(item.unitCost)}</div>
              <div className="col-span-1 text-center text-xs">
                  <span className={`px-1.5 py-0.5 rounded ${item.marginPercent < 20 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {item.marginPercent}%
                  </span>
              </div>
              <div className="col-span-2 text-right font-bold text-slate-800 flex justify-end items-center gap-3">
                  {formatCurrency(item.totalPrice)}
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <button 
                        onClick={() => {
                            setActiveChapterId(chapterId);
                            setActiveSubChapterId(subChapterId || null);
                            setEditingItem(item);
                            setModalOpen(true);
                        }}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500"
                      >
                          <FileText size={14} />
                      </button>
                      <button 
                        onClick={() => deleteItem(chapterId, item.id, subChapterId)}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                          <Trash2 size={14} />
                      </button>
                  </div>
              </div>
          </div>
      ))
  );

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden animate-fade-in gap-4 relative">
      
      {/* LEFT: Main Content (Scrollable) */}
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
                      <span>Projeto: <strong>{budget.projectLocation || 'Geral'}</strong></span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>Cliente: <strong>{budget.client}</strong></span>
                  </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-2">
                 <span className="text-[10px] uppercase font-bold text-slate-400">Estado</span>
                 <div className={`px-3 py-0.5 rounded-full border text-xs font-bold ${getStatusColor(budget.status)} flex items-center gap-1`}>
                    {budget.status === 'DRAFT' ? 'RASCUNHO' : budget.status} <ChevronDown size={12} />
                 </div>
              </div>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Exportar PDF"><Printer size={18} /></button>
              <button 
                onClick={() => onSave(budget)}
                className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
              >
                  <Save size={16} /> <span>Guardar</span>
              </button>
           </div>
        </div>

        {/* Budget Tree (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
           
           {/* Structure Header */}
           <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-bold text-slate-400 uppercase border-b border-slate-200 mb-2">
               <div className="col-span-5">Descrição</div>
               <div className="col-span-1 text-center">Un</div>
               <div className="col-span-1 text-center">Qt</div>
               <div className="col-span-2 text-right">Unitário</div>
               <div className="col-span-1 text-center">Margem</div>
               <div className="col-span-2 text-right">Total</div>
           </div>

           <div className="space-y-4">
               {budget.chapters.map((chapter) => (
                   <div key={chapter.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                       {/* Chapter Header */}
                       <div className="bg-slate-100 p-3 flex justify-between items-center border-b border-slate-200 group">
                           <div className="flex items-center gap-2 flex-1">
                               <button onClick={() => toggleExpand(chapter.id)} className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors">
                                   {expandedChapters[chapter.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                               </button>
                               <input 
                                  className="font-bold text-slate-800 bg-transparent outline-none focus:bg-white px-1 rounded w-full"
                                  value={chapter.name}
                                  onChange={(e) => {
                                      const val = e.target.value;
                                      setBudget(prev => ({
                                          ...prev,
                                          chapters: prev.chapters.map(c => c.id === chapter.id ? { ...c, name: val } : c)
                                      }));
                                  }}
                               />
                           </div>
                           <div className="flex items-center gap-4">
                               <span className="font-bold text-slate-800">{formatCurrency(chapter.totalPrice)}</span>
                               <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                  <button onClick={() => addSubChapter(chapter.id)} className="p-1.5 bg-white border border-slate-200 rounded hover:text-[#00609C]" title="Adicionar Subcapítulo"><FolderPlus size={14}/></button>
                                  <button className="p-1.5 bg-white border border-slate-200 rounded hover:text-red-500"><Trash2 size={14}/></button>
                               </div>
                           </div>
                       </div>

                       {/* Chapter Body */}
                       {expandedChapters[chapter.id] && (
                           <div>
                               {/* SubChapters */}
                               {(chapter.subChapters || []).map(sub => (
                                   <div key={sub.id} className="border-b border-slate-100 bg-slate-50/30">
                                       <div className="flex justify-between items-center py-2 px-3 pl-10 group hover:bg-slate-100 transition-colors">
                                           <div className="flex items-center gap-2 flex-1">
                                               <Layers size={14} className="text-slate-400" />
                                               <input 
                                                  className="font-semibold text-slate-700 text-sm bg-transparent outline-none focus:bg-white px-1 rounded w-full"
                                                  value={sub.name}
                                                  onChange={(e) => {
                                                       /* Implement rename sub logic */
                                                  }}
                                               />
                                           </div>
                                           <div className="flex items-center gap-4 pr-2">
                                                <span className="font-semibold text-slate-700 text-sm">{formatCurrency(sub.totalPrice)}</span>
                                                <button 
                                                  onClick={() => openAddItemModal(chapter.id, sub.id)}
                                                  className="text-xs flex items-center gap-1 text-[#00609C] hover:underline font-medium opacity-0 group-hover:opacity-100"
                                                >
                                                    <Plus size={12} /> Artigo
                                                </button>
                                           </div>
                                       </div>
                                       {/* SubItems */}
                                       <div>
                                           {renderItems(sub.items, chapter.id, sub.id)}
                                       </div>
                                   </div>
                               ))}

                               {/* Direct Items */}
                               {renderItems(chapter.items, chapter.id)}

                               {/* Add Item to Chapter Action */}
                               <div className="p-2 pl-10 bg-white hover:bg-slate-50 cursor-pointer transition-colors border-t border-slate-100" onClick={() => openAddItemModal(chapter.id)}>
                                   <div className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-[#00609C]">
                                       <Plus size={14} /> Adicionar Artigo ao Capítulo
                                   </div>
                               </div>
                           </div>
                       )}
                   </div>
               ))}

               <button 
                  onClick={addChapter}
                  className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#00609C] hover:text-[#00609C] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
               >
                   <Plus size={20} /> Adicionar Novo Capítulo
               </button>
           </div>
        </div>
      </div>

      {/* RIGHT: Sticky Financial Sidebar */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-800 p-4 text-white">
                  <h3 className="font-bold text-sm uppercase tracking-wide opacity-80 mb-1">Resumo do Orçamento</h3>
                  <div className="text-3xl font-bold">{formatCurrency(budget.totalPrice)}</div>
                  <div className="text-xs opacity-70 mt-1">+IVA (23%): {formatCurrency(budget.totalTax)}</div>
              </div>
              <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-sm text-slate-500">Custo Estimado</span>
                      <span className="font-bold text-slate-700">{formatCurrency(budget.totalCost)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-sm text-slate-500">Margem Bruta</span>
                      <div className="text-right">
                          <span className={`font-bold block ${risk.color}`}>{formatCurrency(budget.totalMargin)}</span>
                          <span className={`text-xs ${risk.color} font-medium`}>{budget.marginPercent.toFixed(1)}%</span>
                      </div>
                  </div>
                  <div className={`p-3 rounded-lg flex items-center gap-3 ${risk.bg} border ${risk.color.replace('text', 'border').replace('600', '200')}`}>
                      <AlertTriangle size={20} className={risk.color} />
                      <div>
                          <p className={`text-xs font-bold uppercase ${risk.color}`}>Risco Financeiro</p>
                          <p className="text-xs text-slate-600 font-medium">{risk.label}</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* KPIs Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                  <Calculator size={16} className="text-[#00609C]" /> Indicadores (KPIs)
              </h4>
              <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                      <span className="text-slate-500">Capítulos</span>
                      <span className="font-medium text-slate-800">{budget.chapters.length}</span>
                  </li>
                  <li className="flex justify-between">
                      <span className="text-slate-500">Total Artigos</span>
                      <span className="font-medium text-slate-800">
                          {budget.chapters.reduce((acc, c) => acc + c.items.length + (c.subChapters?.reduce((sAcc, s) => sAcc + s.items.length, 0) || 0), 0)}
                      </span>
                  </li>
                  <li className="flex justify-between">
                      <span className="text-slate-500">Desvio Previsto</span>
                      <span className="font-medium text-green-600">+0.0%</span>
                  </li>
              </ul>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Ações Rápidas</p>
              <div className="space-y-2">
                  <button className="w-full bg-white border border-slate-300 hover:border-[#00609C] text-slate-600 hover:text-[#00609C] py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                      <Copy size={14} /> Duplicar Orçamento
                  </button>
                  <button className="w-full bg-white border border-slate-300 hover:border-[#00609C] text-slate-600 hover:text-[#00609C] py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                      <History size={14} /> Comparar Versões
                  </button>
              </div>
          </div>
      </div>

      {/* MODAL */}
      <ArticleModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onSave={handleSaveItem}
          initialData={editingItem || undefined}
      />

    </div>
  );
};

export default BudgetEditor;