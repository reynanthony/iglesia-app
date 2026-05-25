import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function MinisteriosAppPage() {
  const supabase = await createClient()

  const { data: allMinistries } = await supabase
    .from('ministries')
    .select('*')
    .order('created_at', { ascending: true })

  const parents = allMinistries?.filter(m => !m.parent_id) ?? []
  const children = allMinistries?.filter(m => m.parent_id) ?? []

  const ministriesWithSubs = parents.map(parent => ({
    ...parent,
    sub: children.filter(child => child.parent_id === parent.id)
  }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Ministerios</h1>
        <p className="text-slate-500 text-sm mt-1">Espacios de contenido y recursos por ministerio</p>
      </div>

      <div className="space-y-3">
        {ministriesWithSubs.map((ministry: any) => (
          <div key={ministry.id}>
            <Link
              href={'/app/ministerios/' + ministry.slug}
              className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: ministry.color + '20' }}
              >
                {ministry.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold group-hover:text-amber-400 transition">{ministry.name}</p>
                <p className="text-slate-500 text-sm truncate">{ministry.description}</p>
              </div>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: ministry.color }}
              />
            </Link>

            {ministry.sub.length > 0 && (
              <div className="ml-6 mt-2 space-y-2">
                {ministry.sub.map((sub: any) => (
                  <Link
                    key={sub.id}
                    href={'/app/ministerios/' + sub.slug}
                    className="flex items-center gap-3 bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 rounded-xl px-4 py-3 transition group"
                  >
                    <span className="text-lg">{sub.icon}</span>
                    <p className="text-sm text-slate-300 group-hover:text-white transition">{sub.name}</p>
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
    </div>
  )
}