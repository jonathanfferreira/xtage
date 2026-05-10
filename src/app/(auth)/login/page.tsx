import Link from 'next/link'
import { login } from '../actions'

export default async function LoginPage({
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
          <h1 className="text-4xl font-heading text-white tracking-wider mb-2">Login</h1>
          <p className="text-sm text-gray-400">Acesse sua conta para continuar.</p>
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
            Senha
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
          <p className="mt-2 p-4 bg-red-900/30 border border-red-500/50 text-red-200 text-center text-sm rounded-md">
            {resolvedParams.message}
          </p>
        )}

        <button
          formAction={login}
          className="bg-gradient-neon rounded-md px-4 py-3 text-white font-bold uppercase tracking-wider font-display hover:opacity-90 transition-opacity mt-4 shadow-lg shadow-primary/20"
        >
          Entrar no Wing
        </button>
        
        <p className="text-center text-sm text-gray-400 mt-4">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-highlight hover:underline font-semibold">
            Criar agora
          </Link>
        </p>
      </form>
    </div>
  )
}
