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
    'PLANNING': 'bg-gray-100 text-gray-600 border-gray-200',
    'EXECUTION': 'bg-blue-50 text-blue-700 border-blue-200',
    'DELAYED': 'bg-red-50 text-red-700 border-red-200',
    'COMPLETED': 'bg-green-50 text-green-700 border-green-200'
  };
  
  const labels = {
    'PLANNING': 'Planeamento',
    'EXECUTION': 'Em Execução',
    'DELAYED': 'Atrasado',
    'COMPLETED': 'Concluído'
  };

  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
};

const DashboardProjects: React.FC<Props> = ({ projects }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <h3 className="font-bold text-gray-900 text-lg">Visão Geral de Obras</h3>
        <button className="text-sm text-[#00609C] font-semibold hover:underline flex items-center gap-1 transition-colors">
          Ver Todas <ArrowRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Obra / Cliente</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 w-48 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progresso Físico</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Próximo Marco</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 text-sm">{proj.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-gray-400" /> 
                    {proj.location} <span className="text-gray-300">•</span> {proj.client}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={proj.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${proj.status === 'DELAYED' ? 'bg-red-500' : 'bg-[#00609C]'}`} 
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-700 w-8 text-right text-xs">{proj.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Calendar size={14} className="text-gray-400" />
                    {proj.nextMilestone}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
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