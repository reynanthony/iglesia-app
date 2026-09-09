import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createEvento } from '@/app/actions/eventos-admin'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default function NuevoEventoPage() {
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
        <Link href="/admin/eventos"
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: CARD }}>
          <ArrowLeft size={14} style={{ color: MUTED }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Nuevo evento</h1>
          <p className="text-[13px]" style={{ color: MUTED }}>Agrega un evento al sitio web</p>
        </div>
      </div>

      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={createEvento} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="titulo" required placeholder="Ej: Retiro de Jóvenes"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="descripcion" rows={3} placeholder="Describe el evento"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Fecha inicio *</label>
              <input name="fecha_inicio" type="date" required
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Fecha fin</label>
              <input name="fecha_fin" type="date"
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Lugar</label>
            <input name="lugar" placeholder="Ej: Templo principal"
              className={field} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Categoría</label>
              <input name="categoria" placeholder="Ej: Jóvenes"
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Badge</label>
              <select name="badge" className={field} style={fieldStyle}>
                <option value="Próximo">Próximo</option>
                <option value="Especial">Especial</option>
                <option value="Por confirmar">Por confirmar</option>
                <option value="Hoy">Hoy</option>
              </select>
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Imagen del evento</label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: BORDER }}>
              <input type="file" name="image" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: MUTED }} />
              <p className="text-[11px] mt-2" style={{ color: MUTED }}>
                JPG, PNG o WebP · Recomendado 1200×800px
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold transition"
              style={{ background: GOLD, color: GOLD_INK }}>
              Publicar evento
            </button>
            <Link href="/admin/eventos"
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
