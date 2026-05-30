import Link from 'next/link'
import { ArrowRight, Radio, Clock, Calendar, ChevronRight, Play, Wifi } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const SCHEDULE = [
  { day: 'Domingo',   time: '10:00 AM', type: 'Servicio principal', live: true  },
  { day: 'Miércoles', time: '7:00 PM',  type: 'Estudio bíblico',   live: false },
  { day: 'Viernes',   time: '7:00 PM',  type: 'Noche de oración',  live: false },
]

export default async function EnVivoPage() {
  const supabase = await createClient()

  let config: { is_live: boolean; live_url: string; live_title: string } | null = null
  try {
    const { data } = await supabase
      .from('site_config')
      .select('is_live, live_url, live_title')
      .single()
    config = data
  } catch {
    config = null
  }

  const isLive     = config?.is_live   ?? false
  const liveUrl    = config?.live_url  ?? ''
  const liveTitle  = config?.live_title ?? 'Transmisión en vivo'

  const { data: predicas } = await supabase
    .from('ministry_content')
    .select('id, title, body, video_url, created_at, profiles(full_name), ministries(name)')
    .eq('type', 'video')
    .order('created_at', { ascending: false })
    .limit(3)

  const videos = predicas ?? []

  function getYoutubeId(url: string) {
    const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : null
  }

  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '90vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />

        {/* Glow radial */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: isLive
            ? `radial-gradient(ellipse 60% 60% at 50% 30%, rgba(118,171,174,0.15), transparent 65%)`
            : `radial-gradient(ellipse 50% 65% at 85% 30%, ${TEAL}10, transparent 65%)` }} />

        {/* LIVE indicator pulsing dot */}
        {isLive && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#EF4444' }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: '#EF4444' }} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#EF4444' }}>En vivo ahora</span>
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-44 md:pb-24 flex flex-col justify-end"
          style={{ minHeight: '90vh' }}>

          {/* Eyebrow */}
          <div className="flex items-center gap-5 mb-14">
            <div className="w-px h-10" style={{ background: TEAL }} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
                El Manantial · {isLive ? 'Transmisión activa' : 'Transmisiones en vivo'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-end">
            <div>
              <h1 className="font-display font-black tracking-tighter text-white mb-6"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
                {isLive ? <>La iglesia<br /><em style={{ color: TEAL }}>en vivo.</em></> : <>Iglesia<br />sin<br /><em style={{ color: TEAL }}>fronteras.</em></>}
              </h1>
            </div>
            <div>
              {isLive ? (
                <div>
                  <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(246,243,235,0.55)' }}>
                    Estamos transmitiendo ahora. Únete a la congregación desde donde estés — la presencia de Dios no tiene fronteras geográficas.
                  </p>
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition"
                    style={{ background: '#EF4444', color: '#FFFFFF' }}>
                    <Radio size={13} /> Ver transmisión
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(246,243,235,0.55)' }}>
                    Cada domingo transmitimos nuestro servicio en vivo. También puedes acceder al archivo completo de prédicas desde cualquier lugar del mundo.
                  </p>
                  <div className="flex items-center gap-3 p-4 rounded-xl mb-6"
                    style={{ background: 'rgba(118,171,174,0.08)', border: '1px solid rgba(118,171,174,0.18)' }}>
                    <Clock size={14} style={{ color: TEAL, flexShrink: 0 }} />
                    <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.60)' }}>
                      Próxima transmisión: <strong className="text-white">Domingo 10:00 AM</strong>
                    </p>
                  </div>
                  <Link href="/predicas"
                    className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition"
                    style={{ background: TEAL, color: NAVY }}>
                    Ver prédicas grabadas <ChevronRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PLAYER — solo cuando hay stream activo */}
      {isLive && liveUrl && (
        <section style={{ background: '#000', borderBottom: '1px solid #111' }}>
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="mb-6 flex items-center gap-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#EF4444' }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#EF4444' }} />
              </span>
              <p className="text-sm font-black text-white">{liveTitle}</p>
            </div>
            {getYoutubeId(liveUrl) ? (
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${getYoutubeId(liveUrl)}?autoplay=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="rounded-2xl p-12 text-center" style={{ background: '#0A0A0A', border: '1px solid #222' }}>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl"
                  style={{ background: '#EF4444', color: '#fff' }}>
                  <Wifi size={13} /> Abrir transmisión <ArrowRight size={13} />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* HORARIOS */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Horario de cultos</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Nos reunimos<br />cada semana.
              </h2>
            </div>
          </div>

          <div className="space-y-px rounded-2xl overflow-hidden" style={{ border: '1px solid #D2CDB8' }}>
            {SCHEDULE.map(({ day, time, type, live }, idx) => (
              <div key={day}
                className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 sm:px-8 py-6 sm:py-7"
                style={{ background: idx % 2 === 0 ? CREAM : '#F4F1E8' }}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: live ? TEAL : '#D2CDB8' }} />
                  <div>
                    <h3 className="font-black text-base tracking-tight" style={{ color: NAVY }}>{day}</h3>
                    <p className="text-[12px]" style={{ color: `${NAVY}60` }}>{type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0 pl-5 sm:pl-0">
                  <p className="font-black text-xl" style={{ color: live ? TEAL : NAVY }}>{time}</p>
                  {live && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}>
                      Transmitido en vivo
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3 p-5 rounded-xl"
            style={{ background: '#EDEAE0', border: '1px solid #D2CDB8' }}>
            <Calendar size={14} style={{ color: SAGE, flexShrink: 0, marginTop: 2 }} />
            <p className="text-[12px] leading-relaxed" style={{ color: `${NAVY}65` }}>
              Los servicios de domingo se transmiten vía YouTube. Activa las notificaciones en nuestro canal para no perderte ninguna prédica.
            </p>
          </div>
        </div>
      </section>

      {/* ÚLTIMAS PRÉDICAS */}
      {videos.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Archivo</p>
                <h2 className="font-display font-black tracking-tighter"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                  Últimas<br />prédicas.
                </h2>
              </div>
              <Link href="/predicas"
                className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: SAGE }}>
                Ver todas <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videos.map((p: any, idx) => {
                const ytId = getYoutubeId(p.video_url ?? '')
                return (
                  <div key={p.id} className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid #D2CDB8', background: CREAM }}>
                    <div className="relative aspect-video flex items-center justify-center"
                      style={{ background: NAVY }}>
                      {ytId ? (
                        <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      ) : null}
                      <div className="relative w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}>
                        <Play size={18} className="text-white ml-0.5" />
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-3 left-3 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg"
                          style={{ background: TEAL, color: NAVY }}>
                          Reciente
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-2" style={{ color: TEAL }}>
                        {(p.ministries as any)?.name ?? 'Prédica'}
                      </p>
                      <h3 className="font-black text-base tracking-tight leading-tight mb-3" style={{ color: NAVY }}>
                        {p.title}
                      </h3>
                      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: SAGE }}>
                        {(p.profiles as any)?.full_name ?? 'Pastor'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA COMUNIDAD */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-10" style={{ color: 'rgba(118,171,174,0.50)' }}>
                — La iglesia es más que una pantalla
              </p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.85 }}>
                Conéctate<br />con la<br /><em style={{ color: TEAL }}>comunidad.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.55)' }}>
                El stream es el primer paso. La comunidad en línea te permite participar, orar, conectar y crecer junto a cientos de personas que comparten tu fe.
              </p>
              <Link href="/registro"
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                Unirme a la comunidad <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contacto"
                className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.60)' }}>
                Visitarnos en persona <ArrowRight size={12} className="opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
