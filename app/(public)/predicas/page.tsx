import { Play, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const predicas = [
  { titulo: 'El poder de la oración', pastor: 'Pastor Principal', fecha: 'Mayo 18, 2025', serie: 'Vida de oración', featured: true },
  { titulo: 'Fe que mueve montañas', pastor: 'Pastor Principal', fecha: 'Mayo 11, 2025', serie: 'Fe viva', featured: false },
  { titulo: 'Identidad en Cristo', pastor: 'Pastor Principal', fecha: 'Mayo 4, 2025', serie: 'Quiénes somos', featured: false },
  { titulo: 'El llamado de Dios', pastor: 'Pastor Principal', fecha: 'Abril 27, 2025', serie: 'Propósito divino', featured: false },
  { titulo: 'Gracia y perdón', pastor: 'Pastor Principal', fecha: 'Abril 20, 2025', serie: 'El corazón de Dios', featured: false },
  { titulo: 'Viviendo en victoria', pastor: 'Pastor Principal', fecha: 'Abril 13, 2025', serie: 'Vida abundante', featured: false },
]

const series = ['Vida de oración', 'Fe viva', 'Quiénes somos', 'Propósito divino', 'El corazón de Dios', 'Vida abundante']

export default function PredicasPage() {
  const [featured, ...rest] = predicas

  return (
    <div>

      {/* HERO */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-36 md:py-48">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Mensajes</p>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 max-w-2xl">
            Palabra<br />de vida.
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Escucha y crece con los mensajes de nuestra iglesia. Fe para cada semana.
          </p>
        </div>
      </section>

      {/* FEATURED SERMON */}
      <section className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-8">Mensaje reciente</p>
          <div className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-900 rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl transition duration-500">
            <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[260px] bg-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/60 hidden lg:block" />
              <div className="w-20 h-20 bg-white/10 group-hover:bg-amber-500/80 border border-white/20 rounded-full flex items-center justify-center transition duration-300 relative z-10">
                <Play size={28} className="text-white ml-1.5" />
              </div>
              <span className="absolute top-5 left-5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                Esta semana
              </span>
            </div>
            <div className="p-8 lg:py-10 text-white">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">{featured.serie}</span>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">{featured.titulo}</h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
                <BookOpen size={14} />
                <span>{featured.pastor}</span>
                <span className="text-slate-700">·</span>
                <span>{featured.fecha}</span>
              </div>
              <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-full text-sm transition">
                <Play size={14} /> Escuchar mensaje
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SERIES */}
      <section className="bg-slate-50 py-16 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Series</p>
          <div className="flex flex-wrap gap-3">
            {series.map(s => (
              <button
                key={s}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-slate-700 rounded-full text-sm font-medium transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID DE PRÉDICAS */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-10">Mensajes anteriores</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {rest.map(({ titulo, pastor, fecha, serie }) => (
              <div key={titulo} className="group cursor-pointer">
                <div className="relative bg-slate-900 rounded-2xl overflow-hidden mb-4 aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="w-14 h-14 bg-white/10 group-hover:bg-amber-500/80 border border-white/20 rounded-full flex items-center justify-center transition duration-300 relative z-10">
                    <Play size={18} className="text-white ml-1" />
                  </div>
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-amber-400 z-10">{serie}</span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition mb-1.5">{titulo}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <BookOpen size={11} />
                  <span>{pastor}</span>
                  <span>·</span>
                  <span>{fecha}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 text-white py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Comunidad</p>
          <h2 className="text-5xl font-black leading-tight mb-6">¿Listo para más?</h2>
          <p className="text-slate-400 text-lg mb-10">Únete a nuestra comunidad y conecta con otros creyentes.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full transition text-sm">
            Unirte a la comunidad <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  )
}
