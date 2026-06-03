import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { updateSeries } from '@/app/actions/bible-study'

const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
const labelStyle = { color: 'rgba(246,243,235,0.40)' }

export default async function EditarSeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: series } = await supabase
    .from('bible_study_series')
    .select('*')
    .eq('id', id)
    .single()

  if (!series) notFound()

  const updateAction = updateSeries.bind(null, id)

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href={`/admin/estudio-biblico/${id}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs mb-0.5" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Link href="/admin/estudio-biblico" className="hover:underline">Estudio Bíblico</Link>
              <span>/</span>
              <Link href={`/admin/estudio-biblico/${id}`} className="hover:underline truncate max-w-[10rem]">{series.title}</Link>
              <span>/</span>
              <span>Editar</span>
            </div>
            <h1 className="font-bold text-lg" style={{ color: '#F6F3EB' }}>Editar serie</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={updateAction} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Título *</label>
              <input name="title" required defaultValue={series.title}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Slug (URL)</label>
              <input name="slug" defaultValue={series.slug}
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Libro</label>
              <input name="book" defaultValue={series.book ?? ''}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Tema / Subtítulo</label>
              <input name="theme" defaultValue={series.theme ?? ''}
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="description" rows={3} defaultValue={series.description ?? ''}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={label} style={labelStyle}>Estado</label>
              <select name="status" defaultValue={series.status} className={field} style={fieldStyle}>
                <option value="active">En curso</option>
                <option value="upcoming">Próximamente</option>
                <option value="archived">Completada</option>
              </select>
            </div>
            <div>
              <label className={label} style={labelStyle}>Orden</label>
              <input name="order_index" type="number" defaultValue={series.order_index}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Color</label>
              <input name="cover_color" type="color" defaultValue={series.cover_color || '#76ABAE'}
                className="w-full h-11 rounded-xl border px-2 cursor-pointer"
                style={{ background: '#061E30', borderColor: '#0D3352' }} />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input name="is_active" type="checkbox" id="is_active" value="true"
              defaultChecked={series.is_active} className="rounded" />
            <label htmlFor="is_active" className={label} style={{ ...labelStyle, margin: 0 }}>
              Visible en el sitio público
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Guardar cambios
            </button>
            <Link href={`/admin/estudio-biblico/${id}`}
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.40)' }}>
              Cancelar
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}
