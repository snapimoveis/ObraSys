import React from 'react';
import { ArrowLeft, Upload, Download, Plus, Star, Database, Layers, CheckSquare, Search, Edit2, Trash2, Copy } from 'lucide-react';

const StatCard = ({ label, value, subtext, icon: Icon, iconColor }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        {Icon && <Icon size={16} className={iconColor} />}
        {label}
      </div>
    </div>
    <h3 className={`text-2xl font-bold ${label === 'Preço Médio' ? 'text-orange-500' : label === 'Catálogo Padrão' ? 'text-purple-600' : 'text-primary-600'}`}>
      {value}
    </h3>
    <p className="text-xs text-slate-400 mt-1">{subtext}</p>
  </div>
);

const Prices: React.FC = () => {
  const items = [
    { code: 'ETR0001-1', desc: 'Armaduras em aço A400NR', unit: 'un', price: '50,00 €', category: 'Estruturas', source: 'Personalizado', custom: true },
    { code: 'ETR0003-1', desc: 'Betão armado C25/30 incluindo Armaduras em aço A...', unit: 'kg', price: '50,00 €', category: 'Estruturas', source: 'Personalizado', custom: true },
    { code: '2500-327', desc: 'Demolição de Paredes pladur', unit: 'm²', price: '10,00 €', category: 'Geral', source: 'Personalizado', custom: true },
    { code: 'ALV0001', desc: 'Alvenaria de blocos de Betão com 50x20x15', unit: 'M2', price: '50,00 €', category: 'Alvenarias', source: 'Catálogo Padrão', custom: false },
    { code: 'ALV0002', desc: 'Alvenaria de blocos de Betão com 50x20x20', unit: 'M2', price: '50,00 €', category: 'Alvenarias', source: 'Catálogo Padrão', custom: false },
    { code: 'ALV0003', desc: 'Alvenaria de blocos de Betão com 50x20x25', unit: 'M2', price: '50,00 €', category: 'Alvenarias', source: 'Catálogo Padrão', custom: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
             <ArrowLeft size={16} />
             <span className="sr-only">Voltar</span>
             <span className="ml-2 text-sm font-medium">Voltar</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Base de Preços Unificada</h1>
            <p className="text-slate-500 text-sm">Gerir artigos personalizados e utilizar a base compartilhada</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Personalizados" value="3" subtext="artigos únicos" icon={Star} iconColor="text-blue-500" />
        <StatCard label="Empresa" value="0" subtext="da empresa" icon={Database} iconColor="text-slate-500" />
        <StatCard label="Sistema" value="0" subtext="catálogo público" icon={Layers} iconColor="text-green-500" />
        <StatCard label="Catálogo Padrão" value="241" subtext="artigos padrão" icon={Layers} iconColor="text-purple-500" />
        <StatCard label="Preço Médio" value="49,84 €" subtext="por artigo" icon={CheckSquare} iconColor="text-orange-500" />
      </div>

      {/* Filters */}
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
         <select className="bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-600 outline-none shadow-sm min-w-[200px]">
           <option>Todas as fontes</option>
         </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Código</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 w-1/3">Descrição</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Unidade</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Preço Unitário</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Fonte</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.code}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[300px]" title={item.desc}>{item.desc}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.unit}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.price}</td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 border border-slate-300 rounded-full text-xs text-slate-600 bg-white">
                        {item.category}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     {item.custom ? (
                        <span className="flex items-center gap-1 text-xs text-white bg-primary-500 px-2 py-1 rounded-full w-fit">
                           <Star size={10} fill="currentColor" /> Personalizado
                        </span>
                     ) : (
                        <span className="flex items-center gap-1 text-xs text-slate-600 border border-slate-300 px-2 py-1 rounded-full w-fit bg-white">
                           <Database size={10} /> Catálogo Padrão
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                       {item.custom ? (
                         <>
                           <button className="p-1.5 border border-slate-200 rounded hover:bg-slate-100 text-slate-500"><Edit2 size={14} /></button>
                           <button className="p-1.5 border border-slate-200 rounded hover:bg-slate-100 text-slate-500"><Trash2 size={14} /></button>
                         </>
                       ) : (
                         <button className="flex items-center gap-1 px-2 py-1.5 border border-slate-200 rounded hover:bg-slate-100 text-slate-500 text-xs">
                           <Copy size={14} /> Copiar
                         </button>
                       )}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Prices;