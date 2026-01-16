import React, { useState } from 'react';
import { Plus, BarChart3, Building2, ArrowLeft } from 'lucide-react';
import FinancialExecutionOverview from './financial-execution/FinancialExecutionOverview';
import MeasurementList from './measurements/MeasurementList';
import MeasurementDetail from './measurements/MeasurementDetail';
import RealCostList from './real-costs/RealCostList';
import RealCostForm from './real-costs/RealCostForm';
import RealCostSummary from './real-costs/RealCostSummary';
import FinanceOverview from './finance/FinanceOverview'; // Global View
import { createWorkFromBudget } from '../utils/workUtils';
import { useMeasurements } from '../hooks/useMeasurements';
import { useRealCosts } from '../hooks/useRealCosts';
import { Measurement } from '../types';

// Mocks for Demo (Project Specific Data)
const mockBudget: any = {
  id: '1',
  reference: 'ORC-2023-001',
  title: 'Moradia V4 - Cascais',
  client: 'Ana Pereira',
  projectLocation: 'Cascais, Lisboa',
  totalPrice: 450000,
  chapters: [
    { 
        id: 'c1', 
        name: 'Estaleiro e Trabalhos Preparatórios', 
        totalPrice: 20000,
        subChapters: [
            { 
                id: 's1', 
                name: 'Montagem de Estaleiro', 
                totalPrice: 5000,
                items: [{ id: 'i1', description: 'Vedação', unitCost: 1000, quantity: 1, totalPrice: 1500, marginPercent: 50 }] 
            }, 
            { 
                id: 's2', 
                name: 'Movimento de Terras', 
                totalPrice: 15000,
                items: [{ id: 'i2', description: 'Escavação', unitCost: 10000, quantity: 1, totalPrice: 15000, marginPercent: 50 }]
            }
        ], 
        items: [] 
    },
    { 
        id: 'c2', 
        name: 'Estruturas', 
        totalPrice: 120000,
        subChapters: [
            { 
                id: 's3', 
                name: 'Betão Armado', 
                totalPrice: 120000,
                items: [{ id: 'i3', description: 'Betão C25/30', unitCost: 80000, quantity: 1, totalPrice: 120000, marginPercent: 50 }]
            }
        ], 
        items: [] 
    }
  ]
};

const mockWork = createWorkFromBudget(mockBudget);
// Simulate some progress
mockWork.schedule[0].tasks[0].progress = 100; // Estaleiro Done
mockWork.schedule[0].tasks[1].progress = 50; // Terras 50%
mockWork.schedule[1].tasks[0].progress = 10; // Estrutura 10%

const Financial: React.FC = () => {
  const [viewScope, setViewScope] = useState<'GLOBAL' | 'PROJECT'>('GLOBAL');
  const [activeTab, setActiveTab] = useState<'EXECUTION' | 'REAL_COSTS' | 'AUTOS' | 'INVOICING' | 'REPORTS'>('EXECUTION');
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [isCostFormOpen, setIsCostFormOpen] = useState(false);
  
  // Hooks
  const { measurements, createAuto, updateMeasurement } = useMeasurements(mockWork.id, mockBudget);
  const { costs, addCost, deleteCost, stats } = useRealCosts(mockWork.id);

  const handleCreateAuto = async () => {
    const newAuto = await createAuto();
    if (newAuto) setSelectedMeasurement(newAuto);
  };

  const handleSelectAuto = (m: Measurement) => {
    setSelectedMeasurement(m);
  };

  // --- PROJECT DETAIL RENDERING ---
  const renderProjectView = () => {
    if (activeTab === 'AUTOS' && selectedMeasurement) {
      return (
        <MeasurementDetail 
          measurement={selectedMeasurement}
          budget={mockBudget}
          onUpdate={updateMeasurement}
          onBack={() => setSelectedMeasurement(null)}
        />
      );
    }

    return (
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setViewScope('GLOBAL')}
               className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
               title="Voltar à Visão Global"
             >
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">{mockBudget.title}</h1>
                <p className="text-slate-500 text-sm">Controlo financeiro detalhado da obra.</p>
             </div>
          </div>
          
          {activeTab === 'REAL_COSTS' && (
            <button 
              onClick={() => setIsCostFormOpen(true)}
              className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              <span>Registar Despesa</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex w-full md:w-auto overflow-x-auto">
            <button 
               onClick={() => setActiveTab('EXECUTION')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'EXECUTION' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Execução vs Orçamento
            </button>
            <button 
               onClick={() => setActiveTab('REAL_COSTS')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'REAL_COSTS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Custos Reais
            </button>
            <button 
               onClick={() => setActiveTab('AUTOS')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'AUTOS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Autos de Medição
            </button>
        </div>

        {/* Content */}
        {activeTab === 'EXECUTION' && (
          <div className="space-y-6">
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <BarChart3 className="text-blue-600 mt-1" size={20} />
                <div>
                   <h4 className="font-bold text-blue-800 text-sm">Visão do Projeto</h4>
                   <p className="text-xs text-blue-600 mt-1">
                     A visualizar dados financeiros em tempo real baseados no progresso físico do cronograma e registo de despesas.
                   </p>
                </div>
             </div>
             <FinancialExecutionOverview budget={mockBudget} work={mockWork} />
          </div>
        )}

        {activeTab === 'REAL_COSTS' && (
          <div className="space-y-6">
             <RealCostSummary stats={stats} />
             <RealCostList costs={costs} onDelete={deleteCost} />
          </div>
        )}

        {activeTab === 'AUTOS' && (
          <MeasurementList 
            measurements={measurements} 
            onCreate={handleCreateAuto} 
            onSelect={handleSelectAuto}
          />
        )}

        {isCostFormOpen && (
          <RealCostForm 
            workId={mockWork.id}
            budget={mockBudget}
            onSave={addCost}
            onClose={() => setIsCostFormOpen(false)}
          />
        )}
      </div>
    );
  };

  // --- GLOBAL VIEW RENDERING ---
  if (viewScope === 'GLOBAL') {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
         {/* Global Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <div className="flex items-center gap-2">
                  <Building2 size={24} className="text-[#00609C]" />
                  <h1 className="text-2xl font-bold text-slate-800">Financeiro Global</h1>
               </div>
               <p className="text-slate-500 text-sm mt-1">Visão consolidada da tesouraria e resultados da empresa.</p>
            </div>
         </div>

         <FinanceOverview onSelectProject={(id) => {
            // In a real app, we would fetch the specific project data here.
            // For this demo, we just switch to the mock work view.
            setViewScope('PROJECT');
         }} />
      </div>
    );
  }

  return renderProjectView();
};

export default Financial;