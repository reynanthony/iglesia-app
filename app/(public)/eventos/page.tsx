import { ArrowRight, MapPin, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const regularServices = [
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
  if (badge === 'Especial') return '#444444'
  if (badge === 'Por confirmar') return '#A8A8A8'
  if (badge === 'Hoy') return '#000000'
  return '#000000'
}

function formatEventDate(fechaInicio: string, fechaFin?: string | null) {
  const d1 = new Date(fechaInicio + 'T00:00:00')
  const mes = d1.toLocaleDateString('es-DO', { month: 'short' }).toUpperCase().replace('.', '')
  const dia = fechaFin
    ? `${d1.getUTCDate()}–${new Date(fechaFin + 'T00:00:00').getUTCDate()}`
    : d1.getUTCDate().toString() === '1' ? '—' : d1.getUTCDate().toString()
  const year = d1.getUTCFullYear().toString()
  return { mes, dia, year }
}

export default async function EventosPage() {
  const supabase = await createClient()
  const { data: dbEvents } = await supabase
    .from('events')
    .select('*')
    .eq('visible', true)
    .order('fecha_inicio', { ascending: true })

  const specialEvents: any[] = dbEvents && dbEvents.length > 0 ? dbEvents : fallbackEvents
  return (
    <div>

      {/* ═══════════════════════════════════════
          HERO — calendario tipo agenda editorial
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EBEBEB 0%, #F4F4F4 50%, #FFFFFF 100%)' }}>

        {/* Número mes decorativo */}
        <div className="pointer-events-none absolute right-0 top-0 overflow-hidden select-none flex items-start">
          <span className="font-black text-[#111111] tracking-tighter"
            style={{ fontSize: 'clamp(16rem, 35vw, 32rem)', opacity: 0.04, lineHeight: 0.85 }}>
            2026
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 65% at 15% 70%, rgba(0,0,0,0.06), transparent 65%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-0 md:pt-48">
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px bg-[#000000]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#111111]/40">
              Eventos · Agenda 2026
            </p>
          </div>
          <h1 className="font-display font-black tracking-tighter text-[#111111] mb-8"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
            Lo que<br />se viene.
          </h1>
          <p className="text-base text-[#111111]/45 leading-relaxed max-w-md mb-0 pb-16 md:pb-24">
            Mantente al día con nuestras actividades, servicios y eventos especiales.
          </p>
        </div>

        {/* Servicios regulares como tira de horarios */}
        <div className="relative border-t border-[#111111]/[0.08]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#111111]/[0.08]">
              {regularServices.map(({ day, time, label, type, fullDay }) => (
                <div key={day} className="px-0 sm:px-8 first:sm:pl-0 py-8 flex items-center gap-6">
                  <div className="w-14 h-14 flex-shrink-0 flex flex-col items-center justify-center border border-[#111111]/10 rounded-xl">
                    <span className="text-[9px] font-bold text-[#000000]/70 uppercase tracking-widest">{day}</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-black text-[#111111] text-lg leading-none">{time}</span>
                      <span className="text-[9px] font-bold text-[#111111]/55">{label}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-[#111111] text-sm leading-tight">{type}</p>
                    <p className="text-[11px] text-[#111111]/45 mt-0.5">{fullDay}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          EVENTOS ESPECIALES — cards de fecha grande
      ═══════════════════════════════════════ */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">

          <div className="flex items-end justify-between mb-14 border-b border-edge pb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">— Próximamente</p>
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

                    {/* Fecha grande */}
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

                    {/* Contenido */}
                    <div className="md:col-span-9 p-8 md:p-10 flex flex-col justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-3 mb-4">{event.categoria}</p>
                        <h3 className="font-display font-black text-ink tracking-tight group-hover:text-[#222222] transition"
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

      {/* ═══════════════════════════════════════
          DIRECCIÓN + MAPA PLACEHOLDER
      ═══════════════════════════════════════ */}
      <section className="bg-muted border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
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
                    <p className="text-sm font-bold text-ink">Retiro de Jóvenes · Jun 2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa placeholder */}
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

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #222222 100%)' }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 mb-10">— ¿Primera vez?</p>
            <h2 className="font-display font-black leading-[0.85] tracking-tighter text-white"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              Ven y<br /><em>sé parte.</em>
            </h2>
          </div>
          <div className="flex flex-col gap-4 flex-shrink-0">
            <Link href="/contacto"
              className="inline-flex items-center justify-between gap-3 bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition group">
              Escríbenos <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center justify-between gap-3 border border-white/25 text-white/70 hover:text-white hover:border-white/50 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition group">
              Comunidad en línea <ArrowRight size={13} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
