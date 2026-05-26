import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createAdminRoom } from '@/app/actions/admin'

export default async function NuevaSalaPage() {
  async function create(formData: FormData) {
    'use server'
    await createAdminRoom(formData)
  }
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#141414', borderColor: '#2A2A2A', color: '#F5F5F5' }
  const lbl = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const lblStyle = { color: '#4D4D4D' }

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#1F1F1F' }}>
        <Link href="/admin/oracion" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1A1A1A' }}>
          <ArrowLeft size={14} style={{ color: '#8A8A8A' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Nueva sala de oración</h1>
          <p className="text-[13px]" style={{ color: '#5A5A5A' }}>Se activará inmediatamente en la app</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-xl">
        <form action={create} className="space-y-5">

          <div>
            <label className={lbl} style={lblStyle}>Nombre de la sala *</label>
            <input name="name" required placeholder="Ej: Intercesión por la nación"
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={lbl} style={lblStyle}>Descripción</label>
            <textarea name="description" rows={3} placeholder="Propósito o tema de oración"
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={lbl} style={lblStyle}>Máximo de participantes</label>
            <input name="max_participants" type="number" min={2} max={100} defaultValue={20}
              className={field} style={fieldStyle} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
              Crear sala
            </button>
            <Link href="/admin/oracion" className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#1A1A1A', color: '#8A8A8A' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
