import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { lessonId, progressPercent } = await req.json();

        if (!lessonId) {
            return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
        }

        // Se progress não for passado, considerar como um Ping. Para Reward de 90% exige a prop.
        if (progressPercent < 90) {
            return NextResponse.json({ status: 'ignored_ping', message: 'Progresso insuficiente para XP' }, { status: 200 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll: () => cookieStore.getAll() } }
        );
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verificar se esse usuário já ganhou essa XP específica no banco para não registrar duplo payload
        const { data: existingProgress } = await supabase
            .from('progress')
            .select('id, completed, xp_awarded')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .single();

        if (existingProgress?.completed) {
            return NextResponse.json({ status: 'already_completed', xp_awarded: existingProgress.xp_awarded }, { status: 200 });
        }

        // Marcar como concluído +50 XP (Hardcode, mas poderia vir da aula)
        const xpAmount = 50;

        const { data: newProgress, error } = await supabase
            .from('progress')
            .upsert({
                user_id: user.id,
                lesson_id: lessonId,
                completed: true,
                completed_at: new Date().toISOString(),
                xp_awarded: xpAmount
            }, { onConflict: 'user_id, lesson_id' })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ status: 'success', xp_earned: xpAmount, lessonId: newProgress.lesson_id }, { status: 200 });

    } catch (error: any) {
        console.error('API /progress/track Error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
