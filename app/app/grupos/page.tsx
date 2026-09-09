import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UsersRound, Lock, Bell } from 'lucide-react'
import { leaveGroup, acceptGroupInvite, declineGroupInvite } from '@/app/actions/groups'
import { GoldArt } from '@/components/app/GoldArt'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

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

// Un acento de color por tipo de grupo — para que la lista se pueda escanear
// por categoría de un vistazo, en vez de que cada fila sea idéntica.
const TYPE_COLOR: Record<string, string> = {
  jovenes:     GOLD,
  caballeros:  '#60A5FA',
  damas:       '#F472B6',
  matrimonios: '#C084FC',
  evangelismo: '#F59E0B',
  intercesion: '#4ADE80',
  alabanza:    '#F87171',
  general:     MUTED,
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
    <div style={{ background: BG, minHeight: '100%' }} className="font-app">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 80% at 50% 0%, ${GOLD}12, transparent 70%)` }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <div className="relative w-11 h-11 mb-4">
            <GoldArt uid="grupos-header" light="#9FE3D1" dark="#1B6E56" icon={UsersRound} iconSize={18} />
          </div>
          <h1 className="font-black tracking-tighter"
            style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: INK }}>
            Grupos<br /><span style={{ color: GOLD }}>de Comunidad.</span>
          </h1>
          <p className="text-sm mt-3 max-w-xs leading-relaxed" style={{ color: MUTED }}>
            Conéctate con quienes comparten tu llamado.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Invitaciones pendientes */}
        {invitedGroups.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={13} style={{ color: GOLD }} />
              <p className="text-[11px] font-black uppercase tracking-[0.25em]"
                style={{ color: GOLD }}>
                Invitaciones — {invitedGroups.length}
              </p>
            </div>
            <div className="space-y-2">
              {invitedGroups.map((g: any) => (
                <div key={g.id}
                  className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: `${GOLD}0F`, border: `1px solid ${GOLD}2E` }}>
                  <Link href={`/app/grupos/${g.id}`} className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 flex-shrink-0">
                      <GoldArt uid={`grupo-inv-${g.id}`} light="#9FE3D1" dark="#1B6E56" icon={UsersRound} iconSize={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-black text-sm truncate" style={{ color: INK }}>{g.name}</p>
                        {g.is_private && <Lock size={11} style={{ color: MUTED, flexShrink: 0 }} />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px]" style={{ color: GOLD }}>
                          {TYPE_LABELS[g.type] ?? g.type}
                        </span>
                        <span style={{ color: BORDER }}>·</span>
                        <span className="text-[11px]" style={{ color: MUTED }}>
                          {g.group_members?.[0]?.count ?? 0} miembros
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <form action={acceptGroupInvite.bind(null, g.inviteId)}>
                      <button type="submit"
                        className="text-[11px] font-bold px-3 py-2 rounded-xl"
                        style={{ background: GOLD, color: GOLD_INK }}>
                        Aceptar
                      </button>
                    </form>
                    <form action={declineGroupInvite.bind(null, g.inviteId)}>
                      <button type="submit"
                        className="text-[11px] font-bold px-3 py-2 rounded-xl"
                        style={{ background: BORDER, color: MUTED, border: `1px solid ${BORDER}` }}>
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
            <h2 className="font-bold text-xl mb-1" style={{ color: INK }}>Mis grupos</h2>
            <div className="border-t" style={{ borderColor: BORDER }}>
              {myGroups.map((g: any) => <GroupRow key={g.id} group={g} joined />)}
            </div>
          </section>
        )}

        {/* Grupos públicos disponibles */}
        {publicOther.length > 0 && (
          <section>
            <h2 className="font-bold text-xl mb-1" style={{ color: INK }}>Explorar grupos</h2>
            <div className="border-t" style={{ borderColor: BORDER }}>
              {publicOther.map((g: any) => <GroupRow key={g.id} group={g} joined={false} />)}
            </div>
          </section>
        )}

        {/* Estado vacío */}
        {myGroups.length === 0 && invitedGroups.length === 0 && publicOther.length === 0 && (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <UsersRound size={24} style={{ color: MUTED }} />
            </div>
            <p className="font-black text-lg tracking-tight mb-2" style={{ color: INK }}>
              Aún no tienes grupos
            </p>
            <p className="text-sm" style={{ color: MUTED }}>
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
  const color = TYPE_COLOR[group.type] ?? GOLD

  return (
    <div className="flex items-center gap-4 py-4 border-b" style={{ borderColor: BORDER }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} aria-hidden="true" />

      <Link href={`/app/grupos/${group.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-base truncate" style={{ color: INK }}>{group.name}</p>
          {group.is_private && <Lock size={11} style={{ color: MUTED, flexShrink: 0 }} />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color }}>{type}</span>
          <span style={{ color: BORDER }}>·</span>
          <span className="text-[11px]" style={{ color: MUTED }}>{count} miembros</span>
        </div>
      </Link>

      {joined && (
        <form action={leaveGroup.bind(null, group.id)}>
          <button type="submit" className="text-[11px] font-bold px-3.5 py-2 rounded-xl transition hover:bg-white/5"
            style={{ color: MUTED, border: `1px solid ${BORDER}` }}>
            Salir
          </button>
        </form>
      )}
    </div>
  )
}
