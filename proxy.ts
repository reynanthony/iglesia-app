import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Guard protected routes at the edge — before any Server Component renders
  if (!user && (path.startsWith('/app') || path.startsWith('/admin'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // /admin/* — require admin/pastor/moderador, o lider con can_admin para /admin/ministerio
  if (user && path.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isFullAdmin = profile && ['admin', 'pastor', 'moderador'].includes(profile.role)

    if (!isFullAdmin) {
      if (path.startsWith('/admin/ministerio')) {
        const { count } = await supabase
          .from('ministry_assignments')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('can_admin', true)
        if (!count || count === 0) {
          const url = request.nextUrl.clone()
          url.pathname = '/app/comunidad'
          return NextResponse.redirect(url)
        }
      } else {
        const url = request.nextUrl.clone()
        url.pathname = '/app/comunidad'
        return NextResponse.redirect(url)
      }
    }
  }

  // Skip login/registro for already authenticated users
  if (user && (path === '/login' || path === '/registro')) {
    const url = request.nextUrl.clone()
    url.pathname = '/app/feed'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*', '/login', '/registro'],
}