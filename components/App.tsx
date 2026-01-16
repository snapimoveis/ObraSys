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
import { Menu, Bell, Settings, Search, ChevronLeft, User, Building2, LogOut } from 'lucide-react';

type AuthView = 'LOGIN' | 'REGISTER' | 'APP';

const App: React.FC = () => {
  const [currentAuthView, setCurrentAuthView] = useState<AuthView>('LOGIN');
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Profile State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Authentication Flow
  if (currentAuthView === 'LOGIN') {
    return (
      <Login 
        onLogin={() => setCurrentAuthView('APP')} 
        onNavigateToRegister={() => setCurrentAuthView('REGISTER')} 
      />
    );
  }

  if (currentAuthView === 'REGISTER') {
    return (
      <Register 
        onRegister={() => setCurrentAuthView('APP')} 
        onNavigateToLogin={() => setCurrentAuthView('LOGIN')} 
      />
    );
  }

  // Main Application Flow
  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.BUDGETING:
        return <Budgeting />;
      case View.SITE_MANAGEMENT:
        return <SiteManagement />;
      case View.SCHEDULE:
        return <Schedule />;
      case View.TASKS:
        return <TaskManagement />;
      case View.TEAM:
        return <Team />;
      case View.COMPLIANCE:
        return <Compliance setCurrentView={setCurrentView} />;
      case View.APPROVALS:
         return <Approvals />;
      case View.FINANCIAL:
        return <Financial />;
      case View.REPORTS:
        return <Reports />;
      case View.PLANS:
        return <Plans />;
      case View.PRICES:
        return <Prices />;
      case View.ARTICLES:
        return <Articles />;
      case View.COMPANY_SETTINGS:
        return <CompanyManagement />;
      case View.SUPPORT:
        return <Support />;
      case View.INVOICING:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold">Módulo de Faturação</h2>
            <p>Em desenvolvimento (Integração Moloni)</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-white rounded-xl border border-slate-200 m-4">
             <div className="text-6xl mb-4 text-slate-200">🛠️</div>
             <h2 className="text-xl font-semibold text-slate-600">Página em Construção</h2>
             <p className="text-sm">A vista {currentView} será implementada brevemente.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb / Title area */}
             <div className="hidden md:flex items-center text-sm text-slate-500">
               <span className="font-bold text-[#00609C]">Obra Sys</span>
               <ChevronLeft size={16} className="mx-2 rotate-180" />
               <span className="text-slate-800 font-medium">
                 {currentView === View.DASHBOARD ? 'Painel de Controlo' : 
                  currentView === View.COMPANY_SETTINGS ? 'Gestão da Empresa' :
                  currentView === View.SUPPORT ? 'Centro de Suporte' :
                  'Área de Trabalho'}
               </span>
             </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar (Hidden on mobile) */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none outline-none text-sm text-slate-600 w-full placeholder-slate-400"
              />
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
              <Settings size={20} />
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 font-medium text-lg border border-slate-200 transition-colors focus:ring-2 focus:ring-[#00609C] focus:ring-offset-2"
              >
                S
              </button>

              {isProfileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-slate-100">
                      <p className="font-bold text-slate-800 text-sm">snapimoveis</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">snapimoveis@gmail.com</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
                      >
                        <User size={16} />
                        <span>Perfil</span>
                      </button>
                      <button 
                        onClick={() => {
                          setCurrentView(View.COMPANY_SETTINGS);
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
                      >
                        <Building2 size={16} />
                        <span>Gestão da Empresa</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-slate-100">
                      <button 
                        onClick={() => {
                          setCurrentAuthView('LOGIN');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left"
                      >
                        <LogOut size={16} />
                        <span>Terminar Sessão</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-white md:bg-transparent">
          <div className="max-w-[1600px] mx-auto h-full">
            {renderContent()}
          </div>
        </main>

        {/* Profile Modal */}
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      </div>
    </div>
  );
};

export default App;