import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, MessageSquare, Pin, Mic, Video, Image as ImgIcon, Type } from 'lucide-react'
import DeletePastoralItemButton from '@/components/admin/DeletePastoralItemButton'

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  text: Type, audio: Mic, video: Video, image: ImgIcon,
}

export default async function AdminPastoralMensajesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('pastoral_messages')
    .select('id, body, media_type, pinned, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link href="/admin/pastoral" className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
                Pastoral
              </Link>
              <span style={{ color: 'rgba(246,243,235,0.20)' }}>/</span>
              <span className="text-[13px] text-white">Canal del Pastor</span>
            </div>
            <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
              {messages?.length ?? 0} mensajes publicados
            </p>
          </div>
          <Link href="/admin/pastoral/mensajes/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={14} /> Nuevo mensaje
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {(!messages || messages.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <MessageSquare size={28} style={{ color: 'rgba(118,171,174,0.30)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>No hay mensajes publicados aún.</p>
          </div>
        )}

        {messages?.map(msg => {
          const TypeIcon = TYPE_ICONS[(msg as any).media_type ?? 'text'] ?? Type
          const body = (msg as any).body ?? ''
          return (
            <div key={msg.id} className="rounded-2xl border p-4 flex items-start gap-4"
              style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#061E30' }}>
                <TypeIcon size={15} style={{ color: '#76ABAE' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed line-clamp-2 text-white">{body || '(sin texto)'}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
                    {new Date(msg.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {msg.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: '#C9A227' }}>
                      <Pin size={9} /> Fijado
                    </span>
                  )}
                </div>
              </div>
              <DeletePastoralItemButton id={msg.id} table="pastoral_messages" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
