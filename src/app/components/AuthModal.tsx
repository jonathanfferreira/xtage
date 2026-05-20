'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthModal } from '@/lib/auth-modal-store';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

// Ícone do Google SVG inline (sem dependências)
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.532 24.552c0-1.636-.132-3.233-.388-4.787H24.48v9.065h12.99c-.56 3.016-2.254 5.572-4.8 7.29v6.056h7.768c4.548-4.19 7.094-10.36 7.094-17.624z" fill="#4285F4"/>
      <path d="M24.48 48c6.504 0 11.962-2.156 15.948-5.824l-7.768-6.056c-2.156 1.444-4.912 2.3-8.18 2.3-6.292 0-11.622-4.248-13.528-9.956H3.01v6.244C6.98 42.844 15.16 48 24.48 48z" fill="#34A853"/>
      <path d="M10.952 28.464a14.43 14.43 0 0 1 0-8.928V13.292H3.01a23.97 23.97 0 0 0 0 21.416l7.942-6.244z" fill="#FBBC05"/>
      <path d="M24.48 9.58c3.548 0 6.732 1.22 9.236 3.62l6.932-6.932C36.428 2.376 30.984 0 24.48 0 15.16 0 6.98 5.156 3.01 13.292l7.942 6.244C12.858 13.828 18.188 9.58 24.48 9.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthModal() {
  const { isOpen, view, close, setView } = useAuthModal();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reseta os campos ao trocar de view
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [view, isOpen]);

  // Fecha ao pressionar ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // Se ok, o browser será redirecionado automaticamente
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setError(null);

    if (view === 'register') {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('E-mail ou senha incorretos.');
      } else {
        close();
        router.refresh();
      }
    }

    setLoading(false);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none transition-colors text-sm";

  return (
    <>
      {/* Overlay com blur */}
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={close}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow de fundo */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Botão de fechar */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8 space-y-6">
            {/* Logo + Título */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-3">
                <Logo />
              </div>
              <h2 className="font-title text-2xl font-black text-white uppercase tracking-tight">
                {view === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}
              </h2>
              <p className="text-zinc-500 text-sm">
                {view === 'login'
                  ? 'Entre para acessar festivais, inscrições e muito mais.'
                  : 'Junte-se ao maior ecossistema de festivais de dança.'}
              </p>
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-zinc-700 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continuar com Google
            </button>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-xs text-zinc-600 font-tech tracking-widest uppercase">ou</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Formulário */}
            <div className="space-y-3">
              {/* Erro */}
              {error && (
                <div className="bg-red-950/50 border border-red-800/50 rounded-xl px-4 py-3 flex items-start gap-2 text-sm text-red-300">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Sucesso */}
              {successMsg && (
                <div className="bg-green-950/50 border border-green-800/50 rounded-xl px-4 py-3 text-sm text-green-300">
                  {successMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-tech tracking-widest uppercase text-zinc-500 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={inputClass}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
                />
              </div>

              <div>
                <label className="block text-xs font-tech tracking-widest uppercase text-zinc-500 mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {view === 'register' && (
                <div>
                  <label className="block text-xs font-tech tracking-widest uppercase text-zinc-500 mb-1.5">Confirmar Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
                  />
                </div>
              )}

              <button
                onClick={handleEmailAuth}
                disabled={loading || !email || !password}
                className="w-full py-3 rounded-xl font-tech tracking-widest uppercase text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                {view === 'login' ? 'Entrar com e-mail' : 'Criar conta'}
              </button>
            </div>

            {/* Rodapé: trocar entre login e cadastro */}
            <p className="text-center text-sm text-zinc-500">
              {view === 'login' ? (
                <>
                  Não tem uma conta?{' '}
                  <button onClick={() => setView('register')} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{' '}
                  <button onClick={() => setView('login')} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Entrar
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
