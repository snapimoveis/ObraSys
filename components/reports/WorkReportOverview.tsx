import React from 'react';
import { ReportKPIs } from '../../hooks/useWorkReports';
import { formatCurrency } from '../../utils/financialUtils';
import { FileBarChart, Clock, PieChart, TrendingUp, ArrowRight } from 'lucide-react';

interface Props {
  kpis: ReportKPIs;
  onSelectReport: (type: 'FINANCIAL' | 'SCHEDULE' | 'MARGIN' | 'EXECUTIVE') => void;
}

const ReportCard = ({ title, description, icon: Icon, color, onClick, metric, metricLabel }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between h-48"
  >
    <div>
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-4`}>
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#00609C] transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
    
    <div className="flex justify-between items-end border-t border-slate-50 pt-4 mt-2">
      <div>
        <p className="text-2xl font-bold text-slate-800">{metric}</p>
        <p className="text-xs text-slate-400 font-medium uppercase">{metricLabel}</p>
      </div>
      <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:bg-[#00609C] group-hover:text-white transition-colors">
        <ArrowRight size={16} />
      </div>
    </div>
  </div>
);

const WorkReportOverview: React.FC<Props> = ({ kpis, onSelectReport }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard 
          title="Relatório Financeiro"
          description="Comparativo entre Orçado, Executado e Custos Reais."
          icon={FileBarChart}
          color="bg-blue-500"
          onClick={() => onSelectReport('FINANCIAL')}
          metric={formatCurrency(kpis.earnedValue)}
          metricLabel="Valor Executado"
        />
        <ReportCard 
          title="Relatório de Prazos"
          description="Análise de desvios de cronograma e tarefas críticas."
          icon={Clock}
          color="bg-orange-500"
          onClick={() => onSelectReport('SCHEDULE')}
          metric={kpis.spi.toFixed(2)}
          metricLabel="Índice Desempenho (SPI)"
        />
        <ReportCard 
          title="Análise de Margem"
          description="Rentabilidade por capítulo e desvios de custos."
          icon={PieChart}
          color="bg-green-500"
          onClick={() => onSelectReport('MARGIN')}
          metric={`${kpis.marginPercent.toFixed(1)}%`}
          metricLabel="Margem Atual"
        />
        <ReportCard 
          title="Resumo Executivo"
          description="Visão macro para a administração e cliente."
          icon={TrendingUp}
          color="bg-purple-500"
          onClick={() => onSelectReport('EXECUTIVE')}
          metric={formatCurrency(kpis.invoicedValue)}
          metricLabel="Total Faturado"
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">Insight Rápido</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          A obra apresenta um <strong>SPI de {kpis.spi.toFixed(2)}</strong>, indicando que está {kpis.spi >= 1 ? 'adiantada' : 'atrasada'} face ao planeamento. 
          Financeiramente, o <strong>CPI de {kpis.cpi.toFixed(2)}</strong> sugere que {kpis.cpi >= 1 ? 'estamos a gastar menos que o orçado' : 'os custos estão acima do previsto'} para o trabalho realizado.
        </p>
      </div>
    </div>
  );
};

export default WorkReportOverview;
