"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2, Users, Zap, GraduationCap, Instagram, Youtube, Music2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const DANCE_STYLES = ['LOCKING', 'BALLET', 'POPPING', 'BREAKING', 'CONTEMPORÂNEO', 'FREESTYLE', 'HIP-HOP', 'JAZZ'];

export default function LandingPage() {
  const [styleIndex, setStyleIndex] = useState(0);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [type, setType] = useState<'aluno' | 'criador'>('aluno');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStyleIndex((i) => (i + 1) % DANCE_STYLES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/waitlist')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.count) setCount(data.count);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Erro ao cadastrar.');
        setFormStatus('error');
        return;
      }
      if (data.count) setCount(data.count);
      setFormStatus('success');
    } catch {
      setErrorMsg('Erro de conexão. Tente novamente.');
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#ededed] font-sans flex flex-col selection:bg-primary/30 selection:text-white">

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-0 w-full h-[800px] bg-primary/10 blur-[150px] rounded-[100%] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[180px] rounded-full mix-blend-screen opacity-40" />
      </div>
      
      {/* Noise Texture Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Navbar Minimal */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 pt-10 pb-4"
      >
        <div className="flex justify-center">
          <div className="relative w-40 h-8">
            <Image src="/images/xpace-logo-branca.png" alt="XPACE" fill className="object-contain" priority />
          </div>
        </div>
      </motion.header>

      {/* Hero & Form Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-8 pb-32 px-6">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">

          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#eb00bc] animate-pulse" />
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Abertura: 29 de Abril de 2026</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-[14vw] md:text-[8vw] leading-[0.85] font-bold text-white text-center mb-6 tracking-normal"
          >
            APRENDA{' '}
            <span className="inline-grid min-w-[300px] md:min-w-[500px] -mb-2 pb-2 align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={styleIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="col-start-1 row-start-1"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff0080] inline-block font-black">
                    {DANCE_STYLES[styleIndex]}
                  </span>
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <span className="text-white">DO ZERO AO PALCO.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-xl mx-auto text-[#888] text-center text-sm md:text-base leading-relaxed mb-16"
          >
            A evolução do streaming ensinando a vida real. 
            Inscreva-se na fila de espera e seja avisado assim que as portas se abrirem.
          </motion.p>

          {/* Form UI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, type: "spring" }}
            className="w-full max-w-lg"
          >
            <AnimatePresence mode="wait">
              {formStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="bg-[#050505] border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.1)] rounded-2xl p-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <Check size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Sua vaga está garantida!</h3>
                  <p className="text-[#888] text-sm mb-6">Fique de olho no seu e-mail. Enviaremos o acesso oficial em breve.</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-[#666]">
                    <Users size={14} />
                    <span className="font-mono">{count !== null ? <><strong className="text-white">{count}</strong> pessoas na lista</> : 'Aguardando lançamento'}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
                  
                  {/* Informador de lista */}
                  {count !== null && count > 0 && (
                      <div className="flex flex-col items-center gap-1.5 mb-2 relative z-10">
                          <div className="flex items-center gap-2 text-primary/80 text-xs font-bold uppercase tracking-widest">
                              <Users size={12} />
                              <span className="font-mono">{count} Pessoas na Fila</span>
                          </div>
                      </div>
                  )}

                  {/* Toggle aluno / professor */}
                  <div className="flex gap-2 p-1 bg-[#111] border border-[#222] rounded-lg relative z-10">
                    <button
                      type="button"
                      onClick={() => setType('aluno')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${type === 'aluno' ? 'bg-primary text-white shadow-lg' : 'text-[#666] hover:text-white'}`}
                    >
                      <Zap size={14} /> Sou Aluno
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('criador')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${type === 'criador' ? 'bg-secondary text-white shadow-lg' : 'text-[#666] hover:text-white'}`}
                    >
                      <GraduationCap size={14} /> Sou Professor
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    <div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full bg-[#111] border border-[#222] focus:border-primary/50 focus:bg-[#151515] rounded-lg px-4 py-3.5 text-white text-sm outline-none transition-colors placeholder:text-[#444]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="E-mail principal"
                        className="w-full bg-[#111] border border-[#222] focus:border-primary/50 focus:bg-[#151515] rounded-lg px-4 py-3.5 text-white text-sm outline-none transition-colors placeholder:text-[#444]"
                      />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp (Opcional)"
                      className="w-full bg-[#111] border border-[#222] focus:border-primary/50 focus:bg-[#151515] rounded-lg px-4 py-3.5 text-white text-sm outline-none transition-colors placeholder:text-[#444]"
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="text-red-500 text-xs font-mono text-center relative z-10">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full relative group bg-white text-black py-4 rounded-lg text-sm transition-all disabled:opacity-50 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-bold uppercase tracking-[0.2em] py-0.5">
                      {formStatus === 'loading' ? (
                        <><Loader2 size={16} className="animate-spin" /> Adicionando...</>
                      ) : (
                        <>Entrar na Fila Oficial <ArrowRight size={16} /></>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-0 opacity-20" />
                  </button>

                  <p className="text-center text-[#444] text-[10px] font-mono uppercase tracking-widest relative z-10">
                    Sem spam. Prometemos.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>

      {/* Very Minimal Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#030303] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4">
            <a href="https://instagram.com/xpaceapp" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="https://tiktok.com/@xtage.app" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors"><Music2 size={18} /></a>
            <a href="https://youtube.com/@xpace" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors"><Youtube size={18} /></a>
          </div>
          <p className="text-[#333] text-xs font-mono uppercase">© 2026 XPACE. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
