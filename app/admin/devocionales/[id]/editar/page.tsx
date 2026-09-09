import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateDevocional } from '@/app/actions/devocionales-admin'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default async function EditarDevocionalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()
  const { data: devo } = await supabase.from('devocionales').select('*').eq('id', id).maybeSingle()
  if (!devo) notFound()

  const action = updateDevocional.bind(null, id)
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/devocionales"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: CARD }}>
            <ArrowLeft size={14} style={{ color: MUTED }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Editar devocional</h1>
            <p className="text-[13px]" style={{ color: MUTED }}>{devo.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            No se pudo guardar. Intenta de nuevo.
          </div>
        )}
        <form action={action} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="title" required defaultValue={devo.title}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Contenido *</label>
            <textarea name="content" rows={8} required defaultValue={devo.content}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Versículo</label>
            <textarea name="verse" rows={2} defaultValue={devo.verse ?? ''}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Referencia bíblica</label>
            <input name="verse_ref" defaultValue={devo.verse_ref ?? ''}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Autor</label>
            <input name="author" defaultValue={devo.author ?? ''}
              className={field} style={fieldStyle} />
          </div>

          {devo.image_url && (
            <div>
              <p className={label} style={labelStyle}>Imagen actual</p>
              <img src={devo.image_url} alt={devo.title}
                className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
            </div>
          )}

          <div>
            <label className={label} style={labelStyle}>
              {devo.image_url ? 'Reemplazar imagen' : 'Imagen (opcional)'}
            </label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: BORDER }}>
              <input type="file" name="image" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: MUTED }} />
              <p className="text-[11px] mt-2" style={{ color: MUTED }}>JPG, PNG o WebP</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: GOLD, color: GOLD_INK }}>
              Guardar cambios
            </button>
            <Link href="/admin/devocionales"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: CARD, color: MUTED }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
