import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Video, Radio, CheckCircle, Clock, Pencil } from 'lucide-react'
import DeletePastoralItemButton from '@/components/admin/DeletePastoralItemButton'
import EncounterStatusButton from '@/components/admin/EncounterStatusButton'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK } from '@/lib/gold-theme'

const STATUS_CONFIG = {
  scheduled: { label: 'Programado', icon: Clock,       color: MUTED },
  live:      { label: 'En Vivo',    icon: Radio,       color: '#F87171' },
  finished:  { label: 'Finalizado', icon: CheckCircle, color: `${GOLD}80` },
}

const TYPE_LABELS: Record<string, string> = {
  clase: 'Clase', mentoria: 'Mentoría', conversatorio: 'Conversatorio', preguntas: 'Q&A',
}

export default async function AdminPastoralEncuentrosPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('pastoral_encounters')
    .select('id, title, type, status, scheduled_at, live_url')
    .order('scheduled_at', { ascending: false })

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link href="/admin/pastoral" className="text-[13px]" style={{ color: MUTED }}>
                Pastoral
              </Link>
              <span style={{ color: MUTED }}>/</span>
              <span className="text-[13px] text-white">Encuentros</span>
            </div>
            <p className="text-[12px]" style={{ color: MUTED }}>
              {items?.length ?? 0} encuentros registrados
            </p>
          </div>
          <Link href="/admin/pastoral/encuentros/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold"
            style={{ background: GOLD, color: GOLD_INK }}>
            <Plus size={14} /> Nuevo encuentro
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {(!items || items.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: BORDER }}>
            <Video size={28} style={{ color: `${GOLD}4C`, margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: MUTED }}>No hay encuentros registrados.</p>
          </div>
        )}

        {items?.map(item => {
          const st = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.scheduled
          const StIcon = st.icon
          return (
            <div key={item.id} className="rounded-2xl border p-4 flex items-start gap-4"
              style={{ borderColor: BORDER, background: CARD }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: BG, color: `${GOLD}99` }}>
                    {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: st.color }}>
                    <StIcon size={10} /> {st.label}
                  </span>
                </div>
                <p className="font-bold text-sm text-white">{item.title}</p>
                {item.scheduled_at && (
                  <p className="text-[11px] mt-1" style={{ color: MUTED }}>
                    {new Date(item.scheduled_at).toLocaleDateString('es-DO', {
                      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <EncounterStatusButton id={item.id} status={item.status} />
                <Link href={`/admin/pastoral/encuentros/${item.id}/editar`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: BG }}>
                  <Pencil size={13} style={{ color: MUTED }} />
                </Link>
                <DeletePastoralItemButton id={item.id} table="pastoral_encounters" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
