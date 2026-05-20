'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, ChevronRight, Play, Filter, Star, Ticket } from 'lucide-react';

const featuredFestival = {
  id: '1',
  name: 'LID - Litoral em Dança 2026',
  date: '12 a 15 de Julho',
  location: 'Teatro Municipal, Santos - SP',
  image: 'https://picsum.photos/seed/dance_featured/1920/1080',
  description: 'O maior festival de dança da baixada santista retorna para sua 10ª edição com premiações recordes e jurados internacionais.',
  tags: ['Ballet', 'Jazz', 'Urban', 'Contemporâneo']
};

const trendingFestivals = [
  { id: '2', name: 'Sul em Dança', date: '22 a 25 Agosto', location: 'Porto Alegre, RS', img: 'https://picsum.photos/seed/dance2/800/600', status: 'Inscrições Abertas' },
  { id: '3', name: 'Festival de Joinville (Seletivas)', date: '05 Setembro', location: 'Joinville, SC', img: 'https://picsum.photos/seed/dance3/800/600', status: 'Últimas Vagas' },
  { id: '4', name: 'Masters of Dance', date: '10 a 12 Outubro', location: 'São Paulo, SP', img: 'https://picsum.photos/seed/dance4/800/600', status: 'Ingressos à Venda' },
  { id: '5', name: 'Urban Hype SP', date: '15 Novembro', location: 'São Paulo, SP', img: 'https://picsum.photos/seed/dance5/800/600', status: 'Em Breve' },
];

export default function FestivalHub() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30 font-sans">
      
      {/* Immersive Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-neon-gradient flex items-center justify-center font-bold text-white tracking-widest text-lg">
                X
              </div>
              <span className="text-xl font-bold tracking-tight">XTAGE</span>
            </Link>
            
            <div className="hidden md:flex ml-8 border-l border-zinc-800 pl-8 gap-6">
              <Link href="/hub" className="text-sm font-medium text-white hover:text-purple-400 transition-colors uppercase tracking-widest">Descobrir</Link>
              <Link href="/hub" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Em Alta</Link>
              <Link href="/hub" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Ingressos</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 focus-within:border-zinc-500 transition-colors">
              <Search className="w-4 h-4 text-zinc-500 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar festivais..." 
                className="bg-transparent border-0 text-sm text-white focus:outline-none focus:ring-0 placeholder:text-zinc-500 w-48"
              />
            </div>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">Entrar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Netflix Style) */}
      <section className="relative h-[85vh] w-full flex items-center">
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={featuredFestival.image} 
            alt={featuredFestival.name}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 mt-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 font-bold tracking-widest uppercase rounded">
                Destaque
              </Badge>
              <span className="text-red-500 flex items-center text-sm font-semibold tracking-wider">
                <Star className="w-4 h-4 mr-1 fill-red-500" /> TOP 1 BR
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-title text-white mb-4 leading-none text-shadow-xl">{featuredFestival.name}</h1>
            
            <div className="flex items-center gap-4 text-zinc-300 mb-6 text-sm font-medium">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {featuredFestival.date}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {featuredFestival.location}</span>
            </div>
            
            <p className="text-lg text-zinc-300 mb-8 max-w-xl line-clamp-3">
              {featuredFestival.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-black hover:bg-zinc-200 text-lg font-bold px-8 py-6 rounded">
                <Play className="w-5 h-5 mr-2 fill-black" /> Inscrever Delegação
              </Button>
              <Button className="bg-zinc-800/80 backdrop-blur text-white hover:bg-zinc-700 border border-zinc-700 text-lg font-bold px-8 py-6 rounded">
                <Ticket className="w-5 h-5 mr-2" /> Comprar Ingresso
              </Button>
            </div>
            
            <div className="flex gap-2 mt-8">
              {featuredFestival.tags.map(tag => (
                <span key={tag} className="text-xs font-bold text-zinc-400 tracking-widest uppercase border border-zinc-700 rounded-full px-3 py-1 bg-black/50 backdrop-blur">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Row */}
      <section className="py-12 relative z-10 -mt-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-subtitle text-white tracking-widest">Em Alta na XTAGE</h2>
            <Button variant="link" className="text-purple-400 hover:text-purple-300 group font-bold tracking-widest uppercase text-xs">
              Ver Todos <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingFestivals.map((festival) => (
              <Card key={festival.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden group cursor-pointer hover:border-zinc-700 transition-colors">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={festival.img} 
                    alt={festival.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur text-purple-400 border border-purple-500/30">
                    {festival.status}
                  </Badge>
                </div>
                <CardContent className="p-4 bg-[#0A0A0A]">
                  <h3 className="font-subtitle text-2xl text-white mb-2">{festival.name}</h3>
                  <div className="space-y-1">
                    <span className="flex items-center text-xs text-zinc-400"><Calendar className="w-3 h-3 mr-2" /> {festival.date}</span>
                    <span className="flex items-center text-xs text-zinc-400"><MapPin className="w-3 h-3 mr-2" /> {festival.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Separator / Categories */}
      <section className="py-12 border-t border-zinc-900 bg-[#0A0A0A] mt-8">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl font-subtitle text-white tracking-widest mb-8 text-center">Navegue por Modalidades</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Ballet Clássico', 'Danças Urbanas', 'Jazz', 'Contemporâneo', 'Sapateado', 'Danças Populares'].map(cat => (
                <div key={cat} className="px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-pink-500 hover:text-pink-400 transition-colors cursor-pointer text-sm font-semibold tracking-wider uppercase text-zinc-400">
                  {cat}
                </div>
              ))}
            </div>
         </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 text-center text-zinc-500 text-sm bg-black">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-neon-gradient flex items-center justify-center font-bold text-white tracking-widest text-xs">
            X
          </div>
          <span className="text-lg font-bold tracking-tight text-white">XTAGE</span>
        </div>
        <p>&copy; 2026 XTAGE Dance OS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
