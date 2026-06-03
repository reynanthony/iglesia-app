import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { LogOut } from 'lucide-react'
import AdminNav from '@/components/admin/AdminNav'
import AdminMobileNav from '@/components/admin/AdminMobileNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'pastor', 'moderador'].includes(profile.role)) redirect('/app/comunidad')

  // Badge: mensajes no leídos
  const { count: unreadMessages } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)

  const strapiUrl = process.env.STRAPI_URL

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
        <AdminNav
          logoutAction={logout}
          unreadMessages={unreadMessages ?? 0}
          strapiUrl={strapiUrl}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b flex items-center justify-between px-4"
        style={{ background: '#061E30', borderColor: '#0D3352', paddingTop: 'env(safe-area-inset-top, 0px)', minHeight: 56 }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
            style={{ background: '#F6F3EB', color: '#061E30' }}>A</div>
          <span className="font-bold text-sm text-white">Panel Admin</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/app/comunidad"
            className="px-3 py-2 rounded-lg text-[11px] font-bold transition"
            style={{ color: 'rgba(246,243,235,0.40)' }}>
            ← App
          </Link>
          <form action={logout}>
            <button type="submit"
              className="w-10 h-10 flex items-center justify-center rounded-lg transition"
              style={{ color: 'rgba(246,243,235,0.40)' }}
              title="Cerrar sesión">
              <LogOut size={17} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{ background: '#061E30', borderColor: '#0D3352' }}>
        <AdminMobileNav unreadMessages={unreadMessages ?? 0} />
      </nav>

      <main className="flex-1 md:ml-56 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">{children}</main>
    </div>
  )
}
