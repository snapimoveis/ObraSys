import React, { useState } from 'react';
import { ApprovalRequest, ApprovalStatus } from '../../types';
import { formatCurrency } from '../../utils/financialUtils';
import { Search, Filter, CheckCircle2, XCircle, Clock, ChevronRight, AlertOctagon, ShieldAlert } from 'lucide-react';

interface Props {
  approvals: ApprovalRequest[];
  onSelect: (req: ApprovalRequest) => void;
}

const ApprovalQueue: React.FC<Props> = ({ approvals, onSelect }) => {
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'ALL'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = approvals.filter(a => {
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchesSearch = a.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.workName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'PENDING': return <span className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full"><Clock size={12}/> Pendente</span>;
      case 'APPROVED': return <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Aprovado</span>;
      case 'REJECTED': return <span className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full"><XCircle size={12}/> Rejeitado</span>;
      case 'ON_HOLD': return <span className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full"><Clock size={12}/> Em Espera</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 rounded-t-xl">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filterStatus === 'PENDING' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
          >
            Pendentes
          </button>
          <button 
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filterStatus === 'ALL' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
          >
            Histórico
          </button>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-[#00609C] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Referência</th>
              <th className="px-6 py-3">Obra</th>
              <th className="px-6 py-3">Solicitante</th>
              <th className="px-6 py-3 text-right">Valor</th>
              <th className="px-6 py-3 text-center">Estado</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(req => (
              <tr 
                key={req.id} 
                onClick={() => onSelect(req)}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${req.priority === 'CRITICAL' ? 'bg-red-500 animate-pulse' : req.priority === 'HIGH' ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                    <div>
                      <p className="font-bold text-slate-800">{req.reference}</p>
                      <p className="text-xs text-slate-500">{new Date(req.requestedAt).toLocaleDateString('pt-PT')}</p>
                    </div>
                    {req.complianceStatus === 'BLOCKED' && (
                      <ShieldAlert size={16} className="text-red-500" title="Bloqueado por Conformidade" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {req.workName}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-700">{req.requester}</p>
                  <p className="text-xs text-slate-400">{req.requesterRole}</p>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-700">
                  {req.amount ? formatCurrency(req.amount) : '-'}
                </td>
                <td className="px-6 py-4 flex justify-center">
                  {getStatusBadge(req.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-[#00609C]" />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={32} className="opacity-20" />
                    <p>Não há aprovações pendentes.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalQueue;
