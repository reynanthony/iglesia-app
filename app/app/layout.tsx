import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import NotificationBell from '@/components/NotificationBell'
import { Home, MessageCircle, Users, LogOut, PlusSquare, User, Search, BookOpen } from 'lucide-react'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const navItems = [
  { href: '/app/feed', icon: Home, label: 'Feed' },
  { href: '/app/buscar', icon: Search, label: 'Buscar' },
  { href: '/app/nuevo-post', icon: PlusSquare, label: 'Publicar' },
  { href: '/app/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/app/ministerios', icon: BookOpen, label: 'Ministerios' },
  { href: '/app/oracion', icon: Users, label: 'Oracion' },
  { href: '/app/perfil/' + profile?.username, icon: User, label: 'Perfil' },
]

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <aside className="hidden md:flex w-64 border-r border-slate-800 flex-col fixed h-full z-30">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-lg">✝</div>
            <div>
              <p className="font-bold text-sm leading-tight">Mi Iglesia</p>
              <p className="text-slate-500 text-xs">Comunidad</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm"
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold text-sm overflow-hidden flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.[0]?.toUpperCase() ?? 'U'
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{profile?.full_name ?? 'Usuario'}</p>
                <p className="text-xs text-slate-500 truncate">@{profile?.username ?? ''}</p>
              </div>
            </div>
            <NotificationBell userId={user.id} />
          </div>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition text-sm">
              <LogOut size={16} /> Cerrar sesion
            </button>
          </form>
        </div>
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-sm">✝</div>
          <span className="font-bold text-sm">Mi Iglesia</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell userId={user.id} />
          <Link href={`/app/perfil/${profile?.username}`}>
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold text-sm overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                profile?.full_name?.[0]?.toUpperCase() ?? 'U'
              )}
            </div>
          </Link>
        </div>
      </header>

      <main className="md:ml-64 pb-20 md:pb-0 pt-14 md:pt-0">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur border-t border-slate-800">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-slate-400 hover:text-amber-400 transition"
            >
              <Icon size={20} />
              <span className="text-[9px]">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

    </div>
  )
}