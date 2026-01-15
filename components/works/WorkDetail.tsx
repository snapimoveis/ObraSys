import React, { useState, useEffect } from 'react';
import { Work, WorkStatus, ScheduleTask } from '../../types';
import { calculateWorkKPIs } from '../../utils/workUtils';
import WorkHeader from './WorkHeader';
import WorkKPIs from './WorkKPIs';
import ScheduleTaskRow from '../schedule/ScheduleTaskRow';
import ScheduleTimeline from '../schedule/ScheduleTimeline';
import { ChevronDown, ChevronRight, Layers, ListFilter, GanttChartSquare } from 'lucide-react';

interface WorkDetailProps {
  work: Work;
  onUpdateWork: (updatedWork: Work) => void;
  onBack: () => void;
}

const WorkDetail: React.FC<WorkDetailProps> = ({ work: initialWork, onUpdateWork, onBack }) => {
  const [work, setWork] = useState<Work>(initialWork);
  const [activeTab, setActiveTab] = useState<'LIST' | 'TIMELINE'>('LIST');
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Initialize expanded state
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    work.schedule.forEach(p => initialExpanded[p.id] = true);
    setExpandedPhases(initialExpanded);
  }, []);

  const handleStatusChange = (newStatus: WorkStatus) => {
    const updated = { ...work, status: newStatus };
    setWork(updated);
    onUpdateWork(updated);
  };

  const handleTaskUpdate = (phaseId: string, taskId: string, updates: Partial<ScheduleTask>) => {
    if (work.status === 'COMPLETED' || work.status === 'CLOSED') return; // Read only if closed

    const newSchedule = work.schedule.map(phase => {
       if (phase.id !== phaseId) return phase;
       return {
          ...phase,
          tasks: phase.tasks.map(task => {
             if (task.id !== taskId) return task;
             return { ...task, ...updates };
          })
       };
    });

    // Recalculate Work Level KPIs based on new task data
    const updatedWork = calculateWorkKPIs({ ...work, schedule: newSchedule });
    setWork(updatedWork);
    onUpdateWork(updatedWork);
  };

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isReadOnly = work.status === 'COMPLETED' || work.status === 'CLOSED';

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in pb-10">
      <WorkHeader work={work} onBack={onBack} onStatusChange={handleStatusChange} />
      
      <WorkKPIs work={work} />

      <div className="p-6 space-y-6">
         {/* View Toggle */}
         <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Layers className="text-[#00609C]" size={20} />
               Cronograma de Execução
            </h2>
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
               <button 
                  onClick={() => setActiveTab('LIST')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'LIST' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <ListFilter size={14} /> Lista
               </button>
               <button 
                  onClick={() => setActiveTab('TIMELINE')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'TIMELINE' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <GanttChartSquare size={14} /> Timeline
               </button>
            </div>
         </div>

         {/* CONTENT */}
         {activeTab === 'TIMELINE' ? (
            <ScheduleTimeline schedule={work.schedule} />
         ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               {/* List Header */}
               <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <div className="col-span-1 text-center">Estado</div>
                  <div className="col-span-4">Tarefa / Fase</div>
                  <div className="col-span-3">Datas Planeadas</div>
                  <div className="col-span-3">Progresso</div>
                  <div className="col-span-1 text-right">Info</div>
               </div>

               {/* Phases & Tasks */}
               <div className="divide-y divide-slate-100">
                  {work.schedule.map(phase => (
                     <div key={phase.id} className="bg-white">
                        {/* Phase Header */}
                        <div 
                           className="flex items-center gap-2 py-3 px-4 cursor-pointer hover:bg-slate-50 transition-colors"
                           onClick={() => togglePhase(phase.id)}
                        >
                           {expandedPhases[phase.id] ? <ChevronDown size={16} className="text-slate-400"/> : <ChevronRight size={16} className="text-slate-400"/>}
                           <span className="font-bold text-slate-800 text-sm">{phase.name}</span>
                           <span className="text-xs text-slate-400 font-normal ml-2">({phase.tasks.length} tarefas)</span>
                        </div>

                        {/* Tasks Body */}
                        {expandedPhases[phase.id] && (
                           <div className="pl-0 bg-slate-50/30">
                              {phase.tasks.map(task => (
                                 <ScheduleTaskRow 
                                    key={task.id} 
                                    task={task} 
                                    readOnly={isReadOnly}
                                    onUpdate={(id, update) => handleTaskUpdate(phase.id, id, update)}
                                 />
                              ))}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default WorkDetail;