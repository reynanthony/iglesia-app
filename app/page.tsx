import Link from 'next/link'
import { ArrowRight, Play, Users, Heart, BookOpen, Music, Mic, Globe } from 'lucide-react'

const services = [
  { day: 'Domingo', time: '10:00 AM', type: 'Servicio Principal', note: 'Familias y adultos' },
  { day: 'Miércoles', time: '7:00 PM', type: 'Estudio Bíblico', note: 'Crecimiento en la Palabra' },
  { day: 'Viernes', time: '7:00 PM', type: 'Noche de Oración', note: 'Intercesión comunitaria' },
]

const values = [
  { icon: Users, label: 'Comunidad', desc: 'Familia que crece junta en fe' },
  { icon: Heart, label: 'Amor', desc: 'El amor de Cristo como centro' },
  { icon: BookOpen, label: 'Palabra', desc: 'Fundados en la Biblia' },
  { icon: Music, label: 'Adoración', desc: 'Glorificando a Dios juntos' },
  { icon: Mic, label: 'Oración', desc: 'Comunión constante con Dios' },
  { icon: Globe, label: 'Misión', desc: 'Impactando nuestra ciudad' },
]

const ministeriosPrev = [
  { nombre: 'Jóvenes', desc: 'Fe y comunidad para la próxima generación.', color: '#3b82f6' },
  { nombre: 'Niños', desc: 'La Palabra de Dios de forma creativa y divertida.', color: '#22c55e' },
  { nombre: 'Matrimonios', desc: 'Hogares fuertes con principios bíblicos.', color: '#a855f7' },
  { nombre: 'Adoración', desc: 'Sirviendo con excelencia en cada servicio.', color: '#f59e0b' },
]

export default function HomePage() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-slate-900/60 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-36 md:py-52">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">
            Iglesia El Manantial
          </p>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 max-w-3xl">
            Donde<br />
            <span className="text-amber-400">fluye</span><br />
            la vida.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-md leading-relaxed mb-12">
            Una comunidad de fe viva donde encontrarás amor, propósito y una familia que te recibe como eres.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/nosotros"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full transition text-sm"
            >
              Conócenos <ArrowRight size={16} />
            </Link>
            <Link
              href="/predicas"
              className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-white hover:bg-white/5 px-8 py-4 rounded-full transition text-sm font-medium"
            >
              <Play size={15} /> Ver última prédica
            </Link>
          </div>
        </div>
      </section>

      {/* ── HORARIOS ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-8 text-center">
            Horarios de servicios
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map(({ day, time, type, note }) => (
              <div key={day} className="group flex items-start gap-5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-amber-200 hover:shadow-md rounded-2xl px-6 py-5 transition duration-300">
                <div className="w-12 h-12 bg-amber-500/10 group-hover:bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0 transition">
                  <span className="text-amber-500 font-black text-xs text-center leading-tight">
                    {day.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">{time}</p>
                  <p className="text-slate-700 text-sm font-medium">{type}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ────────────────────────────────────── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">Quiénes somos</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Una familia unida por la fe
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-base">
                Iglesia El Manantial es una comunidad cristiana comprometida con la Palabra de Dios y el servicio a nuestra comunidad. Creemos en la transformación de vidas a través del amor de Cristo.
              </p>
              <p className="text-slate-600 leading-relaxed mb-10 text-base">
                Somos una iglesia vibrante con ministerios para todas las edades y un corazón apasionado por servir.
              </p>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-amber-600 transition text-sm group"
              >
                Conoce nuestra historia
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {values.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition duration-300">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={18} className="text-amber-500" />
                  </div>
                  <p className="font-bold text-sm text-slate-900">{label}</p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ÚLTIMA PRÉDICA ───────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-3">Mensajes</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Crece en la Palabra
              </h2>
            </div>
            <Link
              href="/predicas"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition group"
            >
              Ver todos <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { titulo: 'El poder de la oración', serie: 'Vida de oración', pastor: 'Pastor Principal' },
              { titulo: 'Fe que mueve montañas', serie: 'Fe viva', pastor: 'Pastor Principal' },
              { titulo: 'Identidad en Cristo', serie: 'Quiénes somos', pastor: 'Pastor Principal' },
            ].map(({ titulo, serie, pastor }, i) => (
              <div key={titulo} className="group cursor-pointer">
                <div className="relative bg-slate-900 rounded-2xl overflow-hidden mb-4 aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="w-14 h-14 bg-white/10 group-hover:bg-amber-500/80 border border-white/20 rounded-full flex items-center justify-center transition duration-300 relative z-10">
                    <Play size={20} className="text-white ml-1" />
                  </div>
                  {i === 0 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
                      Reciente
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-amber-400 z-10">{serie}</span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition mb-1">{titulo}</h3>
                <p className="text-slate-500 text-sm">{pastor}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link href="/predicas" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-400 text-slate-700 font-semibold px-6 py-3 rounded-full text-sm transition">
              Ver todas las prédicas <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MINISTERIOS ──────────────────────────────────────── */}
      <section className="bg-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-3">Ministerios</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Un lugar<br />para todos
              </h2>
            </div>
            <Link
              href="/ministerios"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition group"
            >
              Ver todos <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ministeriosPrev.map(({ nombre, desc, color }) => (
              <Link
                key={nombre}
                href="/ministerios"
                className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition duration-300"
              >
                <div
                  className="w-10 h-10 rounded-xl mb-5"
                  style={{ backgroundColor: color + '25' }}
                >
                  <div className="w-full h-full rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-amber-400 transition">{nombre}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link href="/ministerios" className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-400 font-semibold px-6 py-3 rounded-full text-sm transition">
              Ver todos los ministerios <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="bg-white py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">Eres bienvenido</p>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
            Tu historia<br />comienza aquí.
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-md mx-auto">
            No importa dónde estés en tu caminar espiritual, hay un lugar para ti en El Manantial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full transition text-sm"
            >
              Visítanos este domingo
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center border border-slate-200 hover:border-slate-400 text-slate-700 font-bold px-8 py-4 rounded-full transition text-sm"
            >
              Unirte a la comunidad
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
