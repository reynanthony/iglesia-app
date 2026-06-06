import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendPushNotification } from '@/app/actions/native'
import { Bell, Users, CheckCircle2, XCircle } from 'lucide-react'

export default async function NotificacionesAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor'].includes(profile.role)) redirect('/admin')

  const [{ count: tokenCount }, { data: logs }] = await Promise.all([
    supabase.from('device_tokens').select('*', { count: 'exact', head: true }),
    supabase.from('push_notifications_log')
      .select('*, profiles!push_notifications_log_sent_by_fkey(full_name)')
      .order('sent_at', { ascending: false })
      .limit(20),
  ])

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Notificaciones Push</h1>
          <p className="text-xs md:text-sm mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
            {tokenCount ?? 0} dispositivo{tokenCount !== 1 ? 's' : ''} registrado{tokenCount !== 1 ? 's' : ''}
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
              <p className="text-xs" style={{ color: 'rgba(246,243,235,0.40)' }}>
                Se enviará a todos los dispositivos registrados
              </p>
            </div>
          </div>
          <form action={sendPushNotification} className="space-y-4">
            <input type="hidden" name="target" value="all" />
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
                style={{ color: 'rgba(246,243,235,0.40)' }}>
                Título *
              </label>
              <input name="title" required placeholder="Ej: Servicio esta domingo 10am"
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
                style={{ color: 'rgba(246,243,235,0.40)' }}>
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
              {tokenCount ?? 0} dispositivo{tokenCount !== 1 ? 's' : ''} registrado{tokenCount !== 1 ? 's' : ''}
            </p>
          </div>
          {(tokenCount ?? 0) === 0 && (
            <p className="text-xs mt-2" style={{ color: 'rgba(246,243,235,0.35)' }}>
              Los dispositivos se registran automáticamente cuando los usuarios abren la app nativa por primera vez y otorgan permiso de notificaciones.
            </p>
          )}
        </div>

        {/* Log */}
        {logs && logs.length > 0 && (
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-3"
              style={{ color: 'rgba(246,243,235,0.30)' }}>
              Historial de envíos
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              {logs.map((log: any) => {
                const sender = (log.profiles as any)?.full_name ?? 'Sistema'
                const date   = new Date(log.sent_at).toLocaleDateString('es-ES', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })
                return (
                  <div key={log.id} className="px-5 py-4 border-b last:border-0"
                    style={{ borderColor: '#0D3352' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: '#F6F3EB' }}>{log.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'rgba(246,243,235,0.45)' }}>{log.body}</p>
                        <p className="text-[10px] mt-1.5" style={{ color: 'rgba(246,243,235,0.30)' }}>
                          {sender} · {date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                        {log.success > 0 && (
                          <span className="flex items-center gap-1" style={{ color: '#76ABAE' }}>
                            <CheckCircle2 size={12} /> {log.success}
                          </span>
                        )}
                        {log.failed > 0 && (
                          <span className="flex items-center gap-1" style={{ color: '#F87171' }}>
                            <XCircle size={12} /> {log.failed}
                          </span>
                        )}
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
