import React from 'react';
import { ArrowLeft, Upload, Download, Plus, Search } from 'lucide-react';

const Articles: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
             <ArrowLeft size={16} />
             <span className="sr-only">Voltar</span>
             <span className="ml-2 text-sm font-medium">Voltar</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Base de Artigos de Trabalho</h1>
            <p className="text-slate-500 text-sm">0 artigos • Base compartilhada</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Upload size={16} />
              <span>Importar CSV</span>
           </button>
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Download size={16} />
              <span>Exportar CSV</span>
           </button>
           <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
              <Plus size={16} />
              <span>Novo Artigo</span>
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4">
         <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2.5 flex items-center shadow-sm">
             <Search size={18} className="text-slate-400 mr-2" />
             <input 
               type="text" 
               placeholder="Pesquisar artigos..."
               className="flex-1 bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400"
             />
         </div>
         <select className="bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-600 outline-none shadow-sm min-w-[200px]">
           <option>Todas as categorias</option>
         </select>
      </div>

      {/* Empty State */}
      <div className="bg-slate-50/50 rounded-xl min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
         <h3 className="text-lg font-medium text-slate-500 mb-2">Nenhum artigo encontrado. Comece por criar o primeiro artigo.</h3>
         <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors mt-2">
            <Plus size={16} />
            <span>Criar Primeiro Artigo</span>
         </button>
      </div>
    </div>
  );
};

export default Articles;