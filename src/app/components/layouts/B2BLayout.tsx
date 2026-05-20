'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { UserCircle, Compass, Ticket, Settings, Bell, ChevronDown, Calendar, Search, User, Building, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/lib/profile-store';

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { activeProfile, setActiveProfile } = useProfileStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const navItems = [
    { icon: Compass, label: 'Painel Geral', href: '/' },
    { icon: Ticket, label: 'Ingressos & Vendas', href: '/carteira' },
    { icon: Calendar, label: 'Meu Calendário', href: '/calendario' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Background Holographic Haze */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Desktop Sidebar (Left) */}
      <aside className="w-64 border-r border-zinc-900 hidden md:flex flex-col relative z-20 bg-[#050505]/80 xp-glass">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-900/50">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        
        {/* Profile Context Switcher */}
        <div className="p-4 relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 p-3 rounded-xl flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neon-gradient p-0.5">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">Jonathan Ferreira</p>
                <p className="text-[10px] xp-eyebrow text-purple-400 mt-1 capitalize">Modo {activeProfile}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </button>

          {/* Dropdown Profile */}
          {isProfileOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-black border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 space-y-1">
                <p className="text-[10px] xp-eyebrow text-zinc-500 px-2 py-1">Alternar Visão</p>
                <button 
                  onClick={() => { setActiveProfile('bailarino'); setIsProfileOpen(false); }}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-900 transition-colors flex items-center gap-2", activeProfile === 'bailarino' ? 'text-purple-400' : 'text-zinc-300')}
                >
                  <User className="w-4 h-4" /> Conta Pessoal
                </button>
                <button 
                  onClick={() => { setActiveProfile('diretor'); setIsProfileOpen(false); }}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-900 transition-colors flex items-center gap-2", activeProfile === 'diretor' ? 'text-pink-400' : 'text-zinc-300')}
                >
                  <Building className="w-4 h-4" /> Escola de Dança
                </button>
                <button 
                  onClick={() => { setActiveProfile('organizador'); setIsProfileOpen(false); }}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-900 transition-colors flex items-center gap-2", activeProfile === 'organizador' ? 'text-orange-400' : 'text-zinc-300')}
                >
                  <Briefcase className="w-4 h-4" /> Produção de Eventos
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-tech tracking-widest text-sm uppercase",
                  isActive 
                    ? "bg-zinc-900 text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-purple-400" : "text-zinc-500")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
        <header className="h-16 border-b border-zinc-900/50 flex items-center justify-between px-4 md:px-8 xp-glass sticky top-0 z-40">
          <h1 className="font-tech text-xl tracking-widest text-white uppercase">Painel de Gestão</h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
