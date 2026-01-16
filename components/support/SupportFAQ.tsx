import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden transition-all hover:border-[#34669A]/30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-700 text-sm flex items-center gap-2">
          <HelpCircle size={16} className="text-[#34669A]" />
          {question}
        </span>
        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-sm text-slate-600 bg-slate-50 border-t border-slate-100 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const SupportFAQ: React.FC = () => {
  const faqs = [
    {
      category: "Orçamentos",
      items: [
        { q: "Como aprovar um orçamento?", a: "Para aprovar um orçamento, vá à aba 'Orçamentos', selecione o orçamento desejado e clique no botão 'Aprovar' no canto superior direito. Note que apenas perfis de Administrador ou Gestor podem realizar esta ação." },
        { q: "Posso duplicar um orçamento existente?", a: "Sim. Abra o orçamento que deseja copiar e, no menu de ações laterais, selecione 'Duplicar'. Todos os capítulos e artigos serão copiados para um novo rascunho." }
      ]
    },
    {
      category: "Financeiro & Obras",
      items: [
        { q: "Como criar um Auto de Medição?", a: "Aceda ao menu 'Financeiro', selecione a aba 'Autos de Medição' e clique em 'Novo Auto'. O sistema irá gerar um auto baseado nas quantidades acumuladas aprovadas." },
        { q: "O que acontece quando submeto um RDO?", a: "Ao submeter um RDO (Registo Diário de Obra), o documento fica bloqueado para edição. Os dados de execução atualizam automaticamente o Cronograma, e os recursos são lançados como Custos Reais estimados." }
      ]
    },
    {
      category: "Conta & Acesso",
      items: [
        { q: "Como adicionar um novo colaborador?", a: "Vá ao menu 'Colaboradores' na barra lateral e clique em 'Convidar Colaborador'. Insira o email e defina o nível de permissão (Administrador, Engenheiro, etc.)." },
        { q: "Esqueci a minha palavra-passe.", a: "Na tela de login, clique em 'Esqueceu a palavra-passe?'. Receberá um email com instruções para redefinir o acesso." }
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-800">Perguntas Frequentes</h3>
        <p className="text-slate-500 text-sm mt-1">Respostas rápidas para as dúvidas mais comuns.</p>
      </div>

      {faqs.map((section, idx) => (
        <div key={idx} className="space-y-3">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-200 pb-2 mb-4">
            {section.category}
          </h4>
          {section.items.map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SupportFAQ;