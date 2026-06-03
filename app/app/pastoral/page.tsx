import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen, MessageSquare, Video, HelpCircle, ArrowRight,
  Play, Mic, Type, Clock, Radio, Star,
} from 'lucide-react'

const P = {
  bg:       '#060E07',
  surface:  '#0D1A0E',
  surface2: '#111F12',
  sage:     '#869B7E',
  gold:     '#C9A227',
  goldDim:  'rgba(201,162,39,0.12)',
  teal:     '#76ABAE',
  cream:    '#F6F3EB',
  muted:    'rgba(246,243,235,0.45)',
  border:   'rgba(134,155,126,0.15)',
}

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  text: Type, audio: Mic, video: Play,
}

function fmtDuration(secs: number) {
  const m = Math.round(secs / 60)
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`
}

const STATUS_CONFIG = {
  scheduled: { label: 'Programado', color: 'rgba(246,243,235,0.45)' },
  live:      { label: 'En Vivo',    color: '#F87171' },
  finished:  { label: 'Finalizado', color: 'rgba(118,171,174,0.45)' },
}

const TYPE_LABELS: Record<string, string> = {
  clase: 'Clase', mentoria: 'Mentoría', conversatorio: 'Conversatorio', preguntas: 'Q&A',
}

export default async function PastoralRoomPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: pastor },
    { data: weekMessage },
    { data: reflections },
    { data: encounters },
    { data: canal },
  ] = await Promise.all([
    supabase.from('church_leaders')
      .select('name, title, bio, avatar_url')
      .eq('category', 'pastoral').order('order_index').limit(1).single(),
    supabase.from('pastoral_reflections')
      .select('id, title, body, media_type, duration_seconds')
      .eq('week_featured', true).eq('published', true).limit(1).single(),
    supabase.from('pastoral_reflections')
      .select('id, title, body, media_type, duration_seconds, created_at')
      .eq('published', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('pastoral_encounters')
      .select('id, title, type, status, scheduled_at')
      .in('status', ['scheduled','live']).order('scheduled_at').limit(4),
    supabase.from('pastoral_messages')
      .select('id, body, media_type, pinned, created_at')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false }).limit(3),
  ])

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
        {/* Atmospheric overlay */}
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 80% 60% at 70% 0%, rgba(134,155,126,0.12), transparent 65%)` }} />

        {pastor?.avatar_url ? (
          <div className="absolute inset-0">
            <img
              src={pastor.avatar_url}
              alt={pastor.name ?? 'Pastor'}
              className="w-full h-full object-cover object-top"
              style={{ opacity: 0.55 }}
            />
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${P.bg} 12%, rgba(6,14,7,0.30) 50%, transparent 100%)` }} />
          </div>
        ) : (
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${P.surface} 0%, ${P.bg} 100%)` }} />
        )}

        <div className="relative px-5 pt-8 pb-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: P.gold }} />
            <p className="text-[10px] font-black uppercase tracking-[0.45em]" style={{ color: P.gold }}>
              Pastoral Room
            </p>
          </div>

          <h1 className="font-black tracking-tighter leading-none mb-4"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 3.5rem)' }}>
            {pastor?.name ?? 'El Pastor'}
          </h1>

          {pastor?.title && (
            <p className="text-[12px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: P.sage }}>
              {pastor.title}
            </p>
          )}

          <p className="text-[14px] leading-relaxed max-w-xs mb-6" style={{ color: P.muted }}>
            Bienvenido. Este espacio fue creado para acompañarte en tu crecimiento espiritual durante la semana.
          </p>

          {weekMessage && (
            <Link
              href={`/app/pastoral/reflexiones`}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[12px] font-black uppercase tracking-[0.15em] transition"
              style={{ background: P.gold, color: '#0A0F0A' }}
            >
              <Play size={12} /> Ver mensaje de esta semana
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8 space-y-8">

        {/* ── MENSAJE DE LA SEMANA ─────────────────────────── */}
        {weekMessage && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Star size={11} fill={P.gold} style={{ color: P.gold }} />
              <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.gold }}>
                Mensaje de la semana
              </p>
            </div>
            <Link
              href="/app/pastoral/reflexiones"
              className="flex items-start gap-4 p-5 rounded-2xl transition"
              style={{ background: P.goldDim, border: `1px solid rgba(201,162,39,0.22)` }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(201,162,39,0.20)' }}>
                {(() => { const Icon = TYPE_ICONS[weekMessage.media_type ?? 'text'] ?? Type; return <Icon size={18} style={{ color: P.gold }} /> })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[15px] leading-tight mb-1" style={{ color: P.cream }}>
                  {weekMessage.title ?? 'Reflexión pastoral'}
                </p>
                {weekMessage.body && (
                  <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: P.muted }}>
                    {weekMessage.body}
                  </p>
                )}
                {weekMessage.duration_seconds && (
                  <p className="text-[11px] mt-1.5 font-bold" style={{ color: P.gold }}>
                    {fmtDuration(weekMessage.duration_seconds)}
                  </p>
                )}
              </div>
              <ArrowRight size={14} style={{ color: P.gold, flexShrink: 0, marginTop: 4 }} />
            </Link>
          </section>
        )}

        {/* ── REFLEXIONES RECIENTES ────────────────────────── */}
        {reflections && reflections.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen size={13} style={{ color: P.sage }} />
                <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>
                  Reflexiones pastorales
                </p>
              </div>
              <Link href="/app/pastoral/reflexiones"
                className="text-[11px] font-bold flex items-center gap-1"
                style={{ color: 'rgba(134,155,126,0.60)' }}>
                Ver todas <ArrowRight size={10} />
              </Link>
            </div>
            <div className="space-y-2">
              {reflections.slice(0, 4).map(item => {
                const Icon = TYPE_ICONS[item.media_type ?? 'text'] ?? Type
                return (
                  <Link key={item.id} href="/app/pastoral/reflexiones"
                    className="flex items-center gap-3.5 p-4 rounded-2xl transition"
                    style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(134,155,126,0.10)' }}>
                      <Icon size={15} style={{ color: P.sage }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color: P.cream }}>
                        {item.title ?? 'Reflexión'}
                      </p>
                      {item.duration_seconds && (
                        <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.35)' }}>
                          {fmtDuration(item.duration_seconds)}
                        </p>
                      )}
                    </div>
                    <ArrowRight size={12} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0 }} />
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── ENCUENTROS ───────────────────────────────────── */}
        {encounters && encounters.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Video size={13} style={{ color: P.teal }} />
                <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.teal }}>
                  Encuentros en vivo
                </p>
              </div>
              <Link href="/app/pastoral/encuentros"
                className="text-[11px] font-bold flex items-center gap-1"
                style={{ color: 'rgba(118,171,174,0.50)' }}>
                Ver todos <ArrowRight size={10} />
              </Link>
            </div>
            <div className="space-y-2">
              {encounters.map(item => {
                const st = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.scheduled
                const isLive = item.status === 'live'
                return (
                  <Link key={item.id} href={`/app/pastoral/encuentros/${item.id}`}
                    className="flex items-center gap-3.5 p-4 rounded-2xl transition"
                    style={{ background: isLive ? 'rgba(248,113,113,0.08)' : P.surface, border: `1px solid ${isLive ? 'rgba(248,113,113,0.25)' : P.border}` }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: isLive ? 'rgba(248,113,113,0.15)' : 'rgba(118,171,174,0.10)' }}>
                      {isLive
                        ? <Radio size={15} style={{ color: '#F87171' }} />
                        : <Clock size={15} style={{ color: P.teal }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold truncate" style={{ color: P.cream }}>{item.title}</p>
                        {isLive && (
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            Vivo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px]" style={{ color: st.color }}>
                        {TYPE_LABELS[item.type] ?? item.type}
                        {item.scheduled_at && !isLive
                          ? ` · ${new Date(item.scheduled_at).toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'short' })}`
                          : ''}
                      </p>
                    </div>
                    <ArrowRight size={12} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0 }} />
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── CANAL DEL PASTOR (preview) ───────────────────── */}
        {canal && canal.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageSquare size={13} style={{ color: P.sage }} />
                <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>
                  Canal del pastor
                </p>
              </div>
              <Link href="/app/pastoral/canal"
                className="text-[11px] font-bold flex items-center gap-1"
                style={{ color: 'rgba(134,155,126,0.60)' }}>
                Ver canal <ArrowRight size={10} />
              </Link>
            </div>
            <div className="space-y-2">
              {canal.map(msg => (
                <Link key={msg.id} href="/app/pastoral/canal"
                  className="block p-4 rounded-2xl transition"
                  style={{ background: P.surface, border: `1px solid ${msg.pinned ? 'rgba(201,162,39,0.22)' : P.border}` }}>
                  <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: P.muted }}>
                    {msg.body ?? '(contenido multimedia)'}
                  </p>
                  <p className="text-[11px] mt-1.5" style={{ color: 'rgba(246,243,235,0.25)' }}>
                    {new Date(msg.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── ACCESOS RÁPIDOS ──────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4"
            style={{ color: 'rgba(246,243,235,0.20)' }}>— Más del espacio pastoral</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/app/pastoral/preguntas', icon: HelpCircle, label: 'Pregunta al pastor',  color: P.teal },
              { href: '/app/pastoral/perfil',    icon: BookOpen,   label: 'Perfil del pastor',   color: P.sage },
              { href: '/app/oracion',            icon: Type,       label: 'Solicitar oración',   color: P.gold },
              { href: '/app/discipulado',        icon: BookOpen,   label: 'Discipulado',          color: P.sage },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 p-4 rounded-2xl transition"
                style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                <Icon size={15} style={{ color, flexShrink: 0 }} />
                <p className="text-[12px] font-bold leading-tight" style={{ color: P.muted }}>{label}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
