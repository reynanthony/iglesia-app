import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const pillars = [
  { n: '01', title: 'Visión', desc: 'Ser una iglesia que impacte nuestra ciudad y nación con el amor transformador de Jesucristo.' },
  { n: '02', title: 'Misión', desc: 'Hacer discípulos de todas las naciones, enseñando a guardar todo lo que Cristo mandó.' },
  { n: '03', title: 'Valores', desc: 'Fe, amor, integridad, servicio y comunidad son los pilares que guían todo lo que hacemos.' },
]

const beliefs = [
  { title: 'La Biblia', desc: 'Creemos que la Biblia es la Palabra inspirada de Dios, autoridad final para fe y práctica cristiana.' },
  { title: 'La salvación', desc: 'La salvación es por gracia mediante la fe en Jesucristo, no por obras humanas.' },
  { title: 'La iglesia', desc: 'La iglesia es el cuerpo de Cristo, llamada a servir, adorar y hacer discípulos en toda la tierra.' },
  { title: 'La misión', desc: 'Cada creyente es llamado a llevar el mensaje de salvación a su comunidad y al mundo.' },
]

export default function NosotrosPage() {
  return (
    <div>

      {/* HERO */}
      <section className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-0.5 h-12 bg-amber-500 flex-shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
              Quiénes somos<br />Nuestra historia
            </p>
          </div>
          <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[9rem] font-black leading-[0.88] tracking-tighter text-white mb-10 max-w-3xl">
            Nuestra<br />historia.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            Nacimos de un sueño: ver una comunidad donde el amor de Dios fluyera libremente, como agua viva que transforma vidas.
          </p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">— Nuestros inicios</p>
            </div>
            <div className="lg:col-span-8">
              <p className="text-2xl md:text-3xl font-black text-zinc-900 leading-snug tracking-tight mb-8 max-w-2xl">
                Iglesia El Manantial nació de un grupo de creyentes con el sueño de ver una comunidad donde el amor de Dios fluyera libremente.
              </p>
              <div className="space-y-5 text-sm text-zinc-500 leading-relaxed max-w-xl">
                <p>
                  A lo largo de los años hemos crecido como familia, viendo milagros, restauraciones y cientos de vidas transformadas por el poder del evangelio.
                </p>
                <p>
                  Hoy somos una iglesia vibrante, con ministerios para todas las edades y un corazón apasionado por servir a nuestra comunidad. Cada domingo celebramos juntos la bondad de Dios y nos comprometemos a seguir siendo una comunidad de gracia y verdad.
                </p>
                <p>
                  Creemos que la iglesia no es un edificio sino una familia, y cada persona que entra a El Manantial encuentra un hogar espiritual donde puede crecer, servir y ser amado tal como es.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISIÓN, MISIÓN, VALORES */}
      <section className="bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-12 border-b border-zinc-200 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">— Lo que nos mueve</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 border border-zinc-200">
            {pillars.map(({ n, title, desc }) => (
              <div key={n} className="p-8 md:p-10">
                <span className="text-[10px] font-bold text-zinc-300 tracking-widest block mb-8">{n}</span>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-4">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LO QUE CREEMOS */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-12 border-b border-zinc-200 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">— Fundamentos de fe</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-100">
            {beliefs.map(({ title, desc }) => (
              <div key={title} className="bg-white p-8 hover:bg-zinc-50 transition">
                <h3 className="text-base font-black text-zinc-900 mb-3">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900/50 mb-8">— Únete a nosotros</p>
            <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tighter text-black">
              Eres parte<br />de esta<br />historia.
            </h2>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link href="/contacto" className="inline-flex items-center gap-3 bg-black hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition">
              Visítanos <ArrowRight size={13} />
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
