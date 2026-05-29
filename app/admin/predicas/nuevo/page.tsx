import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createPredica } from '@/app/actions/predicas-admin'

export default async function NuevoPredicaPage() {
  const supabase = await createClient()
  const { data: ministries } = await supabase
    .from('ministries')
    .select('id, name')
    .order('name')

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.40)' }

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
        <Link href="/admin/predicas"
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#0B2D47' }}>
          <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Nueva prédica</h1>
          <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.40)' }}>Sube un mensaje o sermón</p>
        </div>
      </div>

      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={createPredica} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="title" required placeholder="Ej: El poder de la oración"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción / Cuerpo</label>
            <textarea name="body" rows={3} placeholder="Resumen o descripción del mensaje"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>URL del video (YouTube, Vimeo, etc.)</label>
            <input name="video_url" type="url" placeholder="https://youtube.com/watch?v=..."
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Ministerio / Serie</label>
            <select name="ministry_id" className={field} style={fieldStyle}>
              <option value="">— Sin categoría —</option>
              {ministries?.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label} style={labelStyle}>Imagen miniatura</label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#0D3352' }}>
              <input type="file" name="image" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: 'rgba(246,243,235,0.40)' }} />
              <p className="text-[11px] mt-2" style={{ color: 'rgba(246,243,235,0.40)' }}>JPG, PNG o WebP · 16:9 recomendado</p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="w-5 h-5 rounded border flex items-center justify-center" style={{ borderColor: '#0D3352' }}>
              <input type="checkbox" name="pinned" className="sr-only" />
            </div>
            <span className="text-[13px] font-medium" style={{ color: 'rgba(246,243,235,0.40)' }}>
              Destacar como mensaje principal
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Publicar prédica
            </button>
            <Link href="/admin/predicas"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.40)' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
