import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Trophy, Flame, Star, Zap, Target, Medal } from 'lucide-react';
import { ReactNode } from 'react';

interface Achievement {
    icon: ReactNode;
    name: string;
    description: string;
    unlocked: boolean;
    xp: number;
}

async function getUserAchievements(userId: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const [
        { count: completedLessons },
        { data: xpHistory },
        { data: progressData },
        { data: leaderboard },
    ] = await Promise.all([
        supabase.from('progress').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('completed', true),
        supabase.from('user_xp_history').select('amount').eq('user_id', userId),
        supabase.from('progress').select('lesson_id, completed, completed_at, lessons!inner(course_id, module_name)').eq('user_id', userId).eq('completed', true),
        supabase.from('leaderboard_weekly').select('user_id').order('weekly_xp', { ascending: false }).limit(10),
    ]);

    const totalXP = (xpHistory || []).reduce((sum: number, h: { amount: number }) => sum + h.amount, 0);
    const completedCount = completedLessons || 0;
    const inTop10 = (leaderboard || []).some((r: { user_id: string }) => r.user_id === userId);

    // Check if any module is fully completed
    // Group completed lessons by module
    // const moduleGroups: Record<string, Set<string>> = {};
    // (progressData || []).forEach((p: { lesson_id: string, lessons: { course_id: string, module_name: string } }) => {
    //     const key = `${p.lessons?.course_id}__${p.lessons?.module_name}`;
    //     if (!moduleGroups[key]) moduleGroups[key] = new Set();
    //     moduleGroups[key].add(p.lesson_id);
    // });

    // Check streak (consecutive days with completions)
    const completionDates = (progressData || [])
        .filter((p: { completed_at: string | null }) => p.completed_at)
        .map((p: { completed_at: string }) => new Date(p.completed_at).toDateString());
    const uniqueDays = [...new Set(completionDates)].sort();
    let maxStreak = 0;
    let currentStreak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
        const prev = new Date(uniqueDays[i - 1]);
        const curr = new Date(uniqueDays[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) { currentStreak++; maxStreak = Math.max(maxStreak, currentStreak); }
        else currentStreak = 1;
    }
    if (uniqueDays.length === 1) maxStreak = 1;

    const achievements: Achievement[] = [
        {
            icon: <Star size={24} />,
            name: 'Primeira Aula',
            description: 'Completou sua primeira aula',
            unlocked: completedCount >= 1,
            xp: 50,
        },
        {
            icon: <Flame size={24} />,
            name: 'Sequência de Fogo',
            description: '7 dias seguidos treinando',
            unlocked: maxStreak >= 7,
            xp: 150,
        },
        {
            icon: <Zap size={24} />,
            name: 'Em Ritmo',
            description: 'Completou 5 aulas',
            unlocked: completedCount >= 5,
            xp: 100,
        },
        {
            icon: <Target size={24} />,
            name: 'Dedicado',
            description: 'Completou 20 aulas',
            unlocked: completedCount >= 20,
            xp: 300,
        },
        {
            icon: <Trophy size={24} />,
            name: 'Top 10 Semanal',
            description: 'Entrou no ranking Top 10 da semana',
            unlocked: inTop10,
            xp: 500,
        },
        {
            icon: <Medal size={24} />,
            name: 'Mestre do XP',
            description: 'Acumulou 1.000 XP ou mais',
            unlocked: totalXP >= 1000,
            xp: 200,
        },
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return { achievements, totalXP, unlockedCount };
}

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

    const { achievements, totalXP, unlockedCount } = await getUserAchievements(user.id);

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
                            {achievement.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-heading text-sm uppercase tracking-widest ${achievement.unlocked ? 'text-white' : 'text-[#444]'}`}>
                                {achievement.name}
                            </h3>
                            <p className="text-[10px] font-sans text-[#555]">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs font-mono ${achievement.unlocked ? 'text-secondary' : 'text-[#333]'}`}>
                                +{achievement.xp} XP
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
