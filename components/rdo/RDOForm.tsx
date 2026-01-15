import React, { useState } from 'react';
import { RDO, ScheduleTask, Work, CostType, RDOResource, RDOExecution, RDOOccurrence } from '../../types';
import { Save, Lock, ArrowLeft, Plus, Trash2, Calendar, Sun, Cloud, CloudRain, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  rdo: RDO;
  work: Work;
  onUpdate: (field: keyof RDO, value: any) => void;
  onSave: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const RDOForm: React.FC<Props> = ({ rdo, work, onUpdate, onSave, onSubmit, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'EXECUTION' | 'RESOURCES' | 'OCCURRENCES'>('GENERAL');

  // --- SUB-HANDLERS ---
  
  // Execution Handlers
  const addExecution = () => {
    const newExec: RDOExecution = {
      id: Date.now().toString(),
      scheduleTaskId: '',
      taskName: '',
      percentageIncrement: 0,
      notes: ''
    };
    onUpdate('execution', [...rdo.execution, newExec]);
  };

  const updateExecution = (id: string, field: keyof RDOExecution, value: any) => {
    onUpdate('execution', rdo.execution.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExecution = (id: string) => {
    onUpdate('execution', rdo.execution.filter(e => e.id !== id));
  };

  // Resource Handlers
  const addResource = () => {
    const newRes: RDOResource = {
      id: Date.now().toString(),
      type: 'LABOR',
      description: '',
      quantity: 1
    };
    onUpdate('resources', [...rdo.resources, newRes]);
  };

  const updateResource = (id: string, field: keyof RDOResource, value: any) => {
    onUpdate('resources', rdo.resources.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeResource = (id: string) => {
    onUpdate('resources', rdo.resources.filter(r => r.id !== id));
  };

  // Occurrence Handlers
  const addOccurrence = () => {
    const newOcc: RDOOccurrence = {
      id: Date.now().toString(),
      type: 'OTHER',
      description: '',
      impactLevel: 'LOW',
      critical: false
    };
    onUpdate('occurrences', [...rdo.occurrences, newOcc]);
  };

  const updateOccurrence = (id: string, field: keyof RDOOccurrence, value: any) => {
    onUpdate('occurrences', rdo.occurrences.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const removeOccurrence = (id: string) => {
    onUpdate('occurrences', rdo.occurrences.filter(o => o.id !== id));
  };

  // Flatten tasks for selection
  const allTasks = work.schedule.flatMap(p => p.tasks);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      
      {/* HEADER */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">RDO #{rdo.number} <span className="text-slate-400 font-normal">| Rascunho</span></h2>
            <p className="text-xs text-slate-500">Editando registo de {new Date(rdo.date).toLocaleDateString('pt-PT')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onSave} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 flex items-center gap-2">
            <Save size={16} /> Guardar
          </button>
          <button onClick={onSubmit} className="px-4 py-2 bg-[#00609C] text-white rounded-lg font-bold text-sm hover:bg-[#005082] flex items-center gap-2 shadow-sm">
            <Lock size={16} /> Submeter
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 px-6 pt-2 gap-6 bg-white">
        <button onClick={() => setActiveTab('GENERAL')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'GENERAL' ? 'border-[#00609C] text-[#00609C]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Geral</button>
        <button onClick={() => setActiveTab('EXECUTION')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'EXECUTION' ? 'border-[#00609C] text-[#00609C]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Execução</button>
        <button onClick={() => setActiveTab('RESOURCES')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'RESOURCES' ? 'border-[#00609C] text-[#00609C]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Recursos</button>
        <button onClick={() => setActiveTab('OCCURRENCES')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'OCCURRENCES' ? 'border-[#00609C] text-[#00609C]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Ocorrências</button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        
        {/* TAB: GENERAL */}
        {activeTab === 'GENERAL' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar size={18} /> Dados Gerais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data do Registo</label>
                  <input 
                    type="date" 
                    value={rdo.date.split('T')[0]} 
                    onChange={(e) => onUpdate('date', e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Responsável</label>
                  <input 
                    type="text" 
                    value={rdo.responsible} 
                    onChange={(e) => onUpdate('responsible', e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Sun size={18} /> Climatologia</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Manhã</label>
                  <select 
                    value={rdo.weatherMorning}
                    onChange={(e) => onUpdate('weatherMorning', e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                  >
                    <option value="SUNNY">Sol</option>
                    <option value="CLOUDY">Nublado</option>
                    <option value="RAIN">Chuva</option>
                    <option value="STORM">Tempestade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tarde</label>
                  <select 
                    value={rdo.weatherAfternoon}
                    onChange={(e) => onUpdate('weatherAfternoon', e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                  >
                    <option value="SUNNY">Sol</option>
                    <option value="CLOUDY">Nublado</option>
                    <option value="RAIN">Chuva</option>
                    <option value="STORM">Tempestade</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observações Gerais</label>
              <textarea 
                value={rdo.observations || ''}
                onChange={(e) => onUpdate('observations', e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-sm h-32"
                placeholder="Observações adicionais, visitas, etc."
              />
            </div>
          </div>
        )}

        {/* TAB: EXECUTION */}
        {activeTab === 'EXECUTION' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 items-start">
               <div className="bg-blue-200 p-2 rounded-full text-blue-700"><CheckCircle2 size={16} /></div>
               <div>
                 <h4 className="font-bold text-blue-800 text-sm">Integração com Cronograma</h4>
                 <p className="text-xs text-blue-600">Ao registar o avanço aqui, o cronograma será atualizado automaticamente após submissão.</p>
               </div>
            </div>

            {rdo.execution.map((item, idx) => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex gap-4 items-start">
                <span className="text-xs font-bold text-slate-400 mt-2">#{idx+1}</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tarefa do Cronograma</label>
                    <select 
                      className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                      value={item.scheduleTaskId}
                      onChange={(e) => {
                        const task = allTasks.find(t => t.id === e.target.value);
                        updateExecution(item.id, 'scheduleTaskId', e.target.value);
                        updateExecution(item.id, 'taskName', task?.name || '');
                      }}
                    >
                      <option value="">Selecione...</option>
                      {allTasks.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.progress}%)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Avanço Hoje (%)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="0" max="100"
                        className="w-full border border-slate-300 rounded p-2 text-sm font-bold"
                        value={item.percentageIncrement}
                        onChange={(e) => updateExecution(item.id, 'percentageIncrement', parseFloat(e.target.value))}
                      />
                      <span className="text-sm font-bold text-slate-600">%</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas de Execução</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-300 rounded p-2 text-sm"
                      placeholder="Detalhes sobre a execução..."
                      value={item.notes}
                      onChange={(e) => updateExecution(item.id, 'notes', e.target.value)}
                    />
                  </div>
                </div>
                <button onClick={() => removeExecution(item.id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button onClick={addExecution} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold hover:border-[#00609C] hover:text-[#00609C] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} /> Adicionar Execução
            </button>
          </div>
        )}

        {/* TAB: RESOURCES */}
        {activeTab === 'RESOURCES' && (
          <div className="space-y-4">
             <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex gap-3 items-start">
               <div className="bg-orange-200 p-2 rounded-full text-orange-700"><CheckCircle2 size={16} /></div>
               <div>
                 <h4 className="font-bold text-orange-800 text-sm">Controlo de Custos</h4>
                 <p className="text-xs text-orange-700">Estes recursos serão registados como custos reais estimados no módulo financeiro.</p>
               </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Descrição / Recurso</th>
                    <th className="px-4 py-3 w-24">Qtd</th>
                    <th className="px-4 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rdo.resources.map(res => (
                    <tr key={res.id}>
                      <td className="px-4 py-2">
                        <select 
                          className="border border-slate-300 rounded p-1 text-xs bg-white w-full"
                          value={res.type}
                          onChange={(e) => updateResource(res.id, 'type', e.target.value)}
                        >
                          <option value="LABOR">Mão de Obra</option>
                          <option value="EQUIPMENT">Equipamento</option>
                          <option value="MATERIAL">Material</option>
                          <option value="SUBCONTRACT">Subempreitada</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="text" 
                          className="border border-slate-300 rounded p-1 text-xs w-full"
                          placeholder="Ex: Servente, Grua..."
                          value={res.description}
                          onChange={(e) => updateResource(res.id, 'description', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number" 
                          className="border border-slate-300 rounded p-1 text-xs w-full text-center font-medium"
                          value={res.quantity}
                          onChange={(e) => updateResource(res.id, 'quantity', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => removeResource(res.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 border-t border-slate-100">
                <button onClick={addResource} className="text-xs font-bold text-[#00609C] hover:underline flex items-center gap-1">
                  <Plus size={14} /> Adicionar Linha
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: OCCURRENCES */}
        {activeTab === 'OCCURRENCES' && (
          <div className="space-y-4">
             {rdo.occurrences.some(o => o.critical) && (
               <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex gap-3 items-start animate-pulse">
                 <AlertTriangle size={20} className="text-red-600 mt-1" />
                 <div>
                   <h4 className="font-bold text-red-800 text-sm">Alerta de Conformidade</h4>
                   <p className="text-xs text-red-700">Ocorrências críticas geram automaticamente registos de não-conformidade.</p>
                 </div>
               </div>
             )}

             {rdo.occurrences.map(occ => (
               <div key={occ.id} className={`bg-white p-4 rounded-lg border shadow-sm flex flex-col gap-3 ${occ.critical ? 'border-red-300' : 'border-slate-200'}`}>
                 <div className="flex justify-between items-start">
                   <div className="flex gap-4 items-center">
                     <select 
                        className="border border-slate-300 rounded p-1.5 text-xs font-bold bg-white"
                        value={occ.type}
                        onChange={(e) => updateOccurrence(occ.id, 'type', e.target.value)}
                     >
                       <option value="DELAY">Atraso</option>
                       <option value="ACCIDENT">Acidente</option>
                       <option value="NON_COMPLIANCE">Não Conformidade</option>
                       <option value="VISIT">Visita</option>
                       <option value="OTHER">Outro</option>
                     </select>
                     
                     <div className="flex items-center gap-2">
                       <label className="text-xs font-medium text-slate-500">Impacto:</label>
                       <select 
                          className="border border-slate-300 rounded p-1 text-xs bg-white"
                          value={occ.impactLevel}
                          onChange={(e) => updateOccurrence(occ.id, 'impactLevel', e.target.value)}
                       >
                         <option value="LOW">Baixo</option>
                         <option value="MEDIUM">Médio</option>
                         <option value="HIGH">Alto</option>
                         <option value="CRITICAL">Crítico</option>
                       </select>
                     </div>
                   </div>
                   
                   <button onClick={() => removeOccurrence(occ.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                 </div>

                 <textarea 
                    className="w-full border border-slate-300 rounded p-2 text-sm h-20 resize-none"
                    placeholder="Descreva a ocorrência..."
                    value={occ.description}
                    onChange={(e) => updateOccurrence(occ.id, 'description', e.target.value)}
                 />

                 <label className="flex items-center gap-2 cursor-pointer w-fit">
                   <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                      checked={occ.critical}
                      onChange={(e) => updateOccurrence(occ.id, 'critical', e.target.checked)}
                   />
                   <span className={`text-xs font-bold ${occ.critical ? 'text-red-600' : 'text-slate-500'}`}>Marcar como Crítico (Gera Não-Conformidade)</span>
                 </label>
               </div>
             ))}

             <button onClick={addOccurrence} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                <Plus size={20} /> Adicionar Ocorrência
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RDOForm;
