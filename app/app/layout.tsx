import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import NotificationBell from '@/components/NotificationBell'
import AppNav, { AppBottomNav } from '@/components/app/AppNav'
import { Globe, LogOut, Cross, ShieldCheck, Building2 } from 'lucide-react'
import { CapacitorBridge } from '@/components/app/CapacitorBridge'
import { getUser, getProfile } from '@/lib/supabase/cached-user'
import AnnouncementGate from '@/components/app/AnnouncementEngine/AnnouncementGate'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/site-settings'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const [profile, { siteName }] = await Promise.all([
    getProfile(user.id),
    getSiteSettings(),
  ])

  // Verificar si el líder tiene acceso admin delegado a algún ministerio
  let isLiderAdmin = false
  if (profile?.role === 'lider') {
    const supabase = await createClient()
    const { count } = await supabase
      .from('ministry_assignments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('can_admin', true)
    isLiderAdmin = (count ?? 0) > 0
  }

  const profileHref = profile?.username ? `/app/perfil/${profile.username}` : '/app/comunidad'
  const initial = profile?.full_name?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="min-h-screen font-app" style={{ background: BG, color: INK }}>
      <CapacitorBridge />
      <AnnouncementGate
        onboardingCompleted={profile?.onboarding_completed ?? false}
        userId={user.id}
        userRole={profile?.role ?? 'visitante'}
        siteName={siteName}
        hasBottomNav
      />

      {/* ── SIDEBAR (desktop) ── */}
      <aside
        className="hidden md:flex w-60 flex-col fixed h-full z-30"
        style={{ background: BG, borderRight: `1px solid ${BORDER}` }}
      >
        <div className="px-5 py-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <Link href="/app/inicio" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFFFFF' }}>
              <img src="/logo-icon.png" alt="" width={21} height={21} className="w-[21px] h-[21px] object-contain" />
            </div>
            <div>
              <p className="font-logo text-[19px] leading-tight" style={{ color: INK }}>{siteName}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: MUTED }}>Comunidad</p>
            </div>
          </Link>
        </div>
        <AppNav profileHref={profileHref} />
        <div className="px-3 pb-5" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1rem' }}>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#181A22]" style={{ color: MUTED }}>
            <Globe size={16} /><span>Página principal</span>
          </Link>
          <Link href="/app/pastoral" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#181A22]" style={{ color: MUTED }}>
            <Cross size={16} /><span>Pastoral</span>
          </Link>
          {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#181A22]" style={{ color: MUTED }}>
              <ShieldCheck size={16} /><span>Panel Admin</span>
            </Link>
          )}
          {isLiderAdmin && (
            <Link href="/admin/ministerio" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#181A22]" style={{ color: GOLD }}>
              <Building2 size={16} /><span>Mi Ministerio</span>
            </Link>
          )}
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <Link href={profileHref} className="flex-1 flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm" style={{ background: CARD, color: GOLD }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" width={32} height={32} loading="lazy" className="w-full h-full object-cover" /> : initial}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold truncate leading-tight" style={{ color: INK }}>{profile?.full_name ?? 'Usuario'}</p>
                <p className="text-[11px] truncate" style={{ color: MUTED }}>@{profile?.username ?? ''}</p>
              </div>
            </Link>
            <NotificationBell userId={user.id} />
            <form action={logout}>
              <button type="submit" className="w-9 h-9 flex items-center justify-center rounded-lg transition hover:text-white" style={{ color: MUTED }} title="Cerrar sesión">
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
        id="app-mobile-header"
        className="md:hidden fixed top-0 left-0 right-0 z-30"
        style={{
          background: 'rgba(16,18,23,0.75)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          borderBottom: `1px solid ${BORDER}`,
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="flex items-center justify-between px-4" style={{ height: 56 }}>
          {/* Brand */}
          <Link href="/app/inicio" className="flex items-center gap-2 min-w-0 flex-shrink mr-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFFFFF' }}
            >
              <img src="/logo-icon.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
            </div>
            <span className="font-logo text-[18px] leading-none truncate" style={{ color: INK }}>{siteName}</span>
          </Link>

          {/* Acciones */}
          <div
            className="flex items-center gap-0.5 rounded-full pl-1 pr-1 py-1 flex-shrink-0"
            style={{ background: '#181A22', border: `1px solid ${BORDER}` }}
          >
            <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full transition hover:bg-white/10" style={{ color: MUTED }} title="Sitio público">
              <Globe size={18} />
            </Link>
            {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
              <Link href="/admin" className="w-9 h-9 flex items-center justify-center rounded-full transition hover:bg-white/10" style={{ color: MUTED }}>
                <ShieldCheck size={18} />
              </Link>
            )}
            {isLiderAdmin && (
              <Link href="/admin/ministerio" className="w-9 h-9 flex items-center justify-center rounded-full transition hover:bg-white/10" style={{ color: GOLD }} title="Mi Ministerio">
                <Building2 size={18} />
              </Link>
            )}
            <NotificationBell userId={user.id} />
            <form action={logout}>
              <button type="submit" className="w-9 h-9 flex items-center justify-center rounded-full transition hover:bg-white/10" style={{ color: MUTED }} title="Cerrar sesión">
                <LogOut size={17} />
              </button>
            </form>
          </div>

          <Link href={profileHref} className="ml-2 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm"
              style={{ background: CARD, color: GOLD, border: `2px solid ${GOLD}55` }}
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" width={36} height={36} loading="lazy" className="w-full h-full object-cover" />
                : initial}
            </div>
          </Link>
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
        id="app-mobile-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-[9100]"
        style={{
          background: 'rgba(16,18,23,0.75)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          borderTop: `1px solid ${BORDER}`,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <AppBottomNav profileHref={profileHref} />
      </nav>
    </div>
  )
}
