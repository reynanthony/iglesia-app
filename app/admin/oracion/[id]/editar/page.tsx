import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { updateAdminRoom } from '@/app/actions/admin'

export default async function EditarSalaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: room } = await supabase.from('rooms').select('*').eq('id', id).single()
  if (!room) notFound()

  async function action(formData: FormData) {
    'use server'
    await updateAdminRoom(id, formData)
  }
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const lbl = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const lblStyle = { color: 'rgba(246,243,235,0.40)' }

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#0D3352' }}>
        <Link href="/admin/oracion" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0B2D47' }}>
          <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Editar sala</h1>
          <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.40)' }}>{room.name}</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-xl">
        <form action={action} className="space-y-5">

          <div>
            <label className={lbl} style={lblStyle}>Nombre *</label>
            <input name="name" required defaultValue={room.name}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={lbl} style={lblStyle}>Descripción</label>
            <textarea name="description" rows={3} defaultValue={room.description ?? ''}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={lbl} style={lblStyle}>Máximo de participantes</label>
            <input name="max_participants" type="number" min={2} max={100} defaultValue={room.max_participants ?? 20}
              className={field} style={fieldStyle} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_active" defaultChecked={room.is_active}
              className="w-4 h-4 accent-white rounded" />
            <span className="text-[13px] font-medium" style={{ color: 'rgba(246,243,235,0.40)' }}>
              Sala activa (visible en la app)
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Guardar cambios
            </button>
            <Link href="/admin/oracion" className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.40)' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
