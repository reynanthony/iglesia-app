import Link from 'next/link'
import { ArrowRight, Radio, Clock, Play } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import LivePlayer from '@/components/LivePlayer'
import { cmsGet, cmsImageUrl, type DPredica } from '@/lib/directus'

export const revalidate = 0

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const SCHEDULE = [
  { day: 'Domingo',   time: '10:00 AM', type: 'Servicio principal', live: true  },
  { day: 'Miércoles', time: '7:00 PM',  type: 'Estudio bíblico',   live: false },
  { day: 'Viernes',   time: '7:00 PM',  type: 'Noche de oración',  live: false },
]

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
function fmtFecha(iso: string) {
  const d = new Date(iso)
  return `${MESES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

function getYoutubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default async function EnVivoPage() {
  const supabase = await createClient()

  let cfg: Record<string, string> = {}
  try {
    const { data } = await supabase.from('site_config').select('key, value')
    cfg = Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]))
  } catch { cfg = {} }

  const isLive    = cfg['is_live'] === 'true' && cfg['live_visible_web'] !== 'false'
  const liveUrl   = cfg['live_url']  ?? ''
  const liveTitle = cfg['live_title'] ?? 'Servicio en vivo'
  const ytId      = getYoutubeId(liveUrl)

  const rawPredicas = await cmsGet<DPredica>('predicas', {
    'filter[status][_eq]': 'published',
    'sort': '-date_created',
    'limit': '12',
  })

  const predicas = rawPredicas.map(s => ({
    id: s.id,
    titulo: s.title,
    pastor: s.speaker ?? 'Pastor Principal',
    fecha: s.date ? fmtFecha(s.date) : '',
    serie: s.series ?? '',
    video_url: s.video_url ?? null,
    image_url: cmsImageUrl(s.thumbnail) ?? null,
  }))

  const featured = predicas[0] ?? null
  const archive  = predicas.slice(1)

  return (
    <div>

      {/* ══ HERO ═══════════════════════════════════════════════
          When LIVE  → immersive embedded player fills the hero
          When OFFLINE → editorial text layout               */}

      {isLive ? (
        /* ─── LIVE HERO ─────────────────────────────────── */
        <section style={{ background: '#000' }}>

          {/* Top status bar */}
          <div className="flex items-center gap-4 px-6 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.30)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-400" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
              </span>
              En vivo
            </span>
            <p className="text-sm font-bold text-white truncate">{liveTitle}</p>
            <div className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: 'rgba(255,255,255,0.30)' }}>
              <Radio size={11} /> El Manantial
            </div>
          </div>

          {/* EMBEDDED PLAYER */}
          <div className="w-full" style={{ background: '#000' }}>
            <div className="max-w-5xl mx-auto">
              <LivePlayer url={liveUrl} title={liveTitle} />
            </div>
          </div>

          {/* Below player: join CTA */}
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] mb-1" style={{ color: 'rgba(255,255,255,0.30)' }}>
                El Manantial · Culto en línea
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Comparte con alguien que necesite escuchar la Palabra hoy.
              </p>
            </div>
            <Link href="/registro"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl flex-shrink-0"
              style={{ background: TEAL, color: NAVY }}>
              Únete a la comunidad <ArrowRight size={12} />
            </Link>
          </div>
        </section>

      ) : (
        /* ─── OFFLINE HERO ───────────────────────────────── */
        <section className="relative overflow-hidden min-h-[85svh] md:min-h-[85vh]" style={{ background: '#051828' }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
          <div className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 50% 65% at 85% 30%, ${TEAL}10, transparent 65%)` }} />
          <div className="pointer-events-none absolute right-0 bottom-0 select-none">
            <span className="font-black leading-none"
              style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', opacity: 0.04, color: TEAL, lineHeight: 1 }}>
              FE
            </span>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12 sm:pt-32 sm:pb-20 md:pt-44 md:pb-24 flex flex-col justify-end">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-px h-10" style={{ background: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
                El Manantial · Transmisiones y prédicas
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-end">
              <h1 className="font-display font-black tracking-tighter text-white leading-[0.9] md:leading-[0.85]"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
                La Palabra<br />donde<br /><em style={{ color: TEAL }}>estés.</em>
              </h1>
              <div>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(246,243,235,0.55)' }}>
                  Todos los domingos transmitimos nuestro servicio. Accede también al archivo completo de prédicas.
                </p>
                <div className="flex items-center gap-3 p-4 rounded-xl mb-6"
                  style={{ background: 'rgba(118,171,174,0.08)', border: '1px solid rgba(118,171,174,0.18)' }}>
                  <Clock size={14} style={{ color: TEAL, flexShrink: 0 }} />
                  <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.60)' }}>
                    Próxima transmisión: <strong className="text-white">Domingo 10:00 AM</strong>
                  </p>
                </div>
                {featured && (
                  <Link href={`/predicas/${featured.id}`}
                    className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition"
                    style={{ background: TEAL, color: NAVY }}>
                    <Play size={12} /> Ver última prédica
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ PRÉDICA DESTACADA ══════════════════════════════════ */}
      {featured && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: TEAL }}>Prédica reciente</p>
            </div>

            <Link href={`/predicas/${featured.id}`}
              className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border transition cursor-pointer"
              style={{ borderColor: '#D2CDB8' }}>

              <div className="lg:col-span-5 relative min-h-[260px] flex items-center justify-center overflow-hidden"
                style={{
                  background: featured.image_url
                    ? `url(${featured.image_url}) center/cover`
                    : `linear-gradient(135deg, ${NAVY} 0%, #0D4A72 100%)`,
                }}>
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.20)' }} />
                {featured.serie && (
                  <div className="absolute top-5 left-5 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                    style={{ background: TEAL, color: NAVY }}>
                    {featured.serie}
                  </div>
                )}
                <div className="relative w-20 h-20 rounded-full border-2 border-white/25 group-hover:bg-white/20 flex items-center justify-center transition duration-300 group-hover:scale-110">
                  <Play size={22} className="text-white ml-1.5" />
                </div>
              </div>

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
            </Link>
          </div>
        </section>
      )}

      {/* ══ ARCHIVO DE PRÉDICAS ════════════════════════════════ */}
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
              <p className="hidden sm:block text-[11px] font-bold uppercase tracking-wider" style={{ color: SAGE }}>
                {predicas.length} mensajes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {archive.map(({ id, titulo, pastor, fecha, serie, image_url, video_url }) => {
                const ytId = getYoutubeId(video_url ?? '')
                const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : image_url
                return (
                  <Link key={id} href={`/predicas/${id}`} className="group block">
                    <div className="relative rounded-xl overflow-hidden mb-4"
                      style={{ aspectRatio: '16/10', background: NAVY }}>
                      {thumb && (
                        <img src={thumb} alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition" />
                      )}
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
                  </Link>
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
                El stream es el primer paso. La comunidad en línea te permite participar, orar y crecer.
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
