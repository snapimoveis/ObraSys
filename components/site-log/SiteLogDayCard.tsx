import React from 'react';
import { RDO } from '../../types';
import { getWeatherIcon } from '../../utils/rdoUtils';
import RDOStatusBadge from '../rdo/RDOStatusBadge';
import { Calendar, User, ChevronRight, AlertTriangle } from 'lucide-react';

interface Props {
  rdo: RDO;
  onClick: () => void;
}

const SiteLogDayCard: React.FC<Props> = ({ rdo, onClick }) => {
  const WeatherIcon = getWeatherIcon(rdo.weatherMorning);
  const criticalCount = rdo.occurrences.filter(o => o.critical).length;

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-500 font-bold text-center w-12 leading-tight">
            <span className="text-xs uppercase block">{new Date(rdo.date).toLocaleDateString('pt-PT', { month: 'short' })}</span>
            <span className="text-lg block">{new Date(rdo.date).getDate()}</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">RDO #{rdo.number}</h4>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <User size={10} /> {rdo.responsible}
            </p>
          </div>
        </div>
        <RDOStatusBadge status={rdo.status} />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
        <div className="flex gap-3">
          <span className="flex items-center gap-1" title="Clima">
            <WeatherIcon size={14} className="text-orange-400" /> 
          </span>
          <span title="Tarefas Executadas">
            <strong>{rdo.execution.length}</strong> tarefas
          </span>
          <span title="Recursos">
            <strong>{rdo.resources.length}</strong> recursos
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">
              <AlertTriangle size={10} /> {criticalCount}
            </span>
          )}
          <ChevronRight size={16} className="text-slate-300 group-hover:text-[#00609C]" />
        </div>
      </div>
    </div>
  );
};

export default SiteLogDayCard;
