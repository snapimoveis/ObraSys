import React from 'react';
import { Check, Star, Zap, Building2, ShieldCheck, HelpCircle, Mail, Phone } from 'lucide-react';

const Plans: React.FC = () => {
  const plans = [
    {
      id: 'starter',
      name: 'Iniciante',
      description: 'Perfeito para pequenos projetos',
      price: '49',
      period: '/mês',
      features: [
        'Até 5 obras ativas',
        '2 utilizadores',
        'Orçamentação básica',
        'Relatórios diários',
        'Portal do cliente',
        'Suporte por email'
      ],
      cta: 'Selecionar Plano',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Profissional',
      description: 'Para equipas em crescimento',
      price: '99',
      period: '/mês',
      features: [
        'Obras ilimitadas',
        '10 utilizadores',
        'Orçamentação avançada',
        'Relatórios diários + fotos',
        'Livro de obra digital',
        'Portal do cliente',
        'Gestão documental',
        'Planeamento de tarefas',
        'Suporte prioritário'
      ],
      cta: 'Selecionar Plano',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Empresa',
      description: 'Para grandes organizações',
      price: 'Personalizado',
      period: '',
      features: [
        'Tudo do plano Profissional',
        'Utilizadores ilimitados',
        'Integrações personalizadas',
        'IA para orçamentação',
        'Relatórios avançados',
        'Suporte dedicado 24/7',
        'Treino da equipa',
        'SLA garantida'
      ],
      cta: 'Contactar Vendas',
      popular: false,
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-[#00609C]">Gestão de Assinatura</h1>
        <p className="text-slate-500 mt-1">Gerir o seu plano de assinatura, faturação e atualizar para funcionalidades premium.</p>
      </div>

      {/* Plan Toggle / Status Bar */}
      <div className="bg-white rounded-xl p-1.5 border border-slate-200 flex justify-between items-center max-w-4xl mx-auto shadow-sm">
        <div className="flex-1 text-center py-2 text-sm font-medium text-slate-400">Plano Atual (Trial)</div>
        <div className="w-px h-6 bg-slate-200"></div>
        <div className="flex-1 text-center py-2 text-sm font-bold text-[#00609C] bg-blue-50 rounded-lg shadow-sm">Planos Disponíveis</div>
      </div>

      <div className="text-center mt-8 mb-4">
        <h2 className="text-xl font-bold text-slate-800">Escolher Plano</h2>
        <p className="text-slate-500 text-sm mt-1">Selecione o plano que melhor se adequa às suas necessidades.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative bg-white rounded-2xl flex flex-col h-full transition-all duration-300
              ${plan.popular 
                ? 'border-2 border-[#00609C] shadow-lg scale-100 md:scale-105 z-10' 
                : 'border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200'}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00609C] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                Mais Popular
              </div>
            )}

            <div className="p-8 text-center border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">{plan.description}</p>
              
              <div className="flex items-center justify-center gap-1">
                {plan.price !== 'Personalizado' && <span className="text-2xl text-slate-400 font-light">€</span>}
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500 self-end mb-1 text-sm">{plan.period}</span>
              </div>
            </div>

            <div className="p-8 flex-grow">
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${plan.popular ? 'bg-blue-100 text-[#00609C]' : 'bg-green-100 text-green-600'}`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 pt-0 mt-auto">
              <button 
                className={`
                  w-full py-3 rounded-xl font-bold text-sm transition-all duration-200
                  ${plan.popular 
                    ? 'bg-[#00609C] hover:bg-[#005082] text-white shadow-md hover:shadow-lg' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-[#00609C] hover:text-[#00609C]'}
                `}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Contact Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Building2 size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Precisa de algo personalizado?</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-lg mx-auto">
              Contacte-nos para soluções empresariais personalizadas com preços especiais, integrações à medida e gestor de conta dedicado.
            </p>
            <button className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium px-6 py-2.5 rounded-lg transition-colors text-sm">
              <Mail size={16} />
              Contactar Vendas
            </button>
          </div>
        </div>
      </div>

      {/* FAQ / Trust Badges (Optional Polish) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <ShieldCheck className="text-slate-400" size={24} />
          <span className="text-xs text-slate-500">Pagamento Seguro SSL</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Zap className="text-slate-400" size={24} />
          <span className="text-xs text-slate-500">Cancelamento a qualquer altura</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <HelpCircle className="text-slate-400" size={24} />
          <span className="text-xs text-slate-500">Suporte Especializado</span>
        </div>
      </div>

    </div>
  );
};

export default Plans;