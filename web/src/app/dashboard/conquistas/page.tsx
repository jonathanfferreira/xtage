import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Trophy, Flame, Star, Zap, Target, Medal, Crown, Activity, Diamond } from 'lucide-react';
import { ReactNode } from 'react';
import { getUserAchievements } from '@/utils/achievements';
import { ClaimButton } from '@/components/gamification/claim-button';

export default async function ConquistasPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div className="text-[#555] text-sm py-20 text-center">Faça login para ver suas conquistas.</div>;
    }

    const { achievements, totalXP, unlockedCount } = await getUserAchievements(user.id, user.user_metadata);

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                        <span className="text-transparent bg-clip-text text-gradient-neon">Conquistas</span>
                    </h1>
                    <p className="text-[#888] font-sans">Desbloqueie medalhas e acumule XP treinando.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#111] border border-[#222] px-4 py-2 rounded flex flex-col items-center min-w-[100px]">
                        <span className="text-secondary font-display text-2xl">{totalXP.toLocaleString()}</span>
                        <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest">XP Total</span>
                    </div>
                    <div className="bg-[#111] border border-[#222] px-4 py-2 rounded flex flex-col items-center min-w-[100px]">
                        <span className="text-accent font-display text-2xl">{unlockedCount}/{achievements.length}</span>
                        <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest">Medalhas</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-4 p-5 rounded-sm border transition-colors ${achievement.unlocked
                            ? 'bg-[#0A0A0A] border-[#222] hover:border-primary/30'
                            : 'bg-[#050505] border-[#151515] opacity-50'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-sm flex items-center justify-center shrink-0 ${achievement.unlocked
                            ? 'bg-primary/10 border border-primary/20 text-primary'
                            : 'bg-[#111] border border-[#1a1a1a] text-[#333]'
                            }`}>
                            {achievement.id === 'primeira-aula' && <Star size={24} />}
                            {achievement.id === 'sequencia-fogo' && <Flame size={24} />}
                            {achievement.id === 'em-ritmo' && <Zap size={24} />}
                            {achievement.id === 'dedicado' && <Target size={24} />}
                            {achievement.id === 'top-10' && <Trophy size={24} />}
                            {achievement.id === 'mestre-xp' && <Medal size={24} />}
                            {achievement.id === 'maratonista' && <Activity size={24} />}
                            {achievement.id === 'lenda-xp' && <Crown size={24} />}
                            {achievement.id === 'foco-diamante' && <Diamond size={24} />}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-heading text-sm uppercase tracking-widest ${achievement.unlocked ? 'text-white' : 'text-[#444]'}`}>
                                {achievement.name}
                            </h3>
                            <p className="text-[10px] font-sans text-[#555]">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                            {achievement.unlocked ? (
                                achievement.claimed ? (
                                    <span className="text-xs font-mono text-secondary">+{achievement.xp} XP Resgatado</span>
                                ) : (
                                    <ClaimButton achievementId={achievement.id} xp={achievement.xp} />
                                )
                            ) : (
                                <span className="text-xs font-mono text-[#333]">+{achievement.xp} XP</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
