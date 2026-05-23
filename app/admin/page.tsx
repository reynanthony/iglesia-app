import { createClient } from '@/lib/supabase/server'
import { Users, FileText, MessageCircle, Mic, TrendingUp, AlertTriangle } from 'lucide-react'
import AdminChart from '@/components/admin/AdminChart'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: totalMessages },
    { count: totalRooms },
    { count: totalReports },
    { count: totalLikes },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('rooms').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('likes').select('*', { count: 'exact', head: true }),
  ])

  // Usuarios por día (últimos 7 días)
  const { data: usersByDay } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })

  // Posts por día (últimos 7 días)
  const { data: postsByDay } = await supabase
    .from('posts')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })

  // Últimos usuarios
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, full_name, username, role, avatar_url, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // Últimos posts
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, content, image_url, created_at, profiles(full_name, username)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Usuarios', value: totalUsers ?? 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', change: '+12%' },
    { label: 'Publicaciones', value: totalPosts ?? 0, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10', change: '+8%' },
    { label: 'Mensajes', value: totalMessages ?? 0, icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/10', change: '+24%' },
    { label: 'Likes totales', value: totalLikes ?? 0, icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-400/10', change: '+16%' },
    { label: 'Salas creadas', value: totalRooms ?? 0, icon: Mic, color: 'text-purple-400', bg: 'bg-purple-400/10', change: '+2%' },
    { label: 'Reportes', value: totalReports ?? 0, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', change: '' },
  ]

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Vista general de la plataforma</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, change }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              {change && (
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                  {change}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            <p className="text-slate-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Graficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminChart
          title="Nuevos usuarios (7 dias)"
          data={usersByDay ?? []}
          color="#60a5fa"
        />
        <AdminChart
          title="Nuevas publicaciones (7 dias)"
          data={postsByDay ?? []}
          color="#f59e0b"
        />
      </div>

      {/* Tablas recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Usuarios recientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-sm text-slate-300">Usuarios recientes</h2>
          <div className="space-y-3">
            {recentUsers?.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                        {u.full_name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.full_name}</p>
                    <p className="text-xs text-slate-500">@{u.username}</p>
                  </div>
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
              <div key={p.id} className="flex items-start gap-3">
                {p.image_url && (
                  <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">@{p.profiles?.username}</p>
                  <p className="text-sm text-slate-300 truncate">{p.content || 'Sin texto'}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {new Date(p.created_at).toLocaleDateString('es-DO')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}