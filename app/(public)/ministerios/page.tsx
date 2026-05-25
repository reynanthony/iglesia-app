import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function MinisteriosPage() {
  const supabase = await createClient()

  const { data: allMinistries } = await supabase
    .from('ministries')
    .select('*')
    .order('created_at', { ascending: true })

  const parents = allMinistries?.filter(m => !m.parent_id) ?? []
  const children = allMinistries?.filter(m => m.parent_id) ?? []
  const ministriesWithSubs = parents.map((p, i) => ({
    ...p,
    n: String(i + 1).padStart(2, '0'),
    sub: children.filter(c => c.parent_id === p.id),
  }))

  return (
    <div>

      {/* HERO */}
      <section className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-0.5 h-12 bg-amber-500 flex-shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
              Ministerios<br />Un lugar para todos
            </p>
          </div>
          <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[9rem] font-black leading-[0.88] tracking-tighter text-white mb-10 max-w-3xl">
            Un lugar<br />para todos.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            Cada ministerio es una comunidad viva donde crecer en fe, servir y conectar con otros creyentes.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-center justify-between mb-12 border-b border-zinc-100 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              — {ministriesWithSubs.length > 0 ? `${ministriesWithSubs.length} ministerios` : 'Ministerios'}
            </p>
          </div>

          {ministriesWithSubs.length === 0 ? (
            <div className="py-32 text-center border border-zinc-100">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Próximamente</p>
              <p className="text-2xl font-black text-zinc-900 mt-4">Estamos preparando este espacio</p>
            </div>
          ) : (
            <div className="space-y-px bg-zinc-100">
              {ministriesWithSubs.map((ministry: any) => (
                <div key={ministry.id}>
                  <Link
                    href={'/ministerios/' + ministry.slug}
                    className="group bg-white hover:bg-zinc-50 transition flex items-start gap-8 p-8 md:p-10"
                  >
                    <span className="text-[10px] font-bold text-zinc-300 tracking-widest flex-shrink-0 pt-1">{ministry.n}</span>

                    <div
                      className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: ministry.color + '18' }}
                    >
                      {ministry.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight mb-2 group-hover:text-amber-600 transition">
                        {ministry.name}
                      </h3>
                      <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">{ministry.description}</p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 group-hover:text-zinc-900 transition self-center">
                      Ver <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  {ministry.sub.length > 0 && (
                    <div className="bg-zinc-50 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
                      {ministry.sub.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={'/ministerios/' + sub.slug}
                          className="group flex items-center gap-3 px-10 py-4 hover:bg-white transition"
                        >
                          <span className="text-base">{sub.icon}</span>
                          <p className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 transition flex-1">{sub.name}</p>
                          <div className="w-1.5 h-1.5 flex-shrink-0" style={{ backgroundColor: sub.color }} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900/50 mb-8">— Sírvenos</p>
            <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tighter text-black">
              ¿Dónde<br />encajas tú?
            </h2>
          </div>
          <Link href="/contacto" className="inline-flex items-center gap-3 bg-black hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition flex-shrink-0">
            Contáctanos <ArrowRight size={13} />
          </Link>
        </div>
      </section>

    </div>
  )
}
