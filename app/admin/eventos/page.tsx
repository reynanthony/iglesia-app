import { createClient } from '@/lib/supabase/server'
import { deleteEvento } from '@/app/actions/eventos-admin'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK } from '@/lib/gold-theme'

export default async function AdminEventosPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('*').order('fecha_inicio')
  const eventos = data ?? []

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="font-bold text-lg text-white">Eventos</h1>
            <p className="text-[13px] mt-0.5" style={{ color: MUTED }}>
              Gestiona los eventos del sitio web
            </p>
          </div>
          <Link href="/admin/eventos/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
            style={{ background: GOLD, color: GOLD_INK }}>
            <Plus size={14} /> Nuevo evento
          </Link>
        </div>
      </div>

      {/* Event list */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {eventos.length === 0 && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: BORDER }}>
            <p className="text-sm mb-2" style={{ color: MUTED }}>No hay eventos publicados.</p>
            <Link href="/admin/eventos/nuevo" className="text-sm font-bold" style={{ color: GOLD }}>
              Crear el primero →
            </Link>
          </div>
        )}

        {eventos.map(evento => {
          const fechaStr = evento.fecha_inicio ? evento.fecha_inicio + 'T00:00:00' : null
          return (
            <div key={evento.id} className="rounded-2xl border overflow-hidden"
              style={{ borderColor: BORDER, background: CARD }}>
              <div className="flex items-center gap-4 p-4">
                {/* Date block */}
                <div className="w-14 h-14 rounded-xl flex-shrink-0 flex flex-col items-center justify-center"
                  style={{ background: BG }}>
                  {fechaStr ? (
                    <>
                      <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: MUTED }}>
                        {new Date(fechaStr).toLocaleDateString('es-DO', { month: 'short' }).toUpperCase()}
                      </span>
                      <span className="font-black text-white text-lg leading-none">
                        {new Date(fechaStr).getUTCDate()}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px]" style={{ color: MUTED }}>—</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-white text-sm truncate">{evento.titulo}</p>
                    {!evento.visible && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: BORDER, color: MUTED }}>Oculto</span>
                    )}
                    {evento.badge && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227' }}>{evento.badge}</span>
                    )}
                  </div>
                  <p className="text-[12px] truncate" style={{ color: MUTED }}>
                    {evento.categoria && `${evento.categoria} · `}{evento.lugar}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/eventos/${evento.id}/editar`}
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <Pencil size={13} style={{ color: MUTED }} />
                  </Link>
                  <form action={async () => {
                    'use server'
                    await deleteEvento(String(evento.id))
                  }}>
                    <button type="submit"
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                      <Trash2 size={13} style={{ color: '#6B3333' }} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
