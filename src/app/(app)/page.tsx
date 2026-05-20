'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ChevronRight, Play, AudioWaveform, Music, Crown, Globe, Flame, BookOpen, Diamond, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/lib/profile-store';
import OrganizerView from '@/app/components/views/OrganizerView';
import DirectorView from '@/app/components/views/DirectorView';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Festival {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  description: string | null;
  cover_image_url: string | null;
  status: string;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1549491754-01ac4749fb2a?q=80&w=600',
  'https://images.unsplash.com/photo-1478147424103-10d9fb89ce7d?q=80&w=600',
  'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600',
  'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=600',
];

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start) return '';
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  if (!e || s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString('pt-BR', opts);
  }
  return `${s.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – ${e.toLocaleDateString('pt-BR', opts)}`;
}

export default function UnifiedFeed() {
  const { activeProfile } = useProfileStore();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFestivals() {
      setLoading(true);
      const { data, error } = await supabase
        .from('festivals')
        .select('id, name, start_date, end_date, location, description, cover_image_url, status')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(8);

      if (!error && data) setFestivals(data);
      setLoading(false);
    }
    fetchFestivals();
  }, []);

  if (activeProfile === 'organizador') {
    return <OrganizerView />;
  }

  if (activeProfile === 'diretor') {
    return <DirectorView />;
  }

  // Hero: primeiro festival publicado ou fallback visual
  const heroFestival = festivals[0];

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] pb-24">

      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroFestival?.cover_image_url || 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2000&auto=format&fit=crop'}
            alt={heroFestival?.name || 'Festival Destaque'}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12 z-10">
          <div className="max-w-2xl">
            <span className="xp-eyebrow text-xs text-orange-400 mb-4 inline-block bg-black/50 backdrop-blur-md px-3 py-1 rounded border border-orange-500/50 uppercase tracking-widest">
              Inscrições Abertas
            </span>
            <h1 className="font-title text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-xl">
              {heroFestival ? (
                heroFestival.name
              ) : (
                <>Festival<br />Internacional<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">de Hip Hop</span></>
              )}
            </h1>
            <p className="text-lg text-zinc-300 font-sans mb-8 max-w-lg drop-shadow-md">
              {heroFestival?.description || 'O maior palco de Danças Urbanas da América Latina. Categorias Solo, Duo e Conjuntos com premiações que ultrapassam R$ 50.000.'}
            </p>
            <div className="flex items-center gap-4">
              <Button className="bg-white text-black hover:bg-zinc-200 font-tech tracking-widest px-8 py-6 rounded-none xp-clip-button text-sm">
                <Play className="w-4 h-4 mr-2 fill-black" />
                SABER MAIS
              </Button>
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white font-tech tracking-widest px-8 py-6 rounded-none text-sm bg-black/50 backdrop-blur-md">
                INSCREVER-SE
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 space-y-16">

        {/* Categories */}
        <div>
          <h2 className="font-tech text-xl uppercase tracking-widest text-white mb-6">Explore por Categoria</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {[
              { icon: AudioWaveform, label: 'Urbanas' },
              { icon: Diamond, label: 'Clássico' },
              { icon: Music, label: 'Jazz' },
              { icon: Globe, label: 'Folclóricas' },
              { icon: Crown, label: 'Heels' },
              { icon: Flame, label: 'Batalhas' },
              { icon: BookOpen, label: 'Workshops' },
            ].map((cat, idx) => (
              <button key={idx} className="flex flex-col items-center gap-3 flex-shrink-0 group">
                <div className="w-20 h-20 rounded-full border border-zinc-800 bg-zinc-900/50 flex items-center justify-center group-hover:bg-zinc-800 group-hover:border-purple-500 transition-all text-zinc-400 group-hover:text-white">
                  <cat.icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-tech tracking-widest text-zinc-400 uppercase group-hover:text-white transition-colors">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row: Eventos em Alta */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-tech text-xl uppercase tracking-widest text-white">
              Eventos em Alta
            </h2>
            <button className="text-xs font-tech tracking-widest text-purple-400 hover:text-purple-300 flex items-center">
              VER TODOS <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48 text-zinc-600">
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              <span className="font-tech tracking-widest text-sm">Carregando eventos...</span>
            </div>
          ) : festivals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-zinc-600 border border-zinc-900 rounded-2xl">
              <p className="font-tech tracking-widest text-sm uppercase">Nenhum evento publicado ainda</p>
              <Link href="/novo-evento">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-tech tracking-widest">
                  <Plus className="w-4 h-4 mr-2" /> Criar o primeiro evento
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {festivals.map((festival, i) => (
                <EventCard
                  key={festival.id}
                  title={festival.name}
                  date={formatDateRange(festival.start_date, festival.end_date)}
                  location={festival.location || ''}
                  image={festival.cover_image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function EventCard({ title, date, location, image }: { title: string; date: string; location: string; image: string }) {
  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-[10px] font-tech tracking-widest text-white px-2 py-1 rounded border border-zinc-800">
          COMPETITIVO
        </div>
      </div>
      <div>
        <h3 className="font-title font-black text-xl uppercase leading-tight text-white group-hover:text-purple-400 transition-colors line-clamp-1">
          {title}
        </h3>
        {date && <p className="text-sm font-sans text-purple-400 mt-1">{date}</p>}
        {location && (
          <p className="text-xs font-sans text-zinc-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> {location}
          </p>
        )}
      </div>
    </div>
  );
}
