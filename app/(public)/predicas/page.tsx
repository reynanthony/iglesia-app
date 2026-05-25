import { Play, ArrowRight } from 'lucide-react'
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

const [featured, ...rest] = predicas

export default function PredicasPage() {
  return (
    <div>

      {/* HERO */}
      <section className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-0.5 h-12 bg-amber-500 flex-shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
              Mensajes<br />Palabra de vida
            </p>
          </div>
          <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[9rem] font-black leading-[0.88] tracking-tighter text-white mb-10 max-w-3xl">
            Palabra<br />de vida.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            Escucha y crece con los mensajes de nuestra iglesia. Fe para cada semana.
          </p>
        </div>
      </section>

      {/* MENSAJE DESTACADO */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">— Mensaje reciente</p>
          </div>
          <div className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border border-zinc-100 overflow-hidden cursor-pointer hover:border-zinc-300 transition">
            <div className="relative bg-zinc-900 flex items-center justify-center min-h-[260px]">
              <div className="absolute top-0 left-0 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-4 py-2">
                Esta semana
              </div>
              <div className="w-14 h-14 border border-white/25 group-hover:bg-amber-500 group-hover:border-amber-500 flex items-center justify-center transition duration-200">
                <Play size={18} className="text-white ml-1" />
              </div>
            </div>
            <div className="p-10 bg-zinc-50 group-hover:bg-white transition">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-4">{featured.serie}</p>
              <h2 className="text-3xl font-black text-zinc-900 leading-tight tracking-tight mb-4">{featured.titulo}</h2>
              <p className="text-xs text-zinc-400 uppercase tracking-wider mb-8">{featured.pastor} · {featured.fecha}</p>
              <button className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-3.5 transition">
                <Play size={12} /> Escuchar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SERIES */}
      <section className="bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center gap-6 flex-wrap">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 flex-shrink-0">Series</p>
            {series.map(s => (
              <button
                key={s}
                className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 border-b border-transparent hover:border-zinc-900 pb-0.5 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID DE PRÉDICAS */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-center justify-between mb-12 border-b border-zinc-100 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">— Mensajes anteriores</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {rest.map(({ titulo, pastor, fecha, serie }) => (
              <div key={titulo} className="group cursor-pointer">
                <div className="relative bg-zinc-900 mb-5 overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 border border-white/25 group-hover:bg-amber-500 group-hover:border-amber-500 flex items-center justify-center transition duration-200">
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

      {/* CTA */}
      <section className="bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-8">— Comunidad</p>
            <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tighter text-white">
              ¿Listo<br />para más?
            </h2>
          </div>
          <Link href="/login" className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition flex-shrink-0">
            Unirte a la comunidad <ArrowRight size={13} />
          </Link>
        </div>
      </section>

    </div>
  )
}
