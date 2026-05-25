import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const regularServices = [
  { n: '01', day: 'Domingo', time: '10:00 AM', type: 'Servicio Principal', desc: 'Adoración, Palabra y comunidad para toda la familia.' },
  { n: '02', day: 'Miércoles', time: '7:00 PM', type: 'Estudio Bíblico', desc: 'Profundizando en la Palabra de Dios juntos.' },
  { n: '03', day: 'Viernes', time: '7:00 PM', type: 'Noche de Oración', desc: 'Intercesión y búsqueda de la presencia de Dios.' },
]

const specialEvents = [
  {
    titulo: 'Retiro de Jóvenes',
    fecha: 'Junio 2025',
    lugar: 'Por confirmar',
    badge: 'Próximo',
    desc: 'Un fin de semana de encuentro, adoración y crecimiento para la juventud.',
  },
  {
    titulo: 'Conferencia de Matrimonios',
    fecha: 'Julio 2025',
    lugar: 'Templo principal',
    badge: 'Especial',
    desc: 'Fortalece tu hogar con enseñanzas prácticas y bíblicas para parejas.',
  },
  {
    titulo: 'Noche de Alabanza',
    fecha: 'Por confirmar',
    lugar: 'Templo principal',
    badge: 'Especial',
    desc: 'Una noche dedicada a la adoración colectiva y la presencia de Dios.',
  },
]

export default function EventosPage() {
  return (
    <div>

      {/* HERO */}
      <section className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-0.5 h-12 bg-amber-500 flex-shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
              Eventos<br />Agenda
            </p>
          </div>
          <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[9rem] font-black leading-[0.88] tracking-tighter text-white mb-10 max-w-3xl">
            Lo que<br />se viene.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            Mantente al día con nuestras actividades, servicios y eventos especiales.
          </p>
        </div>
      </section>

      {/* SERVICIOS REGULARES */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-center justify-between mb-12 border-b border-zinc-100 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">— Cada semana</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100 border border-zinc-100">
            {regularServices.map(({ n, day, time, type, desc }) => (
              <div key={n} className="p-8 md:p-10 hover:bg-zinc-50 transition">
                <span className="text-[10px] font-bold text-zinc-300 tracking-widest block mb-6">{n}</span>
                <p className="text-3xl font-black text-zinc-900 leading-none tracking-tight mb-1">{time}</p>
                <p className="text-sm font-black text-zinc-900 mb-1">{type}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 mb-5">{day}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border border-zinc-100 px-6 py-4 flex items-center gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Ubicación</p>
            <div className="w-px h-4 bg-zinc-200" />
            <p className="text-xs text-zinc-600">Tu dirección aquí, Ciudad, País</p>
          </div>
        </div>
      </section>

      {/* EVENTOS ESPECIALES */}
      <section className="bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-center justify-between mb-12 border-b border-zinc-200 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">— Próximamente</p>
          </div>
          <div className="space-y-px bg-zinc-200">
            {specialEvents.map(({ titulo, fecha, lugar, badge, desc }) => (
              <div
                key={titulo}
                className="bg-white hover:bg-zinc-50 transition p-8 md:p-10 flex flex-col sm:flex-row sm:items-start gap-8"
              >
                <div className="sm:w-48 flex-shrink-0">
                  <span className="inline-block border border-zinc-200 text-[9px] font-black uppercase tracking-widest text-zinc-500 px-2.5 py-1 mb-3">{badge}</span>
                  <p className="text-xs text-zinc-400">{fecha}</p>
                  <p className="text-xs text-zinc-400">{lugar}</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-3">{titulo}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900/50 mb-8">— ¿Primera vez?</p>
            <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tighter text-black">
              Ven y<br />sé parte.
            </h2>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link href="/contacto" className="inline-flex items-center gap-3 bg-black hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition">
              Escríbenos <ArrowRight size={13} />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-3 border border-black text-black hover:bg-black hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition">
              Comunidad en línea
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
