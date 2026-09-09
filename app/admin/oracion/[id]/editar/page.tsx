import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { updateAdminRoom } from '@/app/actions/admin'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

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
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const lbl = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const lblStyle = { color: MUTED }

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: BORDER }}>
        <Link href="/admin/oracion" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: CARD }}>
          <ArrowLeft size={14} style={{ color: MUTED }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Editar sala</h1>
          <p className="text-[13px]" style={{ color: MUTED }}>{room.name}</p>
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
            <span className="text-[13px] font-medium" style={{ color: MUTED }}>
              Sala activa (visible en la app)
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: GOLD, color: GOLD_INK }}>
              Guardar cambios
            </button>
            <Link href="/admin/oracion" className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: CARD, color: MUTED }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
