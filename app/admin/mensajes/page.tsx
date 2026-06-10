import { createClient } from '@/lib/supabase/server'
import { Mail, MailOpen, Clock, User } from 'lucide-react'
import { markMessageRead } from '@/app/actions/admin'
import DeleteContactMessageButton from '@/components/admin/DeleteContactMessageButton'

export default async function AdminMensajesPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const unreadCount = messages?.filter(m => !m.read).length ?? 0

  function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (s < 60)     return 'Ahora'
    if (s < 3600)   return `Hace ${Math.floor(s / 60)} min`
    if (s < 86400)  return `Hace ${Math.floor(s / 3600)} h`
    if (s < 604800) return `Hace ${Math.floor(s / 86400)} días`
    return new Date(date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
  }

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg text-white flex items-center gap-2">
              Mensajes de visitantes
              {unreadCount > 0 && (
                <span
                  className="text-[11px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: '#76ABAE', color: '#061E30' }}
                >
                  {unreadCount} nuevo{unreadCount !== 1 ? 's' : ''}
                </span>
              )}
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Formulario de contacto del sitio web
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        {!messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Mail size={40} style={{ color: 'rgba(118,171,174,0.30)' }} />
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>
              No hay mensajes aún
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg: any) => (
              <MessageRow key={msg.id} msg={msg} timeAgo={timeAgo} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MessageRow({ msg, timeAgo }: { msg: any; timeAgo: (d: string) => string }) {
  return (
    <details
      className="rounded-2xl border overflow-hidden group"
      style={{ borderColor: msg.read ? '#0D3352' : '#76ABAE', background: '#0B2D47' }}
    >
      <summary
        className="flex items-center gap-3 p-4 cursor-pointer list-none select-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <form action={markMessageRead.bind(null, msg.id)} className="contents">
          <button type="submit" className="sr-only" aria-label="Marcar como leído" />
        </form>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#0D3352' }}
        >
          {msg.read
            ? <MailOpen size={16} style={{ color: 'rgba(246,243,235,0.68)' }} />
            : <Mail size={16} style={{ color: '#76ABAE' }} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-white text-sm truncate">{msg.nombre}</p>
            {!msg.read && (
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#76ABAE' }} />
            )}
          </div>
          <p className="text-[12px] truncate" style={{ color: 'rgba(246,243,235,0.60)' }}>
            {msg.asunto}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0" style={{ color: 'rgba(246,243,235,0.55)' }}>
          <Clock size={12} />
          <span className="text-[11px]">{timeAgo(msg.created_at)}</span>
        </div>
      </summary>

      {/* Expanded detail */}
      <form action={markMessageRead.bind(null, msg.id)}>
        <input type="hidden" name="id" value={msg.id} />
        <button type="submit" className="sr-only">Marcar leído</button>
      </form>
      <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: '1px solid #0D3352' }}>
        <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.50)' }}>
          <User size={13} />
          <span className="text-[12px]">{msg.nombre}</span>
          <span className="text-[12px]">·</span>
          <a
            href={`mailto:${msg.email}`}
            className="text-[12px] underline underline-offset-2 transition"
            style={{ color: '#76ABAE' }}
          >
            {msg.email}
          </a>
        </div>
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: 'rgba(246,243,235,0.80)' }}
        >
          {msg.mensaje}
        </p>
        <div className="flex gap-2 pt-1 flex-wrap">
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.asunto ?? '')}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition"
            style={{ background: '#F6F3EB', color: '#061E30' }}
          >
            <Mail size={13} /> Responder
          </a>
          {!msg.read && (
            <form action={markMessageRead.bind(null, msg.id)}>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-[12px] font-bold transition"
                style={{ background: '#0D3352', color: 'rgba(246,243,235,0.60)' }}
              >
                Marcar como leído
              </button>
            </form>
          )}
          <DeleteContactMessageButton messageId={msg.id} />
        </div>
      </div>
    </details>
  )
}
