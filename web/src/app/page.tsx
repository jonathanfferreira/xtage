"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Flame, MonitorPlay, Smartphone, Shield, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-[#ededed] font-sans overflow-x-hidden selection:bg-primary/30 selection:text-white">

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[180px] rounded-full mix-blend-screen opacity-40"></div>
      </div>

      {/* Navbar Minimalista */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="relative w-32 h-8">
            <Image src="/images/xpace-on-branco.png" alt="XTAGE" fill className="object-contain object-left" />
          </div>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="hidden md:block text-sm font-semibold text-white hover:text-primary transition-colors uppercase tracking-widest">
              Explorar Catálogo
            </Link>
            <Link href="/login" className="hidden md:block text-sm font-semibold text-[#888] hover:text-white transition-colors uppercase tracking-widest">
              Acesso Aluno
            </Link>
            <Link href="/register" className="relative group overflow-hidden px-6 py-2.5 rounded-sm bg-primary border border-primary/50 text-white font-bold uppercase tracking-widest text-xs">
              <span className="relative z-10">Tornar-se Membro</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#aaa] uppercase tracking-widest">A Revolução do Streaming de Dança</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-8xl leading-[1.1] md:leading-[1.0] font-bold text-white mb-6 tracking-tight"
          >
            SUA NOVA ACADEMIA <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              DE DANÇA ONLINE.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-[#888] mb-12 font-light tracking-wide"
          >
            Aprenda com os maiores nomes da cena. Masterclasses, coreografias, locking, popping e hip-hop em um ecossistema construído por e para dançarinos reais.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link href="/register" className="w-full sm:w-auto relative group px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-sm overflow-hidden text-sm">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Começar Jornada <ArrowRight size={18} />
              </span>
              <div className="absolute inset-0 bg-[#ddd] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-0"></div>
            </Link>

            <Link href="#preview" className="w-full sm:w-auto px-10 py-5 bg-transparent border border-[#333] text-white hover:bg-[#111] hover:border-[#555] font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 text-sm flex items-center justify-center gap-2">
              <Play size={18} className="text-primary" /> Ver o Holo-Deck
            </Link>
          </motion.div>

        </div>

        {/* Dashboard Mockup - Floating Window Concept */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, type: "spring" }}
          id="preview"
          className="max-w-6xl mx-auto mt-24 relative perspective-[2000px]"
        >
          <div className="relative rounded-xl border border-white/10 bg-[#050505] shadow-[0_0_100px_rgba(99,36,178,0.2)] overflow-hidden aspect-video transform-gpu rotate-x-[5deg] scale-95 hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out group">
            {/* Fake Mac Topbar */}
            <div className="h-8 md:h-10 bg-[#111] border-b border-[#222] flex items-center px-4 gap-2 w-full">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              <div className="flex-1 text-center hidden md:block">
                <span className="text-[10px] font-mono text-[#555] bg-[#000] px-4 py-1 rounded-full border border-[#222]">xtage.app/dashboard</span>
              </div>
            </div>
            {/* Inner Screen Content Illusion */}
            <div className="relative w-full h-full bg-[#050505] overflow-hidden">
              {/* O usuário salvará a imagem que ele printou com este nome na pasta public */}
              <Image src="/images/dashboard-preview.png" alt="Dashboard Preview" unoptimized fill className="object-cover object-top opacity-60 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform duration-500">
                  <Play className="text-white ml-2" size={32} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 py-24 bg-[#020202] border-y border-[#111]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight">Evolução em <span className="text-secondary">Ultra Definição</span></h2>
            <p className="text-[#888] font-light max-w-2xl mx-auto">Muito mais que um player. O XTAGE foi desenhado com inteligência e ferramentas gamificadas para garantir seu desenvolvimento real como bailarino.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              hidden: { opacity: 0 }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
              <FeatureCard
                icon={<MonitorPlay size={32} className="text-primary" />}
                title="Aulas em 4K"
                desc="Qualidade de estúdio. Player focado em dança com espelhamento dinâmico e controle de velocidade avançado."
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
              <FeatureCard
                icon={<Zap size={32} className="text-secondary" />}
                title="Sistema de XP"
                desc="Transforme treino em jogo. Acumule pontos por aula finalizada e suba no Ranking Global da academia."
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
              <FeatureCard
                icon={<Smartphone size={32} className="text-accent" />}
                title="Cross-Platform PWA"
                desc="Seu treino vai junto com você. Experiência nativa em PWA, perfeitamente adaptado pro celular ou tablet."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111] border border-[#222] mb-6"
          >
            <Shield color="#eb00bc" size={14} />
            <span className="text-[10px] font-mono text-[#eb00bc] uppercase tracking-widest">Acesso Desbloqueado</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl font-bold text-white mb-16 text-center uppercase tracking-tight"
          >
            O palco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6324b2] to-[#eb00bc]">Todo Seu</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-md bg-gradient-to-b from-[#111] to-[#050505] p-[1px] rounded-xl relative group"
          >
            {/* Glow ring on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"></div>

            <div className="bg-[#050505] rounded-xl p-8 relative flex flex-col h-full border border-[#222] group-hover:border-primary/50 transition-colors">

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-1">Membro Oficial</h3>
                  <p className="text-[#666] text-sm">Acesso a todos os conteúdos originais.</p>
                </div>
                <div className="bg-primary/20 px-3 py-1 rounded border border-primary/30">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">Premium</span>
                </div>
              </div>

              <div className="flex items-end gap-1 mb-8">
                <span className="text-[#888] font-bold text-xl mb-2">R$</span>
                <span className="text-white font-display text-6xl tracking-tighter">49</span>
                <span className="text-[#555] font-mono text-sm mb-2">,90 / mês</span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                <PricingFeature text="Acesso ilimitado ao Holo-Deck" />
                <PricingFeature text="App Mobile (iOS e Android via PWA)" />
                <PricingFeature text="Ranking Global e Gamificação XP" />
                <PricingFeature text="Masterclasses com Convidados VIP" />
                <PricingFeature text="Suporte VIP da Comunidade" />
              </ul>

              <Link href="/register" className="w-full py-4 bg-primary text-white font-bold text-center uppercase tracking-[0.2em] rounded-sm hover:bg-primary/80 transition-colors">
                Assinar Agora
              </Link>
              <p className="text-center text-[#444] text-[10px] mt-4 uppercase tracking-widest">Cancele quando quiser.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Modern Footer */}
      <footer className="relative z-10 border-t border-[#111] bg-[#020202] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <div className="relative w-32 h-8 mb-4">
                <Image src="/images/xpace-on-branco.png" alt="XTAGE" fill className="object-contain object-left" />
              </div>
              <p className="text-[#666] text-sm max-w-sm">Elevando a arte e o aprendizado físico para a era digital. A tecnologia não substitui, ela te impulsiona.</p>
            </div>

            <div className="flex gap-12">
              <div className="flex flex-col gap-3">
                <span className="text-white font-bold text-xs uppercase tracking-widest mb-2">Plataforma</span>
                <Link href="/login" className="text-[#666] hover:text-white transition-colors text-sm">Login de Aluno</Link>
                <Link href="/register" className="text-[#666] hover:text-white transition-colors text-sm">Criar Conta</Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-white font-bold text-xs uppercase tracking-widest mb-2">Legal</span>
                <Link href="/termos" className="text-[#666] hover:text-white transition-colors text-sm">Termos de Uso</Link>
                <Link href="/privacidade" className="text-[#666] hover:text-white transition-colors text-sm">Privacidade</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[#111] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[#444] text-xs font-mono uppercase">© 2026 XTAGE. Todos os direitos reservados.</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-500 text-xs font-mono uppercase tracking-widest">Sistemas Operacionais Normais</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Subcomponents
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#050505] border border-[#1a1a1a] p-8 rounded-xl hover:bg-[#0a0a0a] hover:border-[#333] transition-all duration-300 group h-full">
      <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#1a1a1a] transition-all duration-500 border border-[#222]">
        {icon}
      </div>
      <h3 className="text-white font-bold text-xl uppercase tracking-wider mb-3">{title}</h3>
      <p className="text-[#666] leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <Star size={12} className="text-primary" />
      </div>
      <span className="text-[#aaa] text-sm">{text}</span>
    </li>
  );
}
