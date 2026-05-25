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

  const ministriesWithSubs = parents.map(parent => ({
    ...parent,
    sub: children.filter(child => child.parent_id === parent.id),
  }))

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-slate-950 text-white py-24">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Ministerios</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5">
            Un lugar<br />para todos
          </h1>
          <p className="text-slate-400 text-lg max-w-lg">
            Cada ministerio es una comunidad viva donde crecer en fe, servir y conectar con otros creyentes.
          </p>
        </div>
      </section>

      {/* Ministry grid */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministriesWithSubs.map((ministry: any) => (
            <div key={ministry.id} className="flex flex-col">
              <Link
                href={'/ministerios/' + ministry.slug}
                className="group flex flex-col flex-1 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition duration-300"
              >
                {/* Colored banner */}
                <div
                  className="h-3 w-full"
                  style={{ backgroundColor: ministry.color }}
                />

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
                    style={{ backgroundColor: ministry.color + '18' }}
                  >
                    {ministry.icon}
                  </div>

                  {/* Name & description */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition">
                    {ministry.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">
                    {ministry.description}
                  </p>

                  {/* Read more */}
                  <div className="flex items-center gap-1 mt-5 text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition">
                    Ver publicaciones <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Sub-ministries */}
              {ministry.sub.length > 0 && (
                <div className="mt-3 space-y-2 pl-2">
                  {ministry.sub.map((sub: any) => (
                    <Link
                      key={sub.id}
                      href={'/ministerios/' + sub.slug}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-white transition group"
                    >
                      <span className="text-lg">{sub.icon}</span>
                      <p className="text-sm text-slate-600 group-hover:text-slate-900 flex-1 transition">{sub.name}</p>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sub.color }} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
