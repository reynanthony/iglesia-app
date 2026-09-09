import Link from 'next/link'
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

export const revalidate = 60

const CATEGORY_LABEL: Record<string, string> = {
  evangelios: 'Evangelios',
  pentateuco: 'Pentateuco',
  sabiduria: 'Sabiduría',
  'nuevo-testamento': 'Nuevo Testamento',
}

export default async function PlanesBibliaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plans } = await supabase
    .from('bible_reading_plans')
    .select('id, title, slug, description, duration_days, category, order_index')
    .eq('is_active', true)
    .order('order_index')

  let enrollments: Record<string, { current_day: number; completed_at: string | null }> = {}
  if (user && plans && plans.length > 0) {
    const { data } = await supabase
      .from('user_reading_plan_enrollments')
      .select('plan_id, current_day, completed_at')
      .eq('user_id', user.id)
      .in('plan_id', plans.map(p => p.id))
    enrollments = Object.fromEntries((data ?? []).map(e => [e.plan_id, { current_day: e.current_day, completed_at: e.completed_at }]))
  }

  return (
    <div style={{ background: BG, color: INK, minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Link href="/biblia"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.30em] mb-6 transition hover:opacity-70"
          style={{ color: MUTED }}>
          <ArrowLeft size={11} /> Biblia
        </Link>
        <h1 className="font-black tracking-tighter mb-3" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', lineHeight: 0.95 }}>
          Planes de lectura.
        </h1>
        <p className="text-base leading-relaxed mb-12" style={{ color: MUTED, maxWidth: 480 }}>
          Rutas guiadas día por día para leer la Biblia con constancia.
        </p>

        <div className="space-y-3">
          {(plans ?? []).map(plan => {
            const enrollment = enrollments[plan.id]
            const inProgress = enrollment && !enrollment.completed_at
            const done = !!enrollment?.completed_at
            return (
              <Link key={plan.id} href={`/biblia/planes/${plan.slug}`}
                className="group flex items-center gap-4 rounded-2xl p-5 transition hover:brightness-110"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${GOLD}18` }}>
                  <CalendarDays size={18} style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: `${GOLD}99` }}>
                    {CATEGORY_LABEL[plan.category] ?? plan.category} · {plan.duration_days} días
                  </p>
                  <p className="font-black text-base leading-tight mb-1" style={{ color: INK }}>{plan.title}</p>
                  <p className="text-xs leading-relaxed line-clamp-1" style={{ color: MUTED }}>{plan.description}</p>
                  {(inProgress || done) && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2" style={{ color: done ? GOLD : MUTED }}>
                      {done ? 'Completado' : `Día ${enrollment.current_day} de ${plan.duration_days}`}
                    </p>
                  )}
                </div>
                <ArrowRight size={16} style={{ color: GOLD, flexShrink: 0 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
