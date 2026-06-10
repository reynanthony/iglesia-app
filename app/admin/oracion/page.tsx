import { createClient } from '@/lib/supabase/server'
import { Mic2, Users, Radio, Plus, Pencil, HandHeart } from 'lucide-react'
import Link from 'next/link'
import ToggleRoomButton from '@/components/admin/ToggleRoomButton'
import DeleteRoomButton from '@/components/admin/DeleteRoomButton'
import DeletePrayerRequestButton from '@/components/admin/DeletePrayerRequestButton'

export default async function AdminOracionPage() {
  const supabase = await createClient()

  const [{ data: rooms }, { data: requests }] = await Promise.all([
    supabase
      .from('rooms')
      .select('*, profiles(full_name, username)')
      .order('created_at', { ascending: false }),
    supabase
      .from('prayer_requests')
      .select('id, title, status, is_anonymous, created_at, profiles:user_id(full_name, username)')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const active = rooms?.filter(r => r.is_active).length ?? 0

  return (
    <div>
      {/* Header */}
      <div className="border-b px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3"
        style={{ borderColor: '#0D3352' }}>
        <div>
          <h1 className="font-bold text-base md:text-lg text-white">Salas de oración</h1>
          <p className="text-[11px] md:text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
            {rooms?.length ?? 0} salas · {active} activa{active !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/oracion/nuevo"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition flex-shrink-0"
          style={{ background: '#F6F3EB', color: '#061E30' }}>
          <Plus size={13} /><span className="hidden sm:inline">Nueva sala</span><span className="sm:hidden">Nueva</span>
        </Link>
      </div>

      {/* List */}
      <div className="px-4 md:px-8 py-5 space-y-3">
        {(!rooms || rooms.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <Mic2 size={28} className="mx-auto mb-3" style={{ color: '#0D3352' }} />
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.40)' }}>No hay salas creadas.</p>
          </div>
        )}

        {rooms?.map((room: any) => (
          <div key={room.id}
            className="rounded-2xl border overflow-hidden flex items-center gap-4 p-4"
            style={{ borderColor: '#0D3352', background: '#0B2D47' }}>

            {/* Icon */}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: room.is_active ? 'rgba(100,200,100,0.08)' : '#0B2D47' }}>
              <Radio size={15} style={{ color: room.is_active ? '#76ABAE' : '#333333' }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {room.is_active && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(118,171,174,0.12)', color: '#76ABAE' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    En vivo
                  </span>
                )}
                <div className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                  <Users size={11} /> Máx {room.max_participants ?? '—'}
                </div>
              </div>
              <p className="font-bold text-white text-sm truncate">{room.name}</p>
              {room.description && (
                <p className="text-[12px] truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>{room.description}</p>
              )}
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
                Creada por {room.profiles?.full_name ?? '—'} ·{' '}
                {new Date(room.created_at).toLocaleDateString('es-DO')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={`/admin/oracion/${room.id}/editar`}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
                title="Editar sala">
                <Pencil size={13} style={{ color: 'rgba(246,243,235,0.40)' }} />
              </Link>
              <ToggleRoomButton roomId={room.id} isActive={room.is_active} />
              <DeleteRoomButton roomId={room.id} />
            </div>
          </div>
        ))}
      </div>
      {/* Prayer requests section */}
      <div className="border-t px-4 md:px-8 py-5" style={{ borderColor: '#0D3352' }}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          style={{ color: 'rgba(246,243,235,0.30)' }}>
          Peticiones de oración · {requests?.length ?? 0}
        </p>

        {(!requests || requests.length === 0) && (
          <div className="py-10 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <HandHeart size={24} className="mx-auto mb-2" style={{ color: '#0D3352' }} />
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.40)' }}>No hay peticiones.</p>
          </div>
        )}

        <div className="space-y-2">
          {requests?.map((req: any) => {
            const author = req.is_anonymous ? 'Anónimo' : (req.profiles?.full_name ?? '—')
            const STATUS_COLOR: Record<string, string> = {
              activa: '#76ABAE', respondida: '#869B7E', seguimiento: '#C9A227',
            }
            return (
              <div key={req.id}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: '#0B2D47', borderColor: '#0D3352' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{req.title}</p>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${STATUS_COLOR[req.status] ?? '#76ABAE'}20`, color: STATUS_COLOR[req.status] ?? '#76ABAE' }}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                    {author} · {new Date(req.created_at).toLocaleDateString('es-DO')}
                  </p>
                </div>
                <DeletePrayerRequestButton requestId={req.id} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
