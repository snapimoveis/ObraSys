import React from 'react';
import { RDO } from '../../types';
import { getWeatherIcon, getWeatherLabel } from '../../utils/rdoUtils';
import RDOStatusBadge from './RDOStatusBadge';
import { Calendar, User, Hammer, AlertTriangle, Users, Clock } from 'lucide-react';

interface Props {
  rdo: RDO;
}

const RDODetail: React.FC<Props> = ({ rdo }) => {
  const MorningIcon = getWeatherIcon(rdo.weatherMorning);
  const AfternoonIcon = getWeatherIcon(rdo.weatherAfternoon);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-800">RDO #{rdo.number}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(rdo.date).toLocaleDateString('pt-PT')}</span>
            <span className="flex items-center gap-1"><User size={14}/> {rdo.responsible}</span>
          </div>
        </div>
        <div className="text-right">
          <RDOStatusBadge status={rdo.status} />
          {rdo.submittedAt && (
            <p className="text-xs text-slate-400 mt-2 flex items-center justify-end gap-1">
              <Clock size={10} /> Submetido em {new Date(rdo.submittedAt).toLocaleDateString('pt-PT')}
            </p>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-6 space-y-8">
        
        {/* Weather & Conditions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Manhã</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{getWeatherLabel(rdo.weatherMorning)}</span>
              <MorningIcon size={20} className="text-orange-500" />
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Tarde</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{getWeatherLabel(rdo.weatherAfternoon)}</span>
              <AfternoonIcon size={20} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Execution */}
        <div>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Hammer size={18} className="text-[#00609C]" />
            Trabalhos Realizados
          </h3>
          {rdo.execution.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Sem registos de execução.</p>
          ) : (
            <div className="space-y-2">
              {rdo.execution.map(exec => (
                <div key={exec.id} className="p-3 border border-slate-100 rounded-lg flex justify-between items-center bg-white hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{exec.taskName}</p>
                    {exec.notes && <p className="text-xs text-slate-500 mt-1">{exec.notes}</p>}
                  </div>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+{exec.percentageIncrement}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Users size={18} className="text-slate-600" />
            Recursos Utilizados
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2">Descrição</th>
                  <th className="px-4 py-2 text-right">Qtd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rdo.resources.map(res => (
                  <tr key={res.id}>
                    <td className="px-4 py-2 text-xs font-bold text-slate-400">{res.type}</td>
                    <td className="px-4 py-2 text-slate-700">{res.description}</td>
                    <td className="px-4 py-2 text-right font-medium">{res.quantity}</td>
                  </tr>
                ))}
                {rdo.resources.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-4 text-center text-slate-400 italic">Sem recursos registados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Occurrences */}
        {rdo.occurrences.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" />
              Ocorrências
            </h3>
            <div className="space-y-2">
              {rdo.occurrences.map(occ => (
                <div key={occ.id} className={`p-3 rounded-lg border ${occ.critical ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${occ.critical ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-600'}`}>
                      {occ.type}
                    </span>
                    {occ.critical && <span className="text-[10px] font-bold text-red-600 flex items-center gap-1"><AlertTriangle size={10}/> CRÍTICO</span>}
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{occ.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observations */}
        {rdo.observations && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-900">
            <span className="font-bold block mb-1">Observações Gerais:</span>
            {rdo.observations}
          </div>
        )}

      </div>
    </div>
  );
};

export default RDODetail;
