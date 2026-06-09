import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UsersRound, Lock, Bell } from 'lucide-react'
import { leaveGroup, acceptGroupInvite, declineGroupInvite } from '@/app/actions/groups'

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

export default async function GruposPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: groups }, { data: myMemberships }, { data: pendingInvites }] = await Promise.all([
    supabase.from('groups').select('*, group_members(count)').eq('is_active', true).order('name'),
    supabase.from('group_members').select('group_id').eq('user_id', user.id),
    supabase.from('group_invitations')
      .select('id, group_id')
      .eq('invited_user_id', user.id)
      .eq('status', 'pending'),
  ])

  const myGroupIds  = new Set((myMemberships ?? []).map((m: any) => m.group_id))
  const inviteMap   = new Map((pendingInvites ?? []).map((i: any) => [i.group_id, i.id]))

  const myGroups      = (groups ?? []).filter((g: any) => myGroupIds.has(g.id))
  const invitedGroups = (groups ?? [])
    .filter((g: any) => !myGroupIds.has(g.id) && inviteMap.has(g.id))
    .map((g: any) => ({ ...g, inviteId: inviteMap.get(g.id) }))
  const publicOther   = (groups ?? [])
    .filter((g: any) => !myGroupIds.has(g.id) && !inviteMap.has(g.id) && !g.is_private)

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: '#0D3352' }}>
            <UsersRound size={18} style={{ color: '#76ABAE' }} />
          </div>
          <h1 className="font-black tracking-tighter"
            style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
            Grupos<br /><span style={{ color: '#76ABAE' }}>de Comunidad.</span>
          </h1>
          <p className="text-sm mt-3 max-w-xs leading-relaxed" style={{ color: 'rgba(246,243,235,0.45)' }}>
            Conéctate con quienes comparten tu llamado.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Invitaciones pendientes */}
        {invitedGroups.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={13} style={{ color: '#76ABAE' }} />
              <p className="text-[11px] font-black uppercase tracking-[0.25em]"
                style={{ color: '#76ABAE' }}>
                Invitaciones — {invitedGroups.length}
              </p>
            </div>
            <div className="space-y-2">
              {invitedGroups.map((g: any) => (
                <div key={g.id}
                  className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: 'rgba(118,171,174,0.06)', border: '1px solid rgba(118,171,174,0.18)' }}>
                  <Link href={`/app/grupos/${g.id}`} className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(118,171,174,0.12)' }}>
                      <UsersRound size={18} style={{ color: '#76ABAE' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-black text-sm truncate" style={{ color: '#F6F3EB' }}>{g.name}</p>
                        {g.is_private && <Lock size={11} style={{ color: 'rgba(246,243,235,0.35)', flexShrink: 0 }} />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px]" style={{ color: 'rgba(118,171,174,0.70)' }}>
                          {TYPE_LABELS[g.type] ?? g.type}
                        </span>
                        <span style={{ color: 'rgba(246,243,235,0.20)' }}>·</span>
                        <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                          {g.group_members?.[0]?.count ?? 0} miembros
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <form action={acceptGroupInvite.bind(null, g.inviteId)}>
                      <button type="submit"
                        className="text-[11px] font-bold px-3 py-2 rounded-xl"
                        style={{ background: '#76ABAE', color: '#061E30' }}>
                        Aceptar
                      </button>
                    </form>
                    <form action={declineGroupInvite.bind(null, g.inviteId)}>
                      <button type="submit"
                        className="text-[11px] font-bold px-3 py-2 rounded-xl"
                        style={{ background: '#0D3352', color: 'rgba(246,243,235,0.50)', border: '1px solid #1A4A6E' }}>
                        Rechazar
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mis grupos */}
        {myGroups.length > 0 && (
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
              style={{ color: 'rgba(118,171,174,0.60)' }}>Mis grupos</p>
            <div className="space-y-2">
              {myGroups.map((g: any) => <GroupRow key={g.id} group={g} joined />)}
            </div>
          </section>
        )}

        {/* Grupos públicos disponibles */}
        {publicOther.length > 0 && (
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
              style={{ color: 'rgba(118,171,174,0.60)' }}>Explorar grupos</p>
            <div className="space-y-2">
              {publicOther.map((g: any) => <GroupRow key={g.id} group={g} joined={false} />)}
            </div>
          </section>
        )}

        {/* Estado vacío */}
        {myGroups.length === 0 && invitedGroups.length === 0 && publicOther.length === 0 && (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <UsersRound size={24} style={{ color: 'rgba(118,171,174,0.40)' }} />
            </div>
            <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>
              Aún no tienes grupos
            </p>
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.45)' }}>
              Habla con tu líder para que te invite a un grupo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function GroupRow({ group, joined }: { group: any; joined: boolean }) {
  const count = group.group_members?.[0]?.count ?? 0
  const type  = TYPE_LABELS[group.type] ?? group.type

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl"
      style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
      <Link href={`/app/grupos/${group.id}`} className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#0D3352' }}>
          <UsersRound size={18} style={{ color: '#76ABAE' }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-black text-sm truncate" style={{ color: '#F6F3EB' }}>{group.name}</p>
            {group.is_private && <Lock size={11} style={{ color: 'rgba(246,243,235,0.35)', flexShrink: 0 }} />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px]" style={{ color: 'rgba(118,171,174,0.70)' }}>{type}</span>
            <span style={{ color: 'rgba(246,243,235,0.20)' }}>·</span>
            <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>{count} miembros</span>
          </div>
        </div>
      </Link>

      {joined && (
        <form action={leaveGroup.bind(null, group.id)}>
          <button type="submit" className="text-[11px] font-bold px-3.5 py-2 rounded-xl"
            style={{ background: '#0D3352', color: 'rgba(246,243,235,0.50)', border: '1px solid #1A4A6E' }}>
            Salir
          </button>
        </form>
      )}
    </div>
  )
}
