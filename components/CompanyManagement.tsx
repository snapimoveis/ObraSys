import React, { useState } from 'react';
import { Building2, Upload } from 'lucide-react';

const CompanyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'COMPANY'>('PROFILE');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
           <Building2 size={24} className="text-[#00609C]" />
           <h1 className="text-2xl font-bold text-slate-800">Gestão da Empresa</h1>
        </div>
        <p className="text-slate-500 text-sm">Gerir informações pessoais e dados da empresa</p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-lg border border-slate-200 inline-flex w-full">
        <button 
          onClick={() => setActiveTab('PROFILE')}
          className={`flex-1 py-2 text-sm font-medium rounded transition-all ${activeTab === 'PROFILE' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Perfil Pessoal
        </button>
        <button 
          onClick={() => setActiveTab('COMPANY')}
          className={`flex-1 py-2 text-sm font-medium rounded transition-all ${activeTab === 'COMPANY' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Dados da Empresa
        </button>
      </div>

      {/* Content */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Photo */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center h-fit">
            <h3 className="text-lg font-medium text-slate-800 mb-2">Foto de Perfil</h3>
            <p className="text-xs text-slate-500 mb-6 px-4">Carregue a sua foto ou logótipo da empresa</p>
            
            <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center mb-6 overflow-hidden">
               {/* Placeholder for Logo */}
               <div className="text-center">
                 <span className="text-2xl font-bold text-[#00609C]">obra</span>
                 <br />
                 <span className="text-xs text-[#00609C]">sys</span>
               </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors w-full justify-center">
              <Upload size={16} />
              Alterar Foto
            </button>
            <p className="text-[10px] text-slate-400 mt-2">JPG, PNG ou GIF (máx. 2MB)</p>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
             <div className="mb-6">
               <h3 className="text-xl font-medium text-slate-800">Informações do Perfil</h3>
               <p className="text-sm text-slate-500">Atualize as suas informações pessoais e de contacto</p>
             </div>
             
             <div className="space-y-5">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#00609C]" defaultValue="Antonio Cavalcanti" />
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm outline-none text-slate-500" defaultValue="snapimoveis@gmail.com" readOnly />
                  <p className="text-xs text-slate-400 mt-1">O email não pode ser alterado. Contacte o suporte se necessário.</p>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Utilizador</label>
                  <input type="text" className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm outline-none text-slate-500" defaultValue="Administrador" readOnly />
               </div>
               
               <div className="pt-4 border-t border-slate-100 mt-2">
                 <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center border border-slate-400 rounded text-[10px]">📅</span> 
                    Conta criada em 18/07/2025
                 </p>
               </div>

               <div className="flex justify-end gap-3 mt-6">
                 <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm hover:bg-slate-50">Cancelar</button>
                 <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">Guardar Alterações</button>
               </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'COMPANY' && (
        <div className="space-y-6">
           {/* Identity */}
           <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
             <div className="mb-6 flex items-start gap-4">
               <div className="pt-1"><Building2 size={20} className="text-slate-400" /></div>
               <div>
                  <h3 className="text-lg font-medium text-slate-800">Identidade da Empresa</h3>
                  <p className="text-sm text-slate-500">Configure o logótipo e informações básicas da empresa</p>
               </div>
             </div>
             
             <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-3">
                   <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xl font-bold">SI</div>
                   <button className="text-xs flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50">
                     <Upload size={12} /> Alterar Logo
                   </button>
                </div>
                <div className="flex-1 space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome da Empresa *</label>
                      <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#00609C]" defaultValue="Snap Imóveis" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Atividade</label>
                      <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#00609C]" placeholder="Área de atividade da empresa" />
                   </div>
                </div>
             </div>
           </div>

           {/* Contacts */}
           <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
             <div className="mb-6">
               <h3 className="text-lg font-medium text-slate-800">Informações de Contacto</h3>
               <p className="text-sm text-slate-500">Contactos e endereço da empresa</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="email@empresa.com" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
                  <input type="tel" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="+351 123 456 789" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
                  <input type="url" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="https://www.empresa.com" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Fax</label>
                  <input type="tel" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="+351 123 456 788" />
               </div>
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço</label>
                  <textarea className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none h-20 resize-none" placeholder="Rua, número, andar"></textarea>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Código Postal</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="0000-000" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cidade</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" defaultValue="Lisboa" />
               </div>
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">País</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" defaultValue="Portugal" />
               </div>
             </div>
           </div>

           {/* Legal & Fiscal */}
           <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
             <div className="mb-6">
               <h3 className="text-lg font-medium text-slate-800">Informações Legais e Fiscais</h3>
               <p className="text-sm text-slate-500">Dados fiscais e legais da empresa</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">NIF</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="123456789" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Capital Social (€)</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="0.00" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Conservatória</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="Conservatória do Registo Comercial" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Matrícula</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" placeholder="Número da matrícula" />
               </div>
             </div>
           </div>

           <div className="flex justify-end">
             <button className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm">
               Guardar Alterações
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;