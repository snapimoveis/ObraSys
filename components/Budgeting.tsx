import React, { useState } from 'react';
import { Plus, Download, UserPlus, User, X, Calendar } from 'lucide-react';

const Budgeting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ORCAMENTOS' | 'CLIENTES' | 'BASE_PRECOS'>('CLIENTES');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal State
  const [modalData, setModalData] = useState({
    title: '',
    client: '',
    description: '',
    validity: ''
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Orçamentação</h1>
        <div className="flex gap-2">
           <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
           >
              <Plus size={16} />
              <span>Novo Orçamento</span>
           </button>
           <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <UserPlus size={16} />
              <span>Cadastrar Cliente</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-100 p-1 rounded-lg inline-flex w-full md:w-auto">
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
          Base de Preços
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'CLIENTES' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <h2 className="text-xl font-bold text-slate-800">Gestão de Clientes</h2>
               <p className="text-slate-500 text-sm">0 clientes registrados</p>
             </div>
             <div className="flex gap-2">
               <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
                  <Download size={16} />
                  <span>Exportar</span>
               </button>
               <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
                  <UserPlus size={16} />
                  <span>Novo Cliente</span>
               </button>
             </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
               <UserPlus size={32} />
             </div>
             <h3 className="text-lg font-medium text-slate-800 mb-1">Nenhum cliente encontrado</h3>
             <p className="text-slate-500 text-sm">Comece criando seu primeiro cliente.</p>
          </div>
        </div>
      )}

      {activeTab !== 'CLIENTES' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <p>Conteúdo da aba {activeTab === 'ORCAMENTOS' ? 'Orçamentos' : 'Base de Preços'} em breve.</p>
        </div>
      )}

      {/* New Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-lg text-slate-800">Criar Novo Orçamento</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Título do Orçamento *</label>
                <input 
                  type="text" 
                  className="w-full border border-primary-500 rounded-lg p-2.5 outline-none ring-1 ring-primary-500 text-sm"
                  placeholder="Ex: Renovação de Apartamento"
                  value={modalData.title}
                  onChange={(e) => setModalData({...modalData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cliente *</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none bg-white text-sm text-slate-500"
                  value={modalData.client}
                  onChange={(e) => setModalData({...modalData, client: e.target.value})}
                >
                  <option value="">Selecione um cliente</option>
                </select>
                <p className="text-xs text-slate-500 mt-1.5">
                  Nenhum cliente disponível. <a href="#" className="text-[#00609C] hover:underline underline-offset-2">Criar cliente primeiro</a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none text-sm h-24 resize-none"
                  placeholder="Descrição do projeto..."
                  value={modalData.description}
                  onChange={(e) => setModalData({...modalData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Data de Validade (opcional)</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="dd/mm/aaaa"
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none text-sm"
                    value={modalData.validity}
                    onChange={(e) => setModalData({...modalData, validity: e.target.value})}
                  />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button 
                  className="flex-1 bg-primary-400 text-white font-medium py-2.5 rounded-lg cursor-not-allowed text-sm"
                  disabled
                >
                  Criar Orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgeting;