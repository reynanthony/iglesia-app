import { createClient } from '@/lib/supabase/server'
import { Users, FileText, MessageCircle, Mic } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: totalMessages },
    { count: totalRooms },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('rooms').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Usuarios', value: totalUsers ?? 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Publicaciones', value: totalPosts ?? 0, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Mensajes', value: totalMessages ?? 0, icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Salas creadas', value: totalRooms ?? 0, icon: Mic, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ]

  // Últimos usuarios registrados
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, full_name, username, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // Últimos posts
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, content, created_at, profiles(full_name, username)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Vista general de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-slate-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Usuarios recientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-sm text-slate-300">Usuarios recientes</h2>
          <div className="space-y-3">
            {recentUsers?.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{u.full_name}</p>
                  <p className="text-xs text-slate-500">@{u.username}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  u.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                  u.role === 'pastor' ? 'bg-purple-500/10 text-purple-400' :
                  u.role === 'moderador' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts recientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-sm text-slate-300">Publicaciones recientes</h2>
          <div className="space-y-3">
            {recentPosts?.map((p: any) => (
              <div key={p.id}>
                <p className="text-xs text-slate-500 mb-0.5">@{p.profiles?.username}</p>
                <p className="text-sm text-slate-300 truncate">{p.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}