import Link from 'next/link'
import { signup } from '../actions'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const resolvedParams = await searchParams
  
  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-surface hover:bg-surface-hover flex items-center group text-sm transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Voltar
      </Link>

      <form className="flex-1 flex flex-col w-full justify-center gap-6 animate-in text-gray-100">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-heading text-white tracking-wider mb-2">Criar Conta</h1>
          <p className="text-sm text-gray-400">Junte-se à revolução dos festivais.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="full_name">
            Nome Completo
          </label>
          <input
            className="rounded-md px-4 py-3 bg-surface border border-gray-700/50 text-white focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
            name="full_name"
            placeholder="Seu nome real"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="role">
            Seu Perfil
          </label>
          <select 
            name="role" 
            className="rounded-md px-4 py-3 bg-surface border border-gray-700/50 text-white focus:outline-none focus:border-accent transition-colors focus:ring-1 focus:ring-accent appearance-none"
            required
          >
            <option value="dancer">Bailarino</option>
            <option value="school_director">Diretor(a) de Escola</option>
            <option value="organizer">Organizador de Eventos</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-3 bg-surface border border-gray-700/50 text-white focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
            name="email"
            placeholder="voce@exemplo.com"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-bold tracking-widest text-gray-400" htmlFor="password">
            Senha Segura
          </label>
          <input
            className="rounded-md px-4 py-3 bg-surface border border-gray-700/50 text-white focus:outline-none focus:border-secondary transition-colors focus:ring-1 focus:ring-secondary"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>

        {resolvedParams?.message && (
          <p className="mt-2 p-4 bg-orange-900/30 border border-orange-500/50 text-orange-200 text-center text-sm rounded-md">
            {resolvedParams.message}
          </p>
        )}

        <button
          formAction={signup}
          className="bg-surface hover:bg-surface-hover border border-gray-700 hover:border-gray-500 rounded-md px-4 py-3 text-white font-bold uppercase tracking-wider font-display transition-all mt-4"
        >
          Criar minha conta
        </button>
        
        <p className="text-center text-sm text-gray-400 mt-4">
          Já possui conta?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold hover:text-secondary transition-colors">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  )
}
