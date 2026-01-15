import React from 'react';
import { View } from '../types';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  Calculator, 
  HardHat, 
  Calendar, 
  Users, 
  FileCheck, 
  CheckSquare, 
  Wallet, 
  FileText, 
  Settings, 
  Database, 
  Briefcase, 
  Zap, 
  LogOut,
  Bolt,
  LifeBuoy
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Painel de Controlo', icon: LayoutDashboard },
    { id: View.BUDGETING, label: 'Orçamentos', icon: Calculator },
    { id: View.SITE_MANAGEMENT, label: 'Obras', icon: HardHat },
    { id: View.SCHEDULE, label: 'Cronograma', icon: Calendar },
    { id: View.TEAM, label: 'Colaboradores', icon: Users },
    { id: View.COMPLIANCE, label: 'Conformidade', icon: FileCheck },
    { id: View.APPROVALS, label: 'Gestão de Aprovações', icon: CheckSquare },
    { id: View.FINANCIAL, label: 'Financeiro', icon: Wallet },
    { id: View.REPORTS, label: 'Relatórios', icon: FileText },
    { id: View.PLANS, label: 'Nossos Planos', icon: Settings },
    { id: View.PRICES, label: 'Base de Preços', icon: Database },
    { id: View.ARTICLES, label: 'Artigos de Trabalho', icon: Briefcase },
    { id: View.AUTOMATION, label: 'Automação & Inteligência', icon: Zap },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-slate-200 text-slate-600 transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        {/* Header Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 flex-shrink-0">
          <Logo className="h-6 w-auto text-[#00609C]" />
        </div>

        {/* User Profile Section */}
        <div className="p-6 pb-2 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
            S
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">snapimoveis</p>
            <p className="text-xs text-slate-500">Cliente</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Plano: Trialing</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-white flex-shrink-0">
          {/* Trial Widget */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Bolt size={16} className="text-blue-600 fill-blue-600" />
              <span className="text-xs font-bold text-slate-800">Trial Gratuito</span>
              <span className="ml-auto bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">10d</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-1.5">10 dias restantes</p>
            <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-1/3 rounded-full"></div>
            </div>
          </div>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium">
            <LifeBuoy size={18} />
            <span>Suporte</span>
          </button>

          <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;