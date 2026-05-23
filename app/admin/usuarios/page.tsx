import { createClient } from '@/lib/supabase/server'
import RoleSelector from '@/components/admin/RoleSelector'

export default async function AdminUsuariosPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-slate-500 text-sm mt-1">{users?.length ?? 0} miembros registrados</p>
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
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.full_name?.[0]?.toUpperCase() ?? 'U'
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
      </div>
    </div>
  )
}