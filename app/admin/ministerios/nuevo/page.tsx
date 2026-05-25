import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createMinistry } from '@/app/actions/ministerios-admin'

export default async function NuevoMinisterioPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>
}) {
  const { parent } = await searchParams
  const supabase = await createClient()
  const { data: parents } = await supabase
    .from('ministries')
    .select('id, name')
    .is('parent_id', null)
    .order('name')

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#141414', borderColor: '#2A2A2A', color: '#F5F5F5' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: '#4D4D4D' }

  return (
    <div>
      {/* Header */}
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4"
        style={{ borderColor: '#1F1F1F' }}>
        <Link href="/admin/ministerios"
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#1A1A1A' }}>
          <ArrowLeft size={14} style={{ color: '#8A8A8A' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Nuevo ministerio</h1>
          <p className="text-[13px]" style={{ color: '#5A5A5A' }}>Completa la información y sube una imagen</p>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 md:px-8 py-6 max-w-xl">
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
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#2A2A2A' }}>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full text-sm cursor-pointer"
                style={{ color: '#8A8A8A' }}
              />
              <p className="text-[11px] mt-2" style={{ color: '#4D4D4D' }}>
                JPG, PNG o WebP · Recomendado 1200×800px
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold transition"
              style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
              Crear ministerio
            </button>
            <Link href="/admin/ministerios"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center transition"
              style={{ background: '#1A1A1A', color: '#8A8A8A' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
