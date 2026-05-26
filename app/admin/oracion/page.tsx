import { createClient } from '@/lib/supabase/server'
import { Mic2, Users, Radio, Plus, Pencil } from 'lucide-react'
import Link from 'next/link'
import ToggleRoomButton from '@/components/admin/ToggleRoomButton'
import DeleteRoomButton from '@/components/admin/DeleteRoomButton'

export default async function AdminOracionPage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*, profiles(full_name, username)')
    .order('created_at', { ascending: false })

  const active = rooms?.filter(r => r.is_active).length ?? 0

  return (
    <div>
      {/* Header */}
      <div className="border-b px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
        style={{ borderColor: '#1F1F1F' }}>
        <div>
          <h1 className="font-bold text-lg text-white">Salas de oración</h1>
          <p className="text-[13px] mt-0.5" style={{ color: '#5A5A5A' }}>
            {rooms?.length ?? 0} salas · {active} activa{active !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/oracion/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition"
          style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
          <Plus size={13} /> Nueva sala
        </Link>
      </div>

      {/* List */}
      <div className="px-4 md:px-8 py-5 space-y-3">
        {(!rooms || rooms.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#1F1F1F' }}>
            <Mic2 size={28} className="mx-auto mb-3" style={{ color: '#2A2A2A' }} />
            <p className="text-sm" style={{ color: '#4D4D4D' }}>No hay salas creadas.</p>
          </div>
        )}

        {rooms?.map((room: any) => (
          <div key={room.id}
            className="rounded-2xl border overflow-hidden flex items-center gap-4 p-4"
            style={{ borderColor: '#1F1F1F', background: '#111111' }}>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: room.is_active ? 'rgba(100,200,100,0.08)' : '#1A1A1A' }}>
              <Radio size={18} style={{ color: room.is_active ? '#6BCB6B' : '#333333' }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {room.is_active && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(100,200,100,0.10)', color: '#6BCB6B' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    En vivo
                  </span>
                )}
                <div className="flex items-center gap-1 text-[11px]" style={{ color: '#4D4D4D' }}>
                  <Users size={11} /> Máx {room.max_participants ?? '—'}
                </div>
              </div>
              <p className="font-bold text-white text-sm truncate">{room.name}</p>
              {room.description && (
                <p className="text-[12px] truncate" style={{ color: '#5A5A5A' }}>{room.description}</p>
              )}
              <p className="text-[11px] mt-0.5" style={{ color: '#4D4D4D' }}>
                Creada por {room.profiles?.full_name ?? '—'} ·{' '}
                {new Date(room.created_at).toLocaleDateString('es-DO')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={`/admin/oracion/${room.id}/editar`}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                title="Editar sala">
                <Pencil size={13} style={{ color: '#8A8A8A' }} />
              </Link>
              <ToggleRoomButton roomId={room.id} isActive={room.is_active} />
              <DeleteRoomButton roomId={room.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
