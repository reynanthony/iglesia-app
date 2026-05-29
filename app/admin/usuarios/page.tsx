import { createClient } from '@/lib/supabase/server'
import RoleSelector from '@/components/admin/RoleSelector'
import MinistryAssignment from '@/components/admin/MinistryAssignment'
import DeleteUserButton from '@/components/admin/DeleteUserButton'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'

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

  const { data: allAssignments } = await supabase
    .from('ministry_assignments')
    .select('user_id, ministry_id, ministries(id, name)')

  const { data: allMinistries } = await supabase
    .from('ministries')
    .select('id, name')
    .order('name')

  const roles = ['todos', 'admin', 'pastor', 'moderador', 'lider', 'miembro', 'visitante']

  const roleColors: Record<string, string> = {
    admin:     'bg-red-500/10 text-red-400',
    pastor:    'bg-purple-500/10 text-purple-400',
    moderador: 'bg-blue-500/10 text-blue-400',
    lider:     'bg-green-500/10 text-green-400',
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-[rgba(246,243,235,0.40)] text-sm mt-1">{users?.length ?? 0} miembros encontrados</p>
        </div>
        <Link href="/admin/usuarios/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition flex-shrink-0"
          style={{ background: '#F6F3EB', color: '#061E30' }}>
          <Plus size={13} /> Nuevo usuario
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form method="GET" className="flex-1 flex items-center gap-3 bg-[#0B2D47] border border-[#0D3352] rounded-xl px-4 py-2.5">
          <Search size={16} className="text-[rgba(246,243,235,0.40)] flex-shrink-0" />
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Buscar por nombre o usuario..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-[rgba(246,243,235,0.30)] focus:outline-none"
          />
          {role && <input type="hidden" name="role" value={role} />}
        </form>

        <div className="flex gap-2 flex-wrap">
          {roles.map(r => {
            const params = new URLSearchParams()
            if (q) params.set('q', q)
            if (r !== 'todos') params.set('role', r)
            const qs = params.toString()
            const href = qs ? '/admin/usuarios?' + qs : '/admin/usuarios'
            const isActive = role === r || (!role && r === 'todos')
            return (
              <a key={r} href={href}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition ${
                  isActive
                    ? 'bg-white text-[#061E30]'
                    : 'bg-[#0B2D47] border border-[#0D3352] text-[rgba(246,243,235,0.45)] hover:border-[#76ABAE]'
                }`}>
                {r}
              </a>
            )
          })}
        </div>
      </div>

      <div className="bg-[#0B2D47] border border-[#0D3352] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#0D3352]">
              <th className="text-left px-5 py-3 text-xs text-[rgba(246,243,235,0.40)] font-medium">Usuario</th>
              <th className="text-left px-5 py-3 text-xs text-[rgba(246,243,235,0.40)] font-medium hidden md:table-cell">Registrado</th>
              <th className="text-left px-5 py-3 text-xs text-[rgba(246,243,235,0.40)] font-medium">Rol</th>
              <th className="text-left px-5 py-3 text-xs text-[rgba(246,243,235,0.40)] font-medium hidden lg:table-cell">Ministerios asignados</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => {
              const userAssignments = (allAssignments ?? []).filter(a => a.user_id === user.id)
              const showAssign = ['lider', 'pastor', 'moderador'].includes(user.role)
              return (
                <tr key={user.id} className="border-b border-[#0D3352]/50 hover:bg-[#0D3352]/30 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0D3352] flex-shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[rgba(246,243,235,0.70)]">
                            {user.full_name?.[0]?.toUpperCase() ?? 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.full_name}</p>
                        <p className="text-xs text-[rgba(246,243,235,0.40)]">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <p className="text-xs text-[rgba(246,243,235,0.40)]">
                      {new Date(user.created_at).toLocaleDateString('es-DO')}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <RoleSelector userId={user.id} currentRole={user.role} />
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {showAssign ? (
                      <MinistryAssignment
                        userId={user.id}
                        assignments={userAssignments as any}
                        allMinistries={allMinistries ?? []}
                      />
                    ) : (
                      <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.25)' }}>
                        {user.role === 'admin' ? 'Acceso total' : '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <DeleteUserButton userId={user.id} username={user.username ?? user.full_name ?? ''} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {(!users || users.length === 0) && (
          <div className="py-16 text-center text-[rgba(246,243,235,0.40)] text-sm">
            No se encontraron usuarios
          </div>
        )}
      </div>

      {/* Role legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(roleColors).map(([r, cls]) => (
          <span key={r} className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${cls}`}>
            {r === 'lider' ? 'Líder — acceso por ministerio asignado' :
             r === 'moderador' ? 'Moderador — modera posts y comentarios' :
             r === 'pastor' ? 'Pastor — acceso completo a contenido' :
             'Admin — control total'}
          </span>
        ))}
      </div>
      </div>
    </div>
  )
}
