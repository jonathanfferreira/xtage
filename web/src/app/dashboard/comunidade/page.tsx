'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Trophy, Star, Loader2, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { FollowButton } from '@/components/community/follow-button';

export default function ComunidadePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const supabase = createClient();

    // Load current user and their follows once
    useEffect(() => {
        const loadCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setCurrentUserId(user.id);

            const { data: follows } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', user.id);

            if (follows) {
                setFollowingSet(new Set(follows.map((f: any) => f.following_id)));
            }
        };
        loadCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchCommunity = async () => {
            setLoading(true);
            try {
                let query = supabase
                    .from('public_profiles')
                    .select('id, username, full_name, avatar_url, xp_total, achievements_count')
                    .order('xp_total', { ascending: false, nullsFirst: false })
                    .limit(50);

                if (searchTerm.trim() !== '') {
                    query = query.or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
                }

                const { data, error } = await query;
                if (!error && data) {
                    setUsers(data);
                }
            } catch (err) {
                console.error("Erro ao buscar comunidade", err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(() => {
            fetchCommunity();
        }, 300);

        return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1 mb-4 text-[10px] font-mono tracking-widest text-primary uppercase">
                        <Star size={12} className="text-primary" /> Beta
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tight text-white mb-2" style={{ WebkitTextStroke: '1px white' }}>
                        Comunidade
                    </h1>
                    <p className="text-[#888] font-sans max-w-xl">
                        Descubra novos bailarinos, escolas e criadores de conteúdo que fazem parte da evolução da dança.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80 shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por @username ou nome"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#222] focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-11 pr-4 py-3.5 font-sans text-white text-sm outline-none transition-all placeholder:text-[#555]"
                    />
                </div>
            </div>

            {/* Content Display */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#555]">
                    <Loader2 size={32} className="animate-spin text-primary mb-4" />
                    <p className="font-mono text-xs uppercase tracking-widest">Buscando dançarinos...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-[#111] bg-[#050505] rounded-xl text-center">
                    <Search size={48} className="text-[#222] mb-4" />
                    <h3 className="text-xl font-heading text-white uppercase mb-2">Nenhum resultado</h3>
                    <p className="text-[#666] font-sans text-sm">
                        Não encontramos ninguém com esse nome ou @username.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="group bg-[#0a0a0a] border border-[#1a1a1a] hover:border-primary/40 rounded-xl p-5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                        >
                            {/* Hover FX */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                            <Link href={`/@${user.username}`} className="flex flex-col items-center w-full relative z-10">
                                <div className="w-20 h-20 rounded-full bg-[#111] border-2 border-[#222] group-hover:border-primary/50 relative overflow-hidden mb-4 shrink-0 transition-colors">
                                    {user.avatar_url ? (
                                        <Image src={user.avatar_url} alt={user.full_name || ''} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#111]">
                                            <span className="text-2xl font-heading text-primary/50 group-hover:text-primary transition-colors">
                                                {(user.full_name || user.username || 'X').substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold font-sans text-white mb-0.5 group-hover:text-primary transition-colors line-clamp-1 w-full flex items-center justify-center gap-1">
                                    {user.full_name || user.username}
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 text-primary" />
                                </h3>
                                <p className="text-[#666] font-mono text-xs mb-4">@{user.username}</p>

                                <div className="w-full pt-4 border-t border-[#151515] flex items-center justify-between">
                                    <div className="text-center flex-1">
                                        <p className="text-[#555] text-[10px] font-mono uppercase tracking-wider mb-1">XP</p>
                                        <p className="text-white font-mono text-sm font-bold flex items-center justify-center gap-1">
                                            <Star size={12} className="text-primary" />
                                            {(user.xp_total || 0).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="w-[1px] h-8 bg-[#151515]"></div>
                                    <div className="text-center flex-1">
                                        <p className="text-[#555] text-[10px] font-mono uppercase tracking-wider mb-1">Conquistas</p>
                                        <p className="text-white font-mono text-sm font-bold flex items-center justify-center gap-1">
                                            <Trophy size={12} className="text-amber-400" />
                                            {user.achievements_count || 0}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {currentUserId && currentUserId !== user.id && (
                                <div className="mt-4 w-full relative z-10">
                                    <FollowButton
                                        targetUserId={user.id}
                                        initialIsFollowing={followingSet.has(user.id)}
                                        size="sm"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
