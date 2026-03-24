import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Mux from '@mux/mux-node';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    // Proteção: apenas usuários autenticados (professores/arquitetos) podem solicitar uma URL de Upload
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });

    // Cria uma URL pre-signed para Upload Direto (que expira rápido)
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['signed'], // Somente acesso assinado/privado
        video_quality: 'basic',      // Presença de resolução adaptativa base sem custos excessivos no Mux
        mp4_support: 'none',         // Reduz o custo para focar 100% no HLS
        passthrough: `author:${user.email || user.id}` // Assinatura Organizacional para a MUX
      },
      cors_origin: '*', // O domínio que fará o request (Pode ser restringido pelo host)
    });

    return NextResponse.json({
      id: upload.id,
      url: upload.url, // O frontend fará o PUT diretamente nessa URL
    });
  } catch (error) {
    console.error('Erro na rota POST /api/mux/upload:', error);
    return NextResponse.json({ error: 'Internal Server Error ao conectar na Mux' }, { status: 500 });
  }
}
