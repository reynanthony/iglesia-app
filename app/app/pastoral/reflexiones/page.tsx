import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Mic, Type, Clock, Star } from 'lucide-react'
import VideoEmbed from '@/components/app/pastoral/VideoEmbed'

const P = {
  bg: '#060E07', surface: '#0D1A0E', sage: '#869B7E',
  gold: '#C9A227', teal: '#76ABAE', cream: '#F6F3EB',
  muted: 'rgba(246,243,235,0.45)', border: 'rgba(134,155,126,0.15)',
}

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  text: Type, audio: Mic, video: Play,
}

function fmtDuration(secs: number) {
  const m = Math.round(secs / 60)
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`
}

export default async function PastoralReflexionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('pastoral_reflections')
    .select('id, title, body, media_type, media_url, duration_seconds, week_featured, created_at')
    .eq('published', true)
    .order('week_featured', { ascending: false })
    .order('created_at', { ascending: false })

  const weekly = items?.find(i => i.week_featured)
  const rest   = items?.filter(i => !i.week_featured) ?? []

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
          <h1 className="font-black text-[17px] tracking-tight">Reflexiones</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Mensaje de la semana */}
        {weekly && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Star size={11} fill={P.gold} style={{ color: P.gold }} />
              <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.gold }}>
                De esta semana
              </p>
            </div>
            <ReflectionCard item={weekly} featured />
          </section>
        )}

        {/* Feed */}
        {rest.length > 0 && (
          <section className="space-y-3">
            {!weekly && (
              <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3"
                style={{ color: 'rgba(246,243,235,0.20)' }}>— Todas las reflexiones</p>
            )}
            {rest.map(item => <ReflectionCard key={item.id} item={item} />)}
          </section>
        )}

        {(!items || items.length === 0) && (
          <div className="py-20 text-center">
            <Type size={28} style={{ color: 'rgba(134,155,126,0.25)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: P.muted }}>El pastor aún no ha publicado reflexiones.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ReflectionCard({
  item, featured = false,
}: {
  item: {
    title?: string | null
    body?: string | null
    media_type?: string | null
    media_url?: string | null
    duration_seconds?: number | null
    created_at: string
  }
  featured?: boolean
}) {
  const Icon = TYPE_ICONS[item.media_type ?? 'text'] ?? Type
  const iconColor = featured ? P.gold : P.sage
  const borderColor = featured ? 'rgba(201,162,39,0.22)' : P.border
  const bgColor     = featured ? 'rgba(201,162,39,0.06)' : P.surface

  return (
    <div className="rounded-2xl p-5" style={{ background: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: featured ? 'rgba(201,162,39,0.15)' : 'rgba(134,155,126,0.10)' }}>
          <Icon size={17} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          {item.title && (
            <p className="font-black text-[15px] leading-tight mb-2" style={{ color: P.cream }}>
              {item.title}
            </p>
          )}
          {item.body && (
            <p className="text-[13px] leading-relaxed" style={{ color: P.muted }}>
              {item.body}
            </p>
          )}
          {item.media_url && item.media_type === 'audio' && (
            <audio controls src={item.media_url}
              className="w-full mt-3 rounded-xl"
              style={{ accentColor: P.sage }} />
          )}
          {item.media_url && item.media_type === 'video' && (
            <VideoEmbed url={item.media_url} className="mt-3" />
          )}
          <div className="flex items-center gap-3 mt-3">
            <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.25)' }}>
              {new Date(item.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long' })}
            </p>
            {item.duration_seconds && (
              <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(246,243,235,0.25)' }}>
                <Clock size={10} /> {fmtDuration(item.duration_seconds)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
