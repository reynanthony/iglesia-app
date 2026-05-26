import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import NotificationBell from '@/components/NotificationBell'
import AppNav, { AppBottomNav } from '@/components/app/AppNav'
import { Globe, LogOut, Cross, ShieldCheck } from 'lucide-react'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profileHref = '/app/perfil/' + (profile?.username ?? '')
  const initial = profile?.full_name?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#F5F5F5' }}>

      {/* ── SIDEBAR (desktop) ── */}
      <aside
        className="hidden md:flex w-60 flex-col fixed h-full z-30"
        style={{ background: '#0A0A0A', borderRight: '1px solid #1A1A1A' }}
      >
        {/* Brand */}
        <div className="px-5 py-6" style={{ borderBottom: '1px solid #1A1A1A' }}>
          <Link href="/app/feed" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#000000] rounded-lg flex items-center justify-center text-black flex-shrink-0">
              <Cross size={15} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-black text-[13px] leading-tight tracking-tight" style={{ color: '#F5F5F5' }}>
                El Manantial
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#4D4D4D' }}>
                Comunidad
              </p>
            </div>
          </Link>
        </div>

        {/* Nav — client component owns icons + active state */}
        <AppNav profileHref={profileHref} />

        {/* Footer */}
        <div className="px-3 pb-5" style={{ borderTop: '1px solid #1A1A1A', paddingTop: '1rem' }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#111111]"
            style={{ color: '#4D4D4D' }}
          >
            <Globe size={16} />
            <span>Página principal</span>
          </Link>
          {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#111111]"
              style={{ color: '#4D4D4D' }}
            >
              <ShieldCheck size={16} />
              <span>Panel Admin</span>
            </Link>
          )}

          {/* User card */}
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <Link href={profileHref} className="flex-1 flex items-center gap-3 min-w-0 group">
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
                style={{ background: 'rgba(0,0,0,0.15)', color: '#000000' }}
              >
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" width={32} height={32} loading="lazy" className="w-full h-full object-cover" />
                  : initial}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold truncate leading-tight group-hover:text-[#222222] transition"
                  style={{ color: '#F5F5F5' }}>
                  {profile?.full_name ?? 'Usuario'}
                </p>
                <p className="text-[11px] truncate" style={{ color: '#4D4D4D' }}>
                  @{profile?.username ?? ''}
                </p>
              </div>
            </Link>
            <NotificationBell userId={user.id} />
            <form action={logout}>
              <button
                type="submit"
                className="p-1.5 rounded-lg transition hover:text-white"
                style={{ color: '#4D4D4D' }}
                title="Cerrar sesión"
              >
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ── HEADER (mobile) ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between backdrop-blur-md"
        style={{ background: 'rgba(10,10,10,0.92)', borderBottom: '1px solid #1A1A1A' }}
      >
        <Link href="/app/feed" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#000000] rounded-lg flex items-center justify-center text-black"><Cross size={13} strokeWidth={2.5} /></div>
          <span className="font-black text-sm tracking-tight" style={{ color: '#F5F5F5' }}>El Manantial</span>
        </Link>
        <div className="flex items-center gap-2">
          {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
            <Link href="/admin" className="p-1.5 rounded-lg transition" style={{ color: '#4D4D4D' }} title="Panel Admin">
              <ShieldCheck size={18} />
            </Link>
          )}
          <NotificationBell userId={user.id} />
          <Link href={profileHref}>
            <div
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm"
              style={{ background: 'rgba(0,0,0,0.15)', color: '#000000' }}
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" width={32} height={32} loading="lazy" className="w-full h-full object-cover" />
                : initial}
            </div>
          </Link>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="md:ml-60 pt-14 md:pt-0">
        {children}
        {/* Spacer so content clears the fixed bottom nav (mobile only) */}
        <div className="md:hidden" style={{ height: 'calc(56px + env(safe-area-inset-bottom, 0px))' }} />
      </main>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md"
        style={{ background: 'rgba(10,10,10,0.96)', borderTop: '1px solid #1A1A1A' }}
      >
        <AppBottomNav profileHref={profileHref} />
      </nav>

    </div>
  )
}
