import React, { useState } from 'react';
import { SiteReport } from '../types';
import { structureSiteReport } from '../services/geminiService';
import { Mic, FileText, Calendar, AlertCircle, Sun, Loader2 } from 'lucide-react';

const SiteReports: React.FC = () => {
  const [reports, setReports] = useState<SiteReport[]>([
    {
      id: '1',
      date: new Date().toISOString(),
      author: 'Ana Silva',
      rawNotes: 'Dia normal.',
      summary: 'Execução de alvenarias no piso 1. Equipa de 4 pedreiros. Entrega de tijolo atrasou 1 hora.',
      issues: ['Atraso entrega material'],
      weather: 'Céu limpo, 22ºC'
    }
  ]);

  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateReport = async () => {
    if (!notes) return;
    setIsProcessing(true);

    const aiResult = await structureSiteReport(notes);

    const newReport: SiteReport = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      author: 'Carlos Mendes',
      rawNotes: notes,
      summary: aiResult.summary,
      issues: aiResult.issues,
      weather: aiResult.weather
    };

    setReports([newReport, ...reports]);
    setNotes('');
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Diário de Obra Digital</h1>
          <p className="text-slate-500">Transforme notas rápidas em relatórios formais.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Area */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Mic size={20} className="text-secondary-500" />
              Novo Registo (Simulação de Voz)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Escreva como se estivesse a ditar. A IA vai estruturar, corrigir o português e identificar problemas.
            </p>
            <textarea
              className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary-500 outline-none resize-none text-sm"
              placeholder="Ex: Hoje choveu de manhã, tivemos de parar a betonagem. O eletricista chegou às 14h para passar os tubos no teto falso. Faltou cimento..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              onClick={handleCreateReport}
              disabled={isProcessing || !notes}
              className={`
                w-full mt-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 text-white transition-colors
                ${isProcessing || !notes ? 'bg-slate-300 cursor-not-allowed' : 'bg-secondary-500 hover:bg-secondary-600'}
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processando IA...</span>
                </>
              ) : (
                <>
                  <FileText size={20} />
                  <span>Gerar Relatório</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">Histórico de Relatórios</h3>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {new Date(report.date).toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500">Autor: {report.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100">
                    <Sun size={14} />
                    {report.weather}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700">Resumo das Atividades:</h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                    {report.summary}
                  </p>
                </div>

                {report.issues.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-red-600 flex items-center gap-2 mb-2">
                      <AlertCircle size={16} />
                      Ocorrências / Bloqueios:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 pl-2">
                      {report.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400 italic">Notas originais: "{report.rawNotes}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteReports;