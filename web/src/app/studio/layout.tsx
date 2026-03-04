import { StudioLayoutWrapper } from "@/components/studio/studio-layout-wrapper";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NotificationBell } from '@/components/layout/notification-bell';

async function getStudioUser() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { user: null, tenant: null };
    const { data: userData } = await supabase
        .from('users')
        .select('full_name, role, avatar_url')
        .eq('id', user.id)
        .single();
    const { data: tenant } = await supabase
        .from('tenants')
        .select('id, name, logo_url, brand_color, slug')
        .eq('owner_id', user.id)
        .single();
    return { user: userData, tenant };
}

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
    const { user: studioUser, tenant } = await getStudioUser();

    return (
        <StudioLayoutWrapper studioUser={studioUser} tenant={tenant}>
            {children}
        </StudioLayoutWrapper>
    );
}
