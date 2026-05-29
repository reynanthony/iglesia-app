import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditProfileModal from '@/components/EditProfileModal'
import PostCard from '@/components/PostCard'

const roleMeta: Record<string, { label: string; color: string; bg: string }> = {
  admin:     { label: 'Administrador', color: '#F87171',                  bg: 'rgba(248,113,113,0.10)' },
  pastor:    { label: 'Pastor',        color: '#76ABAE',                  bg: 'rgba(118,171,174,0.12)' },
  moderador: { label: 'Moderador',     color: '#869B7E',                  bg: 'rgba(134,155,126,0.12)' },
  lider:     { label: 'Líder',         color: 'rgba(246,243,235,0.55)',   bg: 'rgba(246,243,235,0.06)' },
}

export default async function PerfilPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  if (!username || username === 'undefined') notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(id, full_name, username, avatar_url), likes(id, user_id), comments(id, content, created_at, profiles(full_name, username))')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  const isOwner = user?.id === profile.id
  const role = roleMeta[profile.role]
  const initial = profile.full_name?.[0]?.toUpperCase() ?? 'U'
  const postCount = posts?.length ?? 0

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* ── COVER AREA ── */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 50% 0%, rgba(118,171,174,0.06), transparent 70%)`,
          }} />

        <div className="relative max-w-xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-end justify-between gap-4">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center font-black text-2xl flex-shrink-0"
              style={{ background: '#0D3352', color: '#76ABAE', border: '2px solid #0D3352' }}
            >
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                : initial}
            </div>

            {isOwner && <EditProfileModal profile={profile} />}
          </div>

          {/* Identity */}
          <div className="mt-5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-black text-2xl tracking-tight" style={{ color: '#F6F3EB' }}>
                {profile.full_name}
              </h1>
              {role && (
                <span
                  className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                  style={{ background: role.bg, color: role.color }}
                >
                  {role.label}
                </span>
              )}
            </div>
            <p className="text-sm mt-1" style={{ color: 'rgba(246,243,235,0.40)' }}>@{profile.username}</p>

            {profile.bio && (
              <p className="text-sm mt-4 leading-relaxed max-w-sm" style={{ color: 'rgba(246,243,235,0.55)' }}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 pt-6" style={{ borderTop: '1px solid #0D3352' }}>
            <div>
              <p className="font-black text-xl leading-none" style={{ color: '#F6F3EB' }}>{postCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] mt-1" style={{ color: 'rgba(246,243,235,0.40)' }}>
                {postCount === 1 ? 'Publicación' : 'Publicaciones'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── POSTS ── */}
      <div className="max-w-xl mx-auto">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#0D3352', border: '1px solid #0D3352' }}>
              <span className="text-xl">📝</span>
            </div>
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.40)' }}>Sin publicaciones aún</p>
          </div>
        ) : (
          <div>
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} currentUserId={user!.id} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
