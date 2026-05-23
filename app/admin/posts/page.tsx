import { createClient } from '@/lib/supabase/server'
import DeletePostButton from '@/components/admin/DeletePostButton'

export default async function AdminPostsPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(full_name, username)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Publicaciones</h1>
        <p className="text-slate-500 text-sm mt-1">{posts?.length ?? 0} publicaciones en total</p>
      </div>

      <div className="space-y-3">
        {posts?.map((post: any) => (
          <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold">{post.profiles?.full_name}</p>
                <p className="text-xs text-slate-500">@{post.profiles?.username}</p>
                <p className="text-xs text-slate-600 ml-auto">
                  {new Date(post.created_at).toLocaleDateString('es-DO')}
                </p>
              </div>
              <p className="text-sm text-slate-300 line-clamp-2">{post.content}</p>
            </div>
            <DeletePostButton postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  )
}