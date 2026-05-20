import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarioPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="font-title text-3xl font-black uppercase tracking-tighter mb-2">Meu Calendário</h1>
      <p className="text-zinc-400 font-sans text-sm mb-8">Acompanhe os próximos eventos da sua agenda.</p>
      
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-50 border border-zinc-800 border-dashed rounded-xl xp-clip-card bg-zinc-900/20">
        <CalendarIcon className="w-12 h-12 mb-4 text-zinc-500" />
        <p className="font-tech tracking-widest uppercase mb-2">Nenhum evento próximo</p>
        <p className="text-sm font-sans text-zinc-400 max-w-sm">Você ainda não tem nenhum ensaio de palco, apresentação ou evento confirmado na sua agenda.</p>
      </div>
    </div>
  );
}
