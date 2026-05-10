import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rotas restritas que exigem login
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/organizer') || 
                           request.nextUrl.pathname.startsWith('/school') || 
                           request.nextUrl.pathname.startsWith('/dancer') ||
                           request.nextUrl.pathname.startsWith('/onboarding')

  // Redirecionamento se for rota privada sem login
  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Se logado e tentou ir no login/register, joga pro onboarding ou base (dependendo se tem profile - tratamos depois no layout/action)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    // Simplificado: joga para o loading ou base. No futuro, baseia em user.user_metadata.role
    url.pathname = '/dancer' // default
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
