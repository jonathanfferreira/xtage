'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getUserAchievements } from '@/utils/achievements'

export async function claimAchievementAction(achievementId: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )

    // 1. Get user session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // 2. Load all achievements status
    const { achievements } = await getUserAchievements(user.id, user.user_metadata)
    const targetAchievement = achievements.find(a => a.id === achievementId)

    if (!targetAchievement) {
        return { error: 'Conquista não encontrada.' }
    }

    if (!targetAchievement.unlocked) {
        return { error: 'Você ainda não cumpriu os requisitos desta conquista.' }
    }

    if (targetAchievement.claimed) {
        return { error: 'Esta conquista já foi resgatada.' }
    }

    // 3. Increment XP (try RPC first, fallback to direct insert)
    const { error: rpcError } = await supabase.rpc('increment_user_xp', {
        p_user_id: user.id,
        p_xp: targetAchievement.xp
    })

    if (rpcError) {
        // Fallback: insert directly into user_xp_history
        const { error: insertError } = await supabase.from('user_xp_history').insert({
            user_id: user.id,
            amount: targetAchievement.xp,
            source: 'achievement',
        })
        if (insertError) {
            console.error('XP insert failed:', insertError.message)
            return { error: 'Erro ao adicionar XP.' }
        }
    }

    // 4. Update user metadata
    const currentClaimed = user.user_metadata?.achievements_claimed || []
    const updatedClaimed = [...currentClaimed, achievementId]

    const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, achievements_claimed: updatedClaimed }
    })

    if (authError) {
        return { error: 'XP adicionado, mas ocorreu um erro salvando o status da conquista.' }
    }

    return { success: true, xpEarned: targetAchievement.xp }
}
