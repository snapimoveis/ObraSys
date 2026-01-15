import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { generateTaskChecklist } from '../services/geminiService';
import { Plus, Calendar, User, MoreVertical, Sparkles, X, Clock, Loader2, Percent } from 'lucide-react';

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
    case 'MEDIUM': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
  }
};

interface TaskCardProps {
  task: Task;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onUpdateProgress: (taskId: string, newProgress: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onMoveTask, onUpdateProgress }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-2">
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
        {task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
      </span>
      <div className="relative group-hover:block hidden">
          {/* Simple Status Changer for Demo */}
          <select 
            value={task.status}
            onChange={(e) => onMoveTask(task.id, e.target.value as TaskStatus)}
            className="text-xs border border-slate-300 rounded bg-white p-1 outline-none"
          >
            <option value="TODO">A Fazer</option>
            <option value="IN_PROGRESS">Em Curso</option>
            <option value="DONE">Concluído</option>
          </select>
      </div>
    </div>
    
    <h4 className="font-semibold text-slate-800 mb-1">{task.title}</h4>
    <p className="text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded whitespace-pre-line">
      {task.description || "Sem descrição."}
    </p>

    {/* Progress Section */}
    <div className="mb-3">
      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
        <span className="font-medium">Progresso</span>
        <span>{task.progress}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
        <div 
          className={`h-1.5 rounded-full transition-all duration-500 ${
            task.progress === 100 ? 'bg-green-500' : 'bg-[#00609C]'
          }`} 
          style={{ width: `${task.progress}%` }}
        ></div>
      </div>
      {/* Interactive slider hidden by default, shown on hover */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={task.progress}
        onChange={(e) => onUpdateProgress(task.id, parseInt(e.target.value))}
        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
      <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">
            {task.assignee.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <span className="text-xs text-slate-500 truncate max-w-[70px]">{task.project}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium" title={`Prazo: ${task.dueDate}`}>
            <Calendar size={12} />
            {new Date(task.dueDate).toLocaleDateString('pt-PT', {day: '2-digit', month: '2-digit'})}
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-[10px]" title={`Criado em: ${new Date(task.createdAt).toLocaleDateString('pt-PT')}`}>
            <Clock size={10} />
            {new Date(task.createdAt).toLocaleDateString('pt-PT', {day: '2-digit', month: '2-digit'})}
        </div>
      </div>
    </div>
  </div>
);

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Instalar Quadro Elétrico',
      description: '• Verificar esquema unifilar\n• Fixar caixa\n• Ligar disjuntores conforme projeto',
      project: 'Vila Nova',
      assignee: 'João Ferreira',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: '2023-11-20',
      progress: 0,
      createdAt: '2023-11-01'
    },
    {
      id: '2',
      title: 'Pintura Fachada Norte',
      description: 'Aplicar primário e duas demãos de tinta acrílica.',
      project: 'Reab. Centro',
      assignee: 'Ana Silva',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: '2023-11-25',
      progress: 45,
      createdAt: '2023-11-05'
    },
    {
      id: '3',
      title: 'Compra de Cerâmicas',
      description: 'Encomendar revestimento WC Suite.',
      project: 'Apt. Silva',
      assignee: 'Carlos Mendes',
      status: 'DONE',
      priority: 'LOW',
      dueDate: '2023-11-10',
      progress: 100,
      createdAt: '2023-10-20'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // New Task State
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    project: 'Vila Nova',
    assignee: 'Carlos Mendes',
    priority: 'MEDIUM',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'TODO',
    progress: 0
  });

  const generateChecklist = async () => {
    if (!newTask.title) return;
    setLoadingAI(true);
    const checklist = await generateTaskChecklist(newTask.title);
    setNewTask(prev => ({ ...prev, description: checklist }));
    setLoadingAI(false);
  };

  const handleCreateTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || '',
      project: newTask.project!,
      assignee: newTask.assignee!,
      status: 'TODO',
      priority: newTask.priority as TaskPriority,
      dueDate: newTask.dueDate!,
      progress: newTask.progress || 0,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, task]);
    setIsModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      project: 'Vila Nova',
      assignee: 'Carlos Mendes',
      priority: 'MEDIUM',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'TODO',
      progress: 0
    });
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const updateProgress = (taskId: string, newProgress: number) => {
    // Validate range 0-100
    const validProgress = Math.min(100, Math.max(0, newProgress));
    setTasks(tasks.map(t => t.id === taskId ? { ...t, progress: validProgress } : t));
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tarefas de Equipa</h1>
          <p className="text-slate-500">Gestão e atribuição de atividades por obra.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 h-full min-w-[800px]">
          {/* TODO Column */}
          <div className="flex-1 flex flex-col bg-slate-100 rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
              <span>A Fazer</span>
              <span className="bg-slate-200 text-slate-600 px-2 rounded-full text-xs">{tasks.filter(t => t.status === 'TODO').length}</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {tasks.filter(t => t.status === 'TODO').map(task => (
                <TaskCard key={task.id} task={task} onMoveTask={moveTask} onUpdateProgress={updateProgress} />
              ))}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div className="flex-1 flex flex-col bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center justify-between">
              <span>Em Curso</span>
              <span className="bg-blue-200 text-blue-700 px-2 rounded-full text-xs">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
                <TaskCard key={task.id} task={task} onMoveTask={moveTask} onUpdateProgress={updateProgress} />
              ))}
            </div>
          </div>

          {/* DONE Column */}
          <div className="flex-1 flex flex-col bg-green-50 rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center justify-between">
              <span>Concluído</span>
              <span className="bg-green-200 text-green-700 px-2 rounded-full text-xs">{tasks.filter(t => t.status === 'DONE').length}</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {tasks.filter(t => t.status === 'DONE').map(task => (
                <TaskCard key={task.id} task={task} onMoveTask={moveTask} onUpdateProgress={updateProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Nova Tarefa</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Tarefa</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: Instalar Loiças Sanitárias"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium text-slate-700">Descrição / Checklist</label>
                   <button 
                     onClick={generateChecklist}
                     disabled={!newTask.title || loadingAI}
                     className="text-xs flex items-center gap-1 text-secondary-600 hover:text-secondary-700 font-medium disabled:opacity-50"
                   >
                     {loadingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                     Gerar com IA
                   </button>
                </div>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none text-sm"
                  placeholder="Detalhes da tarefa..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Projeto</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none bg-white text-sm"
                    value={newTask.project}
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                  >
                    <option value="Vila Nova">Vila Nova</option>
                    <option value="Reab. Centro">Reab. Centro</option>
                    <option value="Apt. Silva">Apt. Silva</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
                   <select 
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none bg-white text-sm"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  >
                    <option value="Carlos Mendes">Carlos Mendes</option>
                    <option value="Ana Silva">Ana Silva</option>
                    <option value="João Ferreira">João Ferreira</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                   <select 
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none bg-white text-sm"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as TaskPriority})}
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Progresso (%)</label>
                   <div className="relative">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        className="w-full border border-slate-300 rounded-lg p-2.5 pl-9 outline-none text-sm"
                        value={newTask.progress}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setNewTask({...newTask, progress: val});
                        }}
                      />
                      <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   </div>
                </div>
              </div>
              
              <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Prazo</label>
                   <input 
                    type="date"
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none text-sm"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
              </div>

              <button 
                onClick={handleCreateTask}
                disabled={!newTask.title}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;