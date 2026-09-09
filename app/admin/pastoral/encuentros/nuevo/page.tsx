import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createPastoralEncounter } from '@/app/actions/pastoral-admin'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default function NuevoPastoralEncuentroPage() {
  const field = "w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition"
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/pastoral/encuentros"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: CARD }}>
            <ArrowLeft size={14} style={{ color: MUTED }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Nuevo encuentro pastoral</h1>
            <p className="text-[13px]" style={{ color: MUTED }}>Clase, mentoría, conversatorio o Q&A</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={createPastoralEncounter} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="title" required placeholder="Ej: Clase de oración — Fundamentos"
              className={field} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Tipo</label>
              <select name="type" className={field} style={fieldStyle}>
                <option value="clase">Clase</option>
                <option value="mentoria">Mentoría</option>
                <option value="conversatorio">Conversatorio</option>
                <option value="preguntas">Preguntas y Respuestas</option>
              </select>
            </div>
            <div>
              <label className={label} style={labelStyle}>Fecha y hora</label>
              <input name="scheduled_at" type="datetime-local"
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="description" rows={3} placeholder="Descripción breve del encuentro"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>URL del stream (YouTube Live, etc.)</label>
            <input name="live_url" type="url" placeholder="https://youtube.com/watch?v=..."
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Notas del encuentro (Markdown)</label>
            <textarea name="notes_markdown" rows={4} placeholder="Pasajes bíblicos, puntos clave, recursos..."
              className={`${field} resize-none font-mono text-[12px]`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Imagen miniatura</label>
            <div className="rounded-xl border-2 border-dashed p-5 text-center" style={{ borderColor: BORDER }}>
              <input type="file" name="thumbnail" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: MUTED }} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: GOLD, color: GOLD_INK }}>
              Crear encuentro
            </button>
            <Link href="/admin/pastoral/encuentros"
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
