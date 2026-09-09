import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createDevocional } from '@/app/actions/devocionales-admin'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default function NuevoDevocionalPage() {
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
          <h1 className="font-bold text-lg text-white">Nuevo devocional</h1>
          <p className="text-[13px]" style={{ color: MUTED }}>Publica una reflexión</p>
        </div>
      </div>

      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={createDevocional} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="title" required placeholder="Ej: Descansa en Su presencia"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Contenido *</label>
            <textarea name="content" rows={8} required placeholder="Escribe la reflexión completa (usa líneas en blanco para separar párrafos)"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Versículo</label>
            <textarea name="verse" rows={2} placeholder="Texto del versículo"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Referencia bíblica</label>
            <input name="verse_ref" placeholder="Ej: Mateo 11:28"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Autor</label>
            <input name="author" placeholder="Pastor Principal"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Imagen (opcional)</label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: BORDER }}>
              <input type="file" name="image" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: MUTED }} />
              <p className="text-[11px] mt-2" style={{ color: MUTED }}>JPG, PNG o WebP</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold transition"
              style={{ background: GOLD, color: GOLD_INK }}>
              Publicar devocional
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
