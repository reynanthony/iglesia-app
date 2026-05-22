import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Users, MicIcon } from 'lucide-react'

export default async function OracionPage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*, profiles(full_name, username)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Salas de Oración</h1>
          <p className="text-slate-500 text-sm mt-0.5">Únete a una sesión de oración grupal</p>
        </div>
        <Link
          href="/app/oracion/nueva"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition"
        >
          <Plus size={16} />
          Nueva sala
        </Link>
      </div>

      {!rooms || rooms.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-4">🙏</p>
          <p className="font-medium">No hay salas activas</p>
          <p className="text-sm mt-1">Crea una sala para comenzar a orar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room: any) => (
            <Link
              key={room.id}
              href={`/app/oracion/${room.id}`}
              className="block bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <MicIcon size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-amber-400 transition">{room.name}</p>
                    {room.description && (
                      <p className="text-slate-500 text-sm mt-0.5">{room.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Users size={13} />
                  <span>Máx {room.max_participants}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <p className="text-xs text-slate-500">
                  Creada por {room.profiles?.full_name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}