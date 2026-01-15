import React from 'react';
import { Work } from '../../types';
import { ReportKPIs } from '../../hooks/useWorkReports';
import { Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface Props {
  kpis: ReportKPIs;
  work: Work;
}

const WorkScheduleReport: React.FC<Props> = ({ kpis, work }) => {
  
  // Calculate specific schedule stats
  const totalTasks = work.schedule.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = work.schedule.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'DONE').length, 0);
  const delayedTasks = work.schedule.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'DELAYED').length, 0);
  
  const daysElapsed = Math.floor((new Date().getTime() - new Date(work.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor((new Date(work.expectedEndDate).getTime() - new Date(work.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const timeProgress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Índice Desempenho (SPI)</p>
            <h3 className={`text-3xl font-bold mt-1 ${kpis.spi < 0.9 ? 'text-red-500' : kpis.spi > 1.1 ? 'text-green-500' : 'text-orange-500'}`}>
               {kpis.spi.toFixed(2)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Meta: 1.00</p>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Tarefas Concluídas</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{completedTasks} <span className="text-sm text-slate-400 font-normal">/ {totalTasks}</span></h3>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Tarefas em Atraso</p>
            <h3 className={`text-3xl font-bold mt-1 ${delayedTasks > 0 ? 'text-red-500' : 'text-green-500'}`}>{delayedTasks}</h3>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Tempo Decorrido</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{daysElapsed} <span className="text-sm text-slate-400 font-normal">dias</span></h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
               <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: `${timeProgress}%` }}></div>
            </div>
         </div>
      </div>

      {/* Critical Items / Delays */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <AlertCircle size={18} className="text-red-500" />
               Tarefas Críticas / Em Atraso
            </h3>
         </div>
         {delayedTasks === 0 ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
               <CheckCircle size={32} className="text-green-500 mb-2" />
               <p>Nenhuma tarefa em atraso.</p>
            </div>
         ) : (
            <table className="w-full text-left text-sm">
               <thead className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <tr>
                     <th className="px-6 py-3">Tarefa</th>
                     <th className="px-6 py-3">Fim Planeado</th>
                     <th className="px-6 py-3">Progresso</th>
                     <th className="px-6 py-3 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {work.schedule.map(p => p.tasks.filter(t => t.status === 'DELAYED').map(t => (
                     <tr key={t.id} className="hover:bg-red-50/30">
                        <td className="px-6 py-3 font-medium text-slate-700">{t.name}</td>
                        <td className="px-6 py-3 text-slate-600 flex items-center gap-2">
                           <Calendar size={14} className="text-red-400" />
                           {new Date(t.endDate).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-3">
                           <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-200 h-1.5 rounded-full">
                                 <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${t.progress}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-red-600">{t.progress}%</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                           <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                              Atrasado
                           </span>
                        </td>
                     </tr>
                  )))}
               </tbody>
            </table>
         )}
      </div>
    </div>
  );
};

export default WorkScheduleReport;
