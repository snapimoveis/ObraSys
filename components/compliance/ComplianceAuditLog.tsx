import React from 'react';
import { AuditLog } from '../../types';
import { History } from 'lucide-react';

interface Props {
  logs: AuditLog[];
}

const ComplianceAuditLog: React.FC<Props> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <div className="text-xs text-slate-400 italic">Sem histórico registado.</div>;
  }

  return (
    <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-1">
      {logs.map((log) => (
        <div key={log.id} className="relative">
          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{log.user}</span>
              <span className="text-slate-400">{new Date(log.date).toLocaleString('pt-PT')}</span>
            </div>
            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
              <span className="font-semibold text-[10px] uppercase text-slate-400 block mb-1">{log.action}</span>
              {log.previousValue && log.newValue && (
                <span className="block mb-1">
                  Mudança: <span className="line-through text-slate-400">{log.previousValue}</span> → <span className="font-medium text-slate-800">{log.newValue}</span>
                </span>
              )}
              {log.reason && (
                <span className="block italic text-slate-500">"{log.reason}"</span>
              )}
              {log.action === 'ADD_EVIDENCE' && (
                <span className="block text-slate-700">{log.newValue}</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplianceAuditLog;
