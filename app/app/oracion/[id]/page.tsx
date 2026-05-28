import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AudioRoom from '@/components/AudioRoom'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { closeRoom } from '@/app/actions/rooms'

export default async function SalaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: room } = await supabase
    .from('rooms')
    .select('*, profiles(id, full_name)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!room) notFound()

  const isCreator = room.created_by === user?.id

  return (
    <div className="room-height flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1F1F1F' }}>
        <div className="flex items-center gap-3">
          <Link href="/app/oracion" className="p-2.5 hover:bg-[#0D3352] rounded-xl transition" style={{ color: '#76ABAE' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-bold" style={{ color: '#F6F3EB' }}>{room.name}</h1>
            {room.description && (
              <p className="text-xs" style={{ color: 'rgba(118,171,174,0.60)' }}>{room.description}</p>
            )}
          </div>
        </div>

        {isCreator && (
          <form action={closeRoom.bind(null, room.id)}>
            <button
              type="submit"
              className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 px-3 py-2 rounded-lg transition"
            >
              Cerrar sala
            </button>
          </form>
        )}
      </div>

      {/* Audio Room */}
      <div className="flex-1 overflow-hidden">
        <AudioRoom roomId={room.id} roomName={room.name} />
      </div>
    </div>
  )
}