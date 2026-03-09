'use client'

import { useState } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface FollowButtonProps {
    targetUserId: string
    initialIsFollowing: boolean
    size?: 'sm' | 'md'
}

export function FollowButton({ targetUserId, initialIsFollowing, size = 'md' }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (loading) return

        setLoading(true)
        const newIsFollowing = !isFollowing
        setIsFollowing(newIsFollowing)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setIsFollowing(!newIsFollowing)
                return
            }
            if (user.id === targetUserId) {
                setIsFollowing(!newIsFollowing)
                return
            }

            if (newIsFollowing) {
                const { error } = await supabase
                    .from('follows')
                    .insert({ follower_id: user.id, following_id: targetUserId })
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', user.id)
                    .eq('following_id', targetUserId)
                if (error) throw error
            }
        } catch {
            setIsFollowing(!newIsFollowing)
        } finally {
            setLoading(false)
        }
    }

    const isSmall = size === 'sm'

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`
                flex items-center gap-1.5 font-mono uppercase tracking-widest transition-colors border rounded-sm disabled:opacity-50
                ${isSmall ? 'text-[10px] px-3 py-1.5' : 'text-xs px-4 py-2'}
                ${isFollowing
                    ? 'bg-primary/10 border-primary/40 text-primary hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400'
                    : 'bg-[#111] border-[#333] text-[#888] hover:border-primary/40 hover:text-white'
                }
            `}
        >
            {isFollowing
                ? <><UserCheck size={isSmall ? 12 : 14} /> Seguindo</>
                : <><UserPlus size={isSmall ? 12 : 14} /> Seguir</>
            }
        </button>
    )
}
