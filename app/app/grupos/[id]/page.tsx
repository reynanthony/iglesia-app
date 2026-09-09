import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, UsersRound, Lock, GraduationCap, ChevronRight } from 'lucide-react'
import { leaveGroup } from '@/app/actions/groups'
import GrupoTabs from './GrupoTabs'
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

export default async function GrupoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: group }, { data: membership }, { data: posts }, { data: memberCount }, { data: currentProfile }] = await Promise.all([
    supabase.from('groups').select('*, discipleship_programs(id, title, slug, discipleship_courses(id, title, slug))').eq('id', id).single(),
    supabase.from('group_members').select('role').eq('group_id', id).eq('user_id', user!.id).maybeSingle(),
    supabase
      .from('posts')
      .select('*, profiles(id, full_name, username, avatar_url), reactions(id, user_id, type), comments(id, content, created_at, parent_id, profiles(full_name, username, avatar_url), comment_likes(id, user_id))')
      .eq('group_id', id)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase.from('group_members').select('count').eq('group_id', id),
    supabase.from('profiles').select('role, full_name, username, avatar_url').eq('id', user!.id).single(),
  ])

  if (!group) notFound()

  const isMember        = !!membership
  const count           = (memberCount as any)?.[0]?.count ?? 0
  const program         = (group as any)?.discipleship_programs ?? null
  const currentUserRole = currentProfile?.role ?? 'miembro'

  return (
    <div style={{ background: BG, minHeight: '100%' }}>

      {/* Header sticky */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(16,18,23,0.92)', borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(12px)' }}>
        <Link href="/app/grupos" className="p-2 rounded-xl flex-shrink-0"
          style={{ background: BORDER, color: GOLD }}>
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-black text-sm truncate" style={{ color: INK }}>{group.name}</p>
            {group.is_private && <Lock size={11} style={{ color: MUTED, flexShrink: 0 }} />}
          </div>
          <p className="text-[11px]" style={{ color: MUTED }}>
            {TYPE_LABELS[group.type] ?? group.type} · {count} miembros
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isMember && (
            <Link href={`/app/nuevo-post?group=${group.id}`}
              className="w-9 h-9 flex items-center justify-center rounded-xl"
              style={{ background: GOLD, color: GOLD_INK }}>
              <Plus size={16} />
            </Link>
          )}
          {isMember && (
            <form action={leaveGroup.bind(null, group.id)}>
              <button type="submit" className="text-[11px] font-bold px-3.5 py-2 rounded-xl"
                style={{ background: BORDER, color: MUTED }}>
                Salir
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Description */}
      {group.description && (
        <div className="px-4 py-4 max-w-2xl mx-auto">
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            {group.description}
          </p>
        </div>
      )}

      {/* Programa de discipulado */}
      {program && (
        <div className="px-4 pb-4 max-w-2xl mx-auto">
          <Link
            href={`/educacion/discipulado/${program.slug}`}
            className="flex items-center gap-3 p-4 rounded-2xl transition hover:brightness-110"
            style={{ background: CARD, border: `1px solid ${GOLD}33` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${GOLD}1F` }}>
              <GraduationCap size={17} style={{ color: GOLD }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5"
                style={{ color: `${GOLD}8C` }}>
                Programa de este grupo
              </p>
              <p className="text-sm font-bold truncate" style={{ color: INK }}>{program.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>
                {program.discipleship_courses?.length ?? 0} curso{program.discipleship_courses?.length !== 1 ? 's' : ''}
              </p>
            </div>
            <ChevronRight size={14} style={{ color: MUTED }} />
          </Link>
        </div>
      )}

      {/* Contenido — bloqueado para no miembros */}
      {!isMember ? (
        <div className="max-w-2xl mx-auto text-center py-24 px-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <Lock size={22} style={{ color: `${GOLD}66` }} />
          </div>
          <p className="font-black text-lg tracking-tight mb-2" style={{ color: INK }}>
            Acceso por invitación
          </p>
          <p className="text-sm leading-relaxed max-w-[240px] mx-auto" style={{ color: MUTED }}>
            Este grupo es privado. Un líder debe invitarte para que puedas acceder.
          </p>
        </div>
      ) : (
        <GrupoTabs
          posts={posts ?? []}
          groupId={group.id}
          userId={user!.id}
          userProfile={{
            full_name:  currentProfile?.full_name  ?? '',
            username:   currentProfile?.username   ?? '',
            avatar_url: currentProfile?.avatar_url ?? null,
          }}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  )
}
