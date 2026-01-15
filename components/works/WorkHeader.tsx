import React from 'react';
import { Work, WorkStatus } from '../../types';
import { getStatusColor } from '../../utils/workUtils';
import { ArrowLeft, Calendar, MapPin, MoreVertical, Play, Pause, CheckSquare, Printer } from 'lucide-react';

interface WorkHeaderProps {
  work: Work;
  onBack: () => void;
  onStatusChange: (status: WorkStatus) => void;
}

const WorkHeader: React.FC<WorkHeaderProps> = ({ work, onBack, onStatusChange }) => {
  return (
    <div className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-xl font-bold text-slate-800">{work.title}</h1>
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusColor(work.status)}`}>
               {work.status === 'PLANNING' ? 'Planeamento' : work.status === 'EXECUTION' ? 'Em Execução' : work.status}
             </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
             <span className="flex items-center gap-1"><MapPin size={12}/> {work.location}</span>
             <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(work.startDate).toLocaleDateString('pt-PT')} a {new Date(work.expectedEndDate).toLocaleDateString('pt-PT')}</span>
             <span className="font-medium text-slate-600">Cliente: {work.client}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
         {work.status === 'PLANNING' && (
           <button 
             onClick={() => onStatusChange('EXECUTION')}
             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
           >
             <Play size={16} /> Iniciar Obra
           </button>
         )}
         
         {work.status === 'EXECUTION' && (
           <button 
             onClick={() => onStatusChange('SUSPENDED')}
             className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
           >
             <Pause size={16} /> Suspender
           </button>
         )}

         <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Printer size={18} />
         </button>
         <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <MoreVertical size={18} />
         </button>
      </div>
    </div>
  );
};

export default WorkHeader;