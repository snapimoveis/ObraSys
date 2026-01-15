import React, { useState } from 'react';
import { ApprovalRequest, ApprovalHistory } from '../../types';
import { formatCurrency } from '../../utils/financialUtils';
import { X, CheckCircle, XCircle, AlertTriangle, MessageSquare, Clock, ShieldAlert, History } from 'lucide-react';

interface Props {
  request: ApprovalRequest;
  onProcess: (id: string, action: 'APPROVE' | 'REJECT' | 'HOLD', note: string) => void;
  onClose: () => void;
}

const ApprovalItemDetail: React.FC<Props> = ({ request, onProcess, onClose }) => {
  const [note, setNote] = useState('');
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'HOLD' | null>(null);

  const handleConfirm = () => {
    if (!actionType) return;
    if (actionType === 'REJECT' && !note.trim()) {
      alert("É obrigatório justificar a rejeição.");
      return;
    }
    onProcess(request.id, actionType, note);
    onClose();
  };

  const isBlocked = request.complianceStatus === 'BLOCKED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${
              request.type === 'BUDGET' ? 'bg-blue-100 text-blue-700 border-blue-200' :
              request.type === 'RDO' ? 'bg-orange-100 text-orange-700 border-orange-200' :
              'bg-purple-100 text-purple-700 border-purple-200'
            }`}>
              {request.type}
            </span>
            <h3 className="font-bold text-lg text-slate-800">{request.reference}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Main Info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Descrição</p>
              <p className="text-slate-800 font-medium">{request.description}</p>
            </div>
            {request.amount && (
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Valor</p>
                <p className="text-2xl font-bold text-[#00609C]">{formatCurrency(request.amount)}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Obra</p>
              <p className="text-sm font-medium text-slate-700">{request.workName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Solicitado Por</p>
              <p className="text-sm font-medium text-slate-700">{request.requester} <span className="text-slate-400 font-normal">({request.requesterRole})</span></p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Data Pedido</p>
              <p className="text-sm font-medium text-slate-700">{new Date(request.requestedAt).toLocaleString('pt-PT')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Prioridade</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                request.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                request.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {request.priority}
              </span>
            </div>
          </div>

          {/* Compliance Check */}
          <div className={`p-4 rounded-lg border ${isBlocked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <h4 className={`font-bold flex items-center gap-2 mb-2 ${isBlocked ? 'text-red-800' : 'text-green-800'}`}>
              {isBlocked ? <ShieldAlert size={18}/> : <CheckCircle size={18}/>}
              Verificação de Conformidade
            </h4>
            {isBlocked ? (
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {request.complianceIssues?.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-700">Todos os requisitos de conformidade estão válidos.</p>
            )}
          </div>

          {/* History */}
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><History size={16} /> Histórico</h4>
            <div className="space-y-3 pl-2 border-l-2 border-slate-100 ml-1">
              {request.history.map(h => (
                <div key={h.id} className="relative pl-4">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="text-xs text-slate-500 mb-0.5">
                    <span className="font-bold text-slate-700">{h.user}</span> • {new Date(h.date).toLocaleString('pt-PT')}
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className={`font-bold text-xs uppercase px-1.5 py-0.5 rounded mr-2 ${
                      h.action === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      h.action === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{h.action}</span>
                    {h.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Area */}
          {request.status === 'PENDING' && (
            <div className="border-t border-slate-100 pt-6">
              {!actionType ? (
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setActionType('HOLD')}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Clock size={18} /> Aguardar
                  </button>
                  <button 
                    onClick={() => setActionType('REJECT')}
                    className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium hover:bg-red-100 flex items-center gap-2"
                  >
                    <XCircle size={18} /> Rejeitar
                  </button>
                  <button 
                    onClick={() => setActionType('APPROVE')}
                    disabled={isBlocked}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                  >
                    <CheckCircle size={18} /> Aprovar
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fade-in">
                  <h5 className="font-bold text-slate-800 mb-2">
                    {actionType === 'APPROVE' ? 'Confirmar Aprovação' : actionType === 'REJECT' ? 'Motivo da Rejeição' : 'Nota de Pendência'}
                  </h5>
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00609C] outline-none min-h-[80px]"
                    placeholder="Adicione uma nota ou justificativa..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button 
                      onClick={() => { setActionType(null); setNote(''); }}
                      className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleConfirm}
                      className={`px-4 py-2 text-white rounded-lg text-sm font-bold shadow-sm ${
                        actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700' :
                        actionType === 'REJECT' ? 'bg-red-600 hover:bg-red-700' :
                        'bg-orange-500 hover:bg-orange-600'
                      }`}
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalItemDetail;
