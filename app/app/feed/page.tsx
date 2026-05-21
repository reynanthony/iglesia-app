import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { PlusSquare } from 'lucide-react'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
  .from('posts')
  .select(`
    *,
    profiles(id, full_name, username),
    likes(id, user_id),
    comments(id, content, created_at, profiles(full_name, username))
  `)
  .order('created_at', { ascending: false })
  .limit(30)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Feed</h1>
        <Link
          href="/app/nuevo-post"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition"
        >
          <PlusSquare size={16} />
          Publicar
        </Link>
      </div>

      {/* Posts */}
      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-4">✝</p>
          <p className="font-medium">Sé el primero en publicar</p>
          <p className="text-sm mt-1">Comparte algo con la comunidad</p>
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