import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditProfileModal from '@/components/EditProfileModal'
import PostCard from '@/components/PostCard'

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header del perfil */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-2xl flex-shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                profile.full_name?.[0]?.toUpperCase() ?? 'U'
              )}
            </div>
            {/* Info */}
            <div>
              <h1 className="text-xl font-bold">{profile.full_name}</h1>
              <p className="text-slate-500 text-sm">@{profile.username}</p>
              <span className="inline-block mt-1 text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full capitalize">
                {profile.role}
              </span>
            </div>
          </div>

          {isOwner && <EditProfileModal profile={profile} />}
        </div>

        {profile.bio && (
          <p className="text-slate-300 text-sm mt-4 leading-relaxed">{profile.bio}</p>
        )}

        <div className="mt-4 pt-4 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            <span className="text-white font-semibold">{posts?.length ?? 0}</span> publicaciones
          </p>
        </div>
      </div>

      {/* Posts del usuario */}
      {!posts || posts.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-3xl mb-3">📝</p>
          <p className="text-sm">Sin publicaciones aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} currentUserId={user!.id} />
          ))}
        </div>
      )}
    </div>
  )
}