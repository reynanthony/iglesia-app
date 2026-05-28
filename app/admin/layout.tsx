import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { LayoutDashboard } from 'lucide-react'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/app/feed')

  return (
    <div className="min-h-screen flex" style={{ background: '#061E30', color: '#F6F3EB' }}>

      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 border-r flex-col fixed h-full z-40"
        style={{ borderColor: '#0D3352', background: '#061E30' }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: '#0D3352' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
              style={{ background: '#F6F3EB', color: '#061E30' }}>A</div>
            <div>
              <p className="font-bold text-[13px] text-white leading-tight">Panel Admin</p>
              <p className="text-[11px] leading-tight" style={{ color: 'rgba(246,243,235,0.40)' }}>{profile.full_name}</p>
            </div>
          </div>
        </div>
        <AdminNav logoutAction={logout} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b flex items-center justify-between px-4 h-14"
        style={{ background: '#061E30', borderColor: '#0D3352' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
            style={{ background: '#F6F3EB', color: '#061E30' }}>A</div>
          <span className="font-bold text-sm text-white">Panel Admin</span>
        </div>
        <Link href="/app/feed" className="text-[12px] font-bold" style={{ color: 'rgba(246,243,235,0.40)' }}>
          ← App
        </Link>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around"
        style={{ background: '#061E30', borderColor: '#0D3352', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Link href="/admin" className="flex flex-col items-center gap-1 py-3 px-3">
          <LayoutDashboard size={18} style={{ color: 'rgba(246,243,235,0.40)' }} />
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(246,243,235,0.40)' }}>Dashboard</span>
        </Link>
        <Link href="/admin/ministerios" className="flex flex-col items-center gap-1 py-3 px-3">
          <span className="text-base">⛪</span>
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(246,243,235,0.40)' }}>Ministerios</span>
        </Link>
        <Link href="/admin/eventos" className="flex flex-col items-center gap-1 py-3 px-3">
          <span className="text-base">📅</span>
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(246,243,235,0.40)' }}>Eventos</span>
        </Link>
        <Link href="/admin/predicas" className="flex flex-col items-center gap-1 py-3 px-3">
          <span className="text-base">🎙</span>
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(246,243,235,0.40)' }}>Prédicas</span>
        </Link>
        <Link href="/admin/usuarios" className="flex flex-col items-center gap-1 py-3 px-3">
          <span className="text-base">👥</span>
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(246,243,235,0.40)' }}>Usuarios</span>
        </Link>
      </div>

      <main className="flex-1 md:ml-56 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">{children}</main>
    </div>
  )
}