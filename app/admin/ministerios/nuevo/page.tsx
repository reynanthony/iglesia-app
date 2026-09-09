import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createMinistry } from '@/app/actions/ministerios-admin'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default async function NuevoMinisterioPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string; error?: string }>
}) {
  const { parent, error } = await searchParams
  const supabase = await createClient()
  const { data: parents } = await supabase
    .from('ministries')
    .select('id, name')
    .is('parent_id', null)
    .order('name')

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: BORDER }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
        <Link href="/admin/ministerios"
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: CARD }}>
          <ArrowLeft size={14} style={{ color: MUTED }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Nuevo ministerio</h1>
          <p className="text-[13px]" style={{ color: MUTED }}>Completa la información y sube una imagen</p>
        </div>
      </div>

      {/* Form */}
      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            No se pudo crear el ministerio. Intenta de nuevo.
          </div>
        )}
        <form action={createMinistry} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Nombre *</label>
            <input name="name" required placeholder="Ej: Ministerio de Jóvenes"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="description" rows={3} placeholder="Descripción breve del ministerio"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Sub-ministerio de</label>
            <select name="parent_id" className={field} style={fieldStyle}>
              <option value="">— Ministerio principal —</option>
              {parents?.map(p => (
                <option key={p.id} value={p.id} selected={p.id === parent}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label} style={labelStyle}>Imagen de portada</label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: BORDER }}>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full text-sm cursor-pointer"
                style={{ color: MUTED }}
              />
              <p className="text-[11px] mt-2" style={{ color: MUTED }}>
                JPG, PNG o WebP · Recomendado 1200×800px
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold transition"
              style={{ background: GOLD, color: GOLD_INK }}>
              Crear ministerio
            </button>
            <Link href="/admin/ministerios"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center transition"
              style={{ background: CARD, color: MUTED }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
