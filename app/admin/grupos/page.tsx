import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, UsersRound, Lock } from 'lucide-react'
import { toggleGroupActive } from '@/app/actions/groups'

const TYPE_LABELS: Record<string, string> = {
  jovenes:     'Jóvenes',
  caballeros:  'Caballeros',
  damas:       'Damas',
  matrimonios: 'Matrimonios',
  evangelismo: 'Evangelismo',
  intercesion: 'Intercesión',
  alabanza:    'Alabanza',
  general:     'General',
}

export default async function AdminGruposPage() {
  const supabase = await createClient()

  const { data: groups } = await supabase
    .from('groups')
    .select('*, group_members(count)')
    .order('is_active', { ascending: false })
    .order('name')

  const activeCount = (groups ?? []).filter((g: any) => g.is_active).length

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Grupos</h1>
            <p className="text-xs md:text-sm mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
              {activeCount} activos · {(groups ?? []).length} total
            </p>
          </div>
          <Link href="/admin/grupos/nuevo"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold flex-shrink-0"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={13} /><span className="hidden sm:inline">Nuevo grupo</span><span className="sm:hidden">Nuevo</span>
          </Link>
        </div>

        <div className="space-y-2">
          {groups?.map((group: any) => {
            const count = group.group_members?.[0]?.count ?? 0
            return (
              <div key={group.id}
                className="flex items-center gap-3 p-3.5 md:p-4 rounded-xl md:rounded-2xl transition"
                style={{
                  background: '#0B2D47',
                  border: '1px solid #0D3352',
                  opacity: group.is_active ? 1 : 0.55,
                }}>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#0D3352' }}>
                  <UsersRound size={15} style={{ color: '#76ABAE' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>{group.name}</p>
                    {group.is_private && (
                      <Lock size={10} style={{ color: 'rgba(246,243,235,0.35)' }} />
                    )}
                    {!group.is_active && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                    {TYPE_LABELS[group.type] ?? group.type} · {count} miembros
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Link href={`/admin/grupos/${group.id}/editar`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg"
                    style={{ background: '#0D3352', color: 'rgba(246,243,235,0.55)' }}>
                    <Pencil size={13} />
                  </Link>
                  <form action={toggleGroupActive.bind(null, group.id, !group.is_active)}>
                    <button type="submit"
                      className="text-[10px] md:text-[11px] font-bold px-2.5 py-1.5 rounded-lg"
                      style={{
                        background: group.is_active ? 'rgba(248,113,113,0.12)' : 'rgba(118,171,174,0.12)',
                        color:      group.is_active ? '#F87171' : '#76ABAE',
                      }}>
                      {group.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                  </form>
                </div>
              </div>
            )
          })}

          {(!groups || groups.length === 0) && (
            <div className="text-center py-16" style={{ color: 'rgba(246,243,235,0.40)' }}>
              <p className="text-sm">No hay grupos creados aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
