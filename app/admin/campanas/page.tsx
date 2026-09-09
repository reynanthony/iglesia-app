import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Megaphone, Plus, Pencil } from 'lucide-react'
import ToggleActiveCheckbox from '@/components/admin/ToggleActiveCheckbox'
import ResetViewsButton from '@/components/admin/ResetViewsButton'
import { CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

const PRIORITY_LABEL: Record<string, string> = { critical: 'Urgente', high: 'Importante', normal: 'Normal' }
const PRIORITY_COLOR: Record<string, string>  = { critical: '#F87171', high: '#F59E0B',   normal: GOLD }
const FREQ_LABEL: Record<string, string>       = { once: '1 vez', daily: 'Diario', session: 'Por sesión', always: 'Siempre' }
const TYPE_LABEL: Record<string, string>       = {
  image: 'Imagen', video: 'Video', pastoral_message: 'Pastoral',
  event: 'Evento', course: 'Clase', live_invitation: 'En Vivo',
}

function timeRange(start: string, end: string | null) {
  const s = new Date(start).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
  if (!end) return `Desde ${s}`
  const e = new Date(end).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
  return `${s} → ${e}`
}

export default async function CampanasPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  const active   = (items ?? []).filter(i => i.is_active).length
  const now      = new Date()

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Campañas</h1>
            <p className="text-xs md:text-sm mt-0.5" style={{ color: MUTED }}>
              {active} activa{active !== 1 ? 's' : ''} · {(items ?? []).length} total
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ResetViewsButton />
            <Link
              href="/admin/campanas/nueva"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold"
              style={{ background: GOLD, color: GOLD_INK }}
            >
              <Plus size={13} /><span className="hidden sm:inline">Nueva campaña</span><span className="sm:hidden">Nueva</span>
            </Link>
          </div>
        </div>

        {/* Info box */}
        <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
          style={{ background: `${GOLD}0F`, border: '1px solid rgba(217,166,42,0.15)' }}>
          <Megaphone size={14} style={{ color: GOLD, flexShrink: 0, marginTop: 1 }} />
          <p className="text-[11px] leading-relaxed" style={{ color: MUTED }}>
            Las campañas activas se muestran a los miembros al abrir la app, según la audiencia y frecuencia configuradas.
            Los anuncios de prioridad <strong style={{ color: '#F87171' }}>Urgente</strong> se muestran siempre.
          </p>
        </div>

        {/* List */}
        {(!items || items.length === 0) ? (
          <div className="rounded-xl p-12 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <Megaphone size={28} style={{ color: MUTED, margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: MUTED }}>No hay campañas todavía.</p>
            <Link href="/admin/campanas/nueva"
              className="inline-flex items-center gap-1 mt-3 text-sm font-bold"
              style={{ color: GOLD }}>
              <Plus size={13} /> Crear primera campaña
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(item => {
              const expired = item.end_date && new Date(item.end_date) < now
              const pc      = PRIORITY_COLOR[item.priority] ?? GOLD
              return (
                <div key={item.id}
                  className="rounded-xl p-3.5 md:p-4"
                  style={{
                    background: CARD,
                    border: `1px solid ${item.is_active && !expired ? `${GOLD}33` : BORDER}`,
                    opacity: (!item.is_active || expired) ? 0.6 : 1,
                  }}>
                  <div className="flex items-start gap-3">
                    {/* Checkbox activo */}
                    <div className="flex-shrink-0 mt-1">
                      <ToggleActiveCheckbox id={item.id} isActive={item.is_active} />
                    </div>

                    {/* Color accent bar */}
                    <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: pc, minHeight: 40 }} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-sm truncate" style={{ color: INK }}>{item.title}</p>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: `${pc}20`, color: pc, border: `1px solid ${pc}30` }}>
                          {PRIORITY_LABEL[item.priority]}
                        </span>
                        {item.is_banner && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.25)' }}>
                            Banner
                          </span>
                        )}
                        {expired && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: 'rgba(248,113,113,0.12)', color: '#F87171' }}>
                            Expirada
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px]" style={{ color: MUTED }}>
                          {TYPE_LABEL[item.content_type] ?? item.content_type}
                        </span>
                        <span style={{ color: MUTED }}>·</span>
                        <span className="text-[10px]" style={{ color: MUTED }}>
                          {FREQ_LABEL[item.show_frequency] ?? item.show_frequency}
                        </span>
                        <span style={{ color: MUTED }}>·</span>
                        <span className="text-[10px]" style={{ color: MUTED }}>
                          {timeRange(item.start_date, item.end_date)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Link href={`/admin/campanas/${item.id}/editar`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg"
                        style={{ background: BORDER, color: MUTED }}>
                        <Pencil size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
