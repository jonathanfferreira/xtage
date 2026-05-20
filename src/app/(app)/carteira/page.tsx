import React from 'react';
import { Ticket, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CarteiraPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="font-title text-3xl font-black uppercase tracking-tighter mb-2">Carteira</h1>
      <p className="text-zinc-400 font-sans text-sm mb-8">Seus ingressos e credenciais para os festivais.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mock Ticket */}
        <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-900/50 p-4 gap-4 xp-clip-card">
          <div className="w-16 h-16 bg-white rounded flex items-center justify-center p-1">
            <QrCode className="w-full h-full text-black" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-title font-bold uppercase">Sessão da Tarde</h4>
            <p className="text-xs text-zinc-400 font-sans">Festival de Dança LID 2026</p>
            <p className="text-xs text-purple-400 font-tech tracking-widest mt-1 uppercase">1x Inteira • R$ 45,00</p>
          </div>
          <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800 font-tech tracking-widest uppercase text-[10px]">Ver</Button>
        </div>
      </div>
    </div>
  );
}
