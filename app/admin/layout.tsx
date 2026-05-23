import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { LayoutDashboard, Users, FileText, AlertTriangle, ArrowLeft } from 'lucide-react'


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
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-60 border-r border-slate-800 flex flex-col fixed h-full">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-xs font-bold">A</div>
            <p className="font-bold text-sm">Panel Admin</p>
          </div>
          <p className="text-slate-500 text-xs ml-9">{profile.full_name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link href="/admin/usuarios" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm">
            <Users size={16} /> Usuarios
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm">
            <FileText size={16} /> Publicaciones
          </Link>
          <Link href="/admin/reportes" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition text-sm">
  <AlertTriangle size={16} /> Reportes
</Link>
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link href="/app/feed" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition text-sm">
            <ArrowLeft size={16} /> Volver a la app
          </Link>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition text-sm">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-60">{children}</main>
    </div>
  )
}