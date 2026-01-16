import React, { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Budgeting from './components/Budgeting';
import SiteManagement from './components/SiteManagement';
import Schedule from './components/Schedule';
import Team from './components/Team';
import Compliance from './components/Compliance';
import Approvals from './components/Approvals';
import Financial from './components/Financial';
import Reports from './components/Reports';
import Prices from './components/Prices';
import Articles from './components/Articles';
import Plans from './components/Plans';
import CompanyManagement from './components/CompanyManagement';
import ProfileModal from './components/ProfileModal';
import TaskManagement from './components/TaskManagement';
import Support from './components/Support';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { useSession } from './contexts/SessionContext';
import { Menu, Bell, Settings, Search, ChevronLeft, User, Building2, LogOut, Loader2, AlertCircle } from 'lucide-react';

const VIEW_LABELS: Record<View, string> = {
  [View.DASHBOARD]: 'Painel de Controlo',
  [View.BUDGETING]: 'Orçamentos',
  [View.SITE_MANAGEMENT]: 'Obras',
  [View.SCHEDULE]: 'Cronograma',
  [View.TEAM]: 'Colaboradores',
  [View.COMPLIANCE]: 'Conformidade',
  [View.APPROVALS]: 'Gestão de Aprovações',
  [View.FINANCIAL]: 'Financeiro',
  [View.REPORTS]: 'Relatórios',
  [View.PLANS]: 'Nossos Planos',
  [View.PRICES]: 'Base de Preços',
  [View.ARTICLES]: 'Artigos de Trabalho',
  [View.AUTOMATION]: 'Automação & Inteligência',
  [View.COMPANY_SETTINGS]: 'Gestão da Empresa',
  [View.TASKS]: 'Tarefas de Equipa',
  [View.INVOICING]: 'Faturação',
  [View.SUPPORT]: 'Suporte',
};

const App: React.FC = () => {
  const { user, companyId, loading, error, logout } = useSession();
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isRegisterView, setIsRegisterView] = useState(false);
  
  // Profile State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 1. Loading state (Bootstrap)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-[#00609C] mb-4" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">A carregar o sistema...</p>
      </div>
    );
  }

  // 2. Auth Flow (Login/Register)
  if (!user || (!companyId && !isRegisterView)) {
    if (isRegisterView) {
      return <Register onRegister={() => setIsRegisterView(false)} onNavigateToLogin={() => setIsRegisterView(false)} />;
    }
    return <Login onLogin={() => {}} onNavigateToRegister={() => setIsRegisterView(true)} />;
  }

  // 3. Fallback for account not configured
  if (user && !companyId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <AlertCircle className="text-orange-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-800">Conta Não Configurada</h2>
        <p className="text-slate-500 max-w-md mt-2">
          O seu utilizador existe mas não está associado a nenhuma empresa. 
          Contacte o suporte ou tente registar-se novamente.
        </p>
        <button onClick={logout} className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg font-bold">Terminar Sessão</button>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.BUDGETING: return <Budgeting />;
      case View.SITE_MANAGEMENT: return <SiteManagement />;
      case View.SCHEDULE: return <Schedule />;
      case View.TASKS: return <TaskManagement />;
      case View.TEAM: return <Team />;
      case View.COMPLIANCE: return <Compliance setCurrentView={setCurrentView} />;
      case View.APPROVALS: return <Approvals />;
      case View.FINANCIAL: return <Financial />;
      case View.REPORTS: return <Reports />;
      case View.PLANS: return <Plans />;
      case View.PRICES: return <Prices />;
      case View.ARTICLES: return <Articles />;
      case View.COMPANY_SETTINGS: return <CompanyManagement />;
      case View.SUPPORT: return <Support />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
             <div className="hidden md:flex items-center text-sm text-slate-500">
               <span className="font-bold text-[#00609C]">ObraSys</span>
               <ChevronLeft size={16} className="mx-2 rotate-180 text-slate-300" />
               <span className="text-slate-800 font-medium">
                 {VIEW_LABELS[currentView]}
               </span>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 font-medium text-lg border border-slate-200 transition-colors"
              >
                {user?.email?.charAt(0).toUpperCase()}
              </button>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-slate-100">
                      <p className="font-bold text-slate-800 text-sm truncate">{user?.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Admin da Conta</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => { setIsProfileModalOpen(true); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                        <User size={16} /><span>Perfil</span>
                      </button>
                      <button onClick={() => { setCurrentView(View.COMPANY_SETTINGS); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                        <Building2 size={16} /><span>Gestão da Empresa</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left">
                        <LogOut size={16} /><span>Terminar Sessão</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto h-full">
            {renderContent()}
          </div>
        </main>

        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    </div>
  );
};

export default App;