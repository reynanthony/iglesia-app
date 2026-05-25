import Link from 'next/link'
import { ArrowRight, Clock, MapPin, Users, Heart, BookOpen, Music } from 'lucide-react'

export default function HomePage() {
  return (
    <div>

      {/* Hero */}
      <section className="bg-slate-950 text-white py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="max-w-3xl">
            <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              Bienvenido a El Manantial
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Donde fluye<br />
              <span className="text-amber-400">la vida</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Una comunidad de fe viva, donde encontraras amor, proposito y una familia que te recibe como eres.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/nosotros"
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-2xl transition text-sm"
              >
                Conocenos <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-500/50 text-white px-8 py-4 rounded-2xl transition text-sm"
              >
                Unirte a la comunidad
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Horarios */}
      <section className="py-16 bg-amber-500">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { dia: 'Domingo', hora: '10:00 AM', tipo: 'Servicio Principal' },
              { dia: 'Miercoles', hora: '7:00 PM', tipo: 'Estudio Biblico' },
              { dia: 'Viernes', hora: '7:00 PM', tipo: 'Noche de Oracion' },
            ].map(({ dia, hora, tipo }) => (
              <div key={dia} className="flex items-center gap-4 bg-amber-400/50 rounded-2xl px-6 py-4">
                <Clock size={24} className="text-slate-950 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-950">{dia} — {hora}</p>
                  <p className="text-slate-800 text-sm">{tipo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-amber-500 text-sm font-semibold uppercase tracking-wide">Quienes somos</span>
            <h2 className="text-4xl font-bold mt-2 mb-6 text-slate-900">Una familia unida por la fe</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Iglesia El Manantial es una comunidad cristiana comprometida con la Palabra de Dios y el servicio a nuestra comunidad. Creemos en la transformacion de vidas a traves del amor de Cristo.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Desde nuestros inicios hemos crecido como familia, apoyando a cada miembro en su caminar de fe y extendiendo la mano a quienes necesitan esperanza.
            </p>
            <Link href="/nosotros" className="inline-flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-600 transition">
              Conoce nuestra historia <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: 'Comunidad', desc: 'Familia que crece junta' },
              { icon: Heart, label: 'Amor', desc: 'El amor de Dios en accion' },
              { icon: BookOpen, label: 'Palabra', desc: 'Fundados en la Biblia' },
              { icon: Music, label: 'Adoracion', desc: 'Glorificando a Dios' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={18} className="text-amber-500" />
                </div>
                <p className="font-semibold text-sm text-slate-900">{label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministerios preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-500 text-sm font-semibold uppercase tracking-wide">Nuestros ministerios</span>
            <h2 className="text-4xl font-bold mt-2 text-slate-900">Un lugar para todos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { nombre: 'Jovenes', desc: 'Espacio para que los jovenes crezcan en fe y comunidad.', color: 'bg-blue-500' },
              { nombre: 'Ninos', desc: 'Ensenanza biblica adaptada para los mas pequenos.', color: 'bg-green-500' },
              { nombre: 'Matrimonios', desc: 'Fortaleciendo los hogares con principios biblicos.', color: 'bg-purple-500' },
              { nombre: 'Adoracion', desc: 'Sirviendo a Dios y a la congregacion con musica.', color: 'bg-amber-500' },
              { nombre: 'Oracion', desc: 'Intercesion y busqueda de la presencia de Dios.', color: 'bg-red-500' },
              { nombre: 'Evangelismo', desc: 'Llevando el mensaje de Cristo a nuestra ciudad.', color: 'bg-teal-500' },
            ].map(({ nombre, desc, color }) => (
              <div key={nombre} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition">
                <div className={`w-10 h-10 ${color} rounded-xl mb-4`} />
                <p className="font-bold text-slate-900 mb-2">{nombre}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/ministerios" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
              Ver todos los ministerios <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Eres bienvenido aqui</h2>
          <p className="text-slate-400 text-lg mb-10">
            No importa donde estes en tu caminar espiritual, hay un lugar para ti en El Manantial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-2xl transition text-sm">
              Visitanos este domingo
            </Link>
            <Link href="/login" className="border border-slate-700 hover:border-slate-500 text-white px-8 py-4 rounded-2xl transition text-sm">
              Unirte a la comunidad
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}