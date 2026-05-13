import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Users, LogOut, Settings, CalendarRange, Trophy } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar perfil para exibir info na UI
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Glow de Fundo Global para o Dashboard */}
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Sidebar - Efeito Glass */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-800/50 bg-black/40 backdrop-blur-md relative z-10 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800/50">
          <Link href="/" className="font-heading text-2xl tracking-wider text-white hover:opacity-80 transition-opacity">
            WING
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {/* Navegação Base - Podemos criar componentes dinâmicos de acordo com o ROLE depois */}
          <Link href="/dancer" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors group">
            <LayoutDashboard className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
            <span className="font-display uppercase text-sm tracking-wider">Dashboard</span>
          </Link>
          
          <Link href="/festivals" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors group">
            <CalendarRange className="w-5 h-5 mr-3 group-hover:text-secondary transition-colors" />
            <span className="font-display uppercase text-sm tracking-wider">Festivais</span>
          </Link>

          <Link href="/school" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors group">
            <Users className="w-5 h-5 mr-3 group-hover:text-accent transition-colors" />
            <span className="font-display uppercase text-sm tracking-wider">Minha Escola</span>
          </Link>

          <Link href="/ranking" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors group">
            <Trophy className="w-5 h-5 mr-3 group-hover:text-highlight transition-colors" />
            <span className="font-display uppercase text-sm tracking-wider">Ranking</span>
          </Link>
        </div>

        <div className="p-4 border-t border-gray-800/50">
          <form action="/auth/signout" method="post">
            <button className="flex w-full items-center px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors group">
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-display uppercase text-sm tracking-wider">Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Header - Glassmorphism Mobile & User Menu */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-gray-800/50 bg-black/20 backdrop-blur-md">
          <div className="md:hidden">
            <span className="font-heading text-xl text-white">WING</span>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-white">{profile?.full_name || user.email}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{profile?.role}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-neon p-[2px]">
              <div className="h-full w-full bg-black rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
