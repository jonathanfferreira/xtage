"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Youtube, Music2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WaitlistSection } from '@/components/waitlist/waitlist-section';

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
    <div className="min-h-screen bg-[#020202] text-[#ededed] font-sans flex flex-col selection:bg-primary/30 selection:text-white">

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[0] w-full h-[800px] bg-primary/10 blur-[150px] rounded-[100%] mix-blend-screen opacity-50" />
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

      {/* Headline & Splash Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-8 pb-12 px-6 border-b border-white/5">
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center mt-4"
          >
            <h1 className="font-display text-[14vw] md:text-[8vw] leading-[0.85] font-bold text-white mb-6 tracking-normal">
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
            </h1>
            
            {/* Sub-headline premium conforme pedido pelo Ton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12"
            >
              <p className="max-w-2xl mx-auto text-[#ededed] text-center text-xs md:text-sm font-display font-medium uppercase tracking-[0.3em] leading-relaxed opacity-80 decoration-primary/30 underline-offset-8 underline decoration-2">
                A evolução do streaming ensinando a vida real. 
                <br className="hidden md:block" />
                Inscreva-se na fila de espera oficial.
              </p>
            </motion.div>

            {/* Dashboard Mockup Restore */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative w-full max-w-5xl mx-auto mb-20 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent z-10" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-[#0a0a0a]">
                <Image 
                  src="/images/dashboard-preview.png" 
                  alt="Interface do App XPACE" 
                  width={1400} 
                  height={800} 
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                  priority
                />
              </div>
              
              {/* Floating UI Elements or Indicators can go here */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                <div className="px-4 py-2 bg-[#111] border border-white/10 rounded-full backdrop-blur-md shadow-xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888]">Live Feed</span>
                </div>
                <div className="px-4 py-2 bg-[#111] border border-white/10 rounded-full backdrop-blur-md shadow-xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888]">XP System Ready</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Restore Waitlist Section full structure */}
      <WaitlistSection />

      {/* Very Minimal Footer */}
      <footer className="relative z-10 bg-[#030303] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4">
            <a href="https://instagram.com/xpaceapp" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="https://tiktok.com/@xtage.app" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors"><Music2 size={18} /></a>
            <a href="https://youtube.com/@xpace" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors"><Youtube size={18} /></a>
          </div>
          <p className="text-[#333] text-xs font-mono uppercase mb-4">© 2026 XPACE. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest text-[#444]">
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
