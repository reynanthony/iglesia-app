import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateEvento } from '@/app/actions/eventos-admin'
import { notFound } from 'next/navigation'

export default async function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) notFound()

  const action = updateEvento.bind(null, id)
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#141414', borderColor: '#2A2A2A', color: '#F5F5F5' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: '#4D4D4D' }

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4"
        style={{ borderColor: '#1F1F1F' }}>
        <Link href="/admin/eventos"
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#1A1A1A' }}>
          <ArrowLeft size={14} style={{ color: '#8A8A8A' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Editar evento</h1>
          <p className="text-[13px]" style={{ color: '#5A5A5A' }}>{event.titulo}</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-xl">
        <form action={action} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="titulo" required defaultValue={event.titulo}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="descripcion" rows={3} defaultValue={event.descripcion ?? ''}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Fecha inicio *</label>
              <input name="fecha_inicio" type="date" required defaultValue={event.fecha_inicio}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Fecha fin</label>
              <input name="fecha_fin" type="date" defaultValue={event.fecha_fin ?? ''}
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Lugar</label>
            <input name="lugar" defaultValue={event.lugar ?? ''}
              className={field} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Categoría</label>
              <input name="categoria" defaultValue={event.categoria ?? ''}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Badge</label>
              <select name="badge" className={field} style={fieldStyle}>
                {['Próximo', 'Especial', 'Por confirmar', 'Hoy'].map(b => (
                  <option key={b} value={b} selected={event.badge === b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {event.image_url && (
            <div>
              <p className={label} style={labelStyle}>Imagen actual</p>
              <img src={event.image_url} alt={event.titulo}
                className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
            </div>
          )}

          <div>
            <label className={label} style={labelStyle}>
              {event.image_url ? 'Reemplazar imagen' : 'Imagen del evento'}
            </label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#2A2A2A' }}>
              <input type="file" name="image" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: '#8A8A8A' }} />
              <p className="text-[11px] mt-2" style={{ color: '#4D4D4D' }}>JPG, PNG o WebP</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
              Guardar cambios
            </button>
            <Link href="/admin/eventos"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#1A1A1A', color: '#8A8A8A' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
