import React, { useState } from 'react';
import { X, Camera, User, Mail, Phone } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
          <div>
            <h3 className="font-bold text-xl text-gray-900">Editar Perfil</h3>
            <p className="text-sm text-gray-500 mt-0.5">Atualize as suas informações pessoais.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-3xl font-light text-gray-700 shadow-inner">
              S
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
              <Camera size={16} />
              <span>Alterar foto</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primeiro Nome</label>
                <input 
                  type="text" 
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Último Nome</label>
                <input 
                  type="text" 
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  className="w-full bg-gray-50 text-gray-500 border border-gray-200 rounded-lg p-2.5 pl-10 outline-none text-sm cursor-not-allowed"
                  value={formData.email}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="tel" 
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+351..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00609C] hover:bg-[#005082] text-white font-bold rounded-lg transition-colors shadow-sm text-sm"
          >
            Guardar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;