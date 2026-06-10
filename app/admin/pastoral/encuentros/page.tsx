import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Video, Radio, CheckCircle, Clock, Pencil } from 'lucide-react'
import DeletePastoralItemButton from '@/components/admin/DeletePastoralItemButton'
import EncounterStatusButton from '@/components/admin/EncounterStatusButton'

const STATUS_CONFIG = {
  scheduled: { label: 'Programado', icon: Clock,       color: 'rgba(246,243,235,0.50)' },
  live:      { label: 'En Vivo',    icon: Radio,       color: '#F87171' },
  finished:  { label: 'Finalizado', icon: CheckCircle, color: 'rgba(118,171,174,0.50)' },
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
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link href="/admin/pastoral" className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
                Pastoral
              </Link>
              <span style={{ color: 'rgba(246,243,235,0.20)' }}>/</span>
              <span className="text-[13px] text-white">Encuentros</span>
            </div>
            <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
              {items?.length ?? 0} encuentros registrados
            </p>
          </div>
          <Link href="/admin/pastoral/encuentros/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={14} /> Nuevo encuentro
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {(!items || items.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <Video size={28} style={{ color: 'rgba(118,171,174,0.30)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>No hay encuentros registrados.</p>
          </div>
        )}

        {items?.map(item => {
          const st = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.scheduled
          const StIcon = st.icon
          return (
            <div key={item.id} className="rounded-2xl border p-4 flex items-start gap-4"
              style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: '#061E30', color: 'rgba(118,171,174,0.60)' }}>
                    {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: st.color }}>
                    <StIcon size={10} /> {st.label}
                  </span>
                </div>
                <p className="font-bold text-sm text-white">{item.title}</p>
                {item.scheduled_at && (
                  <p className="text-[11px] mt-1" style={{ color: 'rgba(246,243,235,0.62)' }}>
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
                  style={{ background: '#061E30' }}>
                  <Pencil size={13} style={{ color: 'rgba(246,243,235,0.68)' }} />
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
