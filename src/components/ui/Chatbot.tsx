'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente da XTAGE. Como posso ajudar com sua inscrição, pagamentos ou dúvidas sobre o regulamento?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Formata todo o historico no prompt 
      let fullPrompt = "Histórico do chat:\n";
      newMessages.forEach(m => {
        fullPrompt += `${m.role === 'user' ? 'Usuário' : 'Você'}: ${m.content}\n`;
      });
      fullPrompt += "\nResponda agora ao último prompt dentro do contexto.";

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, encontrei um erro ao tentar responder.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro de conexão.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center border-0 p-0"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-[#0A0A0A] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neon-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">XTAGE AI</h3>
                <p className="text-[10px] text-zinc-400">Powered by Gemini</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-zinc-400 hover:text-white rounded-full" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050505]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-neon-gradient flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none ml-8' 
                    : 'bg-zinc-900 border border-zinc-800 rounded-tl-none mr-8'
                }`}>
                  {msg.role === 'user' ? (
                     <p className="text-sm">{msg.content}</p>
                  ) : (
                     <div className="text-sm text-zinc-300 markdown-body prose prose-invert max-w-none prose-p:leading-snug prose-p:mb-2 prose-last:mb-0">
                       <Markdown>{msg.content}</Markdown>
                     </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-gradient flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl rounded-tl-none flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-col gap-2 pl-11">
                <button 
                  onClick={() => handleSend("Como enviar a música da minha coreografia?")}
                  className="text-xs text-left bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 p-2 rounded-lg transition-colors"
                >
                  Como enviar a música da minha coreografia?
                </button>
                <button 
                  onClick={() => handleSend("Onde vejo minhas notas do último festival?")}
                  className="text-xs text-left bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 p-2 rounded-lg transition-colors"
                >
                  Onde vejo minhas notas do último festival?
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2 items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
              placeholder="Digite sua dúvida..." 
              className="flex-1 bg-black border border-zinc-800 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white p-0 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
