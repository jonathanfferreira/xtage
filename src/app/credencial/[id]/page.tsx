import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Credencial Digital | XTAGE',
  description: 'Credencial oficial de bailarino verificada pela plataforma XTAGE.',
};

export default async function CredencialPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('id', params.id)
    .maybeSingle();

  if (!profile) return notFound();

  const { data: schoolData } = await supabase
    .from('school_dancers')
    .select('schools(name), status')
    .eq('dancer_id', params.id)
    .eq('status', 'accepted')
    .maybeSingle();

  const { data: choreoData } = await supabase
    .from('choreography_dancers')
    .select('choreographies(name, category)')
    .eq('dancer_id', params.id);

  const schoolName = (schoolData?.schools as any)?.name || 'Escola não encontrada';
  const choreographies = (choreoData || [])
    .map((d: any) => d.choreographies)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-neon-gradient flex items-center justify-center font-bold text-white">X</div>
            <span className="text-xl font-bold tracking-tight text-white">XTAGE</span>
          </div>
          <p className="text-zinc-500 text-xs">Plataforma Oficial de Festivais de Dança</p>
        </div>

        {/* Credential Card */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#0d0020] via-[#0a0015] to-[#050505] p-8 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-neon-gradient" />

          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.25em]">Credencial Digital Verificada</span>
              <h1 className="text-3xl font-title font-black text-white">{profile.full_name}</h1>
              <p className="text-zinc-400">{schoolName}</p>
            </div>

            {/* Choreographies */}
            {choreographies.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Coreografias Inscrita(s)</p>
                {choreographies.map((c: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">{c.name}</p>
                      <p className="text-xs text-zinc-500">{c.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <div>
                <p className="text-green-400 font-bold text-sm">Credencial Válida</p>
                <p className="text-zinc-500 text-xs">Verificada pela plataforma XTAGE · {new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-500/10 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-700">ID: {profile.id.substring(0, 16).toUpperCase()}…</span>
              <span className="text-[10px] text-zinc-700">XTAGE © 2026</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600">
          Este é um documento digital oficial. Apresente na entrada do evento para validação.
        </p>
      </div>
    </div>
  );
}
