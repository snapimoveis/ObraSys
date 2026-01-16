import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { chatWithSupportAgent } from '../../services/geminiService';
import { ChatMessage } from '../../types';

const SupportChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou o Assistente Oficial do ObraSys. Como posso ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for the service
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await chatWithSupportAgent(history, userMsg.text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Desculpe, ocorreu um erro momentâneo. Por favor tente novamente.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <div className="bg-[#34669A]/10 p-2 rounded-lg">
          <Bot size={20} className="text-[#34669A]" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Assistente ObraSys</h3>
          <p className="text-xs text-slate-500">IA Powered • Disponível 24/7</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-slate-200' : 'bg-[#34669A] text-white'}
            `}>
              {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-none' 
                : 'bg-[#34669A] text-white rounded-tl-none'}
            `}>
              <p className="whitespace-pre-line">{msg.text}</p>
              <p className={`text-[10px] mt-2 opacity-70 text-right`}>
                {msg.timestamp.toLocaleTimeString('pt-PT', {hour: '2-digit', minute: '2-digit'})}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-[#34669A] text-white flex items-center justify-center">
               <Bot size={16} />
             </div>
             <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
               <Loader2 size={16} className="animate-spin text-[#34669A]" />
               <span className="text-xs text-slate-500">A processar...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite a sua mensagem..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[#34669A] focus:ring-1 focus:ring-[#34669A] transition-all placeholder-slate-400"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-[#34669A] text-white rounded-md hover:bg-[#2a527a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          A IA pode cometer erros. Verifique informações críticas nos manuais oficiais.
        </p>
      </div>
    </div>
  );
};

export default SupportChat;
