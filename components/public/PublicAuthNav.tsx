'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { logout } from '@/app/actions/auth'
import { CARD, MUTED, INK } from '@/lib/gold-theme'

export function PublicAuthNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      setReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Default state: show login button (no layout shift for guests)
  if (!ready || !isLoggedIn) {
    return (
      <Link
        href="/login"
        className="hidden md:inline-flex items-center font-black text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition hover:opacity-90"
        style={{ background: INK, color: CARD }}
      >
        Entrar
      </Link>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Link
        href="/app/feed"
        className="inline-flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition hover:opacity-90"
        style={{ background: INK, color: CARD }}
      >
        <LayoutDashboard size={13} /> Mi comunidad
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center rounded-full transition hover:bg-white/10"
          style={{ color: MUTED }}
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </form>
    </div>
  )
}
