'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, CalendarDays, Users, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: string;
  label: string;
  sublabel?: string;
  category: 'escola' | 'festival';
  href: string;
}

const CATEGORY_CONFIG = {
  festival: {
    label: 'Festivais',
    icon: CalendarDays,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  escola: {
    label: 'Escolas',
    icon: Building2,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
} as const;

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    const [festivalsRes, schoolsRes] = await Promise.all([
      supabase
        .from('festivals')
        .select('id, name, city, state')
        .ilike('name', `%${q}%`)
        .limit(5),
      supabase
        .from('schools')
        .select('id, name, city, state')
        .ilike('name', `%${q}%`)
        .limit(5),
    ]);

    const festivalResults: SearchResult[] = (festivalsRes.data || []).map(f => ({
      id: f.id,
      label: f.name,
      sublabel: [f.city, f.state].filter(Boolean).join(', ') || undefined,
      category: 'festival' as const,
      href: `/descobrir`,
    }));

    const schoolResults: SearchResult[] = (schoolsRes.data || []).map(s => ({
      id: s.id,
      label: s.name,
      sublabel: [s.city, s.state].filter(Boolean).join(', ') || undefined,
      category: 'escola' as const,
      href: `/hub?escola=${s.id}`,
    }));

    const combined = [...festivalResults, ...schoolResults];
    setResults(combined);
    setIsOpen(combined.length > 0);
    setActiveIndex(-1);
    setIsLoading(false);
  }, []);

  // Debounce: espera 250ms após parar de digitar
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => search(query), 250);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query, search]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.label);
    setIsOpen(false);
    router.push(result.href);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Agrupado por categoria
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  // Índice global para navegação por teclado
  let flatIndex = 0;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md mx-8 hidden md:block">
      {/* Input */}
      <div className={`flex items-center gap-2 bg-zinc-900/50 border rounded-full pl-3 pr-3 py-2 transition-all group ${isOpen ? 'border-purple-500 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700'}`}>
        {isLoading
          ? <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
          : <Search className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-purple-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
        }
        <input
          ref={inputRef}
          id="global-search"
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar festivais, escolas..."
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none min-w-0"
          autoComplete="off"
        />
        {query && (
          <button onClick={clear} className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
          {(Object.keys(grouped) as Array<keyof typeof CATEGORY_CONFIG>).map(cat => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            const items = grouped[cat];

            return (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-900">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${config.bg}`}>
                    <Icon className={`w-3 h-3 ${config.color}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${config.color}`}>
                    {config.label}
                  </span>
                </div>

                {/* Items */}
                {items.map(result => {
                  const currentIndex = flatIndex++;
                  const isActive = activeIndex === currentIndex;
                  return (
                    <button
                      key={result.id}
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                      onMouseLeave={() => setActiveIndex(-1)}
                      onClick={() => handleSelect(result)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isActive ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{result.label}</p>
                        {result.sublabel && (
                          <p className="text-xs text-zinc-500 truncate">{result.sublabel}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-zinc-900 flex items-center gap-3">
            <span className="text-[10px] text-zinc-600">↑↓ navegar</span>
            <span className="text-[10px] text-zinc-600">↵ selecionar</span>
            <span className="text-[10px] text-zinc-600">esc fechar</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {isOpen && !isLoading && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl p-6 z-[100] text-center animate-in fade-in">
          <p className="text-zinc-400 text-sm">Nenhum resultado para <span className="text-white font-medium">"{query}"</span></p>
          <p className="text-zinc-600 text-xs mt-1">Tente um nome diferente ou verifique a grafia.</p>
        </div>
      )}
    </div>
  );
}
