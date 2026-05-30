import Link from 'next/link'
import { ArrowRight, Radio, Clock, Calendar, Play, Wifi, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cmsGet, cmsImageUrl } from '@/lib/directus'

export const revalidate = 60

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const SCHEDULE = [
  { day: 'Domingo',   time: '10:00 AM', type: 'Servicio principal',  live: true  },
  { day: 'Miércoles', time: '7:00 PM',  type: 'Estudio bíblico',    live: false },
  { day: 'Viernes',   time: '7:00 PM',  type: 'Noche de oración',   live: false },
]

type DirectusPredica = {
  id: string
  title: string
  description?: string
  video_url?: string
  thumbnail?: string
  series?: string
  speaker?: string
  date?: string
}

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
function fmtFecha(iso: string) {
  const d = new Date(iso)
  return `${MESES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

function getYoutubeId(url: string) {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default async function EnVivoPage() {
  const supabase = await createClient()

  // Live state from Supabase
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

  const isLive    = config?.is_live   ?? false
  const liveUrl   = config?.live_url  ?? ''
  const liveTitle = config?.live_title ?? 'Servicio en vivo'

  // Predicas from Directus CMS (recorded sermons)
  const cmsSermons = await cmsGet<DirectusPredica>('predicas', { sort: '-date', limit: '12' })
  const predicas = cmsSermons.map(s => ({
    id: s.id,
    titulo: s.title,
    pastor: s.speaker ?? 'Pastor Principal',
    fecha: s.date ? fmtFecha(s.date) : '',
    serie: s.series ?? '',
    video_url: s.video_url ?? null,
    image_url: cmsImageUrl(s.thumbnail),
  }))

  const featured = predicas[0]
  const archive  = predicas.slice(1)

  return (
    <div>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '85vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: isLive
            ? `radial-gradient(ellipse 60% 60% at 50% 30%, rgba(239,68,68,0.08), transparent 65%)`
            : `radial-gradient(ellipse 50% 65% at 85% 30%, ${TEAL}10, transparent 65%)` }} />

        {/* LIVE dot */}
        {isLive && (
          <div className="absolute top-28 md:top-36 left-6 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#EF4444' }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: '#EF4444' }} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#EF4444' }}>En vivo ahora</span>
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-44 md:pb-24 flex flex-col justify-end"
          style={{ minHeight: '85vh' }}>

          <div className="flex items-center gap-5 mb-12">
            <div className="w-px h-10" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
              El Manantial · {isLive ? 'Transmisión en vivo' : 'Transmisiones y prédicas'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-end">
            <div>
              <h1 className="font-display font-black tracking-tighter text-white mb-6"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
                {isLive ? <>La iglesia<br /><em style={{ color: '#EF4444' }}>en vivo.</em></> : <>La Palabra<br />donde<br /><em style={{ color: TEAL }}>estés.</em></>}
              </h1>
            </div>
            <div>
              {isLive ? (
                <>
                  <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(246,243,235,0.55)' }}>
                    Estamos transmitiendo ahora mismo. Únete a la congregación desde cualquier lugar — la presencia de Dios no tiene fronteras.
                  </p>
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition"
                    style={{ background: '#EF4444', color: '#FFFFFF' }}>
                    <Radio size={13} /> Ver transmisión en vivo
                  </a>
                </>
              ) : (
                <>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(246,243,235,0.55)' }}>
                    Todos los domingos transmitimos nuestro servicio. Accede también al archivo completo de prédicas predicadas en El Manantial.
                  </p>
                  <div className="flex items-center gap-3 p-4 rounded-xl mb-6"
                    style={{ background: 'rgba(118,171,174,0.08)', border: '1px solid rgba(118,171,174,0.18)' }}>
                    <Clock size={14} style={{ color: TEAL, flexShrink: 0 }} />
                    <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.60)' }}>
                      Próxima transmisión: <strong className="text-white">Domingo 10:00 AM</strong>
                    </p>
                  </div>
                  {featured?.video_url && (
                    <a href={featured.video_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition"
                      style={{ background: TEAL, color: NAVY }}>
                      <Play size={12} /> Ver última prédica
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PLAYER EN VIVO ══════════════════════════════════ */}
      {isLive && liveUrl && (
        <section style={{ background: '#000', borderBottom: '1px solid #111' }}>
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="mb-6 flex items-center gap-3">
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
                  <Wifi size={13} /> Abrir transmisión
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ PRÉDICA DESTACADA ════════════════════════════════ */}
      {featured && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: TEAL }}>Prédica reciente</p>
            </div>

            <a href={featured.video_url ?? '#'}
              target={featured.video_url ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border transition cursor-pointer"
              style={{ borderColor: '#D2CDB8' }}>

              {/* Thumbnail */}
              <div className="lg:col-span-5 relative min-h-[260px] flex items-center justify-center overflow-hidden"
                style={{
                  background: featured.image_url
                    ? `url(${featured.image_url}) center/cover`
                    : `linear-gradient(135deg, ${NAVY} 0%, #0D4A72 100%)`,
                }}>
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.20)' }} />
                <div className="absolute top-5 left-5 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                  style={{ background: TEAL, color: NAVY }}>
                  {featured.serie || 'Mensaje'}
                </div>
                <div className="relative w-20 h-20 rounded-full border-2 border-white/25 group-hover:bg-white/20 flex items-center justify-center transition duration-300 group-hover:scale-110">
                  <Play size={22} className="text-white ml-1.5" />
                </div>
              </div>

              {/* Info */}
              <div className="lg:col-span-7 p-10 lg:p-14 flex flex-col justify-between gap-8"
                style={{ background: '#EDEAE0' }}>
                <div>
                  {featured.serie && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: TEAL }}>{featured.serie}</p>
                  )}
                  <h2 className="font-display font-black tracking-tight leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: NAVY }}>
                    {featured.titulo}
                  </h2>
                  <p className="text-sm uppercase tracking-wider" style={{ color: SAGE }}>
                    {featured.pastor} · {featured.fecha}
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl self-start"
                  style={{ background: NAVY }}>
                  <Play size={12} /> Ver prédica <ArrowRight size={12} />
                </div>
              </div>
            </a>
          </div>
        </section>
      )}

      {/* ══ ARCHIVO DE PRÉDICAS ══════════════════════════════ */}
      {archive.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Archivo</p>
                <h2 className="font-display font-black tracking-tighter"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                  Prédicas<br />anteriores.
                </h2>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: SAGE }}>{predicas.length} mensajes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {archive.map(({ id, titulo, pastor, fecha, serie, image_url, video_url }) => {
                const ytId = getYoutubeId(video_url ?? '')
                return (
                  <a key={id} href={video_url ?? '#'}
                    target={video_url ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group block">
                    <div className="relative rounded-xl overflow-hidden mb-4"
                      style={{ aspectRatio: '16/10', background: NAVY }}>
                      {ytId ? (
                        <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition" />
                      ) : image_url ? (
                        <img src={image_url} alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition" />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-white/25 group-hover:bg-white/20 flex items-center justify-center transition group-hover:scale-110">
                          <Play size={14} className="text-white ml-0.5" />
                        </div>
                      </div>
                      {serie && (
                        <span className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">{serie}</span>
                      )}
                    </div>
                    <h3 className="font-black text-base tracking-tight leading-tight mb-1" style={{ color: NAVY }}>
                      {titulo}
                    </h3>
                    <p className="text-[11px] uppercase tracking-wider" style={{ color: SAGE }}>{pastor} · {fecha}</p>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ HORARIOS ══════════════════════════════════════════ */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Horario</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 0.9, color: NAVY }}>
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
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
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
                El stream es el primer paso. La comunidad en línea te permite participar, orar, conectar y crecer junto a cientos de personas.
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
