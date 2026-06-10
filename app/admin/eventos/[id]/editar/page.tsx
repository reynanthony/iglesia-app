import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateEvento } from '@/app/actions/eventos-admin'
import { cmsById, cmsImageUrl, DEvento } from '@/lib/directus'
import { notFound } from 'next/navigation'

export default async function EditarEventoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const evento = await cmsById<DEvento>('eventos', id)
  if (!evento) notFound()

  const action = updateEvento.bind(null, id)
  const imgUrl = cmsImageUrl(evento.imagen)
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.68)' }

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/eventos"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.68)' }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Editar evento</h1>
            <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>{evento.titulo}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            No se pudo guardar. Verifica los permisos del CMS o intenta de nuevo.
          </div>
        )}
        <form action={action} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="titulo" required defaultValue={evento.titulo}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="descripcion" rows={3} defaultValue={evento.descripcion ?? ''}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Fecha inicio *</label>
              <input name="fecha_inicio" type="date" required defaultValue={evento.fecha_inicio ?? ''}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Fecha fin</label>
              <input name="fecha_fin" type="date" defaultValue={evento.fecha_fin ?? ''}
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Lugar</label>
            <input name="lugar" defaultValue={evento.lugar ?? ''}
              className={field} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Categoría</label>
              <input name="categoria" defaultValue={evento.categoria ?? ''}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Badge</label>
              <select name="badge" defaultValue={evento.badge ?? 'Próximo'} className={field} style={fieldStyle}>
                {['Próximo', 'Especial', 'Por confirmar', 'Hoy'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {imgUrl && (
            <div>
              <p className={label} style={labelStyle}>Imagen actual</p>
              <img src={imgUrl} alt={evento.titulo}
                className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
            </div>
          )}

          <div>
            <label className={label} style={labelStyle}>
              {imgUrl ? 'Reemplazar imagen' : 'Imagen del evento'}
            </label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#0D3352' }}>
              <input type="file" name="image" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: 'rgba(246,243,235,0.68)' }} />
              <p className="text-[11px] mt-2" style={{ color: 'rgba(246,243,235,0.68)' }}>JPG, PNG o WebP</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Guardar cambios
            </button>
            <Link href="/admin/eventos"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.68)' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
