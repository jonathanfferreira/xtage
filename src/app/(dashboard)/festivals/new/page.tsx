import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createFestival } from '@/app/actions/festivals'

export default async function NewFestivalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const resolvedParams = await searchParams

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'organizer') {
    redirect('/festivals')
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/festivals" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Meus Festivais
        </Link>
        <h1 className="text-3xl font-heading text-white tracking-wider">Lançar Novo Evento</h1>
        <p className="text-gray-400 mt-1">Configure as regras e datas do seu festival. Ele será salvo como rascunho inicialmente.</p>
      </div>

      <div className="glass-panel border border-gray-800 rounded-2xl p-6 md:p-8">
        {resolvedParams?.error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-md">
            {resolvedParams.error}
          </div>
        )}

        <form action={createFestival} className="space-y-8">
          {/* Seção 1: Identidade */}
          <div className="space-y-4">
            <h2 className="text-lg font-heading text-white border-b border-gray-800 pb-2">1. Identidade do Festival</h2>
            
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="name">
                Nome do Evento
              </label>
              <input
                required
                name="name"
                id="name"
                className="w-full rounded-md px-4 py-3 bg-black/50 border border-gray-700 text-white focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
                placeholder="Ex: Wing Dance Festival 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="description">
                Descrição Curta / Edital Resumido
              </label>
              <textarea
                required
                name="description"
                id="description"
                rows={4}
                className="w-full rounded-md px-4 py-3 bg-black/50 border border-gray-700 text-white focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary resize-none"
                placeholder="Descreva o propósito do festival, estilos aceitos e regras principais."
              />
            </div>
          </div>

          {/* Seção 2: Cronograma */}
          <div className="space-y-4">
            <h2 className="text-lg font-heading text-white border-b border-gray-800 pb-2">2. Cronograma</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="start_date">
                  Data de Início
                </label>
                <input
                  required
                  type="date"
                  name="start_date"
                  id="start_date"
                  className="w-full rounded-md px-4 py-3 bg-black/50 border border-gray-700 text-white focus:outline-none focus:border-secondary transition-colors focus:ring-1 focus:ring-secondary [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="end_date">
                  Data de Encerramento
                </label>
                <input
                  required
                  type="date"
                  name="end_date"
                  id="end_date"
                  className="w-full rounded-md px-4 py-3 bg-black/50 border border-gray-700 text-white focus:outline-none focus:border-secondary transition-colors focus:ring-1 focus:ring-secondary [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 flex justify-end">
            <Link 
              href="/festivals" 
              className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors mr-4"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-gradient-neon rounded-md px-8 py-3 text-white font-bold uppercase tracking-wider font-display hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Salvar como Rascunho
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
