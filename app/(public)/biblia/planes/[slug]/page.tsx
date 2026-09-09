import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { enrollInReadingPlan } from '@/app/actions/bible-reading-plans'
import { formatDayReference } from '@/lib/bible-reading-plans'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export const revalidate = 60

export default async function PlanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plan } = await supabase
    .from('bible_reading_plans')
    .select('id, title, slug, description, duration_days, category')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!plan) notFound()

  const { data: days } = await supabase
    .from('bible_reading_plan_days')
    .select('id, day_number, book_id, chapter_start, chapter_end')
    .eq('plan_id', plan.id)
    .order('day_number')

  let enrollment: { current_day: number; completed_at: string | null } | null = null
  let completedDayIds = new Set<string>()
  if (user) {
    const [enrollmentResult, completionsResult] = await Promise.all([
      supabase.from('user_reading_plan_enrollments')
        .select('current_day, completed_at').eq('user_id', user.id).eq('plan_id', plan.id).maybeSingle(),
      supabase.from('user_reading_plan_day_completions')
        .select('plan_day_id').eq('user_id', user.id).in('plan_day_id', (days ?? []).map(d => d.id)),
    ])
    enrollment = enrollmentResult.data
    completedDayIds = new Set((completionsResult.data ?? []).map(c => c.plan_day_id))
  }

  return (
    <div style={{ background: BG, color: INK, minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <Link href="/biblia/planes"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.30em] mb-6 transition hover:opacity-70"
          style={{ color: MUTED }}>
          <ArrowLeft size={11} /> Planes de lectura
        </Link>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}18` }}>
            <CalendarDays size={20} style={{ color: GOLD }} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: `${GOLD}99` }}>
            {plan.duration_days} días
          </p>
        </div>

        <h1 className="font-black tracking-tighter mb-4" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.2rem)', lineHeight: 0.95 }}>
          {plan.title}
        </h1>
        <p className="text-base leading-relaxed mb-8" style={{ color: MUTED, maxWidth: 480 }}>
          {plan.description}
        </p>

        {user ? (
          <form action={enrollInReadingPlan.bind(null, plan.id, plan.slug)}>
            <button type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition hover:opacity-90 mb-10"
              style={{ background: GOLD, color: GOLD_INK }}>
              {enrollment ? 'Continuar plan' : 'Empezar plan'}
            </button>
          </form>
        ) : (
          <Link href="/login"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition hover:opacity-90 mb-10"
            style={{ background: GOLD, color: GOLD_INK }}>
            Inicia sesión para empezar
          </Link>
        )}

        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: MUTED }}>
          Días del plan
        </p>
        <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: BORDER }}>
          {(days ?? []).map(day => {
            const done = completedDayIds.has(day.id)
            return (
              <Link key={day.id} href={`/biblia/planes/${plan.slug}/dia/${day.day_number}`}
                className="flex items-center gap-4 px-5 py-3.5 transition hover:brightness-110"
                style={{ background: CARD }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
                  style={{ background: done ? GOLD : BORDER, color: done ? GOLD_INK : MUTED }}>
                  {done ? <Check size={12} /> : day.day_number}
                </span>
                <span className="text-sm font-bold" style={{ color: INK }}>
                  {formatDayReference(day.book_id, day.chapter_start, day.chapter_end)}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
