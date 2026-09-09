import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, CalendarDays } from 'lucide-react'
import DeleteReadingPlanButton from '@/components/admin/DeleteReadingPlanButton'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK } from '@/lib/gold-theme'

export default async function AdminReadingPlansPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('bible_reading_plans').select('*').order('order_index')
  const plans = data ?? []

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="font-bold text-lg text-white">Planes de lectura</h1>
            <p className="text-[13px] mt-0.5" style={{ color: MUTED }}>
              {plans.length} plan{plans.length !== 1 ? 'es' : ''}
            </p>
          </div>
          <Link href="/admin/biblia/planes/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
            style={{ background: GOLD, color: GOLD_INK }}>
            <Plus size={14} /> Nuevo plan
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {plans.length === 0 && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: BORDER }}>
            <p className="text-sm mb-2" style={{ color: MUTED }}>No hay planes de lectura todavía.</p>
            <Link href="/admin/biblia/planes/nuevo" className="text-sm font-bold text-white">
              Crear el primero →
            </Link>
          </div>
        )}

        {plans.map(plan => (
          <div key={plan.id} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: BORDER, background: CARD }}>
            <div className="flex items-center gap-4 p-4">
              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ background: BG }}>
                {plan.thumbnail_url
                  ? <img src={plan.thumbnail_url} alt={plan.title} className="w-full h-full object-cover" />
                  : <CalendarDays size={16} style={{ color: '#333333' }} />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-white text-sm truncate">{plan.title}</p>
                  {!plan.is_active && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: BORDER, color: MUTED }}>Oculto</span>
                  )}
                </div>
                <p className="text-[12px] truncate" style={{ color: MUTED }}>
                  {plan.category ?? 'Sin categoría'} · {plan.duration_days} días
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/biblia/planes/${plan.id}`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <Pencil size={13} style={{ color: MUTED }} />
                </Link>
                <DeleteReadingPlanButton planId={plan.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
