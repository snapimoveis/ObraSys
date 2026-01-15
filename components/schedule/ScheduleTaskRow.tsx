import React from 'react';
import { ScheduleTask } from '../../types';
import { Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ScheduleTaskRowProps {
  task: ScheduleTask;
  readOnly: boolean;
  onUpdate: (taskId: string, field: Partial<ScheduleTask>) => void;
}

const ScheduleTaskRow: React.FC<ScheduleTaskRowProps> = ({ task, readOnly, onUpdate }) => {
  
  const statusColors = {
    'PENDING': 'bg-slate-100 text-slate-500',
    'IN_PROGRESS': 'bg-blue-100 text-blue-700',
    'DONE': 'bg-green-100 text-green-700',
    'DELAYED': 'bg-red-100 text-red-700'
  };

  return (
    <div className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-slate-50 hover:bg-slate-50 transition-colors items-center text-sm group">
      {/* Status Indicator */}
      <div className="col-span-1 flex justify-center">
         <div className={`w-2 h-2 rounded-full ${
            task.status === 'DONE' ? 'bg-green-500' :
            task.status === 'DELAYED' ? 'bg-red-500' :
            task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-slate-300'
         }`}></div>
      </div>

      {/* Name */}
      <div className="col-span-4 font-medium text-slate-700 truncate" title={task.name}>
        {task.name}
      </div>

      {/* Dates */}
      <div className="col-span-3 flex items-center gap-2">
        <input 
          type="date" 
          disabled={readOnly}
          value={task.startDate}
          onChange={(e) => onUpdate(task.id, { startDate: e.target.value })}
          className="bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-300 rounded px-1 py-0.5 text-xs text-slate-600 outline-none transition-all w-28"
        />
        <span className="text-slate-300">→</span>
        <input 
          type="date" 
          disabled={readOnly}
          value={task.endDate}
          onChange={(e) => onUpdate(task.id, { endDate: e.target.value })}
          className="bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-300 rounded px-1 py-0.5 text-xs text-slate-600 outline-none transition-all w-28"
        />
      </div>

      {/* Progress Slider */}
      <div className="col-span-3 flex items-center gap-3">
         <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative group/slider">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${task.status === 'DELAYED' ? 'bg-red-500' : 'bg-[#00609C]'}`} 
              style={{ width: `${task.progress}%` }}
            ></div>
            {!readOnly && (
               <input 
                type="range" 
                min="0" 
                max="100" 
                value={task.progress}
                onChange={(e) => onUpdate(task.id, { progress: parseInt(e.target.value) })}
                className="absolute inset-0 opacity-0 cursor-pointer"
               />
            )}
         </div>
         <span className="text-xs font-bold text-slate-700 w-8 text-right">{task.progress}%</span>
      </div>

      {/* Status Badge */}
      <div className="col-span-1 text-right">
         {task.status === 'DELAYED' && <AlertCircle size={16} className="text-red-500 ml-auto" />}
         {task.status === 'DONE' && <CheckCircle2 size={16} className="text-green-500 ml-auto" />}
      </div>
    </div>
  );
};

export default ScheduleTaskRow;