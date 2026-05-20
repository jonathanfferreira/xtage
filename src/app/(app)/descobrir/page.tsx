import React from 'react';
import { Search } from 'lucide-react';

export default function DescobrirPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="font-title text-3xl font-black uppercase tracking-tighter mb-6">Descobrir</h1>
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Busque por festivais, escolas ou bailarinos..." 
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full pl-12 pr-4 py-4 font-tech tracking-widest text-white focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
        <p className="font-tech tracking-widest uppercase mb-2">Em breve</p>
        <p className="text-sm font-sans">A busca global será ativada na próxima fase.</p>
      </div>
    </div>
  );
}
