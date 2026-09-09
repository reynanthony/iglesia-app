import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createLider } from '@/app/actions/lideres-admin'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default function NuevoLiderPage() {
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/lideres"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: CARD }}>
            <ArrowLeft size={14} style={{ color: MUTED }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Nuevo líder</h1>
            <p className="text-[13px]" style={{ color: MUTED }}>
              Agrega un pastor o líder a la sección Nosotros
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6">
        <form action={createLider} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Nombre completo *</label>
            <input name="name" required placeholder="Ej: Juan García"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Cargo *</label>
            <input name="title" required placeholder="Ej: Pastor Principal"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Categoría *</label>
            <select name="category" required className={field} style={fieldStyle}>
              <option value="pastoral">Liderazgo pastoral</option>
              <option value="ministerio">Líder de ministerio</option>
            </select>
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción / Biografía</label>
            <textarea name="bio" rows={4}
              placeholder="Breve descripción del líder, su ministerio y trayectoria..."
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Orden de aparición</label>
              <input name="order_index" type="number" min="0" defaultValue="0"
                className={field} style={fieldStyle} />
              <p className="text-[11px] mt-1.5" style={{ color: MUTED }}>
                Número menor aparece primero
              </p>
            </div>
            <div>
              <label className={label} style={labelStyle}>Visibilidad</label>
              <select name="is_public" className={field} style={fieldStyle}>
                <option value="true">Público</option>
                <option value="false">Oculto</option>
              </select>
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Foto</label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: BORDER }}>
              <input type="file" name="avatar" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: MUTED }} />
              <p className="text-[11px] mt-2" style={{ color: MUTED }}>
                JPG, PNG o WebP · Recomendado 600×600px o retrato
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: GOLD, color: GOLD_INK }}>
              Guardar líder
            </button>
            <Link href="/admin/lideres"
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
