import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { PlusCircle, Calendar, Edit3 } from 'lucide-react'

export default async function FestivalsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const resolvedParams = await searchParams

  if (!user) return null

  // Traz a lista de festivais APENAS desse usuário logado (se for organizer) ou publicos/todos que ele criou. 
  // RLS vai tratar de vazar dados, mas filtraremos explicitamente.
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  // Condicional de Listagem baseada no Perfil
  let festivals = []
  
  if (profile?.role === 'organizer') {
    const { data } = await supabase.from('festivals')
      .select('*')
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false })
    festivals = data || []
  } else {
    // Escolas/Dancers veriam apenas festivais ativos
    const { data } = await supabase.from('festivals')
      .select('*')
      .eq('status', 'active')
      .order('start_date', { ascending: true })
    festivals = data || []
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-heading text-white tracking-wider">Festivais</h1>
          <p className="text-gray-400 mt-1">Gerencie ou inscreva-se nos eventos da plataforma.</p>
        </div>
        
        {profile?.role === 'organizer' && (
          <Link
            href="/festivals/new"
            className="inline-flex items-center bg-gradient-neon px-6 py-3 rounded-md text-white font-bold uppercase tracking-wider font-display hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Evento
          </Link>
        )}
      </div>

      {resolvedParams?.success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 text-green-200 rounded-md">
          {resolvedParams.success}
        </div>
      )}

      {festivals.length === 0 ? (
        <div className="glass-panel border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 border border-gray-800">
            <Calendar className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-2xl font-heading text-white mb-2">Nenhum Festival Encontrado</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            {profile?.role === 'organizer' 
              ? "Você ainda não criou nenhum evento. Clique no botão acima para organizar seu primeiro festival de dança." 
              : "Não há nenhum festival com inscrições abertas no momento."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {festivals.map((festival) => (
            <div key={festival.id} className="glass-panel border border-gray-800/80 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full 
                    ${festival.status === 'draft' ? 'bg-gray-800 text-gray-400' : 
                      festival.status === 'active' ? 'bg-green-900/50 text-green-400 border border-green-700/50' : 
                      'bg-red-900/50 text-red-400 border border-red-700/50'}`}>
                    {festival.status === 'draft' ? 'Rascunho' : festival.status === 'active' ? 'Ativo' : 'Encerrado'}
                  </span>
                </div>
                <h3 className="text-xl font-heading text-white mb-2 truncate" title={festival.name}>{festival.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{festival.description || "Nenhuma descrição fornecida."}</p>
                
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(festival.start_date).toLocaleDateString('pt-BR')} - {new Date(festival.end_date).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              {profile?.role === 'organizer' && (
                <div className="bg-black/40 border-t border-gray-800 p-4 flex justify-end">
                  <Link href={`/festivals/${festival.id}/edit`} className="text-sm flex items-center text-gray-400 hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4 mr-2" /> Editar Evento
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
