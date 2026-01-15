import React from 'react';
import { AlertCircle, Clock, FileWarning, ArrowRight, CheckSquare } from 'lucide-react';

export interface Alert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  module: string;
}

interface Props {
  alerts: Alert[];
}

const DashboardAlerts: React.FC<Props> = ({ alerts }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <AlertCircle size={18} className="text-red-500" />;
      case 'WARNING': return <Clock size={18} className="text-orange-500" />;
      default: return <FileWarning size={18} className="text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'CRITICAL': return 'bg-red-50 border-red-100';
      case 'WARNING': return 'bg-orange-50 border-orange-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <AlertCircle size={20} className="text-slate-400" />
          Alertas e Notificações
        </h3>
        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
          {alerts.length} Novos
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
            <CheckSquare size={32} className="mb-2 opacity-50" />
            <p className="text-sm">Tudo em dia!</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded-lg border flex items-start gap-3 transition-colors hover:shadow-sm ${getBgColor(alert.type)}`}>
              <div className="mt-0.5 flex-shrink-0">
                {getIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-slate-700 uppercase mb-0.5">{alert.module}</p>
                  <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-slate-800 leading-snug">{alert.message}</p>
              </div>
              <button className="text-slate-400 hover:text-[#00609C] self-center">
                <ArrowRight size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-slate-100 text-center">
        <button className="text-xs font-medium text-[#00609C] hover:underline">Ver Histórico Completo</button>
      </div>
    </div>
  );
};

export default DashboardAlerts;
