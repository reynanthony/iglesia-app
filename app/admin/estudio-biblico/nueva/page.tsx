import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createSeries } from '@/app/actions/bible-study'

const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
const labelStyle = { color: 'rgba(246,243,235,0.40)' }

export default function NuevaSeriesPage() {
  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/estudio-biblico"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs mb-0.5" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Link href="/admin/estudio-biblico" className="hover:underline">Estudio Bíblico</Link>
              <span>/</span>
              <span>Nueva serie</span>
            </div>
            <h1 className="font-bold text-lg" style={{ color: '#F6F3EB' }}>Nueva serie</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={createSeries} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Título *</label>
              <input name="title" required placeholder="Ej: Evangelio de Juan"
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Slug (URL)</label>
              <input name="slug" placeholder="ej: evangelio-de-juan (auto si vacío)"
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Libro</label>
              <input name="book" placeholder="Ej: Evangelio de Juan"
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Tema / Subtítulo</label>
              <input name="theme" placeholder="Ej: La identidad de Cristo"
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="description" rows={3}
              placeholder="Describe el propósito de esta serie…"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={label} style={labelStyle}>Estado</label>
              <select name="status" className={field} style={fieldStyle}>
                <option value="active">En curso</option>
                <option value="upcoming">Próximamente</option>
                <option value="archived">Completada</option>
              </select>
            </div>
            <div>
              <label className={label} style={labelStyle}>Orden</label>
              <input name="order_index" type="number" defaultValue={0} min={0}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Color</label>
              <input name="cover_color" type="color" defaultValue="#76ABAE"
                className="w-full h-11 rounded-xl border px-2 cursor-pointer"
                style={{ background: '#061E30', borderColor: '#0D3352' }} />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input name="is_active" type="checkbox" id="is_active" value="true" defaultChecked
              className="rounded" />
            <label htmlFor="is_active" className={label} style={{ ...labelStyle, margin: 0 }}>
              Visible en el sitio público
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Crear serie
            </button>
            <Link href="/admin/estudio-biblico"
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
