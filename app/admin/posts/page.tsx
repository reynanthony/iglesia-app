import { createClient } from '@/lib/supabase/server'
import DeletePostButton from '@/components/admin/DeletePostButton'
import { Search, ImageIcon } from 'lucide-react'

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('*, profiles(full_name, username, avatar_url)')
    .order('created_at', { ascending: false })

  if (q) query = query.ilike('content', `%${q}%`)

  const { data: posts } = await query

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Publicaciones</h1>
        <p className="text-slate-500 text-sm mt-1">{posts?.length ?? 0} publicaciones</p>
      </div>

      {/* Búsqueda */}
      <form method="GET" className="flex items-center gap-3 bg-slate-900 border border-slate-800 focus-within:border-[#000000]/50 rounded-xl px-4 py-2.5 transition mb-6">
        <Search size={16} className="text-slate-500 flex-shrink-0" />
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Buscar en publicaciones..."
          className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
        />
      </form>

      <div className="space-y-3">
        {posts?.map((post: any) => (
          <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
                  {post.profiles?.avatar_url ? (
                    <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                      {post.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{post.profiles?.full_name}</p>
                    <p className="text-xs text-slate-500">@{post.profiles?.username}</p>
                    {post.image_url && (
                      <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                        <ImageIcon size={10} /> Imagen
                      </span>
                    )}
                    <p className="text-xs text-slate-600 ml-auto">
                      {new Date(post.created_at).toLocaleDateString('es-DO')}
                    </p>
                  </div>
                  {post.content && (
                    <p className="text-sm text-slate-300 line-clamp-2">{post.content}</p>
                  )}
                </div>
              </div>
              <DeletePostButton postId={post.id} />
            </div>

            {/* Imagen del post */}
            {post.image_url && (
              <img
                src={post.image_url}
                alt=""
                className="w-full object-cover max-h-48 border-t border-slate-800"
              />
            )}
          </div>
        ))}

        {(!posts || posts.length === 0) && (
          <div className="py-16 text-center text-slate-500 text-sm">
            No se encontraron publicaciones
          </div>
        )}
      </div>
    </div>
  )
}