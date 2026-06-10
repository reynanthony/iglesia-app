import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { updatePastoralEncounter } from '@/app/actions/pastoral-admin'

export default async function EditarEncuentroPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: enc } = await supabase
    .from('pastoral_encounters')
    .select('id, title, description, type, live_url, scheduled_at, notes_markdown, thumbnail_url')
    .eq('id', id)
    .single()

  if (!enc) notFound()

  const field = "w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.68)' }

  const scheduledLocal = enc.scheduled_at ? enc.scheduled_at.slice(0, 16) : ''
  const action = updatePastoralEncounter.bind(null, id)

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/pastoral/encuentros"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.68)' }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Editar encuentro</h1>
            <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>{enc.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={action} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Título *</label>
            <input name="title" required defaultValue={enc.title}
              placeholder="Ej: Clase de oración — Fundamentos"
              className={field} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Tipo</label>
              <select name="type" defaultValue={enc.type} className={field} style={fieldStyle}>
                <option value="clase">Clase</option>
                <option value="mentoria">Mentoría</option>
                <option value="conversatorio">Conversatorio</option>
                <option value="preguntas">Preguntas y Respuestas</option>
              </select>
            </div>
            <div>
              <label className={label} style={labelStyle}>Fecha y hora</label>
              <input name="scheduled_at" type="datetime-local" defaultValue={scheduledLocal}
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción</label>
            <textarea name="description" rows={3} defaultValue={enc.description ?? ''}
              placeholder="Descripción breve del encuentro"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>URL del stream (YouTube Live, etc.)</label>
            <input name="live_url" type="url" defaultValue={enc.live_url ?? ''}
              placeholder="https://youtube.com/watch?v=..."
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Notas del encuentro (Markdown)</label>
            <textarea name="notes_markdown" rows={4} defaultValue={enc.notes_markdown ?? ''}
              placeholder="Pasajes bíblicos, puntos clave, recursos..."
              className={`${field} resize-none font-mono text-[12px]`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Reemplazar miniatura (opcional)</label>
            {enc.thumbnail_url && (
              <div className="mb-3 w-24 h-16 rounded-xl overflow-hidden">
                <img src={enc.thumbnail_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="rounded-xl border-2 border-dashed p-5 text-center" style={{ borderColor: '#0D3352' }}>
              <input type="file" name="thumbnail" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: 'rgba(246,243,235,0.68)' }} />
              <p className="text-[11px] mt-1.5" style={{ color: 'rgba(246,243,235,0.25)' }}>
                Dejar vacío para conservar la imagen actual
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Guardar cambios
            </button>
            <Link href="/admin/pastoral/encuentros"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.68)' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
