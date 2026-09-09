import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, BookOpen, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { markPlanDayComplete } from '@/app/actions/bible-reading-plans'
import { formatDayReference } from '@/lib/bible-reading-plans'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export const revalidate = 0

export default async function PlanDayPage({
  params,
}: {
  params: Promise<{ slug: string; day: string }>
}) {
  const { slug, day } = await params
  const dayNumber = parseInt(day, 10)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plan } = await supabase
    .from('bible_reading_plans')
    .select('id, title, slug, duration_days')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!plan || isNaN(dayNumber) || dayNumber < 1 || dayNumber > plan.duration_days) notFound()

  const { data: currentDay } = await supabase
    .from('bible_reading_plan_days')
    .select('id, day_number, book_id, chapter_start, chapter_end')
    .eq('plan_id', plan.id)
    .eq('day_number', dayNumber)
    .single()

  if (!currentDay) notFound()

  let isCompleted = false
  if (user) {
    const { data } = await supabase
      .from('user_reading_plan_day_completions')
      .select('plan_day_id')
      .eq('user_id', user.id)
      .eq('plan_day_id', currentDay.id)
      .maybeSingle()
    isCompleted = !!data
  }

  const hasPrev = dayNumber > 1
  const hasNext = dayNumber < plan.duration_days
  const reference = formatDayReference(currentDay.book_id, currentDay.chapter_start, currentDay.chapter_end)

  return (
    <div style={{ background: BG, color: INK, minHeight: '100vh' }}>
      <div className="max-w-xl mx-auto px-6 py-12 md:py-16">
        <Link href={`/biblia/planes/${plan.slug}`}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.30em] mb-6 transition hover:opacity-70"
          style={{ color: MUTED }}>
          <ArrowLeft size={11} /> {plan.title}
        </Link>

        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: `${GOLD}99` }}>
          Día {dayNumber} de {plan.duration_days}
        </p>
        <h1 className="font-black tracking-tighter mb-8" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.2rem)', lineHeight: 0.95 }}>
          {reference}
        </h1>

        <Link href={`/biblia/lectura/${currentDay.book_id}/${currentDay.chapter_start}`}
          className="flex items-center gap-4 rounded-2xl p-5 mb-6 transition hover:brightness-110"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}18` }}>
            <BookOpen size={18} style={{ color: GOLD }} />
          </div>
          <div className="flex-1">
            <p className="font-black text-sm" style={{ color: INK }}>Leer {reference}</p>
            <p className="text-xs" style={{ color: MUTED }}>Abrir en el lector</p>
          </div>
          <ArrowRight size={16} style={{ color: GOLD }} />
        </Link>

        {user ? (
          isCompleted ? (
            <div className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black mb-10"
              style={{ background: `${GOLD}18`, color: GOLD }}>
              <Check size={16} /> Día completado
            </div>
          ) : (
            <form action={markPlanDayComplete.bind(null, plan.id, currentDay.id, dayNumber)}>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition hover:opacity-90 mb-10"
                style={{ background: GOLD, color: GOLD_INK }}>
                Marcar día como completado
              </button>
            </form>
          )
        ) : (
          <Link href="/login"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition hover:opacity-90 mb-10"
            style={{ background: GOLD, color: GOLD_INK }}>
            Inicia sesión para marcar tu progreso
          </Link>
        )}

        <div className="flex items-center justify-between">
          {hasPrev ? (
            <Link href={`/biblia/planes/${plan.slug}/dia/${dayNumber - 1}`}
              className="flex items-center gap-1.5 text-[11px] font-bold transition hover:opacity-70" style={{ color: MUTED }}>
              <ChevronLeft size={16} /> Día anterior
            </Link>
          ) : <div />}
          {hasNext && (
            <Link href={`/biblia/planes/${plan.slug}/dia/${dayNumber + 1}`}
              className="flex items-center gap-1.5 text-[11px] font-bold transition hover:opacity-70" style={{ color: MUTED }}>
              Día siguiente <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
