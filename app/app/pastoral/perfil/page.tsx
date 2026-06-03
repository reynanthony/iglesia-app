import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Video, MessageSquare } from 'lucide-react'

const P = {
  bg: '#060E07', surface: '#0D1A0E',
  sage: '#869B7E', teal: '#76ABAE', gold: '#C9A227',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.45)', border: 'rgba(134,155,126,0.15)',
}

export default async function PastoralPerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: pastor }, { data: recentReflections }, { data: recentEncounters }] = await Promise.all([
    supabase.from('church_leaders')
      .select('name, title, bio, avatar_url')
      .eq('category', 'pastoral').order('order_index').limit(1).single(),
    supabase.from('pastoral_reflections')
      .select('id, title, media_type, created_at')
      .eq('published', true).order('created_at', { ascending: false }).limit(4),
    supabase.from('pastoral_encounters')
      .select('id, title, type, status')
      .in('status', ['live','scheduled']).limit(3),
  ])

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${P.border}` }}>
        <Link href="/app/pastoral" className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: P.surface }}>
          <ArrowLeft size={15} style={{ color: P.muted }} />
        </Link>
        <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>
          Perfil Pastoral
        </p>
      </div>

      {/* Hero pastoral */}
      <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 70% 60% at 30% 20%, rgba(134,155,126,0.10), transparent)` }} />
        {pastor?.avatar_url && (
          <div className="absolute inset-0">
            <img src={pastor.avatar_url} alt={pastor?.name ?? ''} className="w-full h-full object-cover object-top"
              style={{ opacity: 0.22 }} />
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${P.bg} 30%, transparent)` }} />
          </div>
        )}
        <div className="relative px-5 pt-8 pb-6 flex flex-col items-start gap-4">
          {pastor?.avatar_url && (
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2"
              style={{ borderColor: P.border }}>
              <img src={pastor.avatar_url} alt={pastor?.name ?? ''} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="font-black text-[26px] tracking-tight leading-tight">
              {pastor?.name ?? 'Pastor Principal'}
            </h1>
            {pastor?.title && (
              <p className="text-[12px] font-bold uppercase tracking-[0.25em] mt-1" style={{ color: P.sage }}>
                {pastor.title}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8 space-y-7">

        {/* Biografía */}
        {pastor?.bio && (
          <section>
            <p className="text-[14px] leading-relaxed" style={{ color: P.muted }}>{pastor.bio}</p>
          </section>
        )}

        {/* Reflexiones recientes */}
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

        {/* Encuentros próximos */}
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

        {/* CTAs */}
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
