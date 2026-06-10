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

  const { data: usersByDay } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })

  const { data: postsByDay } = await supabase
    .from('posts')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, full_name, username, role, avatar_url, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, content, image_url, created_at, profiles(full_name, username)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Usuarios',      value: totalUsers    ?? 0, icon: Users,         iconColor: '#60A5FA', bgColor: 'rgba(96,165,250,0.10)',  change: '+12%' },
    { label: 'Publicaciones', value: totalPosts    ?? 0, icon: FileText,       iconColor: '#76ABAE', bgColor: 'rgba(118,171,174,0.12)', change: '+8%'  },
    { label: 'Mensajes',      value: totalMessages ?? 0, icon: MessageCircle,  iconColor: '#4ADE80', bgColor: 'rgba(74,222,128,0.10)',  change: '+24%' },
    { label: 'Likes totales', value: totalLikes    ?? 0, icon: TrendingUp,     iconColor: '#F472B6', bgColor: 'rgba(244,114,182,0.10)', change: '+16%' },
    { label: 'Salas creadas', value: totalRooms    ?? 0, icon: Mic,            iconColor: '#C084FC', bgColor: 'rgba(192,132,252,0.10)', change: '+2%'  },
    { label: 'Reportes',      value: totalReports  ?? 0, icon: AlertTriangle,  iconColor: '#F87171', bgColor: 'rgba(248,113,113,0.10)', change: ''     },
  ]

  const roleBadge = (role: string) => {
    if (role === 'admin')     return { bg: 'rgba(248,113,113,0.10)',  color: '#F87171' }
    if (role === 'pastor')    return { bg: 'rgba(192,132,252,0.10)',  color: '#C084FC' }
    if (role === 'moderador') return { bg: 'rgba(96,165,250,0.10)',   color: '#60A5FA' }
    return { bg: 'rgba(246,243,235,0.06)', color: 'rgba(246,243,235,0.50)' }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#F6F3EB' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(246,243,235,0.68)' }}>Vista general de la plataforma</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4 mb-5 md:mb-8">
        {stats.map(({ label, value, icon: Icon, iconColor, bgColor, change }) => (
          <div key={label} className="rounded-xl md:rounded-2xl p-3 md:p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: bgColor }}>
                <Icon size={15} style={{ color: iconColor }} />
              </div>
              {change && (
                <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full" style={{ color: '#4ADE80', background: 'rgba(74,222,128,0.10)' }}>
                  {change}
                </span>
              )}
            </div>
            <p className="text-xl md:text-3xl font-bold" style={{ color: '#F6F3EB' }}>{value.toLocaleString()}</p>
            <p className="text-xs md:text-sm mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Graficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-6">
        <AdminChart title="Nuevos usuarios (7 días)" data={usersByDay ?? []} color="#76ABAE" />
        <AdminChart title="Nuevas publicaciones (7 días)" data={postsByDay ?? []} color="#76ABAE" />
      </div>

      {/* Tablas recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">

        {/* Usuarios recientes */}
        <div className="rounded-xl md:rounded-2xl p-4 md:p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <h2 className="font-semibold mb-3 md:mb-4 text-sm" style={{ color: 'rgba(246,243,235,0.70)' }}>Usuarios recientes</h2>
          <div className="space-y-3">
            {recentUsers?.map((u: any) => {
              const badge = roleBadge(u.role)
              return (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs"
                      style={{ background: '#0D3352', color: '#76ABAE' }}>
                      {u.avatar_url
                        ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                        : u.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F6F3EB' }}>{u.full_name}</p>
                      <p className="text-xs" style={{ color: 'rgba(246,243,235,0.68)' }}>@{u.username}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize font-bold"
                    style={{ background: badge.bg, color: badge.color }}>
                    {u.role}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Posts recientes */}
        <div className="rounded-xl md:rounded-2xl p-4 md:p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <h2 className="font-semibold mb-3 md:mb-4 text-sm" style={{ color: 'rgba(246,243,235,0.70)' }}>Publicaciones recientes</h2>
          <div className="space-y-3">
            {recentPosts?.map((p: any) => (
              <div key={p.id} className="flex items-start gap-3">
                {p.image_url && (
                  <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>@{p.profiles?.username}</p>
                  <p className="text-sm truncate" style={{ color: 'rgba(246,243,235,0.80)' }}>{p.content || 'Sin texto'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
                    {new Date(p.created_at).toLocaleDateString('es-DO')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}
