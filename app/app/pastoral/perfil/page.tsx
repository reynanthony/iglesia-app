import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Video, MessageSquare, ChevronRight } from 'lucide-react'

const P = {
  bg: '#060E07', surface: '#0D1A0E',
  sage: '#869B7E', teal: '#76ABAE', gold: '#C9A227',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.45)', border: 'rgba(134,155,126,0.15)',
}

export default async function PastoralPerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: leaders }, { data: recentReflections }, { data: recentEncounters }] = await Promise.all([
    supabase.from('church_leaders')
      .select('id, name, title, bio, avatar_url, category')
      .eq('is_public', true)
      .order('category')
      .order('order_index'),
    supabase.from('pastoral_reflections')
      .select('id, title, media_type, created_at')
      .eq('published', true).order('created_at', { ascending: false }).limit(4),
    supabase.from('pastoral_encounters')
      .select('id, title, type, status')
      .in('status', ['live','scheduled']).limit(3),
  ])

  const pastor    = leaders?.find(l => l.category === 'pastoral') ?? null
  const pastoral  = leaders?.filter(l => l.category === 'pastoral') ?? []
  const ministry  = leaders?.filter(l => l.category === 'ministerio') ?? []

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${P.border}` }}>
        <Link href="/app/pastoral" className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: P.surface }}>
          <ArrowLeft size={15} style={{ color: P.muted }} />
        </Link>
        <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>
          El Equipo
        </p>
      </div>

      {/* Hero — mobile: full-bleed, desktop: card */}
      <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 70% 60% at 30% 20%, rgba(134,155,126,0.10), transparent)` }} />

        {pastor?.avatar_url && (
          <div className="absolute inset-0 md:hidden">
            <img src={pastor.avatar_url} alt={pastor.name ?? ''} className="w-full h-full object-cover object-top"
              style={{ opacity: 0.60 }} />
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${P.bg} 8%, rgba(6,14,7,0.28) 48%, transparent 100%)` }} />
          </div>
        )}

        <div className="relative px-5 pt-8 pb-6 max-w-2xl mx-auto md:flex md:items-center md:gap-8 md:py-10">
          <div className="flex-1">
            {/* Mobile: small inline avatar */}
            {pastor?.avatar_url && (
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 mb-4 md:hidden"
                style={{ borderColor: P.border }}>
                <img src={pastor.avatar_url} alt={pastor.name ?? ''} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="font-black text-[26px] tracking-tight leading-tight">
              {pastor?.name ?? 'Equipo Pastoral'}
            </h1>
            {pastor?.title && (
              <p className="text-[12px] font-bold uppercase tracking-[0.25em] mt-1" style={{ color: P.sage }}>
                {pastor.title}
              </p>
            )}
            {pastor?.bio && (
              <p className="text-[13px] leading-relaxed mt-3 max-w-sm" style={{ color: P.muted }}>
                {pastor.bio}
              </p>
            )}
          </div>

          {/* Desktop only: contained photo */}
          {pastor?.avatar_url && (
            <div className="hidden md:block w-44 h-52 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ border: `1px solid ${P.border}` }}>
              <img src={pastor.avatar_url} alt={pastor.name ?? ''} className="w-full h-full object-cover object-top" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8 space-y-8">

        {/* ── LIDERAZGO PASTORAL ────────────────────────────── */}
        {pastoral.length > 1 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: P.sage }}>
              — Liderazgo pastoral
            </p>
            <div className="space-y-3">
              {pastoral.map(leader => (
                <Link key={leader.id} href={`/app/pastoral/equipo/${leader.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl transition hover:brightness-110"
                  style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center font-black text-lg"
                    style={{ background: 'rgba(134,155,126,0.12)', color: P.sage }}>
                    {leader.avatar_url
                      ? <img src={leader.avatar_url} alt={leader.name} className="w-full h-full object-cover" />
                      : leader.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[15px] leading-tight" style={{ color: P.cream }}>{leader.name}</p>
                    {leader.title && (
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5" style={{ color: P.sage }}>
                        {leader.title}
                      </p>
                    )}
                    {leader.bio && (
                      <p className="text-[12px] leading-relaxed mt-1.5 line-clamp-2" style={{ color: P.muted }}>
                        {leader.bio}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── LÍDERES DE MINISTERIOS ────────────────────────── */}
        {ministry.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: P.teal }}>
              — Líderes de ministerios
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ministry.map(leader => (
                <Link key={leader.id} href={`/app/pastoral/equipo/${leader.id}`}
                  className="flex items-center gap-3 p-4 rounded-2xl transition hover:brightness-110"
                  style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center font-black"
                    style={{ background: 'rgba(118,171,174,0.10)', color: P.teal }}>
                    {leader.avatar_url
                      ? <img src={leader.avatar_url} alt={leader.name} className="w-full h-full object-cover" />
                      : leader.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[13px] truncate" style={{ color: P.cream }}>{leader.name}</p>
                    {leader.title && (
                      <p className="text-[11px] truncate" style={{ color: P.teal }}>{leader.title}</p>
                    )}
                  </div>
                  <ChevronRight size={13} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── REFLEXIONES RECIENTES ────────────────────────── */}
        {recentReflections && recentReflections.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={13} style={{ color: P.sage }} />
                <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>
                  Reflexiones recientes
                </p>
              </div>
              <Link href="/app/pastoral/reflexiones"
                className="text-[11px] font-bold flex items-center gap-1" style={{ color: 'rgba(134,155,126,0.60)' }}>
                Ver todas <ArrowRight size={10} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentReflections.map(r => (
                <Link key={r.id} href="/app/pastoral/reflexiones"
                  className="flex items-center gap-3 p-3.5 rounded-xl transition"
                  style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(134,155,126,0.08)' }}>
                    <BookOpen size={13} style={{ color: P.sage }} />
                  </div>
                  <p className="text-[13px] font-bold flex-1 truncate" style={{ color: P.muted }}>
                    {r.title ?? 'Reflexión'}
                  </p>
                  <p className="text-[11px] flex-shrink-0" style={{ color: 'rgba(246,243,235,0.25)' }}>
                    {new Date(r.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── ENCUENTROS PRÓXIMOS ───────────────────────────── */}
        {recentEncounters && recentEncounters.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Video size={13} style={{ color: P.teal }} />
              <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.teal }}>
                Encuentros próximos
              </p>
            </div>
            <div className="space-y-2">
              {recentEncounters.map(e => (
                <Link key={e.id} href={`/app/pastoral/encuentros/${e.id}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl transition"
                  style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                  <Video size={13} style={{ color: P.teal, flexShrink: 0 }} />
                  <p className="text-[13px] font-bold flex-1 truncate" style={{ color: P.muted }}>{e.title}</p>
                  <ArrowRight size={12} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CTAs ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/app/pastoral/canal"
            className="flex items-center gap-2.5 p-4 rounded-2xl transition"
            style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <MessageSquare size={15} style={{ color: P.sage }} />
            <p className="text-[12px] font-bold" style={{ color: P.muted }}>Canal del pastor</p>
          </Link>
          <Link href="/app/pastoral/preguntas"
            className="flex items-center gap-2.5 p-4 rounded-2xl transition"
            style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <BookOpen size={15} style={{ color: P.gold }} />
            <p className="text-[12px] font-bold" style={{ color: P.muted }}>Hacer una pregunta</p>
          </Link>
        </div>

      </div>
    </div>
  )
}
