import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Lógica de Server Action isolada para criar a escola (ou atualizar dados do organizador)
  async function submitOnboarding(formData: FormData) {
    'use server'
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    if (!user) return

    const { data: prof } = await supabaseServer.from('profiles').select('role').eq('id', user.id).single()
    const role = prof?.role

    if (role === 'school_director') {
      const schoolName = formData.get('school_name') as string
      // Inserir a escola no banco atrelando ao Diretor Logado
      await supabaseServer.from('schools').insert({
        name: schoolName,
        director_id: user.id
      })
      // Redireciona para o dashboard da escola
      redirect('/school')
    } else if (role === 'organizer') {
      // Redireciona para o dashboard de festivais
      redirect('/festivals')
    } else {
      // Redireciona para bailarino
      redirect('/dancer')
    }
  }

  // Verifica se o Diretor já tem uma escola. Se sim, não precisa do Onboarding.
  if (profile?.role === 'school_director') {
    const { data: schools } = await supabase.from('schools').select('id').eq('director_id', user.id)
    if (schools && schools.length > 0) {
      redirect('/school')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 animate-in slide-in-from-bottom-8 duration-500">
      <div className="glass-panel p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading text-white tracking-wider mb-2">Bem-vindo(a) ao Wing, {profile?.full_name}!</h1>
          <p className="text-gray-400">
            Você se cadastrou como <span className="text-primary font-bold uppercase">{profile?.role}</span>.
            Para iniciarmos, precisamos configurar o seu espaço na plataforma.
          </p>
        </div>

        <form action={submitOnboarding} className="space-y-6">
          {profile?.role === 'school_director' && (
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400">
                Nome Oficial da Sua Escola/Grupo
              </label>
              <input
                required
                name="school_name"
                className="w-full rounded-md px-4 py-3 bg-black/50 border border-gray-700 text-white focus:outline-none focus:border-accent transition-colors focus:ring-1 focus:ring-accent"
                placeholder="Ex: Companhia de Dança XYZ"
              />
              <p className="text-xs text-gray-500">
                Este é o nome que aparecerá nos festivais e para os seus bailarinos quando eles se vincularem.
              </p>
            </div>
          )}

          {profile?.role === 'organizer' && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-md text-sm text-gray-300">
              <p>Seu perfil de Organizador já está pré-aprovado. Clique em continuar para acessar o painel de Criação de Festivais.</p>
            </div>
          )}

          {profile?.role === 'dancer' && (
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-md text-sm text-gray-300">
              <p>Você acessará o painel central do Bailarino, onde poderá conectar-se à sua escola através do link/código deles.</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800">
            <button
              type="submit"
              className="w-full bg-gradient-neon rounded-md px-4 py-3 text-white font-bold uppercase tracking-wider font-display hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Começar a usar o Wing
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
