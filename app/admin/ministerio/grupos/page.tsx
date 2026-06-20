import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, UsersRound, ArrowLeft, Pencil } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  jovenes: 'Jóvenes', caballeros: 'Caballeros', damas: 'Damas',
  matrimonios: 'Matrimonios', evangelismo: 'Evangelismo',
  intercesion: 'Intercesión', alabanza: 'Alabanza', general: 'General',
}

export default async function LiderGruposPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: assignments } = await supabase
    .from('ministry_assignments')
    .select('ministry_id, ministries(id, name)')
    .eq('user_id', user.id)
    .eq('can_admin', true)

  if (!assignments || assignments.length === 0) redirect('/app/comunidad')

  const ministryIds = assignments.map((a: any) => a.ministry_id)

  // Grupos de este ministerio + los creados por este lider (por si no tienen ministry_id aún)
  const { data: groups } = await supabase
    .from('groups')
    .select('*, group_members(count)')
    .or(`ministry_id.in.(${ministryIds.join(',')}),created_by.eq.${user.id}`)
    .order('is_active', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/ministerio"
            className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: '#0D3352', color: '#76ABAE' }}>
            <ArrowLeft size={15} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Grupos</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
              {groups?.length ?? 0} grupos en tu ministerio
            </p>
          </div>
          <Link href="/admin/grupos/nuevo"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold flex-shrink-0"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={13} /><span className="hidden sm:inline">Nuevo grupo</span>
          </Link>
        </div>

        <div className="space-y-2">
          {groups?.map((group: any) => {
            const count = group.group_members?.[0]?.count ?? 0
            return (
              <div key={group.id}
                className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{
                  background: '#0B2D47',
                  border: '1px solid #0D3352',
                  opacity: group.is_active ? 1 : 0.55,
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#0D3352' }}>
                  <UsersRound size={15} style={{ color: '#76ABAE' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: '#F6F3EB' }}>{group.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
                    {TYPE_LABELS[group.type] ?? group.type} · {count} miembro{count !== 1 ? 's' : ''}
                    {!group.is_active && <span className="ml-2 text-red-400">· Inactivo</span>}
                  </p>
                </div>
                <Link href={`/admin/grupos/${group.id}/editar`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: '#0D3352', color: 'rgba(246,243,235,0.55)' }}>
                  <Pencil size={13} />
                </Link>
              </div>
            )
          })}

          {(!groups || groups.length === 0) && (
            <div className="text-center py-16 space-y-3" style={{ color: 'rgba(246,243,235,0.55)' }}>
              <UsersRound size={32} className="mx-auto opacity-30" />
              <p className="text-sm">No hay grupos creados aún</p>
              <Link href="/admin/grupos/nuevo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: '#76ABAE', color: '#061E30' }}>
                <Plus size={14} /> Crear grupo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
