import Link from 'next/link'
import { ArrowRight, Radio, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cmsSingleton, cmsImageUrl, type DEnVivo } from '@/lib/directus'
import LivePlayer from '@/components/LivePlayer'
import { HeroVideo } from '@/components/public/HeroVideo'

export const revalidate = 0

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

function getYoutubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default async function EnVivoPage() {
  const [supabase, cms] = await Promise.all([
    createClient(),
    cmsSingleton<DEnVivo>('en_vivo'),
  ])
  const c = cms ?? {} as DEnVivo

  const offlineTitle    = c.offline_title    ?? 'Estamos en *camino.'
  const offlineSubtitle = c.offline_subtitle ?? 'Todos los domingos transmitimos nuestro servicio. Vuelve el próximo domingo para unirte.'
  const offlineNextText = c.offline_next_text ?? 'Próxima transmisión: Domingo 10:00 AM'
  const scheduleEyebrow = c.schedule_eyebrow ?? '— Horario'
  const scheduleTitle   = c.schedule_title   ?? 'Nos reunimos cada semana.'
  const ctaEyebrow      = c.cta_eyebrow ?? '— La iglesia es más que una pantalla'
  const ctaTitle        = c.cta_title   ?? 'Conéctate con la *comunidad.'
  const ctaBody         = c.cta_body    ?? 'El stream es el primer paso. La comunidad en línea te permite participar, orar y crecer.'
  const heroImageUrl       = c.hero_image_url || cmsImageUrl(c.hero_image)
  const heroVideoUrl       = c.hero_video_url || cmsImageUrl(c.hero_video) || null
  const heroOverlayOpacity = c.hero_overlay_opacity ?? 0.60
  const heroShowGrid       = c.hero_show_grid !== false
  const heroBg             = c.hero_bg_color ?? '#051828'

  const SCHEDULE = [
    { day: c.schedule_1_day ?? 'Domingo',   time: c.schedule_1_time ?? '10:00 AM', type: c.schedule_1_type ?? 'Servicio principal', live: c.schedule_1_live !== false },
    { day: c.schedule_2_day ?? 'Miércoles', time: c.schedule_2_time ?? '7:00 PM',  type: c.schedule_2_type ?? 'Estudio bíblico',   live: c.schedule_2_live === true  },
    { day: c.schedule_3_day ?? 'Viernes',   time: c.schedule_3_time ?? '7:00 PM',  type: c.schedule_3_type ?? 'Noche de oración',  live: c.schedule_3_live === true  },
  ]

  let cfg: Record<string, string> = {}
  try {
    const { data } = await supabase.from('site_config').select('key, value')
    cfg = Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]))
  } catch { cfg = {} }

  const isLive    = cfg['is_live'] === 'true' && cfg['live_visible_web'] !== 'false'
  const liveUrl   = cfg['live_url']  ?? ''
  const liveTitle = cfg['live_title'] ?? 'Servicio en vivo'

  // Parse title with * for accent (same as HeroTitle pattern)
  function renderTitle(text: string, accentColor = TEAL) {
    if (!text.includes('*')) return <>{text}</>
    const parts = text.split('*')
    return <>{parts[0]}<em style={{ color: accentColor }}>{parts[1]}</em>{parts[2] ?? ''}</>
  }

  return (
    <div>

      {isLive ? (
        /* ─── LIVE ─────────────────────────────────────── */
        <section style={{ background: '#000' }}>
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
              style={{ color: 'rgba(255,255,255,0.80)' }}>
              <Radio size={11} /> El Manantial
            </div>
          </div>

          <div className="w-full" style={{ background: '#000' }}>
            <div className="max-w-5xl mx-auto">
              <LivePlayer url={liveUrl} title={liveTitle} />
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] mb-1" style={{ color: 'rgba(255,255,255,0.80)' }}>
                El Manantial · Culto en línea
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
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
        /* ─── OFFLINE ───────────────────────────────────── */
        <section className="relative overflow-hidden min-h-[85svh] md:min-h-[85vh]" style={{ background: heroBg }}>
          {heroImageUrl && !heroVideoUrl && (
            <img src={heroImageUrl} alt="" aria-hidden fetchPriority="high" loading="eager"
              className="absolute inset-0 w-full h-full object-cover" style={{ opacity: heroOverlayOpacity }} />
          )}
          {heroVideoUrl && <HeroVideo url={heroVideoUrl} opacity={heroOverlayOpacity} fallbackUrl={heroImageUrl ?? undefined} />}
          {(heroImageUrl || heroVideoUrl) && (
            <div className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.50) 0%, rgba(9,60,93,0.30) 100%)' }} />
          )}
          {heroShowGrid && (
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
          )}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 50% 65% at 85% 30%, ${TEAL}10, transparent 65%)` }} />
          <div className="pointer-events-none absolute right-0 bottom-0 select-none">
            <span className="font-black leading-none"
              style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', opacity: 0.04, color: TEAL, lineHeight: 1 }}>
              FE
            </span>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12 sm:pt-32 sm:pb-20 md:pt-44 md:pb-24 flex flex-col justify-end" style={{ minHeight: '85vh' }}>
            <div className="flex items-center gap-5 mb-12">
              <div className="w-px h-10" style={{ background: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
                El Manantial · Transmisiones en vivo
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              <h1 className="font-display font-black tracking-tighter text-white leading-[0.9] md:leading-[0.85]"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
                {renderTitle(offlineTitle)}
              </h1>
              <div>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(246,243,235,0.82)' }}>
                  {offlineSubtitle}
                </p>
                <div className="flex items-center gap-3 p-4 rounded-xl mb-6"
                  style={{ background: 'rgba(118,171,174,0.08)', border: '1px solid rgba(118,171,174,0.18)' }}>
                  <Clock size={14} style={{ color: TEAL, flexShrink: 0 }} />
                  <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.84)' }}>
                    {offlineNextText}
                  </p>
                </div>
                <Link href="/predicas"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition"
                  style={{ background: TEAL, color: NAVY }}>
                  <ArrowRight size={12} /> Ver archivo de prédicas
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HORARIOS */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>{scheduleEyebrow}</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 0.9, color: NAVY }}>
                {scheduleTitle}
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
                    <p className="text-[12px]" style={{ color: `${NAVY}CC` }}>{type}</p>
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

      {/* CTA */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-10" style={{ color: 'rgba(118,171,174,0.50)' }}>
                {ctaEyebrow}
              </p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.85 }}>
                {renderTitle(ctaTitle)}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.82)' }}>
                {ctaBody}
              </p>
              <Link href="/registro"
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                Unirme a la comunidad <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contacto"
                className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.84)' }}>
                Visitarnos en persona <ArrowRight size={12} className="opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
