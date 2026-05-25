import { Clock, MapPin, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const regularServices = [
  { dia: 'Domingo', hora: '10:00 AM', tipo: 'Servicio Principal', desc: 'Adoración, Palabra y comunidad para toda la familia.' },
  { dia: 'Miércoles', hora: '7:00 PM', tipo: 'Estudio Bíblico', desc: 'Profundizando en la Palabra de Dios juntos.' },
  { dia: 'Viernes', hora: '7:00 PM', tipo: 'Noche de Oración', desc: 'Intercesión y búsqueda de la presencia de Dios.' },
]

const specialEvents = [
  {
    titulo: 'Retiro de Jóvenes',
    fecha: 'Próximo mes',
    hora: 'Por confirmar',
    lugar: 'Por confirmar',
    desc: 'Un fin de semana de encuentro, adoración y crecimiento para la juventud.',
    badge: 'Próximo',
    color: 'bg-blue-50 border-blue-100 text-blue-600',
  },
  {
    titulo: 'Conferencia de Matrimonios',
    fecha: 'Próximo mes',
    hora: 'Por confirmar',
    lugar: 'Templo principal',
    desc: 'Fortalece tu hogar con enseñanzas prácticas y bíblicas para parejas.',
    badge: 'Especial',
    color: 'bg-purple-50 border-purple-100 text-purple-600',
  },
  {
    titulo: 'Noche de Alabanza',
    fecha: 'Próximamente',
    hora: '7:00 PM',
    lugar: 'Templo principal',
    desc: 'Una noche dedicada a la adoración colectiva y la presencia de Dios.',
    badge: 'Especial',
    color: 'bg-amber-50 border-amber-100 text-amber-600',
  },
]

export default function EventosPage() {
  return (
    <div>

      {/* HERO */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-36 md:py-48">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Eventos</p>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 max-w-2xl">
            Lo que<br />se viene.
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Mantente al día con nuestras actividades, servicios y eventos especiales.
          </p>
        </div>
      </section>

      {/* SERVICIOS REGULARES */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">Cada semana</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12">Servicios regulares</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularServices.map(({ dia, hora, tipo, desc }) => (
              <div key={dia} className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-amber-200 hover:shadow-lg rounded-2xl p-8 transition duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-amber-500/10 group-hover:bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0 transition">
                    <span className="text-amber-600 font-black text-sm">{dia.slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xl">{hora}</p>
                    <p className="text-amber-600 text-sm font-semibold">{tipo}</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4">
            <MapPin size={16} className="text-slate-400 flex-shrink-0" />
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Ubicación:</span> Tu dirección aquí, Ciudad, País
            </p>
          </div>
        </div>
      </section>

      {/* EVENTOS ESPECIALES */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">Próximamente</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12">Eventos especiales</h2>

          <div className="space-y-5">
            {specialEvents.map(({ titulo, fecha, hora, lugar, desc, badge, color }) => (
              <div
                key={titulo}
                className="group bg-white border border-slate-100 hover:border-amber-200 hover:shadow-lg rounded-2xl p-7 transition duration-300 flex flex-col sm:flex-row sm:items-center gap-6"
              >
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Calendar size={24} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-xl">{titulo}</h3>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${color}`}>
                      {badge}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3">{desc}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar size={12} />{fecha}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} />{hora}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} />{lugar}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 text-white py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">¿Primera vez?</p>
          <h2 className="text-5xl font-black leading-tight mb-6">Ven y sé parte.</h2>
          <p className="text-slate-400 text-lg mb-10">Cada servicio es una nueva oportunidad de encontrarte con Dios y con tu comunidad.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full transition text-sm">
              Escríbenos <ArrowRight size={15} />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center border border-white/15 hover:border-white/30 text-white px-8 py-4 rounded-full transition text-sm font-medium">
              Comunidad en línea
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
