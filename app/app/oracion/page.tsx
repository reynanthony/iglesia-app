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
    <div style={{ background: '#061E30', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 280, borderBottom: '1px solid #0D3352' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(118,171,174,0.07), transparent 70%)' }} />

        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#0D3352', border: '1px solid #0D3352' }}>
                  <Mic2 size={18} style={{ color: '#76ABAE' }} />
                </div>
                {count > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px rgba(74,222,128,0.8)' }} />
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(246,243,235,0.45)' }}>
                      {count} activa{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
                Salas de<br />
                <span style={{ color: '#76ABAE' }}>Oración.</span>
              </h1>
              <p className="text-sm mt-4 leading-relaxed max-w-sm" style={{ color: 'rgba(246,243,235,0.45)' }}>
                Únete a una sesión de oración grupal en tiempo real. Voz en vivo con tu comunidad.
              </p>
            </div>

            <Link
              href="/app/oracion/nueva"
              className="flex-shrink-0 flex items-center gap-2 text-sm font-black uppercase tracking-wider px-5 py-3 rounded-xl transition"
              style={{ background: '#F6F3EB', color: '#061E30' }}
            >
              <Plus size={14} /> Nueva sala
            </Link>
          </div>
        </div>
      </div>

      {/* ── ROOMS ── */}
      <div className="max-w-2xl mx-auto px-4 py-8">

        {!rooms || rooms.length === 0 ? (
          <div className="text-center py-28 flex flex-col items-center">
            <svg width="72" height="80" viewBox="0 0 72 80" fill="none" aria-hidden className="mb-6">
              <path d="M20 52 C18 44 14 38 12 30 C11 26 13 22 17 22 C19 22 21 24 22 27 L24 36"
                stroke="rgba(118,171,174,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M24 36 C22 28 20 22 22 18 C23 15 26 14 29 15 C31 16 32 19 32 22 L33 34"
                stroke="rgba(118,171,174,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M33 34 C32 26 32 20 34 17 C35 14 38 13 40 15 C42 17 42 22 41 28"
                stroke="rgba(118,171,174,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M20 52 C19 58 22 64 28 66 L36 68"
                stroke="rgba(118,171,174,0.45)" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M52 52 C54 44 58 38 60 30 C61 26 59 22 55 22 C53 22 51 24 50 27 L48 36"
                stroke="rgba(118,171,174,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M48 36 C50 28 52 22 50 18 C49 15 46 14 43 15 C41 16 40 19 40 22 L39 34"
                stroke="rgba(118,171,174,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M52 52 C53 58 50 64 44 66 L36 68"
                stroke="rgba(118,171,174,0.45)" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <line x1="36" y1="6" x2="36" y2="12" stroke="rgba(118,171,174,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="28" y1="8" x2="30" y2="13" stroke="rgba(118,171,174,0.20)" strokeWidth="1" strokeLinecap="round"/>
              <line x1="44" y1="8" x2="42" y2="13" stroke="rgba(118,171,174,0.20)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>No hay salas activas</p>
            <p className="text-sm mb-8 max-w-[200px] leading-relaxed mx-auto" style={{ color: 'rgba(246,243,235,0.45)' }}>Crea una sala y comienza a orar con tu comunidad</p>
            <Link
              href="/app/oracion/nueva"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl transition"
              style={{ background: '#F6F3EB', color: '#061E30' }}
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
                style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
              >
                <div className="p-5 md:p-6">
                  {/* Live indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"
                        style={{ boxShadow: '0 0 8px rgba(74,222,128,0.7)', animation: 'pulse 2s infinite' }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(246,243,235,0.45)' }}>
                        En vivo
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
                      <Users size={12} />
                      <span className="text-[11px] font-bold">Máx {room.max_participants}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#0D3352', border: '1px solid #0D3352' }}>
                      <Radio size={20} style={{ color: '#76ABAE' }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-black text-base tracking-tight" style={{ color: '#F6F3EB' }}>
                        {room.name}
                      </p>
                      {room.description && (
                        <p className="text-sm mt-0.5 truncate" style={{ color: 'rgba(246,243,235,0.50)' }}>{room.description}</p>
                      )}
                      <p className="text-[11px] mt-1.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
                        Creada por {room.profiles?.full_name}
                      </p>
                    </div>

                    <div
                      className="flex-shrink-0 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider"
                      style={{ background: '#F6F3EB', color: '#061E30' }}
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
