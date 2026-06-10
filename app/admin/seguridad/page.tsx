import { createClient } from '@/lib/supabase/server'
import { Shield, UserCheck, UserX, Clock } from 'lucide-react'
import RoleSelector from '@/components/admin/RoleSelector'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin', pastor: 'Pastor', moderador: 'Moderador',
  lider: 'Líder', miembro: 'Miembro',
}

const ROLE_COLOR: Record<string, string> = {
  admin: '#F87171', pastor: '#C084FC', moderador: '#F59E0B',
  lider: '#60A5FA', miembro: 'rgba(246,243,235,0.68)',
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
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center gap-2.5">
          <Shield size={18} style={{ color: '#76ABAE' }} />
          <div>
            <h1 className="font-bold text-base md:text-lg text-white">Seguridad</h1>
            <p className="text-[11px] md:text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Control de acceso y actividad
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-6 space-y-5 md:space-y-8">

        {/* Usuarios con roles privilegiados */}
        <section>
          <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] mb-2.5 md:mb-3"
            style={{ color: 'rgba(246,243,235,0.68)' }}>
            Accesos privilegiados ({privileged.length})
          </h2>
          <div className="space-y-2">
            {privileged.map(user => (
              <div key={user.id}
                className="flex flex-wrap items-center gap-2.5 p-3 md:p-3.5 rounded-xl md:rounded-2xl border"
                style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: '#0D3352', color: 'rgba(246,243,235,0.70)' }}>
                  {user.full_name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="flex-1 min-w-[100px]">
                  <p className="font-bold text-white text-sm truncate">{user.full_name}</p>
                  <p className="text-[11px] truncate" style={{ color: 'rgba(246,243,235,0.68)' }}>
                    @{user.username}
                  </p>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${ROLE_COLOR[user.role]}20`, color: ROLE_COLOR[user.role], border: `1px solid ${ROLE_COLOR[user.role]}40` }}>
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
                <div className="w-full md:w-auto flex-shrink-0">
                  <RoleSelector userId={user.id} currentRole={user.role} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Log de actividad reciente */}
        <section>
          <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] mb-2.5 md:mb-3"
            style={{ color: 'rgba(246,243,235,0.68)' }}>
            Actividad reciente
          </h2>
          {!logs || logs.length === 0 ? (
            <div className="rounded-xl md:rounded-2xl border p-4 md:p-6 text-center"
              style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
              <p className="text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>
                El log de actividad está vacío.
              </p>
              <p className="text-[11px] mt-1.5" style={{ color: 'rgba(246,243,235,0.25)' }}>
                Requiere correr: supabase/v2_ecosystem.sql
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 md:space-y-2">
              {logs.map((log: any) => (
                <div key={log.id}
                  className="flex items-center gap-3 p-2.5 md:p-3 rounded-xl border"
                  style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#0D3352' }}>
                    <Clock size={12} style={{ color: 'rgba(246,243,235,0.68)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white">
                      {(log.profiles as any)?.full_name ?? 'Sistema'}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'rgba(246,243,235,0.68)' }}>
                      {log.action}
                    </p>
                  </div>
                  <span className="text-[11px] flex-shrink-0" style={{ color: 'rgba(246,243,235,0.55)' }}>
                    {timeAgo(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resumen de miembros */}
        <section>
          <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] mb-2.5 md:mb-3"
            style={{ color: 'rgba(246,243,235,0.68)' }}>
            Resumen de miembros
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
            {[
              { label: 'Total',        value: users?.length ?? 0,                                    icon: UserCheck },
              { label: 'Privilegiados',value: privileged.length,                                     icon: Shield    },
              { label: 'Miembros',     value: members.length,                                        icon: UserCheck },
              { label: 'Inactivos',    value: users?.filter(u => u.is_active === false).length ?? 0, icon: UserX     },
            ].map(stat => (
              <div key={stat.label} className="p-3 md:p-4 rounded-xl md:rounded-2xl border"
                style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
                <stat.icon size={14} style={{ color: '#76ABAE', marginBottom: 6 }} />
                <p className="font-black text-xl md:text-2xl text-white leading-none">{stat.value}</p>
                <p className="text-[10px] md:text-[11px] mt-1" style={{ color: 'rgba(246,243,235,0.68)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
