import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateMinistry } from '@/app/actions/ministerios-admin'
import { notFound } from 'next/navigation'

export default async function EditarMinisterioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: ministry }, { data: parents }] = await Promise.all([
    supabase.from('ministries').select('*').eq('id', id).single(),
    supabase.from('ministries').select('id, name').is('parent_id', null).neq('id', id).order('name'),
  ])

  if (!ministry) notFound()

  const action = updateMinistry.bind(null, id)
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.40)' }

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
        <Link href="/admin/ministerios"
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#0B2D47' }}>
          <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Editar ministerio</h1>
          <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.40)' }}>{ministry.name}</p>
        </div>
      </div>

      {/* Form */}
      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={action} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Nombre *</label>
            <input name="name" required defaultValue={ministry.name}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="description" rows={3} defaultValue={ministry.description ?? ''}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Sub-ministerio de</label>
            <select name="parent_id" className={field} style={fieldStyle}>
              <option value="">— Ministerio principal —</option>
              {parents?.map(p => (
                <option key={p.id} value={p.id} selected={p.id === ministry.parent_id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Current image */}
          {ministry.image_url && (
            <div>
              <p className={label} style={labelStyle}>Imagen actual</p>
              <img src={ministry.image_url} alt={ministry.name}
                className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
            </div>
          )}

          <div>
            <label className={label} style={labelStyle}>
              {ministry.image_url ? 'Reemplazar imagen' : 'Imagen de portada'}
            </label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#0D3352' }}>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full text-sm cursor-pointer"
                style={{ color: 'rgba(246,243,235,0.40)' }}
              />
              <p className="text-[11px] mt-2" style={{ color: 'rgba(246,243,235,0.40)' }}>
                JPG, PNG o WebP · Recomendado 1200×800px
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold transition"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Guardar cambios
            </button>
            <Link href="/admin/ministerios"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center transition"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.40)' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
