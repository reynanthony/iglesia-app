import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session on every request (keeps JWT alive)
  const { data: { user } } = await supabase.auth.getUser()

  // /app/* — require any authenticated user
  if (pathname.startsWith('/app')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // /admin/* — require admin/pastor/moderador
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (!profile || !['admin', 'pastor', 'moderador'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/app/comunidad', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/app/:path*',
    '/admin/:path*',
  ],
}
