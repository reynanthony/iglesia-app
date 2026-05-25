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
  const ministriesWithSubs = parents.map(p => ({
    ...p,
    sub: children.filter(c => c.parent_id === p.id),
  }))

  return (
    <div>

      {/* HERO */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-36 md:py-48">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Ministerios</p>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 max-w-2xl">
            Un lugar<br />para todos.
          </h1>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
            Cada ministerio es una comunidad viva donde crecer en fe, servir y conectar con otros creyentes.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">

          {ministriesWithSubs.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <p className="text-5xl mb-4">✝</p>
              <p className="text-lg font-semibold text-slate-600">Ministerios próximamente</p>
              <p className="text-sm mt-2">Estamos preparando este espacio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ministriesWithSubs.map((ministry: any) => (
                <div key={ministry.id} className="flex flex-col">
                  <Link
                    href={'/ministerios/' + ministry.slug}
                    className="group flex flex-col flex-1 rounded-2xl overflow-hidden border border-slate-100 hover:border-transparent hover:shadow-xl transition duration-300"
                  >
                    {/* Color bar */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: ministry.color }} />

                    <div className="p-7 flex flex-col flex-1 bg-white group-hover:bg-slate-50 transition">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                        style={{ backgroundColor: ministry.color + '18' }}
                      >
                        {ministry.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition">
                        {ministry.name}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed flex-1">
                        {ministry.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-6 text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">
                        Ver publicaciones
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>

                  {ministry.sub.length > 0 && (
                    <div className="mt-3 space-y-2 pl-2">
                      {ministry.sub.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={'/ministerios/' + sub.slug}
                          className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition duration-200 group"
                        >
                          <span className="text-lg">{sub.icon}</span>
                          <p className="text-sm text-slate-600 group-hover:text-slate-900 flex-1 font-medium transition">
                            {sub.name}
                          </p>
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sub.color }} />
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
      <section className="bg-slate-950 text-white py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Sírvenos</p>
          <h2 className="text-5xl font-black leading-tight mb-6">¿Dónde encajas tú?</h2>
          <p className="text-slate-400 text-lg mb-10">Cada ministerio necesita personas con tu talento y tu corazón.</p>
          <Link href="/contacto" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full transition text-sm">
            Contáctanos <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  )
}
