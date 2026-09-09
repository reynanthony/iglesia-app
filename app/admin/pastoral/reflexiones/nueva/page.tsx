import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createPastoralReflection } from '@/app/actions/pastoral-admin'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default function NuevaPastoralReflexionPage() {
  const field = "w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition"
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/pastoral/reflexiones"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: CARD }}>
            <ArrowLeft size={14} style={{ color: MUTED }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Nueva reflexión pastoral</h1>
            <p className="text-[13px]" style={{ color: MUTED }}>1–5 minutos de contenido pastoral</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={createPastoralReflection} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Tipo</label>
            <select name="media_type" className={field} style={fieldStyle}>
              <option value="text">Texto</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className={label} style={labelStyle}>Título</label>
            <input name="title" placeholder="Ej: La gracia que sostiene"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Contenido / Reflexión</label>
            <textarea name="body" rows={6} placeholder="Escribe la reflexión..."
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>URL de video / audio (YouTube, etc.)</label>
              <input name="media_url_external" type="url" placeholder="https://..."
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Duración (segundos)</label>
              <input name="duration_seconds" type="number" min="0" placeholder="180"
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Archivo multimedia (opcional)</label>
            <div className="rounded-xl border-2 border-dashed p-5 text-center" style={{ borderColor: BORDER }}>
              <input type="file" name="media" accept="audio/*,video/*"
                className="w-full text-sm cursor-pointer" style={{ color: MUTED }} />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="week_featured" className="w-4 h-4 rounded accent-[#C9A227]" />
            <span className="text-[13px]" style={{ color: MUTED }}>
              Marcar como "Mensaje de la semana"
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: GOLD, color: GOLD_INK }}>
              Publicar reflexión
            </button>
            <Link href="/admin/pastoral/reflexiones"
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
