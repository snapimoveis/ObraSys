import React, { useState, useEffect } from 'react';
import { TeamMember, Role } from '../../types';
import { X, User, Mail, Phone, Briefcase, Building } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<TeamMember>) => void;
  initialData?: TeamMember | null;
}

const TeamMemberForm: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    email: '',
    role: 'WORKER',
    phone: '',
    assignedWorks: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'WORKER',
        phone: '',
        assignedWorks: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">
            {initialData ? 'Editar Colaborador' : 'Convidar Colaborador'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  required
                  className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="tel" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent"
                  placeholder="+351..."
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Função</label>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent bg-white"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as Role})}
              >
                <option value="ADMIN">Administrador</option>
                <option value="ENGINEER">Engenheiro Civil</option>
                <option value="ARCHITECT">Arquiteto</option>
                <option value="FOREMAN">Encarregado</option>
                <option value="WORKER">Operário</option>
                <option value="SUBCONTRACTOR">Subempreiteiro</option>
                <option value="CLIENT">Cliente (Leitura)</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {formData.role === 'ADMIN' && 'Acesso total a todas as obras e configurações.'}
              {formData.role === 'ENGINEER' && 'Gestão de obras, RDOs, Orçamentos e Autos.'}
              {formData.role === 'FOREMAN' && 'Acesso a RDOs e visualização de planos.'}
              {formData.role === 'CLIENT' && 'Apenas visualização do progresso e documentos.'}
            </p>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1.5">Associar a Obras</label>
             <div className="border border-slate-200 rounded-lg p-3 max-h-32 overflow-y-auto bg-slate-50">
               {/* Mock Work List - In real app, pass available works as props */}
               <label className="flex items-center gap-2 mb-2 cursor-pointer">
                 <input 
                    type="checkbox" 
                    checked={formData.assignedWorks?.includes('WORK-123')}
                    onChange={(e) => {
                      const works = formData.assignedWorks || [];
                      if (e.target.checked) setFormData({...formData, assignedWorks: [...works, 'WORK-123']});
                      else setFormData({...formData, assignedWorks: works.filter(id => id !== 'WORK-123')});
                    }}
                    className="rounded text-[#00609C]"
                 />
                 <span className="text-sm text-slate-700">Moradia V4 - Cascais</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" className="rounded text-[#00609C]" disabled />
                 <span className="text-sm text-slate-400">Reabilitação Baixa (Sem permissão)</span>
               </label>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-[#00609C] text-white rounded-lg text-sm font-bold hover:bg-[#005082] transition-colors shadow-sm"
            >
              {initialData ? 'Guardar' : 'Enviar Convite'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TeamMemberForm;
