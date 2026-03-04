import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * POST /api/lessons/progress — Save watch position for resume playback
 * Body: { lessonId, positionSeconds, durationSeconds }
 */
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll: () => cookieStore.getAll() } }
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { lessonId, positionSeconds, durationSeconds } = await request.json()
        if (!lessonId || positionSeconds === undefined) {
            return NextResponse.json({ error: 'lessonId and positionSeconds required' }, { status: 400 })
        }

        // Upsert: update if exists, insert if not
        const { data: existing } = await supabase
            .from('lesson_views')
            .select('id')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .maybeSingle()

        if (existing) {
            await supabase
                .from('lesson_views')
                .update({
                    watch_position_seconds: Math.floor(positionSeconds),
                    duration_seconds: durationSeconds ? Math.floor(durationSeconds) : undefined,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id)
        } else {
            await supabase
                .from('lesson_views')
                .insert({
                    user_id: user.id,
                    lesson_id: lessonId,
                    watch_position_seconds: Math.floor(positionSeconds),
                    duration_seconds: durationSeconds ? Math.floor(durationSeconds) : 0,
                })
        }

        return NextResponse.json({ saved: true })
    } catch (e: any) {
        console.error('[PROGRESS] Error:', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
