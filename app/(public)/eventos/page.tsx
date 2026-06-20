import { ArrowRight, MapPin, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { cmsGet, cmsSingleton, cmsImageUrl, type DEventosPage } from '@/lib/directus'
import { createClient } from '@/lib/supabase/server'
import { EventRsvpButton } from '@/components/public/EventRsvpButton'
import { HeroVideo } from '@/components/public/HeroVideo'

export const dynamic = 'force-dynamic'

type DirectusEvento = {
  id: string
  titulo: string
  descripcion?: string
  fecha_inicio: string
  fecha_fin?: string | null
  lugar?: string
  categoria?: string
  badge?: string
  imagen?: string
  visible?: boolean
}

const defaultRegularServices = [
  { day: 'Dom', fullDay: 'Domingo',   time: '10:00', label: 'AM', type: 'Servicio Principal', desc: 'Adoración, Palabra y comunidad para toda la familia.' },
  { day: 'Mié', fullDay: 'Miércoles', time: '7:00',  label: 'PM', type: 'Estudio Bíblico',   desc: 'Profundizando en la Palabra de Dios juntos.' },
  { day: 'Vie', fullDay: 'Viernes',   time: '7:00',  label: 'PM', type: 'Noche de Oración',  desc: 'Intercesión y búsqueda de la presencia de Dios.' },
]

const fallbackEvents: DirectusEvento[] = [
  { id: '1', titulo: 'Retiro de Jóvenes', fecha_inicio: '2026-06-20', fecha_fin: '2026-06-22', lugar: 'Por confirmar', badge: 'Próximo', categoria: 'Jóvenes', descripcion: 'Un fin de semana de encuentro, adoración y crecimiento para la juventud.' },
  { id: '2', titulo: 'Conferencia de Matrimonios', fecha_inicio: '2026-07-11', fecha_fin: '2026-07-12', lugar: 'Templo principal', badge: 'Especial', categoria: 'Matrimonios', descripcion: 'Fortalece tu hogar con enseñanzas prácticas y bíblicas para parejas.' },
  { id: '3', titulo: 'Noche de Alabanza', fecha_inicio: '2026-08-01', fecha_fin: null, lugar: 'Templo principal', badge: 'Por confirmar', categoria: 'Adoración', descripcion: 'Una noche dedicada a la adoración colectiva y la presencia de Dios.' },
]

const BADGE_LABEL: Record<string, string> = {
  proximo: 'Próximo', especial: 'Especial', hoy: 'Hoy', por_confirmar: 'Por confirmar',
  'Próximo': 'Próximo', 'Especial': 'Especial', 'Hoy': 'Hoy', 'Por confirmar': 'Por confirmar',
}
function badgeLabel(badge?: string) {
  return BADGE_LABEL[badge ?? ''] ?? badge ?? 'Próximo'
}
function badgeColor(badge?: string) {
  const b = (badge ?? '').toLowerCase()
  if (b === 'especial') return '#093C5D'
  if (b === 'por_confirmar' || b === 'por confirmar') return '#869B7E'
  if (b === 'hoy') return '#76ABAE'
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
  const [cmsEventos, supabase, cms] = await Promise.all([
    cmsGet<DirectusEvento>('eventos', { sort: 'fecha_inicio' }),
    createClient(),
    cmsSingleton<DEventosPage>('eventos_page'),
  ])
  const c = cms ?? {} as DEventosPage

  const heroEyebrow        = c.hero_eyebrow  ?? 'Eventos · Agenda 2026'
  const heroTitle          = c.hero_title    ?? 'Lo que\nse viene.'
  const heroSubtitle       = c.hero_subtitle ?? 'Mantente al día con nuestras actividades, servicios y eventos especiales.'
  const heroImageUrl       = c.hero_image_url || cmsImageUrl(c.hero_image)
  const heroVideoUrl       = c.hero_video_url || cmsImageUrl(c.hero_video) || null
  const heroOverlayOpacity = c.hero_overlay_opacity ?? 0.60
  const heroShowGrid       = c.hero_show_grid !== false
  const heroBg             = c.hero_bg_color ?? '#051828'
  const heroWatermark      = c.hero_watermark ?? '2026'

  const specialEvents: DirectusEvento[] = cmsEventos.length > 0 ? cmsEventos : fallbackEvents

  // RSVP data
  const { data: { user } } = await supabase.auth.getUser()
  const eventIds = specialEvents.map(e => e.id.toString())
  const rsvpResult = await supabase
    .from('event_rsvps')
    .select('directus_event_id, user_id')
    .in('directus_event_id', eventIds)
  const rsvpRows = rsvpResult.data as { directus_event_id: string; user_id: string }[] | null

  const rsvpCounts: Record<string, number> = {}
  const userRsvps = new Set<string>()
  for (const r of rsvpRows ?? []) {
    rsvpCounts[r.directus_event_id] = (rsvpCounts[r.directus_event_id] ?? 0) + 1
    if (r.user_id === user?.id) userRsvps.add(r.directus_event_id)
  }

  return (
    <div>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[80svh] md:min-h-[80vh] flex flex-col justify-center" style={{ background: heroBg }}>
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
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 90px)' }} />
        )}
        {heroWatermark && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-end overflow-hidden select-none">
            <span className="font-black leading-none tracking-tighter block"
              style={{ fontSize: 'clamp(16rem, 35vw, 32rem)', opacity: 0.06, color: '#76ABAE', paddingRight: '1rem' }}>
              {heroWatermark}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 70% at 90% 40%, rgba(118,171,174,0.10), transparent 65%)' }} />
        <div className="relative max-w-6xl mx-auto w-full px-6 py-12 sm:py-16 md:py-32">
          <div className="flex items-center gap-5 mb-10 sm:mb-14">
            <div className="w-12 h-px" style={{ background: '#76ABAE' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: 'rgba(118,171,174,0.7)' }}>
              {heroEyebrow}
            </p>
          </div>
          <h1 className="font-display font-black tracking-tighter text-white mb-8 leading-[0.9] md:leading-[0.85]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
            {heroTitle.includes('*')
              ? <>{heroTitle.split('*')[0]}<em style={{ color: '#76ABAE' }}>{heroTitle.split('*')[1]}</em></>
              : heroTitle.split('\n').map((line, i) => <span key={i}>{line}{i < heroTitle.split('\n').length - 1 && <br />}</span>)}
          </h1>
          <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(246,243,235,0.82)' }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Horarios regulares */}
      <section className="border-t border-edge bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-edge">
            {defaultRegularServices.map(({ day, time, label, type, desc, fullDay }) => (
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
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 md:py-32">
          <div className="flex items-end justify-between mb-14 border-b border-edge pb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">— Próximamente</p>
            <p className="text-[11px] font-bold text-ink-3">{specialEvents.length} eventos</p>
          </div>
          <div className="space-y-4">
            {specialEvents.map((event) => {
              const { mes, dia, year } = formatEventDate(event.fecha_inicio, event.fecha_fin)
              const bc = badgeColor(event.badge)
              const imgUrl = cmsImageUrl(event.imagen)
              return (
                <div key={event.id}
                  className="group border border-edge hover:border-edge-2 rounded-2xl overflow-hidden transition bg-card hover:bg-muted">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    {/* Panel izquierdo — fecha */}
                    <div className="md:col-span-3 p-5 sm:p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-edge">
                      <div>
                        <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-lg mb-6"
                          style={{ backgroundColor: bc + '18', color: bc, border: `1px solid ${bc}25` }}>
                          {badgeLabel(event.badge)}
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

                    {/* Panel derecho — contenido con imagen de fondo */}
                    <div className="md:col-span-9 relative flex flex-col justify-between gap-6 overflow-hidden"
                      style={{ minHeight: 220 }}>
                      {imgUrl && (
                        <>
                          <img src={imgUrl} alt={event.titulo}
                            className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(135deg, rgba(9,60,93,0.82) 0%, rgba(9,60,93,0.60) 60%, rgba(118,171,174,0.40) 100%)' }} />
                        </>
                      )}
                      <div className="relative p-5 sm:p-8 md:p-10 flex flex-col justify-between h-full gap-6">
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-4 ${imgUrl ? 'text-white/60' : 'text-ink-3'}`}>
                            {event.categoria}
                          </p>
                          <h3 className="font-display font-black tracking-tight transition"
                            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', lineHeight: 1, color: imgUrl ? 'white' : undefined }}>
                            {event.titulo}
                          </h3>
                          <p className={`text-sm leading-relaxed mt-4 max-w-2xl ${imgUrl ? 'text-white/70' : 'text-ink-2'}`}>
                            {event.descripcion}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <EventRsvpButton
                            eventId={event.id.toString()}
                            initialCount={rsvpCounts[event.id.toString()] ?? 0}
                            initialRsvped={userRsvps.has(event.id.toString())}
                            isAuthenticated={!!user}
                          />
                          <Link href="/contacto"
                            className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition ${imgUrl ? 'text-white/50 hover:text-white' : 'text-ink-3 hover:text-ink'}`}>
                            Info <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
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
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6 justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">— Cómo llegar</p>
              <h2 className="font-display font-black text-ink tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
                Encuéntranos<br />aquí.
              </h2>
              <div className="space-y-4 mt-2">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl border border-edge flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-ink-3" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-3 mb-1">Dirección</p>
                    <p className="text-sm font-bold text-ink">Tu dirección aquí, Ciudad, País</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl border border-edge flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-ink-3" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-3 mb-1">Horarios</p>
                    <p className="text-sm font-bold text-ink">Dom 10AM · Mié 7PM · Vie 7PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl border border-edge flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-ink-3" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-3 mb-1">Próximo evento</p>
                    <p className="text-sm font-bold text-ink">
                      {specialEvents[0]?.titulo ?? 'Ver agenda arriba'}
                    </p>
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
        <div className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-10 sm:gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 mb-10">— ¿Primera vez?</p>
            <h2 className="font-display font-black leading-[0.85] tracking-tighter text-white"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              Ven y<br />sé parte.
            </h2>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto md:flex-shrink-0">
            <Link href="/contacto"
              className="flex items-center justify-between gap-3 bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-8 py-5 sm:py-4 rounded-xl transition group">
              Escríbenos <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login"
              className="flex items-center justify-between gap-3 border border-white/25 text-white/70 hover:text-white hover:border-white/50 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-5 sm:py-4 rounded-xl transition group">
              Comunidad en línea <ArrowRight size={13} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
