import React from 'react';
import { ArrowRight, MoreVertical, MapPin, Calendar } from 'lucide-react';

export interface ProjectSummary {
  id: string;
  name: string;
  client: string;
  location: string;
  status: 'PLANNING' | 'EXECUTION' | 'DELAYED' | 'COMPLETED';
  progress: number;
  nextMilestone: string;
  financialStatus: 'ON_TRACK' | 'OVER_BUDGET';
}

interface Props {
  projects: ProjectSummary[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    'PLANNING': 'bg-slate-100 text-slate-600',
    'EXECUTION': 'bg-blue-100 text-blue-700',
    'DELAYED': 'bg-red-100 text-red-700',
    'COMPLETED': 'bg-green-100 text-green-700'
  };
  
  const labels = {
    'PLANNING': 'Planeamento',
    'EXECUTION': 'Em Execução',
    'DELAYED': 'Atrasado',
    'COMPLETED': 'Concluído'
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-transparent ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
};

const DashboardProjects: React.FC<Props> = ({ projects }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">Visão Geral de Obras</h3>
        <button className="text-sm text-[#00609C] font-medium hover:underline flex items-center gap-1">
          Ver Todas <ArrowRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Obra / Cliente</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 w-48">Progresso Físico</th>
              <th className="px-6 py-3">Próximo Marco</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{proj.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {proj.location} • {proj.client}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={proj.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${proj.status === 'DELAYED' ? 'bg-red-500' : 'bg-[#00609C]'}`} 
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-slate-700 w-8 text-right">{proj.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar size={14} className="text-slate-400" />
                    {proj.nextMilestone}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardProjects;
