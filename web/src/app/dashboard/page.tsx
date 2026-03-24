import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Top10Carousel } from "@/components/layout/top10-carousel";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getDashboardData(userAuth: any) {
    const userId = userAuth.id;
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );

    // Fetch XP, streak data and latest enrollment in parallel (3 independent queries → 1 round-trip)
    const [
        { data: xpData },
        { data: completedData },
        { data: latestEnrollment },
        { data: userData },
    ] = await Promise.all([
        supabase
            .from('progress')
            .select('xp_awarded')
            .eq('user_id', userId),
        supabase
            .from('progress')
            .select('completed_at')
            .eq('user_id', userId)
            .eq('completed', true)
            .order('completed_at', { ascending: false })
            .limit(30),
        supabase
            .from('enrollments')
            .select(`
                course_id,
                courses:courses!course_id(title, thumbnail_url),
                created_at
            `)
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
        supabase.from('users').select('full_name, gender').eq('id', userId).single(),
    ]);

    const totalXp = (xpData || []).reduce((acc, p) => acc + (p.xp_awarded || 0), 0);

    // Calculate streak (consecutive days with completions)
    let streak = 0;
    if (completedData && completedData.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dates = new Set(completedData.map(p => {
            const d = new Date(p.completed_at);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }));
        for (let i = 0; i < 30; i++) {
            const check = new Date(today);
            check.setDate(check.getDate() - i);
            if (dates.has(check.getTime())) {
                streak++;
            } else if (i > 0) break;
        }
    }

    // If has enrollment, fetch lessons and progress in parallel
    let currentLesson = null;
    let progressPercent = 0;
    if (latestEnrollment) {
        const [{ data: lessons }, { data: userProgress }] = await Promise.all([
            supabase
                .from('lessons')
                .select('id, title, module_name')
                .eq('course_id', latestEnrollment.course_id)
                .order('order_index'),
            supabase
                .from('progress')
                .select('lesson_id, completed')
                .eq('user_id', userId),
        ]);

        const completedSet = new Set((userProgress || []).filter(p => p.completed).map(p => p.lesson_id));
        const totalLessons = (lessons || []).length;
        const completedCount = (lessons || []).filter(l => completedSet.has(l.id)).length;
        progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        // Find first incomplete lesson
        currentLesson = (lessons || []).find(l => !completedSet.has(l.id)) || (lessons || [])[0];
    }

    return {
        fullName: userData?.full_name || userAuth?.user_metadata?.full_name || 'Dancer',
        gender: userData?.gender || 'N',
        totalXp,
        streak,
        latestCourse: latestEnrollment ? {
            id: latestEnrollment.course_id,
            title: (latestEnrollment as any).courses?.title || 'Curso',
            thumbnail: (latestEnrollment as any).courses?.thumbnail_url,
        } : null,
        currentLesson,
        progressPercent,
    };
}

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const data = user ? await getDashboardData(user) : null;

    const welcomeMsg = data?.gender === 'F' ? 'Bem-vinda,' : data?.gender === 'M' ? 'Bem-vindo,' : 'Bem-vindo(a),';
    const firstName = data?.fullName?.split(' ')[0] || 'Dancer';

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header Panel */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">{welcomeMsg} <span className="text-transparent bg-clip-text text-gradient-neon">{firstName}</span></h1>
                    <p className="text-[#888] font-sans">Seu progresso sincronizado. Continue dominando o palco.</p>
                </div>
                <div className="flex gap-4 tour-step-1">
                    <div className="bg-[#111]/80 backdrop-blur-md border border-secondary/20 shadow-[0_0_20px_rgba(235,0,188,0.15)] px-4 py-2 rounded flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-secondary font-display text-3xl drop-shadow-[0_0_10px_rgba(235,0,188,0.5)]">{data?.totalXp?.toLocaleString('pt-BR') || '0'}</span>
                        <span className="text-[10px] text-[#888] font-mono uppercase tracking-widest">XP Acumulado</span>
                    </div>
                    <div className="bg-[#111]/80 backdrop-blur-md border border-accent/20 shadow-[0_0_20px_rgba(255,82,0,0.15)] px-4 py-2 rounded flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-accent font-display text-3xl drop-shadow-[0_0_10px_rgba(255,82,0,0.5)]">{String(data?.streak || 0).padStart(2, '0')}</span>
                        <span className="text-[10px] text-[#888] font-mono uppercase tracking-widest">Sequência (Dias)</span>
                    </div>
                </div>
            </div>

            {/* Continue Watching (HUD Style) */}
            <h2 className="font-display text-2xl mb-4 tracking-widest text-[#555] uppercase">Sessão Ativa</h2>

            {data?.latestCourse ? (
                <div className="group relative border border-primary/20 bg-[#050505] shadow-[0_0_30px_rgba(99,36,178,0.15)] hover:shadow-[0_0_50px_rgba(99,36,178,0.3)] hover:border-primary/50 transition-all duration-500 rounded-sm overflow-hidden mb-12 tour-step-2">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-neon z-10"></div>
                    <div className="flex flex-col md:flex-row p-6 pl-8 gap-8 items-center relative z-20">
                        <div className="w-full md:w-64 h-36 bg-[#1A1A1A] relative border border-[#333] group-hover:border-primary/40 transition-colors flex shrink-0 items-center justify-center overflow-hidden">
                            {data.latestCourse.thumbnail ? (
                                <Image src={data.latestCourse.thumbnail} alt="" fill className="object-cover opacity-60" unoptimized />
                            ) : (
                                <div className="absolute inset-0 bg-[url('/images/bg-degrade.png')] bg-cover opacity-20 sepia contrast-150"></div>
                            )}
                            <Play className="text-white/50 group-hover:text-white transition-colors relative z-10 w-12 h-12" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono uppercase px-2 py-0.5 tracking-widest">
                                    {data.currentLesson?.module_name || 'Módulo'}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold font-heading text-white mb-2 uppercase">
                                {data.currentLesson?.title || data.latestCourse.title}
                            </h3>
                            <p className="text-[#888] text-sm mb-6 line-clamp-2 max-w-2xl">{data.latestCourse.title}</p>

                            <div className="flex items-center gap-6">
                                <Link href={`/dashboard/aula/${data.currentLesson?.id || data.latestCourse.id}`} className="relative group/btn border border-white/20 bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 px-6 py-2 pb-1.5 text-sm font-sans font-bold flex items-center gap-2">
                                    <div className="absolute inset-0 bg-white scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300 z-0"></div>
                                    <Play size={16} fill="currentColor" className="relative z-10 group-hover/btn:text-black transition-colors" /> 
                                    <span className="relative z-10 group-hover/btn:text-black transition-colors">RETOMAR TREINO</span>
                                </Link>
                                <div className="flex-1 max-w-xs flex items-center gap-3">
                                    <div className="h-1 flex-1 bg-[#111] border border-[#222] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-neon shadow-[0_0_10px_rgba(235,0,188,0.5)]" style={{ width: `${data.progressPercent}%` }}></div>
                                    </div>
                                    <span className="text-xs font-mono text-[#666] tracking-widest">{data.progressPercent}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-1 h-1 bg-[#333]"></div>
                        <div className="w-1 h-1 bg-[#333]"></div>
                        <div className="w-1 h-1 bg-primary"></div>
                    </div>
                </div>
            ) : (
                <div className="border border-[#222] bg-[#0A0A0A] rounded-sm p-8 mb-12 text-center">
                    <p className="text-[#666] mb-4">Você ainda não está matriculado em nenhum curso.</p>
                    <Link href="/dashboard/explore" className="border border-white hover:bg-white hover:text-black transition-colors px-6 py-2 text-sm font-sans font-bold inline-flex items-center gap-2">
                        <Play size={16} /> EXPLORAR CURSOS
                    </Link>
                </div>
            )}

            {/* Top 10 Ranking */}
            <div className="tour-step-3">
                <Top10Carousel />
            </div>
        </div>
    );
}
