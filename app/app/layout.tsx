import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Home, MessageCircle, Users, LogOut, PlusSquare } from 'lucide-react'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-lg">✝</div>
            <div>
              <p className="font-bold text-sm leading-tight">Mi Iglesia</p>
              <p className="text-slate-500 text-xs">Comunidad</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/app/feed" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm">
            <Home size={18} /> Feed
          </Link>
          <Link href="/app/nuevo-post" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm">
            <PlusSquare size={18} /> Nueva publicación
          </Link>
          <Link href="/app/chat" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm">
            <MessageCircle size={18} /> Chat
          </Link>
          <Link href="/app/oracion" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm">
            <Users size={18} /> Salas de oración
          </Link>
        </nav>

        {/* Perfil */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold text-sm">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name ?? 'Usuario'}</p>
              <p className="text-xs text-slate-500 truncate">@{profile?.username ?? ''}</p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition text-sm">
              <LogOut size={16} /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-64">
        {children}
      </main>

    </div>
  )
}