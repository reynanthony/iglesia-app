import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Users, Radio, ArrowLeft, Mic2 } from 'lucide-react'

export default async function SalasPage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*, profiles(full_name, username)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const count = rooms?.length ?? 0

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Link href="/app/oracion"
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition"
                  style={{ color: 'rgba(118,171,174,0.55)' }}>
                  <ArrowLeft size={13} /> Peticiones
                </Link>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#0D3352' }}>
                  <Mic2 size={18} style={{ color: '#76ABAE' }} />
                </div>
                {count > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"
                      style={{ boxShadow: '0 0 6px rgba(74,222,128,0.8)' }} />
                    <span className="text-[11px] font-bold uppercase tracking-widest"
                      style={{ color: 'rgba(246,243,235,0.72)' }}>
                      {count} activa{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
                Salas de<br /><span style={{ color: '#76ABAE' }}>Oración.</span>
              </h1>
              <p className="text-sm mt-3 leading-relaxed max-w-xs"
                style={{ color: 'rgba(246,243,235,0.72)' }}>
                Oración grupal en tiempo real con voz en vivo.
              </p>
            </div>
            <Link href="/app/oracion/salas/nueva"
              className="flex-shrink-0 flex items-center gap-2 text-sm font-black uppercase tracking-wider px-5 py-3 rounded-xl transition"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              <Plus size={14} /> Nueva sala
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!rooms || rooms.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <Mic2 size={24} style={{ color: 'rgba(118,171,174,0.4)' }} />
            </div>
            <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>
              No hay salas activas
            </p>
            <p className="text-sm mb-8 max-w-[200px] leading-relaxed mx-auto"
              style={{ color: 'rgba(246,243,235,0.72)' }}>
              Crea una sala y comienza a orar con tu comunidad
            </p>
            <Link href="/app/oracion/salas/nueva"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl transition"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              <Plus size={13} /> Crear sala
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room: any) => (
              <Link key={room.id} href={`/app/oracion/salas/${room.id}`}
                className="group block rounded-2xl overflow-hidden transition"
                style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"
                        style={{ boxShadow: '0 0 8px rgba(74,222,128,0.7)', animation: 'pulse 2s infinite' }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: 'rgba(246,243,235,0.72)' }}>En vivo</span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
                      <Users size={12} />
                      <span className="text-[11px] font-bold">Máx {room.max_participants}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#0D3352' }}>
                      <Radio size={20} style={{ color: '#76ABAE' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-base tracking-tight" style={{ color: '#F6F3EB' }}>
                        {room.name}
                      </p>
                      {room.description && (
                        <p className="text-sm mt-0.5 truncate" style={{ color: 'rgba(246,243,235,0.50)' }}>
                          {room.description}
                        </p>
                      )}
                      <p className="text-[11px] mt-1.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
                        Creada por {room.profiles?.full_name}
                      </p>
                    </div>
                    <div className="flex-shrink-0 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider"
                      style={{ background: '#F6F3EB', color: '#061E30' }}>
                      Entrar
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
