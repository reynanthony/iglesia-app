import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeletePostButton from '@/components/admin/DeletePostButton'
import PinPostButton from '@/components/admin/PinPostButton'
import { Search, ImageIcon, Pin, Plus, Pencil } from 'lucide-react'
import { CARD, BORDER, MUTED, GOLD, GOLD_INK } from '@/lib/gold-theme'

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
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Publicaciones</h1>
          <p className="text-[rgba(139,146,162,0.68)] text-sm mt-1">{posts?.length ?? 0} publicaciones</p>
        </div>
        <Link href="/admin/posts/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black flex-shrink-0"
          style={{ background: GOLD, color: GOLD_INK }}>
          <Plus size={14} /> Nueva publicación
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form method="GET" className="flex-1 flex items-center gap-3 bg-[#181A22] border border-[#292E3B] rounded-xl px-4 py-2.5">
          <Search size={16} className="text-[rgba(139,146,162,0.68)] flex-shrink-0" />
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Buscar en publicaciones..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-[rgba(139,146,162,0.55)] focus:outline-none"
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
                  isActive ? 'bg-[#C79A2A] text-[#14140F]' : 'bg-[#181A22] border border-[#292E3B] text-[rgba(139,146,162,0.72)]'
                }`}>
                {f.id === 'pinned' && <Pin size={11} />}
                {f.label}
              </a>
            )
          })}
        </div>
      </div>

      <div className="space-y-2.5 md:space-y-3">
        {posts?.map((post: any) => (
          <div key={post.id}
            className="bg-[#181A22] border rounded-xl md:rounded-2xl overflow-hidden transition"
            style={{ borderColor: post.pinned ? `${GOLD}33` : '' }}>
            <div className="p-3.5 md:p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-[#292E3B] flex-shrink-0">
                  {post.profiles?.avatar_url ? (
                    <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[rgba(139,146,162,0.70)]">
                      {post.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    {post.pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: BORDER, color: GOLD }}>
                        <Pin size={9} /> Fijado
                      </span>
                    )}
                    <p className="text-sm font-semibold">{post.profiles?.full_name}</p>
                    <p className="text-xs text-[rgba(139,146,162,0.68)]">@{post.profiles?.username}</p>
                    {post.image_url && (
                      <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                        <ImageIcon size={10} /> Imagen
                      </span>
                    )}
                    <p className="text-xs text-[rgba(139,146,162,0.55)] ml-auto">
                      {new Date(post.created_at).toLocaleDateString('es-DO')}
                    </p>
                  </div>
                  {post.content && (
                    <p className="text-sm text-[rgba(139,146,162,0.70)] line-clamp-2">{post.content}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2.5 justify-end">
                <Link href={`/admin/posts/${post.id}/editar`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
                  style={{ background: CARD, color: MUTED, border: `1px solid ${BORDER}` }}>
                  <Pencil size={12} /><span className="hidden md:inline">Editar</span>
                </Link>
                <PinPostButton postId={post.id} pinned={post.pinned} />
                <DeletePostButton postId={post.id} />
              </div>
            </div>

            {post.image_url && (
              <img src={post.image_url} alt="" className="w-full object-cover max-h-48 border-t border-[#292E3B]" />
            )}
          </div>
        ))}

        {(!posts || posts.length === 0) && (
          <div className="py-16 text-center text-[rgba(139,146,162,0.68)] text-sm">
            No se encontraron publicaciones
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
