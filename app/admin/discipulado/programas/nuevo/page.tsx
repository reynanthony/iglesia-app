import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createProgram } from '@/app/actions/discipleship-lms'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default async function NuevoProgramaPage() {
  const supabase = await createClient()
  const { data: stages } = await supabase
    .from('discipleship_stages')
    .select('id, name, order_index')
    .order('order_index')

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/discipulado/programas"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: CARD }}>
            <ArrowLeft size={14} style={{ color: MUTED }} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs mb-0.5" style={{ color: MUTED }}>
              <Link href="/admin/discipulado" className="hover:underline">Discipulado</Link>
              <span>/</span>
              <Link href="/admin/discipulado/programas" className="hover:underline">Programas</Link>
              <span>/</span>
              <span>Nuevo</span>
            </div>
            <h1 className="font-bold text-lg" style={{ color: INK }}>Nuevo programa</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={createProgram} className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="title" required placeholder="Ej: Fundamentos de la Fe"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="description" rows={3}
              placeholder="Describe el objetivo de este programa…"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Etapa requerida</label>
              <select name="required_stage_id" className={field} style={fieldStyle}>
                <option value="">Ninguna (cualquiera puede cursarlo)</option>
                {stages?.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.order_index}. {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} style={labelStyle}>Orden</label>
              <input name="order_index" type="number" defaultValue={1} min={0}
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold transition"
              style={{ background: GOLD, color: GOLD_INK }}>
              Crear programa
            </button>
            <Link href="/admin/discipulado/programas"
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
