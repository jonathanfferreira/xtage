-- Migration: 20260305100000_increment_xp_and_user_fields.sql
-- Fixes: increment_user_xp RPC (missing), user profile fields (gender, instagram)

-- 1. Create the increment_user_xp RPC function (was never created, causing "Erro ao adicionar XP")
CREATE OR REPLACE FUNCTION public.increment_user_xp(p_user_id UUID, p_xp INT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_xp_history (user_id, amount, source)
    VALUES (p_user_id, p_xp, 'achievement');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add missing columns to users table for profile settings
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'N',
    ADD COLUMN IF NOT EXISTS instagram TEXT;

-- 3. Allow users to update their own profile (was missing, causing settings not to save)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'users'
    ) THEN
        CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;
