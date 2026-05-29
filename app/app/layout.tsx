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
    <div className="min-h-screen" style={{ background: '#061E30', color: '#F6F3EB' }}>
      <CapacitorBridge />

      {/* ── SIDEBAR (desktop) ── */}
      <aside
        className="hidden md:flex w-60 flex-col fixed h-full z-30"
        style={{ background: '#061E30', borderRight: '1px solid #0D3352' }}
      >
        <div className="px-5 py-6" style={{ borderBottom: '1px solid #0D3352' }}>
          <Link href="/app/comunidad" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#0D3352' }}>
              <Cross size={15} strokeWidth={2.5} style={{ color: '#76ABAE' }} />
            </div>
            <div>
              <p className="font-black text-[13px] leading-tight tracking-tight" style={{ color: '#F6F3EB' }}>El Manantial</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(246,243,235,0.35)' }}>Comunidad</p>
            </div>
          </Link>
        </div>
        <AppNav profileHref={profileHref} />
        <div className="px-3 pb-5" style={{ borderTop: '1px solid #0D3352', paddingTop: '1rem' }}>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#0D3352]" style={{ color: 'rgba(246,243,235,0.40)' }}>
            <Globe size={16} /><span>Página principal</span>
          </Link>
          {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#0D3352]" style={{ color: 'rgba(246,243,235,0.40)' }}>
              <ShieldCheck size={16} /><span>Panel Admin</span>
            </Link>
          )}
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <Link href={profileHref} className="flex-1 flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm" style={{ background: '#0D3352', color: '#76ABAE' }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" width={32} height={32} loading="lazy" className="w-full h-full object-cover" /> : initial}
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

      {/* ── HEADER (mobile) ──
          Altura total = env(safe-area-inset-top) + 56px.
          El <main> compensa con padding-top idéntico via .app-header-offset.
      */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-30"
        style={{
          background: 'rgba(6,30,48,0.97)',
          borderBottom: '1px solid #0D3352',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="flex items-center justify-between px-4" style={{ height: 56 }}>
          {/* Brand */}
          <Link href="/app/comunidad" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#0D3352' }}>
              <Cross size={14} strokeWidth={2.5} style={{ color: '#76ABAE' }} />
            </div>
            <span className="font-black text-[15px] tracking-tight" style={{ color: '#F6F3EB' }}>El Manantial</span>
          </Link>

          {/* Acciones */}
          <div className="flex items-center gap-0.5">
            <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ color: 'rgba(246,243,235,0.45)' }} title="Sitio público">
              <Globe size={19} />
            </Link>
            {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
              <Link href="/admin" className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ color: 'rgba(246,243,235,0.45)' }}>
                <ShieldCheck size={19} />
              </Link>
            )}
            <NotificationBell userId={user.id} />
            <Link href={profileHref} className="ml-1">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm" style={{ background: '#0D3352', color: '#76ABAE' }}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" width={32} height={32} loading="lazy" className="w-full h-full object-cover" />
                  : initial}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="md:ml-60 app-header-offset">
        {children}
        {/* Spacer para que el contenido no quede detrás del nav inferior */}
        <div className="md:hidden app-nav-spacer" />
      </main>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30"
        style={{
          background: 'rgba(6,30,48,0.97)',
          borderTop: '1px solid #0D3352',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <AppBottomNav profileHref={profileHref} />
      </nav>
    </div>
  )
}
