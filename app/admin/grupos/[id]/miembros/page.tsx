import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserPlus, X, UsersRound } from 'lucide-react'
import { inviteUserToGroup, cancelGroupInvite, removeGroupMember } from '@/app/actions/groups'

export default async function GrupoMiembrosPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { id }   = await params
  const { q }    = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor', 'lider'].includes(me?.role ?? '')) redirect('/admin')

  const [{ data: group }, { data: members }, { data: pending }] = await Promise.all([
    supabase.from('groups').select('id, name, is_private').eq('id', id).single(),
    supabase
      .from('group_members')
      .select('user_id, role, joined_at, profiles(id, full_name, username, avatar_url)')
      .eq('group_id', id)
      .order('joined_at'),
    supabase
      .from('group_invitations')
      .select('id, invited_user_id, created_at, profiles!group_invitations_invited_user_id_fkey(id, full_name, username, avatar_url)')
      .eq('group_id', id)
      .eq('status', 'pending'),
  ])

  if (!group) notFound()

  // User search
  let searchResults: any[] = []
  if (q && q.trim().length > 1) {
    const memberIds  = new Set((members ?? []).map((m: any) => m.user_id))
    const inviteeIds = new Set((pending ?? []).map((p: any) => p.invited_user_id))

    const { data: found } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url')
      .or(`full_name.ilike.%${q.trim()}%,username.ilike.%${q.trim()}%`)
      .neq('id', user.id)
      .limit(10)

    searchResults = (found ?? []).filter((u: any) => !memberIds.has(u.id) && !inviteeIds.has(u.id))
  }

  const FIELD  = { background: '#0B2D47', border: '1px solid #0D3352', borderRadius: 12, color: '#F6F3EB' }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/grupos" className="p-2 rounded-xl" style={{ background: '#0D3352', color: '#76ABAE' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{group.name}</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>Gestión de miembros</p>
          </div>
        </div>

        {/* Buscar e invitar */}
        <section>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
            style={{ color: 'rgba(118,171,174,0.60)' }}>
            <UserPlus size={12} className="inline mr-1.5" />
            Invitar miembro
          </p>
          <form method="GET" className="flex gap-2 mb-3">
            <input
              name="q"
              defaultValue={q ?? ''}
              placeholder="Buscar por nombre o usuario…"
              autoComplete="off"
              className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none"
              style={FIELD}
            />
            <button type="submit"
              className="px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: '#76ABAE', color: '#061E30' }}>
              Buscar
            </button>
          </form>

          {q && searchResults.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: 'rgba(246,243,235,0.62)' }}>
              Sin resultados para "{q}"
            </p>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((u: any) => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                  <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: '#0D3352', color: '#76ABAE' }}>
                    {u.avatar_url
                      ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                      : u.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{u.full_name}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>@{u.username}</p>
                  </div>
                  <form action={inviteUserToGroup.bind(null, id, u.id)}>
                    <button type="submit"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-xl"
                      style={{ background: 'rgba(118,171,174,0.15)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.25)' }}>
                      Invitar
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Invitaciones pendientes */}
        {(pending ?? []).length > 0 && (
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
              style={{ color: 'rgba(118,171,174,0.60)' }}>
              Invitaciones pendientes — {pending!.length}
            </p>
            <div className="space-y-2">
              {pending!.map((inv: any) => {
                const p = inv.profiles
                return (
                  <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.15)' }}>
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: '#0D3352', color: '#76ABAE' }}>
                      {p?.avatar_url
                        ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                        : p?.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{p?.full_name}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>@{p?.username} · Pendiente</p>
                    </div>
                    <form action={cancelGroupInvite.bind(null, inv.id, id)}>
                      <button type="submit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg"
                        style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171' }}
                        title="Cancelar invitación">
                        <X size={14} />
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Miembros actuales */}
        <section>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
            style={{ color: 'rgba(118,171,174,0.60)' }}>
            <UsersRound size={12} className="inline mr-1.5" />
            Miembros — {(members ?? []).length}
          </p>
          {(members ?? []).length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'rgba(246,243,235,0.62)' }}>
              Este grupo no tiene miembros aún
            </p>
          ) : (
            <div className="space-y-2">
              {(members ?? []).map((m: any) => {
                const p = m.profiles
                return (
                  <div key={m.user_id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: '#0D3352', color: '#76ABAE' }}>
                      {p?.avatar_url
                        ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                        : p?.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{p?.full_name}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
                        @{p?.username}
                        {m.role === 'leader' && ' · Líder'}
                      </p>
                    </div>
                    <form action={removeGroupMember.bind(null, id, m.user_id)}>
                      <button type="submit"
                        className="text-[11px] font-bold px-3 py-1.5 rounded-xl"
                        style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.15)' }}>
                        Quitar
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
