import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  let users: any[] = []

  if (q && q.trim().length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, bio, role')
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
      .limit(20)

    users = data ?? []
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-5">Buscar</h1>

      {/* Buscador */}
      <form method="GET" className="mb-6">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 focus-within:border-amber-500/50 rounded-2xl px-4 py-3 transition">
          <Search size={18} className="text-slate-500 flex-shrink-0" />
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Buscar personas..."
            autoComplete="off"
            className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
          />
        </div>
      </form>

      {/* Resultados */}
      {q && users.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm">Sin resultados para "{q}"</p>
        </div>
      )}

      <div className="space-y-2">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/app/perfil/${user.username}`}
            className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">
                  {user.full_name?.[0]?.toUpperCase() ?? 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{user.full_name}</p>
              <p className="text-slate-500 text-xs">@{user.username}</p>
              {user.bio && (
                <p className="text-slate-400 text-xs mt-0.5 truncate">{user.bio}</p>
              )}
            </div>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full capitalize flex-shrink-0">
              {user.role}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}