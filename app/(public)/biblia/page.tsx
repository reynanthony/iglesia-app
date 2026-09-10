import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays, Flame, Search, Bookmark } from 'lucide-react'
import BibleVerseOfDay from '@/components/public/BibleVerseOfDay'
import BibleContinue from '@/components/public/BibleContinue'
import BibleSelector from '@/components/public/BibleSelector'
import { HeroVideo } from '@/components/public/HeroVideo'
import { HeroTitle } from '@/components/public/HeroTitle'
import { heroStyle } from '@/lib/hero-style'
import { findBook, ALL_BOOKS } from '@/lib/bible'
import { formatDayReference } from '@/lib/bible-reading-plans'
import { createClient } from '@/lib/supabase/server'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

const NAVY  = CARD
const TEAL  = GOLD
const CREAM = INK

interface ActivePlan {
  title: string
  slug: string
  dayNumber: number
  duration: number
  reference: string
}

function computeStreak(dates: Set<string>): number {
  let streak = 0
  const cursor = new Date()
  if (!dates.has(cursor.toISOString().slice(0, 10))) cursor.setUTCDate(cursor.getUTCDate() - 1)
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}

export default async function BibliaPage() {
  const supabase = await createClient()
  const [{ data: { user } }, { data: pageData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('page_content').select('content').eq('page', 'biblia').single(),
  ])
  const c = (pageData?.content ?? {}) as Record<string, string>
  const heroEyebrow    = c.hero_eyebrow ?? 'La Palabra · RVR1960'
  const heroTitleRaw   = c.hero_title ?? 'La Palabra\nque transforma.'
  const heroSubtitle   = c.hero_subtitle ?? 'Lee la Biblia completa en Reina Valera 1960 con marcadores, notas y lectura continua.'
  const heroImageUrl   = c.hero_image_url || '/api/og/biblia-hero'
  const heroVideoUrl   = c.hero_video_url || null
  const heroTitleLines = heroTitleRaw.split('\n')
  const hs = heroStyle({ defaultBg: BG, defaultTitleSize: 'xl' })

  let initialLastRead: { bookId: string; chapterNum: number; bookName: string } | null = null
  let initialBookmarks: Array<{
    bookId: string; chapterNum: number; verseNum: string; ref: string; text: string; savedAt: string
  }> | undefined
  let activePlan: ActivePlan | null = null
  let streak = 0
  let readPercent = 0
  let readingLog: Record<string, Record<number, { readUpTo: number; read: boolean }>> | undefined

  if (user) {
    const [positionResult, bookmarksResult, enrollmentResult, completionsResult, readLogResult] = await Promise.all([
      supabase.from('bible_reading_position').select('book_id, chapter').eq('user_id', user.id).maybeSingle(),
      supabase.from('bible_bookmarks').select('book_id, chapter, verse, verse_text, created_at')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(6),
      supabase.from('user_reading_plan_enrollments')
        .select('plan_id, current_day, bible_reading_plans(title, slug, duration_days)')
        .eq('user_id', user.id).is('completed_at', null)
        .order('started_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('user_reading_plan_day_completions').select('completed_at').eq('user_id', user.id),
      supabase.from('bible_reading_log')
        .select('book_id, chapter, read_up_to_verse, marked_read_at')
        .eq('user_id', user.id),
    ])
    if (positionResult.data) {
      const book = findBook(positionResult.data.book_id)
      if (book) {
        initialLastRead = { bookId: book.id, chapterNum: positionResult.data.chapter, bookName: book.name }
      }
    }
    initialBookmarks = (bookmarksResult.data ?? []).map(r => {
      const book = findBook(r.book_id)
      return {
        bookId: r.book_id,
        chapterNum: r.chapter,
        verseNum: String(r.verse),
        ref: `${book?.name ?? r.book_id} ${r.chapter}:${r.verse}`,
        text: r.verse_text,
        savedAt: r.created_at,
      }
    })

    if (enrollmentResult.data) {
      const planRow = enrollmentResult.data.bible_reading_plans as unknown as
        { title: string; slug: string; duration_days: number } | null
      if (planRow) {
        const { data: dayRow } = await supabase
          .from('bible_reading_plan_days')
          .select('book_id, chapter_start, chapter_end')
          .eq('plan_id', enrollmentResult.data.plan_id)
          .eq('day_number', enrollmentResult.data.current_day)
          .maybeSingle()
        if (dayRow) {
          activePlan = {
            title: planRow.title, slug: planRow.slug,
            dayNumber: enrollmentResult.data.current_day, duration: planRow.duration_days,
            reference: formatDayReference(dayRow.book_id, dayRow.chapter_start, dayRow.chapter_end),
          }
        }
      }
    }

    const dates = new Set((completionsResult.data ?? []).map(c => c.completed_at.slice(0, 10)))
    streak = computeStreak(dates)

    const totalChapters = ALL_BOOKS.reduce((sum, b) => sum + b.chapters, 0)
    readPercent = Math.round(((readLogResult.data?.length ?? 0) / totalChapters) * 100)

    readingLog = {}
    for (const row of readLogResult.data ?? []) {
      readingLog[row.book_id] ??= {}
      readingLog[row.book_id][row.chapter] = {
        readUpTo: row.read_up_to_verse ?? 0,
        read: !!row.marked_read_at,
      }
    }
  }

  const showDashboard = !!user && (!!initialLastRead || !!activePlan)

  return (
    <div>

      {/* ══ DASHBOARD (usuarios con historial) ══════════════ */}
      {showDashboard ? (
        <section style={{ background: BG }}>
          <div className="max-w-6xl mx-auto px-6 pt-28 pb-10 md:pt-36">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <Flame size={14} style={{ color: streak > 0 ? TEAL : MUTED }} />
                <span className="text-[12px] font-black" style={{ color: streak > 0 ? TEAL : MUTED }}>
                  {streak > 0 ? `${streak} día${streak !== 1 ? 's' : ''} seguidos` : 'Empieza tu racha'}
                </span>
              </div>
              {readPercent > 0 && (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <BookOpen size={14} style={{ color: TEAL }} />
                  <span className="text-[12px] font-black" style={{ color: TEAL }}>
                    {readPercent}% de la Biblia leída
                  </span>
                </div>
              )}
              <Link href="/biblia/buscar"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition hover:opacity-80"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <Search size={14} style={{ color: MUTED }} />
                <span className="text-[12px] font-bold" style={{ color: MUTED }}>Buscar</span>
              </Link>
              <Link href="/biblia/planes"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition hover:opacity-80"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <CalendarDays size={14} style={{ color: MUTED }} />
                <span className="text-[12px] font-bold" style={{ color: MUTED }}>Planes</span>
              </Link>
              <Link href="#selector"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition hover:opacity-80"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <Bookmark size={14} style={{ color: MUTED }} />
                <span className="text-[12px] font-bold" style={{ color: MUTED }}>Explorar</span>
              </Link>
            </div>

            <h1 className="font-display font-black tracking-tighter text-white mb-8"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 0.9 }}>
              Bienvenido de vuelta.
            </h1>

            {activePlan && (
              <Link href={`/biblia/planes/${activePlan.slug}/dia/${activePlan.dayNumber}`}
                className="group flex items-center gap-4 rounded-2xl p-5 mb-4 transition hover:brightness-110"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}18` }}>
                  <CalendarDays size={18} style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: `${GOLD}99` }}>
                    {activePlan.title} · Día {activePlan.dayNumber} de {activePlan.duration}
                  </p>
                  <p className="font-black text-base" style={{ color: INK }}>Hoy toca: {activePlan.reference}</p>
                </div>
                <ArrowRight size={16} style={{ color: GOLD, flexShrink: 0 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </section>
      ) : (
      <section className="relative overflow-hidden flex flex-col justify-end" style={{ background: hs.bg, minHeight: '85vh' }}>
        {heroImageUrl && !heroVideoUrl && (
          <img src={heroImageUrl} alt="" aria-hidden fetchPriority="high" loading="eager"
            className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.55 }} />
        )}
        {heroVideoUrl && <HeroVideo url={heroVideoUrl} opacity={0.55} fallbackUrl={heroImageUrl ?? undefined} />}
        {(heroImageUrl || heroVideoUrl) && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(16,18,23,0.55) 0%, rgba(16,18,23,0.35) 100%)' }} />
        )}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 70% at 85% 30%, rgba(199,154,42,0.10), transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 select-none">
          <span className="font-black leading-none" style={{ fontSize: 'clamp(12rem, 26vw, 24rem)', opacity: 0.04, color: TEAL }}>
            BIB
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto w-full px-6 pt-32 pb-16 md:pt-44 md:pb-20">
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px" style={{ background: MUTED }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: MUTED }}>
              {heroEyebrow}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <HeroTitle
              color="#FFFFFF"
              accentColor={TEAL}
              className="font-display font-black tracking-tighter"
              style={{ fontSize: hs.titleFontSize, lineHeight: 0.85, color: '#FFFFFF' }}>
              {heroTitleLines.map((line, i) => (
                <span key={i}>
                  {i === heroTitleLines.length - 1 ? <em style={{ color: TEAL }}>{line}</em> : line}
                  {i < heroTitleLines.length - 1 && <br />}
                </span>
              ))}
            </HeroTitle>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-6" style={{ color: MUTED }}>
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/biblia/lectura/JHN/1"
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl"
                  style={{ background: CREAM, color: NAVY }}>
                  <BookOpen size={12} /> Comenzar a leer
                </Link>
                <Link href="/biblia/planes"
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition hover:opacity-80"
                  style={{ background: `${TEAL}14`, color: TEAL, border: `1px solid ${TEAL}30` }}>
                  <CalendarDays size={12} /> Planes de lectura
                </Link>
                <Link href="/devocionales"
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition hover:opacity-80"
                  style={{ background: 'rgba(134,155,126,0.12)', color: '#869B7E', border: '1px solid rgba(134,155,126,0.30)' }}>
                  Devocionales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ══ VERSO DEL DÍA — visible para todos, incluso primera visita ══ */}
      <BibleVerseOfDay />

      {/* ══ CONTINUAR LEYENDO + MARCADORES ═════════════════ */}
      <BibleContinue initialLastRead={initialLastRead} initialBookmarks={initialBookmarks} />

      {/* ══ SELECTOR DE LIBROS ══════════════════════════════ */}
      <BibleSelector readingLog={readingLog} />

      {/* ══ CTA — solo para visitantes sin cuenta ═══════════ */}
      {!showDashboard && (
        <section className="relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, #101217 0%, ${NAVY} 100%)` }}>
          <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-10" style={{ color: MUTED }}>
                  — También en la comunidad
                </p>
                <h2 className="font-display font-black tracking-tighter text-white"
                  style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.85 }}>
                  La Palabra<br />es mejor<br /><em style={{ color: TEAL }}>en comunidad.</em>
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-base leading-relaxed mb-4" style={{ color: MUTED }}>
                  Únete para compartir reflexiones, pedir oración y crecer en la fe con nuestra comunidad en línea.
                </p>
                <Link href="/registro"
                  className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                  style={{ background: CREAM, color: NAVY }}>
                  Crear mi cuenta <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
