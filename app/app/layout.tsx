import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import NotificationBell from '@/components/NotificationBell'
import AppNav, { AppBottomNav } from '@/components/app/AppNav'
import { Globe, LogOut, Cross, ShieldCheck } from 'lucide-react'
import { CapacitorBridge } from '@/components/app/CapacitorBridge'
import { getUser, getProfile } from '@/lib/supabase/cached-user'
import AnnouncementGate from '@/components/app/AnnouncementEngine/AnnouncementGate'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = await getProfile(user.id)

  const profileHref = profile?.username ? `/app/perfil/${profile.username}` : '/app/comunidad'
  const initial = profile?.full_name?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', color: '#1A1A1A' }}>
      <CapacitorBridge />
      <AnnouncementGate
        onboardingCompleted={profile?.onboarding_completed ?? false}
        userId={user.id}
        userRole={profile?.role ?? 'visitante'}
        hasBottomNav
      />

      {/* ── SIDEBAR (desktop) ── */}
      <aside
        className="hidden md:flex w-60 flex-col fixed h-full z-30"
        style={{ background: '#FFFFFF', borderRight: '1px solid #E8E4DC' }}
      >
        <div className="px-5 py-6" style={{ borderBottom: '1px solid #E8E4DC' }}>
          <Link href="/app/comunidad" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F4F1EC' }}>
              <Cross size={15} strokeWidth={2.5} style={{ color: '#C4854A' }} />
            </div>
            <div>
              <p className="font-black text-[13px] leading-tight tracking-tight" style={{ color: '#1A1A1A' }}>El Manantial</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(26,26,26,0.40)' }}>Comunidad</p>
            </div>
          </Link>
        </div>
        <AppNav profileHref={profileHref} />
        <div className="px-3 pb-5" style={{ borderTop: '1px solid #E8E4DC', paddingTop: '1rem' }}>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#F4F1EC]" style={{ color: 'rgba(26,26,26,0.50)' }}>
            <Globe size={16} /><span>Página principal</span>
          </Link>
          {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[#F4F1EC]" style={{ color: 'rgba(26,26,26,0.50)' }}>
              <ShieldCheck size={16} /><span>Panel Admin</span>
            </Link>
          )}
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <Link href={profileHref} className="flex-1 flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm" style={{ background: '#F4F1EC', color: '#C4854A' }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" width={32} height={32} loading="lazy" className="w-full h-full object-cover" /> : initial}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold truncate leading-tight" style={{ color: '#1A1A1A' }}>{profile?.full_name ?? 'Usuario'}</p>
                <p className="text-[11px] truncate" style={{ color: 'rgba(26,26,26,0.40)' }}>@{profile?.username ?? ''}</p>
              </div>
            </Link>
            <NotificationBell userId={user.id} />
            <form action={logout}>
              <button type="submit" className="w-9 h-9 flex items-center justify-center rounded-lg transition hover:text-[#1A1A1A]" style={{ color: 'rgba(26,26,26,0.40)' }} title="Cerrar sesión">
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ── HEADER (mobile) ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-30"
        style={{
          background: 'rgba(250,250,248,0.97)',
          borderBottom: '1px solid #E8E4DC',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="flex items-center justify-between px-4" style={{ height: 56 }}>
          <Link href="/app/comunidad" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F4F1EC' }}>
              <Cross size={14} strokeWidth={2.5} style={{ color: '#C4854A' }} />
            </div>
            <span className="font-black text-[15px] tracking-tight" style={{ color: '#1A1A1A' }}>El Manantial</span>
          </Link>

          <div className="flex items-center gap-0.5">
            <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ color: 'rgba(26,26,26,0.45)' }} title="Sitio público">
              <Globe size={19} />
            </Link>
            {['admin', 'pastor', 'moderador'].includes(profile?.role ?? '') && (
              <Link href="/admin" className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ color: 'rgba(26,26,26,0.45)' }}>
                <ShieldCheck size={19} />
              </Link>
            )}
            <NotificationBell userId={user.id} />
            <Link href={profileHref} className="ml-1">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm" style={{ background: '#F4F1EC', color: '#C4854A' }}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" width={32} height={32} loading="lazy" className="w-full h-full object-cover" />
                  : initial}
              </div>
            </Link>
            <form action={logout}>
              <button type="submit" className="w-10 h-10 flex items-center justify-center rounded-xl transition" style={{ color: 'rgba(26,26,26,0.40)' }} title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="md:ml-60 app-header-offset">
        {children}
        <div className="md:hidden app-nav-spacer" />
      </main>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30"
        style={{
          background: 'rgba(250,250,248,0.97)',
          borderTop: '1px solid #E8E4DC',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <AppBottomNav profileHref={profileHref} />
      </nav>
    </div>
  )
}
