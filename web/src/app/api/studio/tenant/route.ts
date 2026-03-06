import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: 'Erro ao buscar dados da escola' }, { status: 500 });
    }

    return NextResponse.json({ tenant });
}
