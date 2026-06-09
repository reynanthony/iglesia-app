import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Newspaper } from 'lucide-react'
import { createPublicacion } from '@/app/actions/publicaciones'
import ImageUploader from '@/components/admin/ImageUploader'

const field  = "w-full px-3.5 py-2.5 text-sm focus:outline-none rounded-xl"
const fStyle = { background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' }
const label  = "block text-[10px] font-black uppercase tracking-[0.2em] mb-1.5"
const lStyle = { color: 'rgba(246,243,235,0.45)' }

async function handleCreate(formData: FormData) {
  'use server'
  const result = await createPublicacion(formData)
  if (!result?.error) redirect('/admin/publicaciones')
}

export default function NuevaPublicacionPage() {
  const now = new Date()
  now.setSeconds(0, 0)
  const defaultDate = now.toISOString().slice(0, 16)

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 md:mb-8">
          <Link href="/admin/publicaciones"
            className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: '#0B2D47', border: '1px solid #0D3352', color: 'rgba(246,243,235,0.55)' }}>
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(118,171,174,0.12)' }}>
              <Newspaper size={14} style={{ color: '#76ABAE' }} />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold leading-tight">Nueva publicación</h1>
              <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>Landing page editorial</p>
            </div>
          </div>
        </div>

        <form action={handleCreate} className="space-y-4">

          {/* Título */}
          <div>
            <label className={label} style={lStyle}>Título *</label>
            <input name="title" required placeholder="Ej: Conferencia de Familia 2026"
              className={field} style={fStyle} />
          </div>

          {/* Subtítulo */}
          <div>
            <label className={label} style={lStyle}>Subtítulo</label>
            <input name="subtitle" placeholder="Frase corta debajo del título..."
              className={field} style={fStyle} />
          </div>

          {/* Excerpt */}
          <div>
            <label className={label} style={lStyle}>Extracto (preview en listado)</label>
            <textarea name="excerpt" rows={2} placeholder="Descripción breve que aparece en la tarjeta del listado..."
              className={`${field} resize-none`} style={fStyle} />
          </div>

          {/* Categoría + Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={lStyle}>Categoría</label>
              <select name="category" className={field} style={fStyle}>
                <option value="campana">Campaña</option>
                <option value="serie">Serie</option>
                <option value="evento-especial">Evento Especial</option>
                <option value="ministerio">Ministerio</option>
                <option value="anuncio">Anuncio</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label className={label} style={lStyle}>Fecha de publicación</label>
              <input name="published_at" type="datetime-local" defaultValue={defaultDate}
                className={field} style={fStyle} />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className={label} style={lStyle}>Slug (URL)</label>
            <div className="flex items-center gap-0" style={{ background: '#0B2D47', border: '1px solid #0D3352', borderRadius: 12, overflow: 'hidden' }}>
              <span className="px-3 text-sm flex-shrink-0" style={{ color: 'rgba(246,243,235,0.30)' }}>/publicaciones/</span>
              <input name="slug" placeholder="conferencia-familia-2026"
                className="flex-1 px-2 py-2.5 text-sm focus:outline-none bg-transparent"
                style={{ color: '#F6F3EB' }} />
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(246,243,235,0.30)' }}>
              Opcional — se genera automáticamente del título si lo dejas vacío.
            </p>
          </div>

          {/* Portada */}
          <div>
            <label className={label} style={lStyle}>Imagen de portada</label>
            <ImageUploader name="cover_image" bucket="publicaciones" />
          </div>

          {/* Color de fondo (si no hay imagen) */}
          <div>
            <label className={label} style={lStyle}>Color de portada (si no hay imagen)</label>
            <div className="flex items-center gap-2">
              <input name="cover_color" type="color" defaultValue="#093C5D"
                className="w-10 h-10 rounded-lg border cursor-pointer"
                style={{ background: '#0B2D47', borderColor: '#0D3352', padding: 2 }} />
              <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.35)' }}>
                Se usa como fondo si no hay imagen de portada
              </span>
            </div>
          </div>

          {/* Cuerpo */}
          <div>
            <label className={label} style={lStyle}>Cuerpo (Markdown soportado)</label>
            <textarea name="body" rows={10}
              placeholder={`## Bienvenidos\n\nEscribe el contenido completo de la landing page aquí.\n\nPuedes usar **negrita**, *cursiva*, ## encabezados, y párrafos separados por línea en blanco.\n\n> Citas destacadas con >`}
              className={`${field} resize-y font-mono text-[13px]`} style={fStyle} />
            <p className="text-[10px] mt-1" style={{ color: 'rgba(246,243,235,0.30)' }}>
              Markdown: **negrita**, *cursiva*, ## título, &gt; cita, - lista
            </p>
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={lStyle}>Texto del botón CTA</label>
              <input name="cta_label" placeholder="Más información"
                className={field} style={fStyle} />
            </div>
            <div>
              <label className={label} style={lStyle}>URL del botón CTA</label>
              <input name="cta_url" placeholder="/app/oracion o https://..."
                className={field} style={fStyle} />
            </div>
          </div>

          {/* Activo */}
          <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <input type="checkbox" name="is_active" className="flex-shrink-0" />
            <div>
              <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Publicar inmediatamente</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
                La página estará visible en /publicaciones/slug al activarla
              </p>
            </div>
          </label>

          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold transition"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            Crear publicación
          </button>
        </form>
      </div>
    </div>
  )
}
