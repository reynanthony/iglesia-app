import { ArrowRight, MapPin, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BlockRenderer from '@/components/BlockRenderer'
import { HeroVideo } from '@/components/public/HeroVideo'

export const dynamic = 'force-dynamic'

const defaultRegularServices = [
  { day: 'Dom', fullDay: 'Domingo',   time: '10:00', label: 'AM', type: 'Servicio Principal', desc: 'Adoración, Palabra y comunidad para toda la familia.' },
  { day: 'Mié', fullDay: 'Miércoles', time: '7:00',  label: 'PM', type: 'Estudio Bíblico',   desc: 'Profundizando en la Palabra de Dios juntos.' },
  { day: 'Vie', fullDay: 'Viernes',   time: '7:00',  label: 'PM', type: 'Noche de Oración',  desc: 'Intercesión y búsqueda de la presencia de Dios.' },
]

const fallbackEvents = [
  { id: '1', titulo: 'Retiro de Jóvenes', fecha_inicio: '2026-06-20', fecha_fin: '2026-06-22', lugar: 'Por confirmar', badge: 'Próximo', categoria: 'Jóvenes', descripcion: 'Un fin de semana de encuentro, adoración y crecimiento para la juventud.', image_url: null },
  { id: '2', titulo: 'Conferencia de Matrimonios', fecha_inicio: '2026-07-11', fecha_fin: '2026-07-12', lugar: 'Templo principal', badge: 'Especial', categoria: 'Matrimonios', descripcion: 'Fortalece tu hogar con enseñanzas prácticas y bíblicas para parejas.', image_url: null },
  { id: '3', titulo: 'Noche de Alabanza', fecha_inicio: '2026-08-01', fecha_fin: null, lugar: 'Templo principal', badge: 'Por confirmar', categoria: 'Adoración', descripcion: 'Una noche dedicada a la adoración colectiva y la presencia de Dios.', image_url: null },
]

function badgeColor(badge: string) {
  if (badge === 'Especial') return '#093C5D'
  if (badge === 'Por confirmar') return '#869B7E'
  if (badge === 'Hoy') return '#76ABAE'
  return '#093C5D'
}

const MESES_CORTOS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function formatEventDate(fechaInicio: string, fechaFin?: string | null) {
  const d1 = new Date(fechaInicio + 'T00:00:00')
  const mes = MESES_CORTOS[d1.getUTCMonth()]
  const dia = fechaFin
    ? `${d1.getUTCDate()}–${new Date(fechaFin + 'T00:00:00').getUTCDate()}`
    : d1.getUTCDate().toString()
  const year = d1.getUTCFullYear().toString()
  return { mes, dia, year }
}

export default async function EventosPage() {
  const supabase = await createClient()

  const [pageResult, eventsResult] = await Promise.all([
    supabase.from('page_content').select('content').eq('page', 'eventos').single(),
    supabase.from('events').select('*').eq('visible', true).order('fecha_inicio', { ascending: true }),
  ])

  const editorialBlocks = (pageResult.data?.content as any)?.blocks
  const hasBlocks = Array.isArray(editorialBlocks) && editorialBlocks.length > 0

  const pageContent = (pageResult.data?.content ?? {}) as Record<string, any>
  const heroEyebrow   = (pageContent.hero_eyebrow   as string) || 'Eventos · Agenda 2026'
  const heroTitleMain = (pageContent.hero_title_main as string) || 'Lo que\nse viene.'
  const heroSubtitle  = (pageContent.hero_subtitle   as string) || 'Mantente al día con nuestras actividades, servicios y eventos especiales.'
  const heroImageUrl  = (pageContent.hero_image_url  as string) || null
  const heroVideoUrl  = (pageContent.hero_video_url  as string) || null

  // New CMS fields
  const regularServices   = Array.isArray(pageContent.regular_services) ? pageContent.regular_services : defaultRegularServices
  const eventsEyebrow     = pageContent.events_eyebrow    || '— Próximamente'
  const locationEyebrow   = pageContent.location_eyebrow  || '— Cómo llegar'
  const locationTitle     = pageContent.location_title    || 'Encuéntranos\naquí.'
  const locationAddress   = pageContent.location_address  || 'Tu dirección aquí, Ciudad, País'
  const locationSchedule  = pageContent.location_schedule || 'Dom 10AM · Mié 7PM · Vie 7PM'
  const locationNextEvent = pageContent.location_next_event || 'Retiro de Jóvenes · Jun 2026'
  const evCtaEyebrow      = pageContent.ev_cta_eyebrow    || '— ¿Primera vez?'
  const evCtaTitle        = pageContent.ev_cta_title      || 'Ven y\nsé parte.'
  const evCta1Label       = pageContent.ev_cta1_label     || 'Escríbenos'
  const evCta1Url         = pageContent.ev_cta1_url       || '/contacto'
  const evCta2Label       = pageContent.ev_cta2_label     || 'Comunidad en línea'
  const evCta2Url         = pageContent.ev_cta2_url       || '/login'

  const specialEvents: any[] = eventsResult.data && eventsResult.data.length > 0
    ? eventsResult.data
    : fallbackEvents

  return (
    <div>

      {/* ═══════════════════════════════════════
          ZONA EDITORIAL — bloques del admin, o hero hardcoded
      ═══════════════════════════════════════ */}
      {hasBlocks ? (
        <BlockRenderer blocks={editorialBlocks} />
      ) : (
        <section className="relative overflow-hidden min-h-[80vh] flex flex-col justify-center" style={{ background: '#093C5D' }}>
          {heroImageUrl && !heroVideoUrl && (
            <img src={heroImageUrl} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
          )}
          {heroVideoUrl && <HeroVideo url={heroVideoUrl} />}
          {(heroImageUrl || heroVideoUrl) && (
            <div className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.45) 0%, rgba(9,60,93,0.30) 100%)' }} />
          )}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 90px)' }} />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-end overflow-hidden select-none">
            <span className="font-black leading-none tracking-tighter block"
              style={{ fontSize: 'clamp(16rem, 35vw, 32rem)', opacity: 0.06, color: '#76ABAE', paddingRight: '1rem' }}>
              2026
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 50% 70% at 90% 40%, rgba(118,171,174,0.10), transparent 65%)' }} />
          <div className="relative max-w-6xl mx-auto w-full px-6 py-24 md:py-32">
            <div className="flex items-center gap-5 mb-14">
              <div className="w-12 h-px" style={{ background: '#76ABAE' }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: 'rgba(118,171,174,0.7)' }}>
                {heroEyebrow}
              </p>
            </div>
            <h1 className="font-display font-black tracking-tighter text-white mb-8"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
              {heroTitleMain.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h1>
            <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(246,243,235,0.55)' }}>
              {heroSubtitle}
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          ZONA DE DATOS — siempre visible
      ═══════════════════════════════════════ */}

      {/* Horarios regulares */}
      <section className="border-t border-edge bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-edge">
            {regularServices.map(({ day, time, label, type, desc, fullDay }) => (
              <div key={day} className="py-8 md:px-8 first:md:pl-0 last:md:pr-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-3">
                  {fullDay || day}
                </p>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <p className="font-black text-ink tracking-tighter leading-none"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                    {time}
                  </p>
                  <p className="font-black text-ink-3 text-xl leading-none">{label}</p>
                </div>
                <p className="text-sm font-bold text-ink">{type}</p>
                {desc && (
                  <p className="text-[11px] text-ink-3 mt-1 leading-relaxed">{desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eventos especiales */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 border-b border-edge pb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">{eventsEyebrow}</p>
            <p className="text-[11px] font-bold text-ink-3">{specialEvents.length} eventos</p>
          </div>
          <div className="space-y-4">
            {specialEvents.map((event) => {
              const { mes, dia, year } = formatEventDate(event.fecha_inicio, event.fecha_fin)
              const bc = badgeColor(event.badge)
              return (
                <div key={event.id}
                  className="group border border-edge hover:border-edge-2 rounded-2xl overflow-hidden transition bg-card hover:bg-muted">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-edge">
                      <div>
                        <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-lg mb-6"
                          style={{ backgroundColor: bc + '18', color: bc, border: `1px solid ${bc}25` }}>
                          {event.badge}
                        </span>
                        <p className="font-black text-ink-3 tracking-widest text-sm">{mes}</p>
                        <p className="font-black text-ink leading-none tracking-tighter"
                          style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}>
                          {dia}
                        </p>
                        <p className="text-[11px] font-bold text-ink-3 mt-1">{year}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-6 md:mt-0">
                        <MapPin size={11} className="text-ink-3 flex-shrink-0" />
                        <p className="text-[11px] text-ink-3">{event.lugar}</p>
                      </div>
                    </div>
                    <div className="md:col-span-9 p-8 md:p-10 flex flex-col justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-3 mb-4">{event.categoria}</p>
                        <h3 className="font-display font-black text-ink tracking-tight transition"
                          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', lineHeight: 1 }}>
                          {event.titulo}
                        </h3>
                        <p className="text-sm text-ink-2 leading-relaxed mt-4 max-w-2xl">{event.descripcion}</p>
                      </div>
                      <Link href="/contacto"
                        className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3 hover:text-ink transition self-start">
                        Más información <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dirección */}
      <section className="bg-muted border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6 justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">{locationEyebrow}</p>
              <h2 className="font-display font-black text-ink tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
                {locationTitle.split('\n').map((line: string, i: number, arr: string[]) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
              <div className="space-y-4 mt-2">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl border border-edge flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-ink-3" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-3 mb-1">Dirección</p>
                    <p className="text-sm font-bold text-ink">{locationAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl border border-edge flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-ink-3" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-3 mb-1">Horarios</p>
                    <p className="text-sm font-bold text-ink">{locationSchedule}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl border border-edge flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-ink-3" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-3 mb-1">{pageContent.location_next_label || 'Próximo evento'}</p>
                    <p className="text-sm font-bold text-ink">{locationNextEvent}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-[#F4F4F4] border border-edge flex items-center justify-center"
              style={{ minHeight: 280 }}>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border border-[#111111]/10 flex items-center justify-center mx-auto mb-3">
                  <MapPin size={16} className="text-[#111111]/20" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#111111]/20">Mapa aquí</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #051828 0%, #093C5D 60%, #76ABAE 100%)' }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 mb-10">{evCtaEyebrow}</p>
            <h2 className="font-display font-black leading-[0.85] tracking-tighter text-white"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              {evCtaTitle.split('\n').map((line: string, i: number, arr: string[]) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
          </div>
          <div className="flex flex-col gap-4 flex-shrink-0">
            <Link href={evCta1Url}
              className="inline-flex items-center justify-between gap-3 bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition group">
              {evCta1Label} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={evCta2Url}
              className="inline-flex items-center justify-between gap-3 border border-white/25 text-white/70 hover:text-white hover:border-white/50 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition group">
              {evCta2Label} <ArrowRight size={13} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
