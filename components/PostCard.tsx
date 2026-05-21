'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { toggleLike, createComment } from '@/app/actions/posts'

export default function PostCard({ post, currentUserId }: { post: any, currentUserId: string }) {
  const [showComments, setShowComments] = useState(false)
  const [commenting, setCommenting] = useState(false)

  const liked = post.likes?.some((l: any) => l.user_id === currentUserId)
  const likesCount = post.likes?.length ?? 0
  const commentsCount = post.comments?.length ?? 0
  const initial = post.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'

  const timeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 60) return 'ahora'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
  }

  async function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setCommenting(true)
    const formData = new FormData(form)
    formData.append('post_id', post.id)
    await createComment(formData)
    form.reset()
    setCommenting(false)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold text-sm flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{post.profiles?.full_name ?? 'Usuario'}</p>
          <p className="text-slate-500 text-xs">@{post.profiles?.username} · {timeAgo(post.created_at)}</p>
        </div>
      </div>

      {/* Contenido */}
      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap mb-4">
        {post.content}
      </p>

      {/* Imagen si existe */}
      {post.image_url && (
        <img src={post.image_url} alt="" className="rounded-xl w-full mb-4 object-cover max-h-96" />
      )}

      {/* Acciones */}
      <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
        <button
          onClick={() => toggleLike(post.id)}
          className={`flex items-center gap-1.5 text-sm transition ${liked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'}`}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
          {likesCount > 0 && <span>{likesCount}</span>}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 text-sm transition"
        >
          <MessageCircle size={17} />
          {commentsCount > 0 && <span>{commentsCount}</span>}
        </button>
      </div>

      {/* Comentarios */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">

          {/* Lista de comentarios */}
          {post.comments?.length > 0 && (
            <div className="space-y-3 mb-3">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-2.5">
                  <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold text-xs flex-shrink-0">
                    {comment.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="bg-slate-800 rounded-xl px-3 py-2 flex-1">
                    <p className="text-xs font-semibold text-slate-300 mb-0.5">
                      {comment.profiles?.full_name ?? 'Usuario'}
                    </p>
                    <p className="text-sm text-slate-200">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input nuevo comentario */}
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              name="content"
              placeholder="Escribe un comentario..."
              required
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            <button
              type="submit"
              disabled={commenting}
              className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition disabled:opacity-50"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}

    </div>
  )
}