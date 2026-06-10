import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell, Heart, MessageCircle, MessageSquare, AlertTriangle, Megaphone } from 'lucide-react'
import PushNotificationToggle from '@/components/app/PushNotificationToggle'

type Notification = {
  id: string
  type: 'like' | 'comment' | 'reply' | 'report' | 'announcement'
  read: boolean
  created_at: string
  post_id: string | null
  title: string | null
  body: string | null
  profiles: { full_name: string; username: string | null; avatar_url: string | null } | null
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} d`
  return new Date(date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
}

function notifText(n: Notification) {
  const name = n.profiles?.full_name ?? 'Alguien'
  if (n.type === 'announcement') return n.title ?? 'Nuevo anuncio'
  if (n.type === 'like')    return `${name} reaccionó a tu publicación`
  if (n.type === 'comment') return `${name} comentó en tu publicación`
  if (n.type === 'reply')   return `${name} respondió a tu comentario`
  return `${name} reportó una publicación`
}

function NotifIcon({ type }: { type: string }) {
  if (type === 'announcement') return <Megaphone size={13} style={{ color: '#76ABAE' }} />
  if (type === 'like')    return <Heart size={13} className="text-red-400 fill-red-400" />
  if (type === 'comment') return <MessageCircle size={13} style={{ color: '#76ABAE' }} />
  if (type === 'reply')   return <MessageSquare size={13} style={{ color: '#869B7E' }} />
  return <AlertTriangle size={13} style={{ color: '#C9A227' }} />
}

export default async function NotificacionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: notifications }] = await Promise.all([
    supabase
      .from('notifications')
      .select('*, profiles:actor_id(full_name, username, avatar_url), title, body')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false),
  ])

  const grouped: Record<string, Notification[]> = {}
  for (const n of (notifications ?? []) as Notification[]) {
    const date = new Date(n.created_at).toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(n)
  }

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Header */}
      <div className="px-4 pt-6 pb-4" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="flex items-center gap-3 max-w-xl mx-auto">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#0B2D47' }}>
            <Bell size={16} style={{ color: '#76ABAE' }} />
          </div>
          <div>
            <h1 className="font-black text-lg" style={{ color: '#F6F3EB' }}>Notificaciones</h1>
            <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
              {notifications?.length ?? 0} en total
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto pb-8">
        <div className="px-4 pt-4">
          <PushNotificationToggle />
        </div>

        {!notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <Bell size={22} style={{ color: 'rgba(118,171,174,0.40)' }} />
            </div>
            <div>
              <p className="font-black text-base" style={{ color: '#F6F3EB' }}>Sin notificaciones</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(246,243,235,0.62)' }}>
                Cuando alguien reaccione o comente, aparecerá aquí.
              </p>
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="px-4 pt-5 pb-2 text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: 'rgba(246,243,235,0.25)' }}>
                {date}
              </p>
              {items.map(n => {
                const href = n.type === 'report'
                  ? '/admin/reportes'
                  : n.post_id
                    ? `/app/comunidad?post=${n.post_id}`
                    : '/app/comunidad'
                const initial = n.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'
                return (
                  <Link key={n.id} href={href}
                    className="flex items-start gap-3.5 px-4 py-3.5 transition"
                    style={{
                      background: !n.read ? 'rgba(13,51,82,0.50)' : 'transparent',
                      borderBottom: '1px solid rgba(13,51,82,0.40)',
                    }}>
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm"
                        style={{ background: '#0D3352', color: '#76ABAE' }}>
                        {n.profiles?.avatar_url
                          ? <img src={n.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          : initial}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#061E30', border: '1px solid #0D3352' }}>
                        <NotifIcon type={n.type} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] leading-snug" style={{ color: '#F6F3EB' }}>
                        {notifText(n)}
                      </p>
                      {n.type === 'announcement' && n.body && (
                        <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'rgba(246,243,235,0.55)' }}>
                          {n.body}
                        </p>
                      )}
                      <p className="text-[11px] mt-1" style={{ color: 'rgba(246,243,235,0.62)' }}>
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: '#76ABAE' }} />
                    )}
                  </Link>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
