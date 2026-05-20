'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { UserCircle, Search, Ticket, ChevronDown, Menu, User, Building, Briefcase, LogOut, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/lib/profile-store';
import { useAuthModal } from '@/lib/auth-modal-store';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function DiscoveryLayout({ children }: { children: React.ReactNode }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { activeProfile, setActiveProfile } = useProfileStore();
  const { open: openAuthModal } = useAuthModal();
  const router = useRouter();

  // Observa estado de autenticação em tempo real
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
  };

  const handleCreateEvent = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setActiveProfile('organizador');
    router.push('/novo-evento');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Visitante';

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-[#050505]/90 backdrop-blur-md border-b border-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

          {/* Logo & Main Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 mt-1">
              <Logo />
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-sm font-tech tracking-widest uppercase text-white hover:text-purple-400 transition-colors">
                Início
              </Link>
              <Link href="/descobrir" className="text-sm font-tech tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">
                Eventos
              </Link>
              <Link href="/calendario" className="text-sm font-tech tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">
                Calendário
              </Link>
            </nav>
          </div>

          {/* Central Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Buscar festivais, escolas, bailarinos..."
              className="w-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm font-sans text-white focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">

            {/* Criar evento & Meus ingressos */}
            <div className="hidden md:flex items-center gap-6 mr-4">
              <button
                onClick={handleCreateEvent}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </div>
                <span className="text-xs font-sans font-medium mt-0.5">Criar evento</span>
              </button>

              <button
                onClick={() => !user ? openAuthModal('login') : router.push('/carteira')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <Ticket className="w-5 h-5" />
                <span className="text-xs font-sans font-medium mt-0.5">Meus ingressos</span>
              </button>
            </div>

            {/* User Area */}
            {user ? (
              /* Profile Dropdown (logado) */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-3 bg-zinc-900/30 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold leading-tight truncate max-w-[80px]">{displayName}</p>
                    <p className="text-[9px] xp-eyebrow text-purple-400 uppercase">Modo {activeProfile}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 p-0.5 ml-2">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} className="w-full h-full rounded-full object-cover" alt={displayName} />
                    ) : (
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                        <UserCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-500 mr-2" />
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#0a0a0a] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    {/* User info */}
                    <div className="p-3 border-b border-zinc-800">
                      <p className="text-xs font-bold text-white truncate">{displayName}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                    </div>
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
                    <div className="border-t border-zinc-800 p-2">
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Sair da conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Botões de auth (deslogado) */
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-sm font-tech tracking-widest text-zinc-400 hover:text-white transition-colors hidden sm:block"
                >
                  Entrar
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-tech tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  Cadastrar
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-zinc-400">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#050505] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center md:text-left grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-zinc-500 text-xs mt-4">O Sistema Operacional definitivo para festivais de dança.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
