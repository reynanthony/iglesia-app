import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

const services = [
  { n: '01', day: 'Domingo', time: '10:00 AM', type: 'Servicio Principal' },
  { n: '02', day: 'Miércoles', time: '7:00 PM', type: 'Estudio Bíblico' },
  { n: '03', day: 'Viernes', time: '7:00 PM', type: 'Noche de Oración' },
]

const values = [
  { label: 'Comunidad', desc: 'Familia que crece unida en fe y amor.' },
  { label: 'Palabra', desc: 'Fundados en la autoridad de la Biblia.' },
  { label: 'Oración', desc: 'Comunión constante con Dios.' },
  { label: 'Misión', desc: 'Impactando nuestra ciudad para Cristo.' },
]

const ministeriosPrev = [
  { n: '01', nombre: 'Jóvenes', desc: 'Fe y comunidad para la próxima generación.' },
  { n: '02', nombre: 'Niños', desc: 'La Palabra de Dios de forma creativa.' },
  { n: '03', nombre: 'Matrimonios', desc: 'Hogares fuertes con principios bíblicos.' },
  { n: '04', nombre: 'Adoración', desc: 'Sirviendo con excelencia en cada servicio.' },
]

const predicas = [
  { titulo: 'El poder de la oración', serie: 'Vida de oración', pastor: 'Pastor Principal', fecha: 'May 18' },
  { titulo: 'Fe que mueve montañas', serie: 'Fe viva', pastor: 'Pastor Principal', fecha: 'May 11' },
  { titulo: 'Identidad en Cristo', serie: 'Quiénes somos', pastor: 'Pastor Principal', fecha: 'May 4' },
]

export default function HomePage() {
  return (
    <div>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-0.5 h-12 bg-amber-500 flex-shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 leading-relaxed">
              Iglesia El Manantial<br />Comunidad de fe
            </p>
          </div>

          <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[9rem] font-black leading-[0.88] tracking-tighter text-zinc-900 mb-14 max-w-5xl">
            Donde<br />fluye<br /><span className="text-amber-500">la vida.</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-12">
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Una comunidad de fe viva donde encontrarás amor, propósito y una familia que te recibe como eres.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link href="/nosotros" className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 transition">
                Conócenos <ArrowRight size={13} />
              </Link>
              <Link href="/predicas" className="inline-flex items-center gap-3 border border-zinc-200 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 transition">
                <Play size={12} /> Ver prédica
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HORARIOS ─────────────────────────────────────────── */}
      <section className="bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Servicios semanales</p>
            <Link href="/eventos" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition flex items-center gap-2">
              Todos los eventos <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            {services.map(({ n, day, time, type }) => (
              <div key={n} className="py-6 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
                <span className="text-[10px] font-bold text-zinc-300 tracking-widest block mb-4">{n}</span>
                <p className="text-3xl font-black text-zinc-900 leading-none tracking-tight mb-1">{time}</p>
                <p className="text-xs font-bold text-zinc-900 mb-1">{type}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{day}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ────────────────────────────────────── */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">— Quiénes somos</p>
              <h2 className="text-5xl md:text-6xl font-black leading-[0.9] tracking-tighter text-zinc-900 mb-8 max-w-lg">
                Una familia<br />unida por<br />la fe.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mb-10">
                Iglesia El Manantial es una comunidad cristiana comprometida con la Palabra de Dios y el servicio a nuestra comunidad. Creemos en la transformación de vidas a través del amor de Cristo.
              </p>
              <Link href="/nosotros" className="inline-flex items-center gap-3 border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 transition">
                Nuestra historia <ArrowRight size={13} />
              </Link>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 border border-zinc-100">
                {values.map(({ label, desc }) => (
                  <div key={label} className="p-6">
                    <p className="text-xs font-black text-zinc-900 mb-2">{label}</p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRÉDICAS ─────────────────────────────────────────── */}
      <section className="bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-12 border-b border-zinc-200 pb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">— Mensajes</p>
              <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tighter text-zinc-900">
                Crece en<br />la Palabra.
              </h2>
            </div>
            <Link href="/predicas" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {predicas.map(({ titulo, serie, pastor, fecha }, i) => (
              <div key={titulo} className="group cursor-pointer">
                <div className="relative bg-zinc-900 mb-5 overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {i === 0 && (
                    <div className="absolute top-0 left-0 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
                      Reciente
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 border border-white/30 group-hover:bg-amber-500 group-hover:border-amber-500 flex items-center justify-center transition duration-200">
                      <Play size={14} className="text-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">{serie}</span>
                </div>
                <h3 className="font-black text-zinc-900 group-hover:text-amber-600 transition text-base leading-tight mb-2">{titulo}</h3>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider">{pastor} · {fecha}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MINISTERIOS ──────────────────────────────────────── */}
      <section className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-12 border-b border-zinc-800 pb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-3">— Ministerios</p>
              <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white">
                Un lugar<br />para todos.
              </h2>
            </div>
            <Link href="/ministerios" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800 border border-zinc-800">
            {ministeriosPrev.map(({ n, nombre, desc }) => (
              <Link
                key={n}
                href="/ministerios"
                className="group p-8 hover:bg-zinc-900 transition"
              >
                <span className="text-[10px] font-bold text-zinc-700 tracking-widest block mb-5">{n}</span>
                <h3 className="font-black text-white text-lg leading-tight mb-3 group-hover:text-amber-400 transition">{nombre}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-amber-500">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900/50 mb-8">— Eres bienvenido</p>
            <h2 className="text-5xl md:text-7xl font-black leading-[0.88] tracking-tighter text-black">
              Tu historia<br />comienza<br />aquí.
            </h2>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link href="/contacto" className="inline-flex items-center gap-3 bg-black hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition">
              Visítanos este domingo <ArrowRight size={13} />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-3 border border-black text-black hover:bg-black hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition">
              Unirte a la comunidad
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
