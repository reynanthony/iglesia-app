import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Sprout, Flame, Users2, CalendarClock, BookOpen } from 'lucide-react'
import { getUser, getProfile } from '@/lib/supabase/cached-user'
import { createClient } from '@/lib/supabase/server'
import { getDailyVerse, getDailyVerseDate } from '@/lib/daily-verse'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function formatEventDate(fecha: string) {
  const d = new Date(fecha + 'T00:00:00')
  return d.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default async function InicioPage() {
  const user = await getUser()
  if (!user) redirect('/login')
  const profile = await getProfile(user.id)
  const supabase = await createClient()
  const firstName = (profile?.full_name ?? 'amigo').split(' ')[0]
  const today = new Date().toISOString().slice(0, 10)

  const [
    { data: enrollments },
    { count: prayerCount },
    { data: latestPost },
    { data: nextEvents },
  ] = await Promise.all([
    supabase.from('user_course_enrollments')
      .select('progress_pct, completed_at, discipleship_courses!inner(title, slug)')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false })
      .limit(10),
    supabase.from('prayer_requests')
      .select('id', { count: 'exact', head: true })
      .eq('is_public', true)
      .neq('status', 'respondida'),
    supabase.from('posts')
      .select('id, content, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase.from('events')
      .select('titulo, fecha_inicio, lugar')
      .eq('visible', true)
      .gte('fecha_inicio', today)
      .order('fecha_inicio')
      .limit(1),
  ])

  type Enrollment = { progress_pct: number | null; completed_at: string | null; discipleship_courses: { title: string; slug: string } | { title: string; slug: string }[] | null }
  const verse = getDailyVerse()
  const enrollmentList = (enrollments ?? []) as Enrollment[]
  const activeEnrollment =
    enrollmentList.find(e => !e.completed_at && (e.progress_pct ?? 0) > 0) ??
    enrollmentList.find(e => !e.completed_at) ??
    null
  const courseRaw = activeEnrollment?.discipleship_courses ?? null
  const course = Array.isArray(courseRaw) ? (courseRaw[0] ?? null) : courseRaw
  const post = latestPost?.[0] ?? null
  const postProfile = post?.profiles as { full_name: string } | { full_name: string }[] | null | undefined
  const postAuthor = (Array.isArray(postProfile) ? postProfile[0]?.full_name : postProfile?.full_name)?.split(' ')[0] ?? null
  const nextEvent = nextEvents?.[0] ?? null

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="font-app">
      <div className="max-w-xl mx-auto px-4 pt-10 pb-16">

        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: MUTED }}>
          {getDailyVerseDate()}
        </p>
        <h1 className="font-extrabold tracking-tight mb-10" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.3rem)', lineHeight: 1.15, color: INK }}>
          {greeting()}, {firstName}.<br />
          <span style={{ color: GOLD }}>Detente un momento.</span>
        </h1>

        <div className="space-y-3">

          {/* Palabra de hoy */}
          <Link href="/biblia" className="block rounded-2xl p-5 transition hover:opacity-90" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: GOLD }}>Palabra de hoy</p>
            <p className="text-[15px] leading-relaxed mb-2" style={{ color: INK }}>&ldquo;{verse.text}&rdquo;</p>
            <p className="text-[12px]" style={{ color: MUTED }}>{verse.reference}</p>
          </Link>

          {/* Continúa tu camino */}
          {course && (
            <Link href={`/app/discipulado`} className="flex items-center gap-4 rounded-2xl p-5 transition hover:opacity-90" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}1E` }}>
                <Sprout size={18} style={{ color: GOLD }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: MUTED }}>Continúa tu camino</p>
                <p className="text-sm font-bold truncate" style={{ color: INK }}>{course.title}</p>
                <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: BORDER }}>
                  <div className="h-full rounded-full" style={{ width: `${activeEnrollment?.progress_pct ?? 0}%`, background: GOLD }} />
                </div>
              </div>
              <ArrowRight size={16} style={{ color: MUTED, flexShrink: 0 }} />
            </Link>
          )}

          {/* Orar */}
          <Link href="/app/oracion" className="flex items-center gap-4 rounded-2xl p-5 transition hover:opacity-90" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}1E` }}>
              <Flame size={18} style={{ color: GOLD }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: MUTED }}>Ora</p>
              <p className="text-sm font-bold" style={{ color: INK }}>
                {prayerCount ? `${prayerCount} ${prayerCount === 1 ? 'persona necesita' : 'personas necesitan'} oración` : 'Comparte tu petición de oración'}
              </p>
            </div>
            <ArrowRight size={16} style={{ color: MUTED, flexShrink: 0 }} />
          </Link>

          {/* Comunidad */}
          {post && (
            <Link href="/app/comunidad/feed" className="flex items-center gap-4 rounded-2xl p-5 transition hover:opacity-90" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}1E` }}>
                <Users2 size={18} style={{ color: GOLD }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: MUTED }}>Comunidad</p>
                <p className="text-sm truncate" style={{ color: INK }}>
                  {postAuthor ? `${postAuthor} compartió: ` : ''}{post.content}
                </p>
              </div>
              <ArrowRight size={16} style={{ color: MUTED, flexShrink: 0 }} />
            </Link>
          )}

          {/* Próximo evento */}
          {nextEvent && (
            <Link href="/eventos" className="flex items-center gap-4 rounded-2xl p-5 transition hover:opacity-90" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}1E` }}>
                <CalendarClock size={18} style={{ color: GOLD }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: MUTED }}>Próximo</p>
                <p className="text-sm font-bold truncate" style={{ color: INK }}>{nextEvent.titulo}</p>
                <p className="text-[12px]" style={{ color: MUTED }}>{formatEventDate(nextEvent.fecha_inicio)}{nextEvent.lugar ? ` · ${nextEvent.lugar}` : ''}</p>
              </div>
              <ArrowRight size={16} style={{ color: MUTED, flexShrink: 0 }} />
            </Link>
          )}

        </div>

        <Link
          href="/biblia"
          className="mt-8 flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-sm transition hover:opacity-90"
          style={{ background: GOLD, color: GOLD_INK }}
        >
          <BookOpen size={16} />
          Leer la Biblia
        </Link>
      </div>
    </div>
  )
}
