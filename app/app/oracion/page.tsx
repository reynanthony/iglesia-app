import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Users, Mic2, Radio } from 'lucide-react'

export default async function OracionPage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*, profiles(full_name, username)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const count = rooms?.length ?? 0

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── HERO ATMOSFÉRICO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 280, borderBottom: '1px solid #181818' }}>

        {/* Glow ambiental — color oración: violeta cálido */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 120% at 50% 0%, rgba(0,0,0,0.10), transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 60% at 80% 50%, rgba(0,0,0,0.05), transparent 60%)' }} />

        {/* Ondas decorativas sutiles */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, transparent 40%)',
            backgroundSize: '600px 600px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% -100px',
          }} />

        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.20)' }}>
                  <Mic2 size={18} style={{ color: '#888888' }} />
                </div>
                {count > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px rgba(128,128,128,0.8)' }} />
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#4D4D4D' }}>
                      {count} activa{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 0.9, color: '#F5F5F5' }}>
                Salas de<br />
                <span style={{ color: '#888888' }}>Oración.</span>
              </h1>
              <p className="text-sm mt-4 leading-relaxed max-w-sm" style={{ color: '#4D4D4D' }}>
                Únete a una sesión de oración grupal en tiempo real. Voz en vivo con tu comunidad.
              </p>
            </div>

            <Link
              href="/app/oracion/nueva"
              className="flex-shrink-0 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-5 py-3 rounded-xl transition"
              style={{ background: '#F5F5F5', color: '#0A0A0A' }}
            >
              <Plus size={14} /> Nueva sala
            </Link>
          </div>
        </div>
      </div>

      {/* ── ROOMS ── */}
      <div className="max-w-2xl mx-auto px-4 py-8">

        {!rooms || rooms.length === 0 ? (
          <div className="text-center py-28">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
              <Mic2 size={28} style={{ color: '#4D4D4D' }} />
            </div>
            <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F5F5F5' }}>No hay salas activas</p>
            <p className="text-sm mb-8" style={{ color: '#4D4D4D' }}>Crea una sala y comienza a orar con tu comunidad</p>
            <Link
              href="/app/oracion/nueva"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl transition"
              style={{ background: '#F5F5F5', color: '#0A0A0A' }}
            >
              <Plus size={13} /> Crear sala
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room: any) => (
              <Link
                key={room.id}
                href={`/app/oracion/${room.id}`}
                className="group block rounded-2xl overflow-hidden transition"
                style={{ background: '#161614', border: '1px solid #1A1A1A' }}
              >
                <div className="p-5 md:p-6">
                  {/* Live indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"
                        style={{ boxShadow: '0 0 8px rgba(128,128,128,0.7)', animation: 'pulse 2s infinite' }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4D4D4D' }}>
                        En vivo
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: '#4D4D4D' }}>
                      <Users size={12} />
                      <span className="text-[11px] font-bold">Máx {room.max_participants}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Icono sala */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#1F1F1F', border: '1px solid #2A2A2A' }}>
                      <Radio size={20} style={{ color: '#8A8A8A' }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-black text-base tracking-tight transition"
                        style={{ color: '#F5F5F5' }}>
                        {room.name}
                      </p>
                      {room.description && (
                        <p className="text-sm mt-0.5 truncate" style={{ color: '#8A8A8A' }}>{room.description}</p>
                      )}
                      <p className="text-[11px] mt-1.5" style={{ color: '#4D4D4D' }}>
                        Creada por {room.profiles?.full_name}
                      </p>
                    </div>

                    {/* Entrar button — always visible */}
                    <div
                      className="flex-shrink-0 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider"
                      style={{ background: '#F5F5F5', color: '#0A0A0A' }}
                    >
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
