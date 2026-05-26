import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updatePredica } from '@/app/actions/predicas-admin'
import { notFound } from 'next/navigation'

export default async function EditarPredicaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: predica }, { data: ministries }] = await Promise.all([
    supabase.from('ministry_content').select('*').eq('id', id).single(),
    supabase.from('ministries').select('id, name').order('name'),
  ])

  if (!predica) notFound()

  const action = updatePredica.bind(null, id)
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#141414', borderColor: '#2A2A2A', color: '#F5F5F5' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: '#4D4D4D' }

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#1F1F1F' }}>
        <Link href="/admin/predicas" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1A1A1A' }}>
          <ArrowLeft size={14} style={{ color: '#8A8A8A' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Editar prédica</h1>
          <p className="text-[13px]" style={{ color: '#5A5A5A' }}>{predica.title}</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-xl">
        <form action={action} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="title" required defaultValue={predica.title}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="body" rows={3} defaultValue={predica.body ?? ''}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>URL del video (YouTube, Vimeo, etc.)</label>
            <input name="video_url" type="url" defaultValue={predica.video_url ?? ''}
              placeholder="https://youtube.com/watch?v=..." className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Ministerio / Serie</label>
            <select name="ministry_id" className={field} style={fieldStyle}>
              <option value="">— Sin categoría —</option>
              {ministries?.map(m => (
                <option key={m.id} value={m.id} selected={m.id === predica.ministry_id}>{m.name}</option>
              ))}
            </select>
          </div>

          {predica.image_url && (
            <div>
              <p className={label} style={labelStyle}>Imagen actual</p>
              <img src={predica.image_url} alt={predica.title}
                className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
            </div>
          )}

          <div>
            <label className={label} style={labelStyle}>
              {predica.image_url ? 'Reemplazar miniatura' : 'Imagen miniatura'}
            </label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#2A2A2A' }}>
              <input type="file" name="image" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: '#8A8A8A' }} />
              <p className="text-[11px] mt-2" style={{ color: '#4D4D4D' }}>JPG, PNG o WebP · 16:9 recomendado</p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="pinned" defaultChecked={predica.pinned}
              className="w-4 h-4 accent-white rounded" />
            <span className="text-[13px] font-medium" style={{ color: '#8A8A8A' }}>
              Destacar como mensaje principal
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
              Guardar cambios
            </button>
            <Link href="/admin/predicas" className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#1A1A1A', color: '#8A8A8A' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
