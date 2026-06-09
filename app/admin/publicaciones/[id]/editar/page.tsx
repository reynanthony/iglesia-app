import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Newspaper } from 'lucide-react'
import { updatePublicacion } from '@/app/actions/publicaciones'
import ImageUploader from '@/components/admin/ImageUploader'

const field  = "w-full px-3.5 py-2.5 text-sm focus:outline-none rounded-xl"
const fStyle = { background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' }
const label  = "block text-[10px] font-black uppercase tracking-[0.2em] mb-1.5"
const lStyle = { color: 'rgba(246,243,235,0.45)' }

export default async function EditarPublicacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('publicaciones').select('*').eq('id', id).single()
  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    'use server'
    await updatePublicacion(id, formData)
    redirect('/admin/publicaciones')
  }

  const pubDate = item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : ''

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
              <h1 className="text-base md:text-lg font-bold leading-tight">Editar publicación</h1>
              <p className="text-[11px] truncate max-w-[200px]" style={{ color: 'rgba(246,243,235,0.40)' }}>{item.title}</p>
            </div>
          </div>
        </div>

        <form action={handleUpdate} className="space-y-4">

          <div>
            <label className={label} style={lStyle}>Título *</label>
            <input name="title" required defaultValue={item.title}
              className={field} style={fStyle} />
          </div>

          <div>
            <label className={label} style={lStyle}>Subtítulo</label>
            <input name="subtitle" defaultValue={item.subtitle ?? ''}
              className={field} style={fStyle} />
          </div>

          <div>
            <label className={label} style={lStyle}>Extracto</label>
            <textarea name="excerpt" rows={2} defaultValue={item.excerpt ?? ''}
              className={`${field} resize-none`} style={fStyle} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={lStyle}>Categoría</label>
              <select name="category" defaultValue={item.category} className={field} style={fStyle}>
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
              <input name="published_at" type="datetime-local" defaultValue={pubDate}
                className={field} style={fStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={lStyle}>Slug (URL)</label>
            <div className="flex items-center gap-0" style={{ background: '#0B2D47', border: '1px solid #0D3352', borderRadius: 12, overflow: 'hidden' }}>
              <span className="px-3 text-sm flex-shrink-0" style={{ color: 'rgba(246,243,235,0.30)' }}>/publicaciones/</span>
              <input name="slug" defaultValue={item.slug}
                className="flex-1 px-2 py-2.5 text-sm focus:outline-none bg-transparent"
                style={{ color: '#F6F3EB' }} />
            </div>
          </div>

          <div>
            <label className={label} style={lStyle}>Imagen de portada</label>
            <ImageUploader name="cover_image" defaultValue={item.cover_image ?? ''} bucket="publicaciones" />
          </div>

          <div>
            <label className={label} style={lStyle}>Color de portada</label>
            <div className="flex items-center gap-2">
              <input name="cover_color" type="color" defaultValue={item.cover_color ?? '#093C5D'}
                className="w-10 h-10 rounded-lg border cursor-pointer"
                style={{ background: '#0B2D47', borderColor: '#0D3352', padding: 2 }} />
            </div>
          </div>

          <div>
            <label className={label} style={lStyle}>Cuerpo (Markdown)</label>
            <textarea name="body" rows={12} defaultValue={item.body ?? ''}
              className={`${field} resize-y font-mono text-[13px]`} style={fStyle} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={lStyle}>Texto del botón CTA</label>
              <input name="cta_label" defaultValue={item.cta_label ?? 'Más información'}
                className={field} style={fStyle} />
            </div>
            <div>
              <label className={label} style={lStyle}>URL del botón CTA</label>
              <input name="cta_url" defaultValue={item.cta_url ?? ''}
                className={field} style={fStyle} />
            </div>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <input type="checkbox" name="is_active" defaultChecked={item.is_active} className="flex-shrink-0" />
            <div>
              <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Publicación activa</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
                Visible en /publicaciones/{item.slug}
              </p>
            </div>
          </label>

          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold transition"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  )
}
