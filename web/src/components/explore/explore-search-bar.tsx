'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function ExploreSearchBar({ initialQuery = '', category = '' }: { initialQuery?: string; category?: string }) {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        if (category && category !== 'all') params.set('category', category);
        router.push(`/dashboard/explore?${params.toString()}`);
    };

    const handleClear = () => {
        setQuery('');
        const params = new URLSearchParams();
        if (category && category !== 'all') params.set('category', category);
        router.push(`/dashboard/explore?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] group-focus-within:text-primary transition-colors z-10">
                <Search size={18} />
            </div>
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar cursos, estilos, escolas..."
                className="w-full bg-[#080808] border border-[#222] focus:border-primary/50 text-white font-sans text-sm py-3.5 pl-11 pr-12 outline-none transition-all placeholder:text-[#444] rounded-lg focus:ring-1 focus:ring-primary/20"
            />
            {query && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors z-10 p-1"
                >
                    <X size={14} />
                </button>
            )}
            <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/20 hover:bg-primary/40 border border-primary/30 text-primary rounded px-2 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors z-10"
            >
                IR
            </button>
        </form>
    );
}
