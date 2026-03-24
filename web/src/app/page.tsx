"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Trophy, Users, Instagram, Youtube, Music2, ShoppingBag } from 'lucide-react';
import { WaitlistSection } from '@/components/waitlist/waitlist-section';
import { useEffect, useState } from 'react';

const DANCE_STYLES = ['LOCKING', 'BALLET', 'POPPING', 'BREAKING', 'CONTEMPORÂNEO', 'FREESTYLE', 'HIP-HOP', 'JAZZ'];

export default function LandingPage() {
  const [styleIndex, setStyleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStyleIndex((i) => (i + 1) % DANCE_STYLES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#ededed] font-sans overflow-x-hidden selection:bg-primary/30 selection:text-white">

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/30 blur-[150px] rounded-full mix-blend-screen opacity-60 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[180px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-accent/10 blur-[120px] rounded-full mix-blend-screen opacity-40" />
      </div>
      
      {/* Noise Texture Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-8">
              <Image src="/images/xpace-logo-branca.png" alt="XPACE" fill className="object-contain object-left" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Waitlist Section */}
      <WaitlistSection />

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-40 px-6 border-b border-[#111]">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono text-[#aaa] uppercase tracking-widest">A Revolução do Streaming de Dança</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-[12vw] md:text-[8vw] leading-[0.9] font-bold text-white mb-6 tracking-normal drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            APRENDA{' '}
            <span className="inline-grid min-w-[320px] md:min-w-[500px] -mb-2 pb-2 align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={styleIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="col-start-1 row-start-1 text-transparent bg-clip-text bg-gradient-neon pt-2"
                >
                  {DANCE_STYLES[styleIndex]}
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
            className="max-w-2xl mx-auto text-lg md:text-xl text-[#aaa] font-medium mb-12 tracking-wide"
          >
            Masterclasses com os maiores nomes da cena. Qualquer estilo, qualquer nível — um ecossistema construído por e para dançarinos reais.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <a href="#pre-save" className="w-full sm:w-auto relative group px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-sm overflow-hidden text-sm flex justify-center items-center">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Entrar na Lista <ArrowRight size={18} />
              </span>
              <div className="absolute inset-0 bg-gradient-neon scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-0 opacity-80" />
            </a>
          </motion.div>

        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, type: "spring" }}
          id="preview"
          className="max-w-6xl mx-auto mt-24 relative"
        >
          <div className="relative rounded-xl border border-white/10 bg-[#050505] shadow-[0_0_100px_rgba(99,36,178,0.25)] overflow-hidden aspect-video transform-gpu rotate-x-[5deg] scale-95 hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out group">
            <div className="h-8 md:h-10 bg-[#111] border-b border-[#222] flex items-center px-4 gap-2 w-full">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <div className="flex-1 text-center hidden md:block">
                <span className="text-[10px] font-mono text-[#555] bg-[#000] px-4 py-1 rounded-full border border-[#222]">xpace.app/dashboard</span>
              </div>
            </div>
            <div className="relative w-full h-full bg-[#050505] overflow-hidden">
              <Image src="/images/dashboard-preview.png" alt="Dashboard Preview" unoptimized fill className="object-cover object-top opacity-60 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 flex-col gap-3"
          >
            <div className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">+250 XP</p>
                <p className="text-[#666] text-[10px]">Aula concluída</p>
              </div>
            </div>
            <div className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Trophy size={16} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">#3 Ranking</p>
                <p className="text-[#666] text-[10px]">Brasil — Semanal</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 }}
            className="hidden md:flex absolute -right-8 bottom-16 flex-col gap-3"
          >
            <div className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl mb-3">
              <div className="w-8 h-8 rounded-full bg-[#eb00bc]/20 flex items-center justify-center">
                <ShoppingBag size={16} className="text-[#eb00bc]" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">XTORE App</p>
                <p className="text-[#666] text-[10px]">Marketplace (Em Breve)</p>
              </div>
            </div>
            <div className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Users size={16} className="text-green-500" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Lista de espera</p>
                <p className="text-[#666] text-[10px]">Abertura em 29 ABR</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#030303] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-3">
              <div className="relative w-32 h-8 mb-5">
                <Image src="/images/xpace-logo-branca.png" alt="XPACE" fill className="object-contain object-left" />
              </div>
              <p className="text-[#555] text-sm max-w-sm leading-relaxed mb-6">
                Elevando a arte e o aprendizado físico para a era digital. A tecnologia não substitui — ela te impulsiona.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com/xpaceapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#666] hover:text-white hover:border-[#444] hover:bg-[#1a1a1a] transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://tiktok.com/@xtage.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#666] hover:text-white hover:border-[#444] hover:bg-[#1a1a1a] transition-all duration-200"
                  aria-label="TikTok"
                >
                  <Music2 size={16} />
                </a>
                <a
                  href="https://youtube.com/@xpace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#666] hover:text-white hover:border-[#444] hover:bg-[#1a1a1a] transition-all duration-200"
                  aria-label="YouTube"
                >
                  <Youtube size={16} />
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <span className="text-white font-bold text-xs uppercase tracking-widest block mb-5">Legal</span>
              <div className="flex flex-col gap-3">
                <Link href="/termos" className="text-[#555] hover:text-white transition-colors text-sm">Termos de Uso</Link>
                <Link href="/privacidade" className="text-[#555] hover:text-white transition-colors text-sm">Política de Privacidade</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[#111] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[#333] text-xs font-mono uppercase">© 2026 XPACE. Todos os direitos reservados.</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500/70 text-xs font-mono uppercase tracking-widest">Sistemas Operacionais</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
