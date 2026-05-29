import { createClient } from '@/lib/supabase/server'
import { Shield, UserCheck, UserX, Clock } from 'lucide-react'
import RoleSelector from '@/components/admin/RoleSelector'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin', pastor: 'Pastor', moderador: 'Moderador',
  lider: 'Líder', miembro: 'Miembro',
}

const ROLE_COLOR: Record<string, string> = {
  admin: '#F87171', pastor: '#C084FC', moderador: '#F59E0B',
  lider: '#60A5FA', miembro: 'rgba(246,243,235,0.40)',
}

export default async function SeguridadPage() {
  const supabase = await createClient()

  const [{ data: users }, { data: logs }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, username, role, is_active, created_at')
      .order('role', { ascending: true })
      .order('full_name', { ascending: true })
      .limit(200),
    supabase
      .from('activity_log')
      .select('id, action, metadata, created_at, profiles(full_name, username)')
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (s < 60)     return 'Ahora'
    if (s < 3600)   return `Hace ${Math.floor(s / 60)} min`
    if (s < 86400)  return `Hace ${Math.floor(s / 3600)} h`
    return new Date(date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
  }

  const privileged = users?.filter(u => ['admin','pastor','moderador','lider'].includes(u.role)) ?? []
  const members    = users?.filter(u => !['admin','pastor','moderador','lider'].includes(u.role)) ?? []

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-5 flex items-center gap-3">
          <Shield size={20} style={{ color: '#76ABAE' }} />
          <div>
            <h1 className="font-bold text-lg text-white">Seguridad</h1>
            <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
              Control de acceso y actividad del sistema
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8">

        {/* Usuarios con roles privilegiados */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(246,243,235,0.40)' }}>
            Accesos privilegiados ({privileged.length})
          </h2>
          <div className="space-y-2">
            {privileged.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3.5 rounded-2xl border"
                style={{ borderColor: '#0D3352', background: '#0B2D47' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: '#0D3352' }}
                >
                  {user.full_name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{user.full_name}</p>
                  <p className="text-[11px] truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>
                    @{user.username}
                  </p>
                </div>
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: `${ROLE_COLOR[user.role]}20`, color: ROLE_COLOR[user.role], border: `1px solid ${ROLE_COLOR[user.role]}40` }}
                >
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
                <div className="flex-shrink-0">
                  <RoleSelector userId={user.id} currentRole={user.role} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Log de actividad reciente */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(246,243,235,0.40)' }}>
            Actividad reciente
          </h2>
          {!logs || logs.length === 0 ? (
            <div className="rounded-2xl border p-6 text-center" style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
              <p className="text-sm" style={{ color: 'rgba(246,243,235,0.40)' }}>
                El log de actividad está vacío. Se llenará cuando los usuarios interactúen con el sistema.
              </p>
              <p className="text-[11px] mt-2" style={{ color: 'rgba(246,243,235,0.25)' }}>
                Requiere correr la migración SQL: supabase/v2_ecosystem.sql
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ borderColor: '#0D3352', background: '#0B2D47' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#0D3352' }}
                  >
                    <Clock size={13} style={{ color: 'rgba(246,243,235,0.40)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white">
                      {(log.profiles as any)?.full_name ?? 'Sistema'}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>
                      {log.action}
                    </p>
                  </div>
                  <span className="text-[11px] flex-shrink-0" style={{ color: 'rgba(246,243,235,0.30)' }}>
                    {timeAgo(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resumen de miembros */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(246,243,235,0.40)' }}>
            Resumen de miembros
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: users?.length ?? 0, icon: UserCheck },
              { label: 'Privilegiados', value: privileged.length, icon: Shield },
              { label: 'Miembros', value: members.length, icon: UserCheck },
              { label: 'Inactivos', value: users?.filter(u => u.is_active === false).length ?? 0, icon: UserX },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-2xl border" style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
                <stat.icon size={16} style={{ color: '#76ABAE', marginBottom: 8 }} />
                <p className="font-black text-2xl text-white leading-none">{stat.value}</p>
                <p className="text-[11px] mt-1" style={{ color: 'rgba(246,243,235,0.40)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
