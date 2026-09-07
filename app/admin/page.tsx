import { createClient } from '@/lib/supabase/server'
import { Users, FileText, MessageCircle, Mic, TrendingUp, AlertTriangle } from 'lucide-react'
import AdminChart from '@/components/admin/AdminChart'

// Delta real semana-vs-semana-anterior para una tabla, o null si la tabla no tiene created_at / falla la consulta.
async function weeklyChange(supabase: Awaited<ReturnType<typeof createClient>>, table: string) {
  const now = Date.now()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
  const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString()

  const [{ count: current, error: e1 }, { count: previous, error: e2 }] = await Promise.all([
    supabase.from(table).select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from(table).select('*', { count: 'exact', head: true }).gte('created_at', twoWeeksAgo).lt('created_at', weekAgo),
  ])
  if (e1 || e2 || current === null || previous === null) return null
  if (previous === 0) return current > 0 ? { label: 'Nuevo', positive: true } : null
  const pct = Math.round(((current - previous) / previous) * 100)
  if (pct === 0) return null
  return { label: `${pct > 0 ? '+' : ''}${pct}%`, positive: pct > 0 }
}

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: totalMessages },
    { count: totalRooms },
    { count: totalReports },
    { count: totalLikes },
    usersChange,
    postsChange,
    messagesChange,
    roomsChange,
    ,
    likesChange,
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('rooms').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('likes').select('*', { count: 'exact', head: true }),
    weeklyChange(supabase, 'profiles'),
    weeklyChange(supabase, 'posts'),
    weeklyChange(supabase, 'messages'),
    weeklyChange(supabase, 'rooms'),
    weeklyChange(supabase, 'reports'),
    weeklyChange(supabase, 'likes'),
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
    { label: 'Usuarios',      value: totalUsers    ?? 0, icon: Users,         iconColor: '#60A5FA', bgColor: 'rgba(96,165,250,0.10)',  change: usersChange },
    { label: 'Publicaciones', value: totalPosts    ?? 0, icon: FileText,       iconColor: '#76ABAE', bgColor: 'rgba(118,171,174,0.12)', change: postsChange },
    { label: 'Mensajes',      value: totalMessages ?? 0, icon: MessageCircle,  iconColor: '#4ADE80', bgColor: 'rgba(74,222,128,0.10)',  change: messagesChange },
    { label: 'Likes totales', value: totalLikes    ?? 0, icon: TrendingUp,     iconColor: '#F472B6', bgColor: 'rgba(244,114,182,0.10)', change: likesChange },
    { label: 'Salas creadas', value: totalRooms    ?? 0, icon: Mic,            iconColor: '#C084FC', bgColor: 'rgba(192,132,252,0.10)', change: roomsChange },
    // Un aumento de reportes no es "crecimiento": nunca se muestra como badge positivo, solo el conteo real.
    { label: 'Reportes',      value: totalReports  ?? 0, icon: AlertTriangle,  iconColor: '#F87171', bgColor: 'rgba(248,113,113,0.10)', change: null as { label: string; positive: boolean } | null },
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
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight" style={{ color: '#F6F3EB' }}>Dashboard</h1>
        <p className="text-sm mt-1.5" style={{ color: 'rgba(246,243,235,0.68)' }}>Vista general de la plataforma</p>
      </div>

      {/* Stats — una sola franja con reglas finas entre valores, no seis tarjetas idénticas */}
      <div className="flex flex-wrap mb-8 md:mb-10 border-t border-b" style={{ borderColor: '#0D3352' }}>
        {stats.map(({ label, value, icon: Icon, iconColor, change }, i) => (
          <div
            key={label}
            className="flex-1 min-w-[9.5rem] py-4 md:py-6 px-4 md:px-6"
            style={{ borderLeft: i > 0 ? '1px solid #0D3352' : 'none' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={12} style={{ color: iconColor }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: 'rgba(246,243,235,0.55)' }}>{label}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-display text-2xl md:text-[2rem] font-black tracking-tight" style={{ color: '#F6F3EB' }}>
                {value.toLocaleString()}
              </p>
              {change && (
                <span
                  className="text-[11px] font-bold"
                  style={{ color: change.positive ? '#4ADE80' : '#F87171' }}
                  title="Comparado con los 7 días anteriores"
                >
                  {change.positive ? '↑' : '↓'} {change.label.replace(/^[+-]/, '')}
                </span>
              )}
            </div>
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
          <h2 className="font-display font-bold text-[17px] mb-3 md:mb-4" style={{ color: '#F6F3EB' }}>Usuarios recientes</h2>
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
          <h2 className="font-display font-bold text-[17px] mb-3 md:mb-4" style={{ color: '#F6F3EB' }}>Publicaciones recientes</h2>
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
