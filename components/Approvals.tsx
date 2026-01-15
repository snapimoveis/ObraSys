import React, { useState } from 'react';
import { useApprovals } from '../hooks/useApprovals';
import { ApprovalRequest } from '../types';
import ApprovalQueue from './approvals/ApprovalQueue';
import ApprovalItemDetail from './approvals/ApprovalItemDetail';
import { CheckSquare, AlertOctagon, History } from 'lucide-react';

const Approvals: React.FC = () => {
  const { approvals, pendingCount, urgentCount, processApproval } = useApprovals();
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);

  const handleProcess = (id: string, action: 'APPROVE' | 'REJECT' | 'HOLD', note: string) => {
    processApproval(id, action, note, 'Administrador'); // Hardcoded user for demo
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Aprovações</h1>
          <p className="text-slate-500 text-sm">Central de validação de documentos e processos.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Pendentes</p>
            <h3 className="text-2xl font-bold text-slate-800">{pendingCount}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <CheckSquare size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Urgentes / Críticos</p>
            <h3 className="text-2xl font-bold text-red-600">{urgentCount}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertOctagon size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Histórico</p>
            <h3 className="text-2xl font-bold text-slate-800">{approvals.length}</h3>
          </div>
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
            <History size={24} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ApprovalQueue approvals={approvals} onSelect={setSelectedRequest} />
      </div>

      {/* Modal Detail */}
      {selectedRequest && (
        <ApprovalItemDetail 
          request={selectedRequest}
          onProcess={handleProcess}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default Approvals;
