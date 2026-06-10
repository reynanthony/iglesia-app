import { cmsGet, cmsImageUrl, DEvento } from '@/lib/directus'
import { deleteEvento } from '@/app/actions/eventos-admin'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default async function AdminEventosPage() {
  const eventos = await cmsGet<DEvento>('eventos', { sort: 'fecha_inicio' })

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="font-bold text-lg text-white">Eventos</h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Gestiona los eventos del sitio web
            </p>
          </div>
          <Link href="/admin/eventos/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
            style={{ background: '#F6F3EB' }}>
            <Plus size={14} /> Nuevo evento
          </Link>
        </div>
      </div>

      {/* Event list */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {eventos.length === 0 && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <p className="text-sm mb-2" style={{ color: 'rgba(246,243,235,0.68)' }}>No hay eventos publicados.</p>
            <Link href="/admin/eventos/nuevo" className="text-sm font-bold text-white">
              Crear el primero →
            </Link>
          </div>
        )}

        {eventos.map(evento => {
          const fechaStr = evento.fecha_inicio ? evento.fecha_inicio + 'T00:00:00' : null
          const imgUrl = cmsImageUrl(evento.imagen)
          return (
            <div key={evento.id} className="rounded-2xl border overflow-hidden"
              style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
              <div className="flex items-center gap-4 p-4">
                {/* Date block */}
                <div className="w-14 h-14 rounded-xl flex-shrink-0 flex flex-col items-center justify-center"
                  style={{ background: '#061E30' }}>
                  {fechaStr ? (
                    <>
                      <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: 'rgba(246,243,235,0.68)' }}>
                        {new Date(fechaStr).toLocaleDateString('es-DO', { month: 'short' }).toUpperCase()}
                      </span>
                      <span className="font-black text-white text-lg leading-none">
                        {new Date(fechaStr).getUTCDate()}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.55)' }}>—</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-white text-sm truncate">{evento.titulo}</p>
                    {!evento.visible && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: '#0D3352', color: 'rgba(246,243,235,0.68)' }}>Oculto</span>
                    )}
                    {evento.badge && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227' }}>{evento.badge}</span>
                    )}
                  </div>
                  <p className="text-[12px] truncate" style={{ color: 'rgba(246,243,235,0.68)' }}>
                    {evento.categoria && `${evento.categoria} · `}{evento.lugar}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/eventos/${evento.id}/editar`}
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                    <Pencil size={13} style={{ color: 'rgba(246,243,235,0.68)' }} />
                  </Link>
                  <form action={async () => {
                    'use server'
                    await deleteEvento(String(evento.id))
                  }}>
                    <button type="submit"
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
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
