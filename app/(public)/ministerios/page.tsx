import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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
    <div>
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">Ministerios</span>
          <h1 className="text-5xl font-bold mt-2">Un lugar para todos</h1>
          <p className="text-slate-400 mt-4 max-w-xl">Cada ministerio es una oportunidad de servir, crecer y conectar con otros creyentes.</p>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministriesWithSubs.map((ministry: any) => (
            <div key={ministry.id}>
              <Link
                href={'/ministerios/' + ministry.slug}
                className="block bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ backgroundColor: ministry.color + '20' }}
                >
                  {ministry.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-3 group-hover:text-amber-600 transition">{ministry.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{ministry.description}</p>
              </Link>

              {ministry.sub.length > 0 && (
                <div className="mt-2 ml-4 space-y-2">
                  {ministry.sub.map((sub: any) => (
                    <Link
                      key={sub.id}
                      href={'/ministerios/' + sub.slug}
                      className="flex items-center gap-3 bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-xl px-4 py-3 transition group"
                    >
                      <span className="text-lg">{sub.icon}</span>
                      <p className="text-sm text-slate-600 group-hover:text-slate-900 transition">{sub.name}</p>
                      <div
                        className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                        style={{ backgroundColor: sub.color }}
                      />
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
