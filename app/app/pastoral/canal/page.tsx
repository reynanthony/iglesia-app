import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pin, Mic, Play, Image as ImgIcon, Type } from 'lucide-react'
import PastoralReactionBar from '@/components/app/pastoral/PastoralReactionBar'

const P = {
  bg: '#060E07', surface: '#0D1A0E',
  sage: '#869B7E', gold: '#C9A227', teal: '#76ABAE',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.45)', border: 'rgba(134,155,126,0.15)',
}

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  text: Type, audio: Mic, video: Play, image: ImgIcon,
}

export default async function PastoralCanalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: messages } = await supabase
    .from('pastoral_messages')
    .select(`
      id, body, media_url, media_type, pinned, created_at,
      profiles(full_name, avatar_url),
      pastoral_message_reactions(user_id, type)
    `)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${P.border}` }}>
        <Link href="/app/pastoral"
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: P.surface }}>
          <ArrowLeft size={15} style={{ color: P.muted }} />
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>
            Pastoral Room
          </p>
          <h1 className="font-black text-[17px] tracking-tight">Canal del Pastor</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {(!messages || messages.length === 0) && (
          <div className="py-20 text-center">
            <Type size={28} style={{ color: 'rgba(134,155,126,0.25)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: P.muted }}>El pastor no ha publicado mensajes aún.</p>
          </div>
        )}

        {messages?.map(msg => {
          const Icon = TYPE_ICONS[(msg as any).media_type ?? 'text'] ?? Type
          const reactions = (msg as any).pastoral_message_reactions ?? []
          return (
            <article
              key={msg.id}
              className="rounded-2xl p-5"
              style={{
                background: msg.pinned ? 'rgba(201,162,39,0.06)' : P.surface,
                border: `1px solid ${msg.pinned ? 'rgba(201,162,39,0.20)' : P.border}`,
              }}
            >
              {/* Meta */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs"
                  style={{ background: '#0D3352', color: P.teal }}>
                  {(msg as any).profiles?.avatar_url
                    ? <img src={(msg as any).profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    : ((msg as any).profiles?.full_name?.[0]?.toUpperCase() ?? 'P')}
                </div>
                <div>
                  <p className="text-[13px] font-black" style={{ color: P.cream }}>
                    {(msg as any).profiles?.full_name ?? 'Pastor'}
                  </p>
                  <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.30)' }}>
                    {new Date(msg.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                {msg.pinned && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-black"
                    style={{ color: P.gold }}>
                    <Pin size={10} /> Fijado
                  </span>
                )}
              </div>

              {/* Content */}
              {msg.body && (
                <p className="text-[14px] leading-relaxed mb-3" style={{ color: P.muted }}>{msg.body}</p>
              )}
              {(msg as any).media_url && (msg as any).media_type === 'audio' && (
                <audio controls src={(msg as any).media_url} className="w-full rounded-xl mb-3"
                  style={{ accentColor: P.sage }} />
              )}
              {(msg as any).media_url && (msg as any).media_type === 'video' && (
                <a href={(msg as any).media_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[12px] font-bold px-4 py-2 rounded-xl mb-3 w-fit transition"
                  style={{ background: 'rgba(118,171,174,0.10)', color: P.teal }}>
                  <Play size={12} /> Ver video
                </a>
              )}
              {(msg as any).media_url && (msg as any).media_type === 'image' && (
                <img src={(msg as any).media_url} alt="" className="w-full rounded-xl mb-3 object-cover"
                  style={{ maxHeight: 320 }} />
              )}

              {/* Reactions */}
              <div className="pt-3" style={{ borderTop: `1px solid ${P.border}` }}>
                <PastoralReactionBar
                  messageId={msg.id}
                  currentUserId={user.id}
                  reactions={reactions}
                />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
