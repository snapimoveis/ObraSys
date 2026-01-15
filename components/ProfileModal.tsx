import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    firstName: 'snapimoveis',
    lastName: '',
    email: 'snapimoveis@gmail.com',
    phone: ''
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Editar Perfil</h3>
            <p className="text-sm text-slate-500">Atualize as suas informações pessoais e foto de perfil.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-4xl font-light text-slate-800">
              S
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm">
              <Camera size={16} />
              <span>Carregar foto</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Primeiro Nome</label>
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent text-sm transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Último Nome</label>
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent text-sm transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input 
                type="email" 
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                value={formData.email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
              <input 
                type="tel" 
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent text-sm transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex-shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-[#00609C] hover:bg-[#005082] text-white font-bold py-3 rounded-lg transition-colors shadow-sm text-sm"
          >
            Guardar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;