import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendPushNotification } from '@/app/actions/native'
import { Bell, Users, CheckCircle2, XCircle, Eye } from 'lucide-react'
import DeletePushLogButton from '@/components/admin/DeletePushLogButton'

export default async function NotificacionesAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor'].includes(profile.role)) redirect('/admin')

  const [{ count: webPushCount }, { data: logs }] = await Promise.all([
    supabase.from('device_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('platform', 'web')
      .not('push_sub', 'is', null),
    supabase.from('push_notifications_log')
      .select('*, profiles!push_notifications_log_sent_by_fkey(full_name)')
      .order('sent_at', { ascending: false })
      .limit(20),
  ])

  // Read counts: try push_log_id first, fall back to title matching
  const readMap: Record<string, number> = {}
  const { data: readCounts } = await supabase
    .from('notifications')
    .select('push_log_id, title')
    .eq('type', 'announcement')
    .eq('read', true)

  for (const n of (readCounts ?? [])) {
    if (n.push_log_id) {
      readMap[n.push_log_id] = (readMap[n.push_log_id] ?? 0) + 1
    }
  }
  // Fallback: match by title for notifications without push_log_id
  const titleMap: Record<string, number> = {}
  for (const n of (readCounts ?? [])) {
    if (!n.push_log_id && n.title) {
      titleMap[n.title] = (titleMap[n.title] ?? 0) + 1
    }
  }

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Notificaciones Push</h1>
          <p className="text-xs md:text-sm mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
            {webPushCount ?? 0} suscripcion{webPushCount !== 1 ? 'es' : ''} web push activa{webPushCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Send form */}
        <div className="rounded-xl md:rounded-2xl p-4 md:p-5 mb-4 md:mb-6" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(118,171,174,0.12)', border: '1px solid rgba(118,171,174,0.20)' }}>
              <Bell size={17} style={{ color: '#76ABAE' }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>Nueva notificación</p>
              <p className="text-xs" style={{ color: 'rgba(246,243,235,0.68)' }}>
                Se enviará a todos los dispositivos registrados
              </p>
            </div>
          </div>
          <form action={sendPushNotification} className="space-y-4">
            <input type="hidden" name="target" value="all" />
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
                style={{ color: 'rgba(246,243,235,0.68)' }}>
                Título *
              </label>
              <input name="title" required placeholder="Ej: Servicio esta domingo 10am"
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
                style={{ color: 'rgba(246,243,235,0.68)' }}>
                Mensaje *
              </label>
              <textarea name="body" required rows={3} placeholder="Escribe el mensaje de la notificación..."
                className={`${field} resize-none`} style={fieldStyle} />
            </div>
            <button type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: '#76ABAE', color: '#061E30' }}>
              <Bell size={15} /> Enviar a todos
            </button>
          </form>
        </div>

        {/* Devices summary */}
        <div className="rounded-xl md:rounded-2xl p-4 md:p-5 mb-4 md:mb-6" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <div className="flex items-center gap-3">
            <Users size={16} style={{ color: 'rgba(118,171,174,0.55)' }} />
            <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>
              {webPushCount ?? 0} suscripcion{webPushCount !== 1 ? 'es' : ''} web push
            </p>
          </div>
          {(webPushCount ?? 0) === 0 ? (
            <p className="text-xs mt-2 font-bold" style={{ color: '#F87171' }}>
              ⚠ Ningún usuario ha activado notificaciones aún. Los usuarios deben ir a /app/notificaciones → "Activar".
            </p>
          ) : (
            <p className="text-xs mt-2" style={{ color: 'rgba(246,243,235,0.62)' }}>
              Estos usuarios recibirán la notificación al enviarla.
            </p>
          )}
        </div>

        {/* Log */}
        {logs && logs.length > 0 && (
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-3"
              style={{ color: 'rgba(246,243,235,0.55)' }}>
              Historial de envíos
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              {logs.map((log: any) => {
                const sender  = (log.profiles as any)?.full_name ?? 'Sistema'
                const date    = new Date(log.sent_at).toLocaleDateString('es-ES', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })
                const viewed  = readMap[log.id] ?? titleMap[log.title] ?? 0
                return (
                  <div key={log.id} className="px-4 md:px-5 py-4 border-b last:border-0"
                    style={{ borderColor: '#0D3352' }}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: '#F6F3EB' }}>{log.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'rgba(246,243,235,0.72)' }}>{log.body}</p>
                        <p className="text-[10px] mt-1.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
                          {sender} · {date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-2 text-xs">
                          {log.success > 0 && (
                            <span className="flex items-center gap-1" style={{ color: '#76ABAE' }}
                              title="Enviados">
                              <CheckCircle2 size={12} /> {log.success}
                            </span>
                          )}
                          {log.failed > 0 && (
                            <span className="flex items-center gap-1" style={{ color: '#F87171' }}
                              title="Fallidos">
                              <XCircle size={12} /> {log.failed}
                            </span>
                          )}
                          <span className="flex items-center gap-1" style={{ color: 'rgba(246,243,235,0.62)' }}
                            title="Visualizados">
                            <Eye size={12} /> {viewed}
                          </span>
                        </div>
                        <DeletePushLogButton logId={log.id} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
