import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createPastoralMessage } from '@/app/actions/pastoral-admin'

export default function NuevoPastoralMensajePage() {
  const field = "w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.40)' }

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/pastoral/mensajes"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Nuevo mensaje pastoral</h1>
            <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.40)' }}>Publicar en el canal del pastor</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={createPastoralMessage} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Tipo de contenido</label>
            <select name="media_type" className={field} style={fieldStyle}>
              <option value="text">Texto</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="image">Imagen</option>
            </select>
          </div>

          <div>
            <label className={label} style={labelStyle}>Mensaje / Texto</label>
            <textarea name="body" rows={5} placeholder="Escribe tu mensaje aquí..."
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Archivo multimedia (audio, video o imagen)</label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#0D3352' }}>
              <input type="file" name="media" accept="audio/*,video/*,image/*"
                className="w-full text-sm cursor-pointer" style={{ color: 'rgba(246,243,235,0.40)' }} />
              <p className="text-[11px] mt-2" style={{ color: 'rgba(246,243,235,0.35)' }}>
                Opcional — sube el archivo si aplica
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="pinned" className="w-4 h-4 rounded accent-[#76ABAE]" />
            <span className="text-[13px]" style={{ color: 'rgba(246,243,235,0.60)' }}>
              Fijar este mensaje arriba del canal
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Publicar mensaje
            </button>
            <Link href="/admin/pastoral/mensajes"
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
