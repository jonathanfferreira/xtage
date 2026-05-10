import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Music, Info } from 'lucide-react'
import { redirect } from 'next/navigation'
import { enrollChoreography } from '@/app/actions/school'

export default async function EnrollChoreographyPage({
  params,
  searchParams
}: {
  params: Promise<{ festivalId: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const festivalId = resolvedParams.festivalId

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: festival } = await supabase.from('festivals').select('*').eq('id', festivalId).single()
  if (!festival) {
    redirect('/school?error=Festival%20não%20encontrado')
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/school" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Dashboard
        </Link>
        <h1 className="text-3xl font-heading text-white tracking-wider">Inscrever Coreografia</h1>
        <p className="text-secondary font-bold tracking-widest uppercase text-xs mt-2 border border-secondary/30 bg-secondary/10 px-3 py-1 inline-block rounded-full">
          {festival.name}
        </p>
      </div>

      <div className="glass-panel border border-gray-800 rounded-2xl p-6 md:p-8">
        {resolvedSearchParams?.error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-md">
            {resolvedSearchParams.error}
          </div>
        )}

        <form action={enrollChoreography} className="space-y-8">
          <input type="hidden" name="festival_id" value={festival.id} />

          {/* Dados da Coreografia */}
          <div className="space-y-4">
            <h2 className="text-lg font-heading text-white border-b border-gray-800 pb-2 flex items-center">
              <Info className="w-5 h-5 mr-2 text-primary" /> Ficha Técnica
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="name">
                Nome da Coreografia
              </label>
              <input
                required
                name="name"
                className="w-full rounded-md px-4 py-3 bg-black/50 border border-gray-700 text-white focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
                placeholder="Ex: Noites de Sol (Jazz)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="category">
                Modalidade / Categoria
              </label>
              <select 
                required
                name="category"
                className="w-full rounded-md px-4 py-3 bg-black/50 border border-gray-700 text-white focus:outline-none focus:border-accent transition-colors focus:ring-1 focus:ring-accent appearance-none"
              >
                <option value="jazz_conjunto_avancado">Jazz - Conjunto Avançado</option>
                <option value="ballet_classico_solo">Ballet Clássico de Repertório - Solo</option>
                <option value="dancas_urbanas_duo">Danças Urbanas - Duo</option>
                <option value="danca_contemporanea_trio">Dança Contemporânea - Trio</option>
              </select>
            </div>
          </div>

          {/* Trilha Sonora MVP */}
          <div className="space-y-4">
            <h2 className="text-lg font-heading text-white border-b border-gray-800 pb-2 flex items-center">
              <Music className="w-5 h-5 mr-2 text-secondary" /> Trilha Sonora
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="music_url">
                Link da Música (YouTube ou Google Drive Público)
              </label>
              <input
                name="music_url"
                type="url"
                className="w-full rounded-md px-4 py-3 bg-black/50 border border-gray-700 text-white focus:outline-none focus:border-secondary transition-colors focus:ring-1 focus:ring-secondary"
                placeholder="https://youtube.com/..."
              />
              <p className="text-xs text-gray-500">
                A organização usará este link para o som do evento. Verifique se não está privado!
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              className="bg-gradient-neon rounded-md px-8 py-3 text-white font-bold uppercase tracking-wider font-display hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Adicionar ao Carrinho da Escola
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
