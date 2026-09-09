import { createClient } from '@/lib/supabase/server'
import { Mic2, Users, Radio, Plus, Pencil, HandHeart } from 'lucide-react'
import Link from 'next/link'
import ToggleRoomButton from '@/components/admin/ToggleRoomButton'
import DeleteRoomButton from '@/components/admin/DeleteRoomButton'
import DeletePrayerRequestButton from '@/components/admin/DeletePrayerRequestButton'
import { CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

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
        style={{ borderColor: BORDER }}>
        <div>
          <h1 className="font-bold text-base md:text-lg text-white">Salas de oración</h1>
          <p className="text-[11px] md:text-[13px] mt-0.5" style={{ color: MUTED }}>
            {rooms?.length ?? 0} salas · {active} activa{active !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/oracion/nuevo"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition flex-shrink-0"
          style={{ background: GOLD, color: GOLD_INK }}>
          <Plus size={13} /><span className="hidden sm:inline">Nueva sala</span><span className="sm:hidden">Nueva</span>
        </Link>
      </div>

      {/* List */}
      <div className="px-4 md:px-8 py-5 space-y-3">
        {(!rooms || rooms.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: BORDER }}>
            <Mic2 size={28} className="mx-auto mb-3" style={{ color: BORDER }} />
            <p className="text-sm" style={{ color: MUTED }}>No hay salas creadas.</p>
          </div>
        )}

        {rooms?.map((room: any) => (
          <div key={room.id}
            className="rounded-2xl border overflow-hidden flex items-center gap-4 p-4"
            style={{ borderColor: BORDER, background: CARD }}>

            {/* Icon */}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: room.is_active ? 'rgba(100,200,100,0.08)' : CARD }}>
              <Radio size={15} style={{ color: room.is_active ? GOLD : '#333333' }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {room.is_active && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: `${GOLD}1F`, color: GOLD }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    En vivo
                  </span>
                )}
                <div className="flex items-center gap-1 text-[11px]" style={{ color: MUTED }}>
                  <Users size={11} /> Máx {room.max_participants ?? '—'}
                </div>
              </div>
              <p className="font-bold text-white text-sm truncate">{room.name}</p>
              {room.description && (
                <p className="text-[12px] truncate" style={{ color: MUTED }}>{room.description}</p>
              )}
              <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>
                Creada por {room.profiles?.full_name ?? '—'} ·{' '}
                {new Date(room.created_at).toLocaleDateString('es-DO')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={`/admin/oracion/${room.id}/editar`}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
                title="Editar sala">
                <Pencil size={13} style={{ color: MUTED }} />
              </Link>
              <ToggleRoomButton roomId={room.id} isActive={room.is_active} />
              <DeleteRoomButton roomId={room.id} />
            </div>
          </div>
        ))}
      </div>
      {/* Prayer requests section */}
      <div className="border-t px-4 md:px-8 py-5" style={{ borderColor: BORDER }}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          style={{ color: MUTED }}>
          Peticiones de oración · {requests?.length ?? 0}
        </p>

        {(!requests || requests.length === 0) && (
          <div className="py-10 text-center rounded-2xl border" style={{ borderColor: BORDER }}>
            <HandHeart size={24} className="mx-auto mb-2" style={{ color: BORDER }} />
            <p className="text-sm" style={{ color: MUTED }}>No hay peticiones.</p>
          </div>
        )}

        <div className="space-y-2">
          {requests?.map((req: any) => {
            const author = req.is_anonymous ? 'Anónimo' : (req.profiles?.full_name ?? '—')
            const STATUS_COLOR: Record<string, string> = {
              activa: GOLD, respondida: '#869B7E', seguimiento: '#C9A227',
            }
            return (
              <div key={req.id}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: CARD, borderColor: BORDER }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold truncate" style={{ color: INK }}>{req.title}</p>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${STATUS_COLOR[req.status] ?? GOLD}20`, color: STATUS_COLOR[req.status] ?? GOLD }}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: MUTED }}>
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
