import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { CalendarRange, Sparkles, Navigation } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SchoolDashboard({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const resolvedParams = await searchParams

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'school_director') redirect('/login')

  const { data: school } = await supabase.from('schools').select('*').eq('director_id', user.id).single()

  // Buscar festivais ativos para inscrição
  const { data: activeFestivals } = await supabase.from('festivals').select('*').eq('status', 'active').order('start_date', { ascending: true })

  // Buscar minhas inscrições (Coreografias vinculadas à minha escola)
  const { data: myInscriptions } = await supabase
    .from('inscriptions')
    .select(`
      id, status, created_at,
      choreographies ( name, category, festivals ( name ) )
    `)
    .eq('school_id', school?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-heading text-white tracking-wider">Dashboard da Escola</h1>
        <p className="text-primary font-bold tracking-widest uppercase text-sm mt-1">{school?.name || 'Escola não configurada'}</p>
      </div>

      {resolvedParams?.success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 text-green-200 rounded-md">
          {resolvedParams.success}
        </div>
      )}

      {/* Grid Layout em 2 colunas: Abertos e Minhas Coreos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Festivais Abertos */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-heading text-white">Festivais com Inscrições Abertas</h2>
          </div>

          {!activeFestivals || activeFestivals.length === 0 ? (
            <div className="p-8 border border-gray-800 border-dashed rounded-xl text-center text-gray-500">
              Nenhum festival está recebendo inscrições no momento.
            </div>
          ) : (
            <div className="space-y-4">
              {activeFestivals.map(festival => (
                <div key={festival.id} className="glass-panel p-5 border border-gray-800 rounded-xl hover:border-secondary/50 transition-colors group">
                  <h3 className="text-lg font-heading text-white mb-1 truncate" title={festival.name}>{festival.name}</h3>
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <CalendarRange className="w-4 h-4 mr-2" />
                    {new Date(festival.start_date).toLocaleDateString('pt-BR')} até {new Date(festival.end_date).toLocaleDateString('pt-BR')}
                  </div>
                  <Link 
                    href={`/school/enroll/${festival.id}`}
                    className="inline-flex w-full justify-center items-center px-4 py-2 bg-white/5 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded-md font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Inscrever Coreografias
                    <Navigation className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Histórico de Inscrições */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <h2 className="text-xl font-heading text-white">Nossas Inscrições / Coreografias</h2>
          </div>

          {!myInscriptions || myInscriptions.length === 0 ? (
            <div className="glass-panel p-12 border border-gray-800 rounded-xl text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
                <span className="text-gray-600">🎭</span>
              </div>
              <p className="text-gray-400 max-w-sm">Você ainda não inscreveu nenhuma coreografia em festivais pela sua escola.</p>
            </div>
          ) : (
            <div className="glass-panel border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-800">
                    <th className="p-4 font-semibold">Coreografia</th>
                    <th className="p-4 font-semibold">Festival</th>
                    <th className="p-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {myInscriptions.map((insc: any) => (
                    <tr key={insc.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="text-white font-medium">{insc.choreographies?.name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{insc.choreographies?.category}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {insc.choreographies?.festivals?.name}
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-orange-900/40 text-orange-400 border border-orange-700/50">
                          {insc.status === 'pending_school_approval' ? 'Carrinho / Rascunho' : insc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
