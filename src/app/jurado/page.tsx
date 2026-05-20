'use client';

import React from 'react';
import JudgeView from '../components/views/JudgeView';
import { Button } from '@/components/ui/button';
import { LogOut, ClipboardList, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JuradoDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar Layout */}
      <aside className="w-64 bg-[#050505] border-r border-zinc-900 hidden md:flex flex-col">
        <Link href="/" className="p-6 border-b border-zinc-900 flex items-center gap-3 hover:bg-zinc-900/50 transition-colors">
          <div className="w-8 h-8 rounded bg-neon-gradient flex items-center justify-center font-bold text-white tracking-widest text-lg">
            X
          </div>
          <span className="text-xl font-bold tracking-tight text-white">XTAGE</span>
        </Link>
        
        <div className="p-4 flex-1">
          <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Área do Jurado</p>
          <nav className="space-y-1">
            <Button 
              variant="ghost"
              className="w-full justify-start bg-zinc-900 text-white"
            >
              <ClipboardList className="w-4 h-4 mr-3" /> Fila de Avaliação
            </Button>
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-900">
           <Link href="/">
             <Button variant="outline" className="w-full justify-start bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-900 mb-4 border-dashed">
               <LayoutDashboard className="w-4 h-4 mr-2" /> Voltar ao Hub
             </Button>
           </Link>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-900/50 mt-1">
            <LogOut className="w-4 h-4 mr-3" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden p-4 border-b border-zinc-900 flex justify-between items-center bg-[#050505] flex-wrap gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-neon-gradient flex items-center justify-center font-bold text-white text-xs">
              X
            </div>
            <span className="font-bold">XTAGE</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400">
              Sair
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto relative">
           <JudgeView />
        </div>
      </main>
    </div>
  );
}
