import React, { useState } from 'react';
import { Mail, MessageSquare, Ticket, FileQuestion, ExternalLink, Bot, LifeBuoy } from 'lucide-react';
import SupportChat from './support/SupportChat';
import SupportTickets from './support/SupportTickets';
import SupportFAQ from './support/SupportFAQ';

type SupportTab = 'CHAT' | 'TICKETS' | 'FAQ' | 'WHATSAPP';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SupportTab>('CHAT');

  const cards = [
    {
      id: 'chat',
      title: 'Assistente IA',
      desc: 'Assistência inteligente 24/7',
      icon: Bot,
      action: () => setActiveTab('CHAT'),
      btnText: 'Ver Chat IA',
      btnStyle: 'primary'
    },
    {
      id: 'tickets',
      title: 'Tickets de Suporte',
      desc: 'Sistema organizado de suporte',
      icon: Ticket,
      action: () => setActiveTab('TICKETS'),
      btnText: 'Gerir Tickets',
      btnStyle: 'outline'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      desc: 'Contacto direto via WhatsApp',
      icon: MessageSquare,
      action: () => window.open('https://wa.me/351912345678', '_blank'),
      btnText: 'Abrir WhatsApp',
      btnStyle: 'outline'
    },
    {
      id: 'email',
      title: 'Email',
      desc: 'Resposta em até 24 horas',
      icon: Mail,
      action: () => window.location.href = 'mailto:suporte@obrasys.pt',
      btnText: 'suporte@obrasys.pt',
      btnStyle: 'outline'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Centro de Suporte</h1>
          <p className="text-slate-500 text-sm">Ajuda, documentação e contacto direto</p>
        </div>
        <a 
          href="mailto:suporte@obrasys.pt" 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
        >
          <Mail size={16} />
          suporte@obrasys.pt
        </a>
      </div>

      {/* Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between items-center text-center h-56 transition-all hover:shadow-md"
          >
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-slate-50 text-[#34669A] mb-3">
                <card.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-xs text-slate-500">{card.desc}</p>
            </div>
            
            <button
              onClick={card.action}
              className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
                card.btnStyle === 'primary' 
                  ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white' 
                  : 'bg-white border border-slate-300 text-slate-600 hover:border-slate-400'
              }`}
            >
              {card.btnText}
            </button>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-8 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('CHAT')}
             className={`py-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'CHAT' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             Chat IA
           </button>
           <button 
             onClick={() => setActiveTab('TICKETS')}
             className={`py-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'TICKETS' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             Tickets
           </button>
           <button 
             onClick={() => setActiveTab('FAQ')}
             className={`py-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'FAQ' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             FAQ
           </button>
           <button 
             onClick={() => window.open('https://wa.me/351912345678', '_blank')}
             className={`py-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap border-transparent text-slate-500 hover:text-slate-700`}
           >
             WhatsApp
           </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'CHAT' && (
            <div className="max-w-5xl mx-auto">
              <SupportChat />
            </div>
          )}
          {activeTab === 'TICKETS' && <SupportTickets />}
          {activeTab === 'FAQ' && <SupportFAQ />}
        </div>
      </div>
    </div>
  );
};

export default Support;
