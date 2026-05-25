import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditProfileModal from '@/components/EditProfileModal'
import PostCard from '@/components/PostCard'

const roleMeta: Record<string, { label: string; color: string; bg: string }> = {
  admin:     { label: 'Administrador', color: '#f87171',  bg: 'rgba(239,68,68,0.08)' },
  pastor:    { label: 'Pastor',        color: '#111111',  bg: 'rgba(0,0,0,0.08)' },
  moderador: { label: 'Moderador',     color: '#000000',  bg: 'rgba(0,0,0,0.08)' },
  lider:     { label: 'Líder',         color: '#888888',  bg: 'rgba(128,128,128,0.08)' },
}

export default async function PerfilPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
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
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── COVER AREA ── */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #181818' }}>
        {/* Ambient glow based on role */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${role ? role.color + '10' : 'rgba(0,0,0,0.06)'}, transparent 70%)`,
          }} />

        <div className="relative max-w-xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-end justify-between gap-4">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center font-black text-2xl flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.12)', color: '#000000', border: '2px solid rgba(0,0,0,0.20)' }}
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
              <h1 className="font-black text-2xl tracking-tight" style={{ color: '#F5F5F5' }}>
                {profile.full_name}
              </h1>
              {role && (
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                  style={{ background: role.bg, color: role.color }}
                >
                  {role.label}
                </span>
              )}
            </div>
            <p className="text-sm mt-1" style={{ color: '#4D4D4D' }}>@{profile.username}</p>

            {profile.bio && (
              <p className="text-sm mt-4 leading-relaxed max-w-sm" style={{ color: '#8A8A8A' }}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 pt-6" style={{ borderTop: '1px solid #181818' }}>
            <div>
              <p className="font-black text-xl leading-none" style={{ color: '#F5F5F5' }}>{postCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] mt-1" style={{ color: '#4D4D4D' }}>
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
              style={{ background: '#161614', border: '1px solid #1A1A1A' }}>
              <span className="text-xl">📝</span>
            </div>
            <p className="text-sm" style={{ color: '#4D4D4D' }}>Sin publicaciones aún</p>
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
