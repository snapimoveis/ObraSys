import React, { useState } from 'react';
import { RealCost, CostType, Budget } from '../../types';
import { X, Save, Calendar, Tag, FileText, DollarSign, User } from 'lucide-react';

interface Props {
  workId: string;
  budget?: Budget;
  onSave: (cost: Omit<RealCost, 'id'>) => void;
  onClose: () => void;
}

const RealCostForm: React.FC<Props> = ({ workId, budget, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<RealCost>>({
    date: new Date().toISOString().split('T')[0],
    type: 'MATERIAL',
    amount: 0,
    description: '',
    supplier: '',
    documentRef: '',
    budgetChapterId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || formData.amount <= 0) return;

    onSave({
      workId,
      date: formData.date!,
      description: formData.description!,
      amount: formData.amount!,
      type: formData.type as CostType,
      supplier: formData.supplier,
      documentRef: formData.documentRef,
      budgetChapterId: formData.budgetChapterId
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Registar Custo Real</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date"
                  required
                  className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none focus:border-[#00609C]"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor (€)</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none focus:border-[#00609C] font-bold text-slate-800"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
            <input 
              type="text"
              required
              placeholder="Ex: Fatura Cimento"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#00609C]"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Custo</label>
            <div className="grid grid-cols-3 gap-2">
              {(['MATERIAL', 'LABOR', 'SUBCONTRACT', 'EQUIPMENT', 'OTHER'] as CostType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, type})}
                  className={`text-xs py-2 px-1 rounded border font-medium transition-all ${
                    formData.type === type 
                      ? 'bg-[#00609C] text-white border-[#00609C]' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {type === 'MATERIAL' ? 'Material' : 
                   type === 'LABOR' ? 'Mão de Obra' :
                   type === 'SUBCONTRACT' ? 'Subemp.' :
                   type === 'EQUIPMENT' ? 'Equip.' : 'Outro'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fornecedor</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Nome entidade"
                  className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none focus:border-[#00609C]"
                  value={formData.supplier}
                  onChange={e => setFormData({...formData, supplier: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nº Documento</label>
              <div className="relative">
                <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Ex: FT 123"
                  className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none focus:border-[#00609C]"
                  value={formData.documentRef}
                  onChange={e => setFormData({...formData, documentRef: e.target.value})}
                />
              </div>
            </div>
          </div>

          {budget && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Imputar a Capítulo (Opcional)</label>
              <select
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-white"
                value={formData.budgetChapterId}
                onChange={e => setFormData({...formData, budgetChapterId: e.target.value})}
              >
                <option value="">-- Geral / Não imputado --</option>
                {budget.chapters.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 mt-2 border-t border-slate-100">
            <button 
              type="submit"
              className="w-full bg-[#00609C] hover:bg-[#005082] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Save size={18} />
              <span>Registar Despesa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealCostForm;