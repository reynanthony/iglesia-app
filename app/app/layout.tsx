import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import NotificationBell from '@/components/NotificationBell'
import AppNav, { AppBottomNav } from '@/components/app/AppNav'
import { Globe, LogOut, Cross, ShieldCheck } from 'lucide-react'
import { CapacitorBridge } from '@/components/app/CapacitorBridge'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profileHref = profile?.username ? `/app/perfil/${profile.username}` : '/app/comunidad'
  const initial = profile?.full_name?.[0]?.toUpperCase() ?? 'U'

  return (
    <>
      <CapacitorBridge />

      {/*
        ══════════════════════════════════════════════════════
        MOBILE LAYOUT — Flex column, sin position:fixed.
        Capacitor WebView no garantiza fixed. Usamos flex
        para que header y nav sean elementos del flujo normal.
        ══════════════════════════════════════════════════════
      */}
      <div
        className="md:hidden flex flex-col"
        style={{
          height: '100dvh',
          overflow: 'hidden',
          background: '#061E30',
          color: '#F6F3EB',
        }}
      >
        {/* Safe area top (status bar en iOS/Android) */}
        <div style={{
          height: 'env(safe-area-inset-top, 0px)',
          flexShrink: 0,
          background: 'rgba(6,30,48,0.98)',
        }} />

        {/* Header — 56px fijo, en flujo normal (no fixed) */}
        <header
          style={{
            height: 56,
            flexShrink: 0,
            background: 'rgba(6,30,48,0.98)',
            borderBottom: '1px solid #0D3352',
          }}
        >
          <div className="px-4 flex items-center justify-between h-full">
            <Link href="/app/comunidad" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#0D3352' }}>
                <Cross size={14} strokeWidth={2.5} style={{ color: '#76ABAE' }} />
              </div>
              <span className="font-black text-base tracking-tight" style={{ color: '#F6F3EB' }}>
                El Manantial
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
                <Link
                  href="/admin"
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition"
                  style={{ color: 'rgba(246,243,235,0.45)' }}
                  title="Admin"
                >
                  <ShieldCheck size={19} />
                </Link>
              )}
              <NotificationBell userId={user.id} />
              <Link href={profileHref}>
                <div
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm ml-1"
                  style={{ background: '#0D3352', color: '#76ABAE' }}
                >
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" width={36} height={36} loading="lazy" className="w-full h-full object-cover" />
                    : initial}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Área de contenido — scrolleable, ocupa todo el espacio restante */}
        <main
          style={{
            flex: 1,
            minHeight: 0,           /* evita que flexbox desborde */
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch' as any,
            overscrollBehaviorY: 'contain' as any,
            background: '#061E30',
          }}
        >
          {children}
        </main>

        {/* Bottom nav — 56px fijo, en flujo normal (no fixed) */}
        <nav
          style={{
            flexShrink: 0,
            background: 'rgba(6,30,48,0.98)',
            borderTop: '1px solid #0D3352',
          }}
        >
          <AppBottomNav profileHref={profileHref} />
        </nav>

        {/* Safe area bottom (home indicator en iPhone) */}
        <div style={{
          height: 'env(safe-area-inset-bottom, 0px)',
          flexShrink: 0,
          background: 'rgba(6,30,48,0.98)',
        }} />
      </div>

      {/*
        ══════════════════════════════════════════════════════
        DESKTOP LAYOUT — Sidebar fija + contenido
        ══════════════════════════════════════════════════════
      */}
      <div
        className="hidden md:flex"
        style={{ minHeight: '100vh', background: '#061E30', color: '#F6F3EB' }}
      >
        {/* Sidebar */}
        <aside
          className="w-60 flex-shrink-0 flex flex-col sticky top-0 h-screen"
          style={{ background: '#061E30', borderRight: '1px solid #0D3352' }}
        >
          <div className="px-5 py-6" style={{ borderBottom: '1px solid #0D3352' }}>
            <Link href="/app/comunidad" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#0D3352' }}>
                <Cross size={15} strokeWidth={2.5} style={{ color: '#76ABAE' }} />
              </div>
              <div>
                <p className="font-black text-[13px] leading-tight tracking-tight" style={{ color: '#F6F3EB' }}>
                  El Manantial
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(246,243,235,0.35)' }}>
                  Comunidad
                </p>
              </div>
            </Link>
          </div>

          <AppNav profileHref={profileHref} />

          <div className="px-3 pb-5" style={{ borderTop: '1px solid #0D3352', paddingTop: '1rem' }}>
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#0D3352]" style={{ color: 'rgba(246,243,235,0.40)' }}>
              <Globe size={16} />
              <span>Página principal</span>
            </Link>
            {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
              <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#0D3352]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                <ShieldCheck size={16} />
                <span>Panel Admin</span>
              </Link>
            )}
            <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
              <Link href={profileHref} className="flex-1 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm" style={{ background: '#0D3352', color: '#76ABAE' }}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" width={32} height={32} loading="lazy" className="w-full h-full object-cover" />
                    : initial}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold truncate leading-tight" style={{ color: '#F6F3EB' }}>{profile?.full_name ?? 'Usuario'}</p>
                  <p className="text-[11px] truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>@{profile?.username ?? ''}</p>
                </div>
              </Link>
              <NotificationBell userId={user.id} />
              <form action={logout}>
                <button type="submit" className="w-9 h-9 flex items-center justify-center rounded-lg transition hover:text-white" style={{ color: 'rgba(246,243,235,0.40)' }} title="Cerrar sesión">
                  <LogOut size={15} />
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Contenido desktop */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </>
  )
}
