import { createClient } from '@/lib/supabase/server'
import RoleSelector from '@/components/admin/RoleSelector'
import { Search } from 'lucide-react'

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>
}) {
  const { q, role } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (q) query = query.or('username.ilike.%' + q + '%,full_name.ilike.%' + q + '%')
  if (role && role !== 'todos') query = query.eq('role', role)

  const { data: users } = await query
  const roles = ['todos', 'admin', 'pastor', 'moderador', 'lider', 'miembro', 'visitante']

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-slate-500 text-sm mt-1">{users?.length ?? 0} miembros encontrados</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form method="GET" className="flex-1 flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-slate-500 flex-shrink-0" />
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Buscar por nombre o usuario..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
          />
          {role && <input type="hidden" name="role" value={role} />}
        </form>

        <div className="flex gap-2 flex-wrap">
          {roles.map(function(r) {
            const params = new URLSearchParams()
            if (q) params.set('q', q)
            if (r !== 'todos') params.set('role', r)
            const qs = params.toString()
            const href = qs ? '/admin/usuarios?' + qs : '/admin/usuarios'
            const isActive = role === r || (!role && r === 'todos')
            const base = 'px-3 py-2 rounded-xl text-xs font-medium capitalize transition '
            const active = 'bg-[#000000] text-slate-950'
            const inactive = 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-600'
            return (
              <a key={r} href={href} className={base + (isActive ? active : inactive)}>
                {r}
              </a>
            )
          })}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-5 py-3 text-xs text-slate-500 font-medium">Usuario</th>
              <th className="text-left px-5 py-3 text-xs text-slate-500 font-medium hidden md:table-cell">Registrado</th>
              <th className="text-left px-5 py-3 text-xs text-slate-500 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-300">
                          {user.full_name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-slate-500">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <p className="text-xs text-slate-500">
                    {new Date(user.created_at).toLocaleDateString('es-DO')}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <RoleSelector userId={user.id} currentRole={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!users || users.length === 0) && (
          <div className="py-16 text-center text-slate-500 text-sm">
            No se encontraron usuarios
          </div>
        )}
      </div>
    </div>
  )
}