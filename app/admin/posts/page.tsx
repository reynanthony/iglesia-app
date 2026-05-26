import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeletePostButton from '@/components/admin/DeletePostButton'
import PinPostButton from '@/components/admin/PinPostButton'
import { Search, ImageIcon, Pin, Plus, Pencil } from 'lucide-react'

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  const { q, filter } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('*, profiles(full_name, username, avatar_url)')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (q) query = query.ilike('content', `%${q}%`)
  if (filter === 'pinned') query = query.eq('pinned', true)

  const { data: posts } = await query

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Publicaciones</h1>
          <p className="text-slate-500 text-sm mt-1">{posts?.length ?? 0} publicaciones</p>
        </div>
        <Link href="/admin/posts/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black flex-shrink-0"
          style={{ background: '#F5F5F5' }}>
          <Plus size={14} /> Nueva publicación
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form method="GET" className="flex-1 flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-slate-500 flex-shrink-0" />
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Buscar en publicaciones..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
          />
          {filter && <input type="hidden" name="filter" value={filter} />}
        </form>
        <div className="flex gap-2">
          {[
            { id: '',       label: 'Todos' },
            { id: 'pinned', label: 'Fijados' },
          ].map(f => {
            const isActive = filter === f.id || (!filter && f.id === '')
            const href = f.id ? `/admin/posts?filter=${f.id}${q ? '&q=' + q : ''}` : `/admin/posts${q ? '?q=' + q : ''}`
            return (
              <a key={f.id} href={href}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive ? 'bg-white text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}>
                {f.id === 'pinned' && <Pin size={11} />}
                {f.label}
              </a>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        {posts?.map((post: any) => (
          <div key={post.id}
            className="bg-slate-900 border rounded-2xl overflow-hidden transition"
            style={{ borderColor: post.pinned ? '#2A3A2A' : '' }}>
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
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
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {post.pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: '#1A2A1A', color: '#6BCB6B' }}>
                        <Pin size={9} /> Fijado
                      </span>
                    )}
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

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/posts/${post.id}/editar`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition"
                  style={{ background: '#1A1A1A', color: '#5A5A5A', border: '1px solid #2A2A2A' }}>
                  <Pencil size={12} /> Editar
                </Link>
                <PinPostButton postId={post.id} pinned={post.pinned} />
                <DeletePostButton postId={post.id} />
              </div>
            </div>

            {post.image_url && (
              <img src={post.image_url} alt="" className="w-full object-cover max-h-48 border-t border-slate-800" />
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
