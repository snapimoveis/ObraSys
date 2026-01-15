import React from 'react';
import { SchedulePhase } from '../../types';

interface ScheduleTimelineProps {
  schedule: SchedulePhase[];
}

const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ schedule }) => {
  // Helper to determine relative position
  const today = new Date();
  
  // Find min/max for scale
  let minDate = new Date(schedule[0]?.tasks[0]?.startDate || today).getTime();
  let maxDate = new Date(schedule[0]?.tasks[0]?.endDate || today).getTime();

  schedule.forEach(p => p.tasks.forEach(t => {
     const s = new Date(t.startDate).getTime();
     const e = new Date(t.endDate).getTime();
     if(s < minDate) minDate = s;
     if(e > maxDate) maxDate = e;
  }));

  // Add buffer
  const totalDuration = maxDate - minDate;
  if(totalDuration === 0) return null;

  const getPosition = (date: string) => {
     const d = new Date(date).getTime();
     return ((d - minDate) / totalDuration) * 100;
  };

  const getWidth = (start: string, end: string) => {
     const s = new Date(start).getTime();
     const e = new Date(end).getTime();
     return ((e - s) / totalDuration) * 100;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-4">
       <h3 className="font-bold text-slate-700 mb-4 px-2">Linha do Tempo</h3>
       
       <div className="relative min-h-[200px] bg-slate-50 rounded-lg p-4 overflow-x-auto">
          {/* Today Marker */}
          <div 
            className="absolute top-0 bottom-0 border-l-2 border-red-400 z-10 opacity-50 border-dashed"
            style={{ left: `${((today.getTime() - minDate) / totalDuration) * 100}%` }}
            title="Hoje"
          ></div>

          <div className="space-y-6">
             {schedule.map(phase => (
                <div key={phase.id} className="space-y-1">
                   <div className="text-xs font-bold text-slate-400 uppercase mb-1">{phase.name}</div>
                   {phase.tasks.map(task => (
                      <div key={task.id} className="relative h-6 w-full">
                         <div 
                           className={`absolute top-0 h-4 rounded-full shadow-sm text-[10px] text-white flex items-center px-2 truncate cursor-help hover:z-20 transition-all hover:scale-105 ${
                              task.status === 'DONE' ? 'bg-green-500' :
                              task.status === 'DELAYED' ? 'bg-red-400' : 'bg-[#00609C]'
                           }`}
                           style={{ 
                              left: `${getPosition(task.startDate)}%`,
                              width: `${Math.max(getWidth(task.startDate, task.endDate), 2)}%` // min width 2%
                           }}
                           title={`${task.name}: ${task.progress}%`}
                         >
                            {task.name}
                         </div>
                      </div>
                   ))}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default ScheduleTimeline;