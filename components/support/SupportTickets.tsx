import React, { useState } from 'react';
import { Ticket } from '../../types';
import { Plus, Search, Filter, AlertCircle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TCK-2023-88',
      subject: 'Erro ao exportar PDF do Orçamento',
      category: 'TECHNICAL',
      status: 'OPEN',
      priority: 'HIGH',
      createdAt: '2023-11-15T10:00:00',
      lastUpdate: '2023-11-15T10:00:00',
      messages: []
    },
    {
      id: 'TCK-2023-85',
      subject: 'Dúvida sobre Autos de Medição',
      category: 'FINANCIAL',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      createdAt: '2023-11-10T14:30:00',
      lastUpdate: '2023-11-11T09:15:00',
      messages: []
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'TECHNICAL', description: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject) return;

    const ticket: Ticket = {
      id: `TCK-2023-${Math.floor(Math.random() * 1000)}`,
      subject: newTicket.subject,
      category: newTicket.category as any,
      status: 'OPEN',
      priority: 'MEDIUM',
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      messages: []
    };

    setTickets([ticket, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({ subject: '', category: 'TECHNICAL', description: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><AlertCircle size={12} /> Aberto</span>;
      case 'IN_PROGRESS': return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><Clock size={12} /> Em Análise</span>;
      case 'RESOLVED': return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Resolvido</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar tickets..." 
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#34669A]"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
            <Filter size={16} /> Filtros
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#34669A] text-white rounded-lg hover:bg-[#2a527a] text-sm font-bold shadow-sm"
          >
            <Plus size={16} /> Novo Ticket
          </button>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4">ID / Assunto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Última Atualização</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{t.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.id}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(t.status)}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(t.lastUpdate).toLocaleDateString('pt-PT')}
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-[#34669A]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Abrir Novo Ticket</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assunto</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#34669A]"
                  value={newTicket.subject}
                  onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                  placeholder="Resumo do problema"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-white outline-none focus:border-[#34669A]"
                  value={newTicket.category}
                  onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                >
                  <option value="TECHNICAL">Problema Técnico</option>
                  <option value="FINANCIAL">Financeiro / Faturação</option>
                  <option value="FEATURE">Sugestão de Melhoria</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-2.5 h-32 resize-none outline-none focus:border-[#34669A]"
                  value={newTicket.description}
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder="Detalhe o que aconteceu..."
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#34669A] text-white rounded-lg font-bold hover:bg-[#2a527a]"
                >
                  Criar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
