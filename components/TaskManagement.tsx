import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, ChecklistItem } from '../types';
import { generateTaskChecklist } from '../services/geminiService';
import { Plus, Calendar, User, MoreVertical, Sparkles, X, Clock, Loader2, Percent, CheckSquare, Square } from 'lucide-react';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, QuerySnapshot } from 'firebase/firestore';

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
  onToggleChecklist: (taskId: string, itemId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onMoveTask, onUpdateProgress, onToggleChecklist }) => (
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
    
    {task.description && (
      <p className="text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded whitespace-pre-line">
        {task.description}
      </p>
    )}

    {/* Checklist Section */}
    {task.checklist && task.checklist.length > 0 && (
      <div className="mb-3 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Checklist IA</p>
        {task.checklist.map(item => (
          <div 
            key={item.id} 
            className="flex items-start gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors group/item"
            onClick={() => onToggleChecklist(task.id, item.id)}
          >
            <div className={`mt-0.5 ${item.completed ? 'text-green-500' : 'text-slate-300 group-hover/item:text-slate-400'}`}>
              {item.completed ? <CheckSquare size={14} /> : <Square size={14} />}
            </div>
            <span className={`text-xs leading-tight ${item.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    )}

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
      {/* Interactive slider hidden by default, shown on hover, only if no checklist (manual override) */}
      {(!task.checklist || task.checklist.length === 0) && (
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={task.progress}
          onChange={(e) => onUpdateProgress(task.id, parseInt(e.target.value))}
          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
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
      </div>
    </div>
  </div>
);

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const companyId = getCurrentCompanyId();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // New Task State
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    checklist: [],
    project: 'Geral',
    assignee: 'Eu',
    priority: 'MEDIUM',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'TODO',
    progress: 0
  });

  useEffect(() => {
    if (!companyId) return;

    const q = query(collection(db, 'tasks'), where('companyId', '==', companyId));
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  // Generates Checklist and populates the checklist array instead of just description
  const generateChecklist = async () => {
    if (!newTask.title) return;
    setLoadingAI(true);
    
    // Call API
    const checklistText = await generateTaskChecklist(newTask.title);
    
    // Parse response: Split lines, remove bullets/numbers, filter empty
    const items: ChecklistItem[] = checklistText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: line.replace(/^[\d\.\-\•\*]+\s*/, ''), // Remove bullet points or numbers
        completed: false
      }));

    setNewTask(prev => ({ 
      ...prev, 
      checklist: items,
      // If description is empty, maybe put a default message or leave it
      description: prev.description || 'Tarefa gerada com assistência IA' 
    }));
    setLoadingAI(false);
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !companyId) return;
    
    try {
        await addDoc(collection(db, 'tasks'), {
            companyId,
            title: newTask.title!,
            description: newTask.description || '',
            checklist: newTask.checklist || [],
            project: newTask.project!,
            assignee: newTask.assignee!,
            status: 'TODO',
            priority: newTask.priority as TaskPriority,
            dueDate: newTask.dueDate!,
            progress: newTask.progress || 0,
            createdAt: new Date().toISOString()
        });

        setIsModalOpen(false);
        setNewTask({
            title: '',
            description: '',
            checklist: [],
            project: 'Geral',
            assignee: 'Eu',
            priority: 'MEDIUM',
            dueDate: new Date().toISOString().split('T')[0],
            status: 'TODO',
            progress: 0
        });
    } catch (e) {
        console.error("Error creating task:", e);
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
  };

  const updateProgress = async (taskId: string, newProgress: number) => {
    const validProgress = Math.min(100, Math.max(0, newProgress));
    await updateDoc(doc(db, 'tasks', taskId), { progress: validProgress });
  };

  const toggleChecklistItem = async (taskId: string, itemId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.checklist) return;

    const updatedChecklist = task.checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    // Auto-calculate progress
    const completedCount = updatedChecklist.filter(i => i.completed).length;
    const progress = Math.round((completedCount / updatedChecklist.length) * 100);

    // Auto-update status based on progress
    let status = task.status;
    if (progress === 100) status = 'DONE';
    else if (progress > 0 && status === 'TODO') status = 'IN_PROGRESS';

    await updateDoc(doc(db, 'tasks', taskId), {
        checklist: updatedChecklist,
        progress,
        status
    });
  };

  const removeNewTaskChecklistItem = (itemId: string) => {
    setNewTask(prev => ({
      ...prev,
      checklist: prev.checklist?.filter(i => i.id !== itemId)
    }));
  };

  if (loading) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-[#00609C]" /></div>;
  }

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col animate-fade-in">
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
                <TaskCard key={task.id} task={task} onMoveTask={moveTask} onUpdateProgress={updateProgress} onToggleChecklist={toggleChecklistItem} />
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
                <TaskCard key={task.id} task={task} onMoveTask={moveTask} onUpdateProgress={updateProgress} onToggleChecklist={toggleChecklistItem} />
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
                <TaskCard key={task.id} task={task} onMoveTask={moveTask} onUpdateProgress={updateProgress} onToggleChecklist={toggleChecklistItem} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800">Nova Tarefa</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none text-sm"
                  placeholder="Detalhes adicionais..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>

              {/* AI Checklist Section */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-bold text-slate-700 flex items-center gap-1">
                     <Sparkles size={14} className="text-secondary-500" /> Checklist IA
                   </label>
                   <button 
                     onClick={generateChecklist}
                     disabled={!newTask.title || loadingAI}
                     className="text-xs bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-100 font-medium disabled:opacity-50 text-slate-600 flex items-center gap-1"
                   >
                     {loadingAI ? <Loader2 size={10} className="animate-spin" /> : 'Gerar Passos'}
                   </button>
                </div>
                
                {newTask.checklist && newTask.checklist.length > 0 ? (
                  <div className="space-y-1">
                    {newTask.checklist.map((item) => (
                      <div key={item.id} className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200 text-xs">
                        <Square size={14} className="text-slate-300 mt-0.5" />
                        <span className="flex-1 text-slate-700">{item.text}</span>
                        <button onClick={() => removeNewTaskChecklistItem(item.id)} className="text-slate-300 hover:text-red-500"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-2">
                    Clique em "Gerar Passos" para criar uma checklist automática baseada no título.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Projeto</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none bg-white text-sm"
                    value={newTask.project}
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                  >
                    <option value="Geral">Geral</option>
                    {/* In a real app, populate from Works */}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
                   <select 
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none bg-white text-sm"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  >
                    <option value="Eu">Eu</option>
                    <option value="Equipa">Equipa</option>
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
                   <label className="block text-sm font-medium text-slate-700 mb-1">Prazo</label>
                   <input 
                    type="date"
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none text-sm"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
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