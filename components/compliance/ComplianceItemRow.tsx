import React, { useState } from 'react';
import { ComplianceItem, ComplianceStatus } from '../../types';
import { getTypeColor } from '../../utils/complianceRules';
import ComplianceStatusBadge from './ComplianceStatusBadge';
import ComplianceAuditLog from './ComplianceAuditLog';
import { ChevronDown, ChevronRight, AlertCircle, FileText, CheckCircle, XCircle, History } from 'lucide-react';

interface Props {
  item: ComplianceItem;
  onUpdateStatus: (id: string, status: ComplianceStatus, user: string, reason: string) => void;
  onAddEvidence: (id: string, note: string, user: string) => void;
}

const ComplianceItemRow: React.FC<Props> = ({ item, onUpdateStatus, onAddEvidence }) => {
  const [expanded, setExpanded] = useState(false);
  const [evidenceInput, setEvidenceInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'EVIDENCE' | null>(null);

  const handleAction = (status: ComplianceStatus) => {
    if (!reasonInput.trim()) return;
    onUpdateStatus(item.id, status, 'Administrador', reasonInput); // Mock User
    setReasonInput('');
    setActionType(null);
  };

  const handleAddEvidence = () => {
    if (!evidenceInput.trim()) return;
    onAddEvidence(item.id, evidenceInput, 'Administrador'); // Mock User
    setEvidenceInput('');
    setActionType(null);
  };

  return (
    <div className={`border rounded-lg mb-3 transition-all ${expanded ? 'border-blue-200 shadow-md bg-white' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
      
      {/* Header Row */}
      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <button className="text-slate-400 hover:text-blue-600 transition-colors">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {item.critical && (
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200 flex items-center gap-1">
                <AlertCircle size={10} /> CRÍTICO
              </span>
            )}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTypeColor(item.type)}`}>
              {item.type}
            </span>
            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 border rounded">
              Fonte: {item.source}
            </span>
          </div>
          <h4 className="font-semibold text-slate-800 text-sm">{item.requirement}</h4>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-400">Responsável</p>
            <p className="text-sm font-medium text-slate-700">{item.responsible}</p>
          </div>
          <ComplianceStatusBadge status={item.status} className="w-32 justify-center" />
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Actions & Evidence */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h5 className="font-bold text-slate-700 text-xs uppercase mb-3 flex items-center gap-2">
                  <FileText size={14} /> Evidências Atuais
                </h5>
                {item.evidence ? (
                  <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded border border-blue-100 italic">
                    "{item.evidence}"
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic">Nenhuma evidência registada.</p>
                )}
                
                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button 
                    onClick={() => setActionType('EVIDENCE')}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                  >
                    Adicionar Nota
                  </button>
                  {item.status !== 'COMPLIANT' && (
                    <button 
                      onClick={() => setActionType('APPROVE')}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <CheckCircle size={12} /> Validar
                    </button>
                  )}
                  {item.status !== 'NON_COMPLIANT' && (
                    <button 
                      onClick={() => setActionType('REJECT')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <XCircle size={12} /> Rejeitar
                    </button>
                  )}
                </div>

                {/* Input Area based on Action */}
                {actionType && (
                  <div className="mt-4 bg-slate-100 p-3 rounded animate-fade-in">
                    <p className="text-xs font-bold text-slate-700 mb-2">
                      {actionType === 'EVIDENCE' ? 'Nova Evidência / Nota' : actionType === 'APPROVE' ? 'Justificativa de Aprovação' : 'Motivo da Rejeição'}
                    </p>
                    {actionType === 'EVIDENCE' ? (
                      <textarea 
                        className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                        value={evidenceInput}
                        onChange={(e) => setEvidenceInput(e.target.value)}
                        placeholder="Descreva a evidência ou cole um link..."
                      />
                    ) : (
                      <textarea 
                        className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                        value={reasonInput}
                        onChange={(e) => setReasonInput(e.target.value)}
                        placeholder="Justifique esta alteração de estado..."
                      />
                    )}
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setActionType(null)} className="text-xs text-slate-500 hover:text-slate-800">Cancelar</button>
                      <button 
                        onClick={() => actionType === 'EVIDENCE' ? handleAddEvidence() : handleAction(actionType === 'APPROVE' ? 'COMPLIANT' : 'NON_COMPLIANT')}
                        className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-900"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Log */}
            <div>
              <h5 className="font-bold text-slate-700 text-xs uppercase mb-3 flex items-center gap-2">
                <History size={14} /> Histórico de Auditoria
              </h5>
              <ComplianceAuditLog logs={item.auditTrail} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceItemRow;