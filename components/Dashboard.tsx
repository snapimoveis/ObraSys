import React from 'react';
import { 
  HardHat, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  CheckSquare, 
  Plus, 
  Users, 
  Calculator, 
  Upload, 
  CreditCard, 
  RefreshCw,
  Clock,
  ArrowRight,
  MoreVertical,
  Briefcase
} from 'lucide-react';

// Mock Data
const stats = {
  activeProjects: "12",
  overdueProjects: "2",
  pendingReports: "5",
  scheduledTasks: "8",
  pendingApprovals: "3"
};

const activeProjects = [
  { id: 1, name: "Reabilitação Vila Nova", client: "João Silva", status: "Em Curso", progress: 65, dueDate: "2023-12-15" },
  { id: 2, name: "Escritórios TechHub", client: "TechCorp SA", status: "Planeamento", progress: 15, dueDate: "2024-02-20" },
  { id: 3, name: "Vivenda Algarve", client: "Maria Santos", status: "Atrasado", progress: 42, dueDate: "2023-11-30" },
];

const recentReports = [
  { id: 1, title: "Diário de Obra #45", project: "Reabilitação Vila Nova", author: "Carlos Mendes", time: "2h atrás", type: "Diário" },
  { id: 2, title: "Insp. Segurança", project: "Escritórios TechHub", author: "Ana Silva", time: "Ontem", type: "Segurança" },
  { id: 3, title: "Medição Mensal", project: "Vivenda Algarve", author: "Pedro Costa", time: "2 dias atrás", type: "Medição" },
];

const notifications = [
  { id: 1, text: "Aprovação de orçamento pendente para Vila Nova", time: "30 min", type: "warning" },
  { id: 2, text: "Entrega de materiais atrasada (Cimento)", time: "2h", type: "alert" },
  { id: 3, text: "Novo colaborador adicionado à equipa", time: "1 dia", type: "info" },
];

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, iconColorClass }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 min-w-[200px] hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={18} className={iconColorClass} />
      </div>
    </div>
    <p className="text-xs text-slate-400 mt-2 font-medium">
      {subtext}
    </p>
  </div>
);

const ActionButton = ({ icon: Icon, label, primary = false }: { icon: any, label: string, primary?: boolean }) => (
  <button className={`
    flex flex-col items-center justify-center p-4 rounded-xl border transition-all h-24 gap-2 w-full
    ${primary 
      ? 'bg-[#00609C] border-[#00609C] text-white hover:bg-[#005082]' 
      : 'bg-white border-slate-200 text-slate-600 hover:border-[#00609C] hover:text-[#00609C] hover:shadow-sm'}
  `}>
    <Icon size={24} />
    <span className="text-xs font-medium text-center">{label}</span>
  </button>
);

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "";
  switch(status) {
    case 'Em Curso': styles = "bg-blue-100 text-blue-700"; break;
    case 'Planeamento': styles = "bg-slate-100 text-slate-700"; break;
    case 'Atrasado': styles = "bg-red-100 text-red-700"; break;
    case 'Concluído': styles = "bg-green-100 text-green-700"; break;
    default: styles = "bg-slate-100 text-slate-700";
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${styles}`}>
      {status}
    </span>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#00609C]">Bem-vindo, snapimoveis@gmail.com</h1>
        <p className="text-slate-500">Aqui está o resumo da sua atividade hoje.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Obras Ativas" 
          value={stats.activeProjects} 
          subtext="+2 esta semana" 
          icon={HardHat} 
          colorClass="bg-blue-50"
          iconColorClass="text-blue-600"
        />
        <StatCard 
          title="Obras em Atraso" 
          value={stats.overdueProjects} 
          subtext="-1 desde ontem" 
          icon={AlertTriangle} 
          colorClass="bg-orange-50"
          iconColorClass="text-orange-600"
        />
        <StatCard 
          title="Relatórios Pendentes" 
          value={stats.pendingReports} 
          subtext="requerem atenção" 
          icon={FileText} 
          colorClass="bg-purple-50"
          iconColorClass="text-purple-600"
        />
        <StatCard 
          title="Tarefas Agendadas" 
          value={stats.scheduledTasks} 
          subtext="esta semana" 
          icon={Calendar} 
          colorClass="bg-green-50"
          iconColorClass="text-green-600"
        />
        <StatCard 
          title="Aprovações Pendentes" 
          value={stats.pendingApprovals} 
          subtext="requer ação" 
          icon={CheckSquare} 
          colorClass="bg-red-50"
          iconColorClass="text-red-600"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Projects Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Briefcase size={20} className="text-[#00609C]" />
                Obras em Curso
              </h2>
              <button className="text-sm text-[#00609C] font-medium hover:underline flex items-center gap-1">
                Ver Todas <ArrowRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Obra</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Progresso</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Prazo</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{project.name}</p>
                        <p className="text-xs text-slate-500">ID: #{1000 + project.id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{project.client}</td>
                      <td className="px-6 py-4"><StatusBadge status={project.status} /></td>
                      <td className="px-6 py-4 w-32">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${project.status === 'Atrasado' ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-medium text-slate-600">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(project.dueDate).toLocaleDateString('pt-PT')}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-[#00609C]">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Reports List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-[#00609C]" />
                Relatórios Recentes
              </h2>
              <button className="text-sm text-slate-500 hover:text-[#00609C] border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 transition-colors">
                Filtrar
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{report.title}</p>
                      <p className="text-xs text-slate-500">{report.project} • Por {report.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">{report.type}</span>
                    <span className="text-xs text-slate-400">{report.time}</span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-[#00609C]" />
                  </div>
                </div>
              ))}
            </div>
             <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
              <button className="text-sm text-[#00609C] font-medium hover:underline">Ver todos os relatórios</button>
            </div>
          </div>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plus size={20} className="text-[#00609C]" />
              <h2 className="text-lg font-semibold text-slate-800">Ações Rápidas</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={HardHat} label="Nova Obra" primary />
              <ActionButton icon={Users} label="Utilizadores" />
              <ActionButton icon={Calculator} label="Orçamento" />
              <ActionButton icon={FileText} label="Relatório" />
              <ActionButton icon={Upload} label="Importar" />
              <ActionButton icon={CreditCard} label="Planos" />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-800">Notificações</h2>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
              </div>
              <button className="text-slate-400 hover:text-[#00609C] transition-colors">
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
               {notifications.map((notif) => (
                 <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors">
                   <div className="flex gap-3">
                     <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.type === 'alert' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                     <div>
                       <p className="text-sm text-slate-700 leading-snug">{notif.text}</p>
                       <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                         <Clock size={10} /> {notif.time}
                       </p>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
             <div className="p-3 text-center border-t border-slate-100">
               <button className="text-xs text-slate-500 hover:text-[#00609C]">Marcar todas como lidas</button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;