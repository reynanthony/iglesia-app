import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, UsersRound, Lock, GraduationCap, ChevronRight } from 'lucide-react'
import PostCard from '@/components/PostCard'
import { leaveGroup } from '@/app/actions/groups'

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
    supabase.from('profiles').select('role').eq('id', user!.id).single(),
  ])

  if (!group) notFound()

  const isMember        = !!membership
  const count           = (memberCount as any)?.[0]?.count ?? 0
  const program         = (group as any)?.discipleship_programs ?? null
  const currentUserRole = currentProfile?.role ?? 'miembro'

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Header sticky */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(6,30,48,0.97)', borderBottom: '1px solid #0D3352', backdropFilter: 'blur(12px)' }}>
        <Link href="/app/grupos" className="p-2 rounded-xl flex-shrink-0"
          style={{ background: '#0D3352', color: '#76ABAE' }}>
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-black text-sm truncate" style={{ color: '#F6F3EB' }}>{group.name}</p>
            {group.is_private && <Lock size={11} style={{ color: 'rgba(246,243,235,0.35)', flexShrink: 0 }} />}
          </div>
          <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
            {TYPE_LABELS[group.type] ?? group.type} · {count} miembros
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isMember && (
            <Link href={`/app/nuevo-post?group=${group.id}`}
              className="w-9 h-9 flex items-center justify-center rounded-xl"
              style={{ background: '#76ABAE', color: '#061E30' }}>
              <Plus size={16} />
            </Link>
          )}
          {isMember && (
            <form action={leaveGroup.bind(null, group.id)}>
              <button type="submit" className="text-[11px] font-bold px-3.5 py-2 rounded-xl"
                style={{ background: '#0D3352', color: 'rgba(246,243,235,0.50)' }}>
                Salir
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Description */}
      {group.description && (
        <div className="px-4 py-4 max-w-2xl mx-auto">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.50)' }}>
            {group.description}
          </p>
        </div>
      )}

      {/* Programa de discipulado del grupo */}
      {program && (
        <div className="px-4 pb-4 max-w-2xl mx-auto">
          <Link
            href={`/educacion/discipulado/${program.slug}`}
            className="flex items-center gap-3 p-4 rounded-2xl transition hover:brightness-110"
            style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.20)' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(118,171,174,0.12)' }}>
              <GraduationCap size={17} style={{ color: '#76ABAE' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5"
                style={{ color: 'rgba(118,171,174,0.55)' }}>
                Programa de este grupo
              </p>
              <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{program.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.35)' }}>
                {program.discipleship_courses?.length ?? 0} curso{program.discipleship_courses?.length !== 1 ? 's' : ''}
              </p>
            </div>
            <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.25)' }} />
          </Link>
        </div>
      )}

      {/* Posts — solo visibles para miembros */}
      {!isMember ? (
        <div className="max-w-2xl mx-auto text-center py-24 px-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <Lock size={22} style={{ color: 'rgba(118,171,174,0.40)' }} />
          </div>
          <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>
            Acceso por invitación
          </p>
          <p className="text-sm leading-relaxed max-w-[240px] mx-auto" style={{ color: 'rgba(246,243,235,0.45)' }}>
            Este grupo es privado. Habla con tu líder para que te agreguen como miembro.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-24 px-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                <UsersRound size={24} style={{ color: 'rgba(118,171,174,0.40)' }} />
              </div>
              <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>
                Sin publicaciones aún
              </p>
              <Link href={`/app/nuevo-post?group=${group.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black mt-4"
                style={{ background: '#F6F3EB', color: '#061E30' }}>
                <Plus size={14} /> Primera publicación
              </Link>
            </div>
          ) : (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} currentUserId={user!.id} currentUserRole={currentUserRole} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
