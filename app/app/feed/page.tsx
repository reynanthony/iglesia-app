import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { PenLine } from 'lucide-react'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, username')
    .eq('id', user!.id)
    .single()

  const { data: posts } = await supabase
  .from('posts')
  .select(`
    *,
    profiles(id, full_name, username, avatar_url),
    likes(id, user_id),
    comments(
      id, content, created_at, parent_id,
      profiles(full_name, username, avatar_url),
      comment_likes(id, user_id)
    )
  `)
  .order('created_at', { ascending: false })
  .limit(30)

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-xl mx-auto">

        {/* Quick post */}
        <Link href="/app/nuevo-post">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-500 ring-offset-2 ring-offset-black flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm">
                  {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-slate-500 text-sm">
              ¿Qué quieres compartir?
            </div>
            <PenLine size={20} className="text-amber-500 flex-shrink-0" />
          </div>
        </Link>

        {/* Posts */}
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-4">🙏</p>
            <p className="font-medium text-white">Sé el primero en publicar</p>
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