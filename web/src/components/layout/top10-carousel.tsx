import Link from 'next/link';
import { Play } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

interface Lesson {
    id: string;
    title: string;
    module_name: string;
    course_id: string;
    video_id: string;
    course_title: string;
}

const getCachedRecentLessons = unstable_cache(
    async (): Promise<Lesson[]> => {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data } = await supabase
            .from('lessons')
            .select('id, title, module_name, course_id, video_id, courses!inner(title, is_published)')
            .not('video_id', 'is', null)
            .order('created_at', { ascending: false })
            .limit(10);

        return (data || [])
            .filter((l: any) => l.courses?.is_published)
            .map((l: any) => ({
                id: l.id,
                title: l.title,
                module_name: l.module_name,
                course_id: l.course_id,
                video_id: l.video_id,
                course_title: l.courses?.title || '',
            }));
    },
    ['recent-lessons-carousel'],
    { revalidate: 3600, tags: ['lessons', 'courses'] } // 1 hora de cache (ISR)
);

export async function Top10Carousel() {
    const lessons = await getCachedRecentLessons();

    if (lessons.length === 0) return null;

    return (
        <div className="w-full mt-16 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="font-heading text-2xl tracking-tighter uppercase text-white">Aulas Recentes</h2>
                <div className="bg-primary/20 border border-primary/50 text-primary text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold">Novo</div>
            </div>

            <div className="flex overflow-x-auto pt-4 pb-12 -mx-6 px-6 lg:-mx-10 lg:px-10 gap-x-8 lg:gap-x-12 no-scrollbar snap-x snap-mandatory">
                {lessons.map((lesson, index) => (
                    <Link
                        href={`/dashboard/aula/${lesson.id}`}
                        key={lesson.id}
                        className="relative shrink-0 w-[280px] h-[160px] group snap-start block"
                    >
                        {/* Large background number */}
                        <div
                            className="absolute -left-8 -bottom-6 font-display text-[150px] leading-none text-[#1A1A1A] group-hover:text-[#252525] transition-colors z-0 select-none drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                            style={{ WebkitTextStroke: '2px #333' }}
                        >
                            {index + 1}
                        </div>

                        {/* Thumbnail Box */}
                        <div className="absolute right-0 top-0 w-[220px] h-[140px] bg-[#0A0A0A] border border-[#222] group-hover:border-primary/60 transition-colors rounded-sm overflow-hidden z-10 flex flex-col justify-end p-4">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary to-secondary" />

                            <div className="relative z-20 flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] text-primary font-mono uppercase tracking-widest mb-1">{lesson.course_title}</p>
                                    <h3 className="text-white font-sans font-bold leading-tight line-clamp-2">{lesson.title}</h3>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 ml-2 group-hover:bg-primary group-hover:border-primary transition-all">
                                    <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                                </div>
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="absolute right-2 -top-3 z-20 bg-primary text-white font-bold text-[10px] px-2 py-0.5 uppercase tracking-widest">
                            Nova Aula
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
