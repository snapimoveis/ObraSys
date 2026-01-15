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
    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[200px]"
  >
    <div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5 shadow-sm`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#00609C] transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
    </div>
    
    <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-4">
      <div>
        <p className="text-2xl font-bold text-gray-900">{metric}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{metricLabel}</p>
      </div>
      <div className="p-2 bg-gray-50 rounded-full text-gray-400 group-hover:bg-[#00609C] group-hover:text-white transition-all transform group-hover:translate-x-1">
        <ArrowRight size={18} />
      </div>
    </div>
  </div>
);

const WorkReportOverview: React.FC<Props> = ({ kpis, onSelectReport }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard 
          title="Relatório Financeiro"
          description="Comparativo detalhado entre Orçado, Executado e Custos Reais."
          icon={FileBarChart}
          color="bg-blue-600"
          onClick={() => onSelectReport('FINANCIAL')}
          metric={formatCurrency(kpis.earnedValue)}
          metricLabel="Valor Executado"
        />
        <ReportCard 
          title="Relatório de Prazos"
          description="Análise de desvios de cronograma e identificação de tarefas críticas."
          icon={Clock}
          color="bg-orange-500"
          onClick={() => onSelectReport('SCHEDULE')}
          metric={kpis.spi.toFixed(2)}
          metricLabel="Índice Desempenho (SPI)"
        />
        <ReportCard 
          title="Análise de Margem"
          description="Rentabilidade por capítulo e controle de desvios de custos."
          icon={PieChart}
          color="bg-green-600"
          onClick={() => onSelectReport('MARGIN')}
          metric={`${kpis.marginPercent.toFixed(1)}%`}
          metricLabel="Margem Atual"
        />
        <ReportCard 
          title="Resumo Executivo"
          description="Visão macro consolidada para a administração e cliente."
          icon={TrendingUp}
          color="bg-purple-600"
          onClick={() => onSelectReport('EXECUTIVE')}
          metric={formatCurrency(kpis.invoicedValue)}
          metricLabel="Total Faturado"
        />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-8 shadow-sm">
        <h3 className="font-bold text-blue-900 mb-2 text-lg">Insight Rápido</h3>
        <p className="text-blue-800 text-sm leading-relaxed max-w-4xl">
          A obra apresenta um <strong>SPI de {kpis.spi.toFixed(2)}</strong>, indicando que está {kpis.spi >= 1 ? 'adiantada' : 'atrasada'} face ao planeamento. 
          Financeiramente, o <strong>CPI de {kpis.cpi.toFixed(2)}</strong> sugere que {kpis.cpi >= 1 ? 'estamos a gastar menos que o orçado' : 'os custos estão acima do previsto'} para o trabalho realizado.
        </p>
      </div>
    </div>
  );
};

export default WorkReportOverview;