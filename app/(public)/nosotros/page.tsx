import { Eye, Target, Heart, Users, BookOpen, Globe } from 'lucide-react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const pillars = [
  { icon: Eye, title: 'Visión', desc: 'Ser una iglesia que impacte nuestra ciudad y nación con el amor transformador de Jesucristo.', color: 'text-blue-500 bg-blue-50 border-blue-100' },
  { icon: Target, title: 'Misión', desc: 'Hacer discípulos de todas las naciones, enseñando a guardar todo lo que Cristo mandó.', color: 'text-amber-500 bg-amber-50 border-amber-100' },
  { icon: Heart, title: 'Valores', desc: 'Fe, amor, integridad, servicio y comunidad son los pilares que guían todo lo que hacemos.', color: 'text-rose-500 bg-rose-50 border-rose-100' },
]

const beliefs = [
  { icon: BookOpen, title: 'La Biblia', desc: 'Creemos que la Biblia es la Palabra inspirada de Dios, autoridad final para fe y práctica.' },
  { icon: Users, title: 'La iglesia', desc: 'La iglesia es el cuerpo de Cristo, llamada a servir, adorar y hacer discípulos.' },
  { icon: Globe, title: 'La misión', desc: 'Cada creyente es llamado a llevar el mensaje de salvación a su comunidad y al mundo.' },
]

export default function NosotrosPage() {
  return (
    <div>

      {/* HERO */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-36 md:py-48">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Quiénes somos</p>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 max-w-2xl">
            Nuestra<br />historia.
          </h1>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
            Nacimos de un sueño: ver una comunidad donde el amor de Dios fluyera libremente, como agua viva que transforma vidas.
          </p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Nuestros inicios</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-8">
            Iglesia El Manantial nació de un grupo de creyentes con el sueño de ver una comunidad donde el amor de Dios fluyera libremente.
          </p>
          <div className="space-y-5 text-slate-600 leading-relaxed text-base">
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
      </section>

      {/* VISIÓN, MISIÓN, VALORES */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">Lo que nos mueve</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Visión, misión y valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className={`bg-white border rounded-2xl p-8 ${color.split(' ')[2]}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LO QUE CREEMOS */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">Fundamentos</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Lo que creemos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beliefs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-md transition duration-300">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Icon size={22} className="text-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 text-white py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Únete a nosotros</p>
          <h2 className="text-5xl font-black leading-tight mb-6">Eres parte de esta historia.</h2>
          <p className="text-slate-400 text-lg mb-10">Visítanos este domingo y experimenta una comunidad que te espera.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full transition text-sm">
              Visítanos <ArrowRight size={15} />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center border border-white/15 hover:border-white/30 text-white px-8 py-4 rounded-full transition text-sm font-medium">
              Unirte a la comunidad
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
