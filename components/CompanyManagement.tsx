import React, { useState } from 'react';
import { Building2, Upload, User, MapPin, Phone, Mail, Globe, FileText } from 'lucide-react';

const CompanyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'COMPANY'>('PROFILE');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
             <Building2 size={20} className="text-[#00609C]" />
           </div>
           <h1 className="text-2xl font-bold text-gray-900">Gestão da Empresa</h1>
        </div>
        <p className="text-gray-500 text-sm ml-11">Gerir informações pessoais e dados da organização.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl border border-gray-200 inline-flex w-full shadow-sm max-w-md">
        <button 
          onClick={() => setActiveTab('PROFILE')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'PROFILE' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          Perfil Pessoal
        </button>
        <button 
          onClick={() => setActiveTab('COMPANY')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'COMPANY' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          Dados da Empresa
        </button>
      </div>

      {/* Content */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Photo */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Foto de Perfil</h3>
            <p className="text-xs text-gray-500 mb-6 px-4">Esta imagem será visível para a sua equipa.</p>
            
            <div className="w-32 h-32 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-6 overflow-hidden relative group">
               <div className="text-center">
                 <span className="text-2xl font-bold text-[#00609C]">AS</span>
               </div>
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <Upload className="text-white" size={24} />
               </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center shadow-sm">
              <Upload size={16} />
              Alterar Foto
            </button>
            <p className="text-[10px] text-gray-400 mt-3">JPG, PNG ou GIF (máx. 2MB)</p>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
             <div className="mb-8 border-b border-gray-100 pb-4">
               <h3 className="text-xl font-bold text-gray-900">Informações Pessoais</h3>
               <p className="text-sm text-gray-500 mt-1">Atualize os seus dados de contacto e login.</p>
             </div>
             
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome Completo</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all placeholder-gray-400 shadow-sm" 
                        defaultValue="Antonio Cavalcanti" 
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefone</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="tel" 
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all placeholder-gray-400 shadow-sm" 
                        defaultValue="+351 912 345 678" 
                      />
                    </div>
                 </div>
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      className="w-full bg-gray-50 text-gray-500 border border-gray-200 rounded-lg p-2.5 pl-10 text-sm outline-none cursor-not-allowed" 
                      defaultValue="snapimoveis@gmail.com" 
                      readOnly 
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> O email de login não pode ser alterado diretamente.
                  </p>
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Função / Cargo</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 text-gray-500 border border-gray-200 rounded-lg p-2.5 text-sm outline-none cursor-not-allowed" 
                    defaultValue="Administrador" 
                    readOnly 
                  />
               </div>
               
               <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                 <button className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                   Cancelar
                 </button>
                 <button className="px-5 py-2.5 bg-[#00609C] text-white rounded-lg text-sm font-bold hover:bg-[#005082] transition-colors shadow-sm">
                   Guardar Alterações
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'COMPANY' && (
        <div className="space-y-6">
           {/* Identity */}
           <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
             <div className="mb-8 flex items-start gap-4 border-b border-gray-100 pb-4">
               <div className="p-2 bg-blue-50 text-[#00609C] rounded-lg">
                 <Building2 size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-900">Identidade da Empresa</h3>
                  <p className="text-sm text-gray-500">Configure como a sua empresa aparece nos documentos.</p>
               </div>
             </div>
             
             <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-32 h-32 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 transition-all cursor-pointer">
                      <Upload size={24} className="mb-2" />
                      <span className="text-xs font-medium">Carregar Logo</span>
                   </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome da Empresa *</label>
                      <input 
                        type="text" 
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                        defaultValue="Snap Imóveis" 
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Setor de Atividade</label>
                      <input 
                        type="text" 
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                        placeholder="Ex: Construção Residencial" 
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website</label>
                      <div className="relative">
                        <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="url" 
                          className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                          placeholder="https://..." 
                        />
                      </div>
                   </div>
                </div>
             </div>
           </div>

           {/* Contacts */}
           <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
             <div className="mb-6 border-b border-gray-100 pb-4">
               <h3 className="text-lg font-bold text-gray-900">Morada e Contactos</h3>
               <p className="text-sm text-gray-500">Dados utilizados no cabeçalho de orçamentos e faturas.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Endereço Principal</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                    <textarea 
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm min-h-[80px] resize-none" 
                      placeholder="Rua, número, andar"
                    ></textarea>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Código Postal</label>
                  <input 
                    type="text" 
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                    placeholder="0000-000" 
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cidade</label>
                  <input 
                    type="text" 
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                    defaultValue="Lisboa" 
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Geral</label>
                  <input 
                    type="email" 
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                    placeholder="geral@empresa.com" 
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefone Geral</label>
                  <input 
                    type="tel" 
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                    placeholder="+351..." 
                  />
               </div>
             </div>
           </div>

           {/* Legal */}
           <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
             <div className="mb-6 border-b border-gray-100 pb-4">
               <h3 className="text-lg font-bold text-gray-900">Dados Fiscais</h3>
               <p className="text-sm text-gray-500">Informação legal obrigatória.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">NIF</label>
                  <div className="relative">
                    <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                      placeholder="123456789" 
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capital Social (€)</label>
                  <input 
                    type="text" 
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                    placeholder="5000.00" 
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registo Comercial</label>
                  <input 
                    type="text" 
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all shadow-sm" 
                    placeholder="CRC Lisboa" 
                  />
               </div>
             </div>
           </div>

           <div className="flex justify-end pt-4">
             <button className="px-8 py-3 bg-[#00609C] text-white rounded-lg text-sm font-bold hover:bg-[#005082] transition-colors shadow-md flex items-center gap-2">
               <Upload size={18} />
               Guardar Todos os Dados
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;