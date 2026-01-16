import React, { useState, useEffect } from 'react';
import { Ticket } from '../../types';
import { Plus, Search, Filter, AlertCircle, CheckCircle2, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { db, getCurrentCompanyId, auth } from '../../services/firebase';
import { collection, query, where, onSnapshot, addDoc, orderBy, QuerySnapshot } from 'firebase/firestore';

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'TECHNICAL', description: '' });
  const companyId = getCurrentCompanyId();

  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, 'tickets'), 
      where('companyId', '==', companyId)
      // orderBy('createdAt', 'desc') // Requires index
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
      // Sort manually
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTickets(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !companyId || !auth.currentUser) return;

    try {
      const ticketData = {
        companyId,
        requesterId: auth.currentUser.uid,
        requesterEmail: auth.currentUser.email,
        subject: newTicket.subject,
        category: newTicket.category,
        description: newTicket.description,
        status: 'OPEN',
        priority: 'MEDIUM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        lastUpdate: new Date().toISOString() // for UI compat
      };

      await addDoc(collection(db, 'tickets'), ticketData);
      setIsModalOpen(false);
      setNewTicket({ subject: '', category: 'TECHNICAL', description: '' });
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Erro ao criar ticket.");
    }
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#34669A] text-white rounded-lg hover:bg-[#2a527a] text-sm font-bold shadow-sm"
          >
            <Plus size={16} /> Novo Ticket
          </button>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-[#00609C]" size={24} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <CheckCircle2 size={48} className="mb-2 opacity-20" />
            <p>Nenhum ticket encontrado.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Assunto</th>
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
                    <p className="text-xs text-slate-500 mt-0.5">{(t as any).readableId || t.id}</p>
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
                    {new Date(t.lastUpdate || t.createdAt).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#34669A]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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