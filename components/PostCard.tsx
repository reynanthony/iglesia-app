'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react'
import { toggleLike, createComment } from '@/app/actions/posts'
import Link from 'next/link'

export default function PostCard({ post, currentUserId }: { post: any, currentUserId: string }) {
  const [showComments, setShowComments] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [liked, setLiked] = useState(post.likes?.some((l: any) => l.user_id === currentUserId))
  const [likesCount, setLikesCount] = useState(post.likes?.length ?? 0)

  const commentsCount = post.comments?.length ?? 0

  const timeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 60) return 'AHORA'
    if (diff < 3600) return `HACE ${Math.floor(diff / 60)} MIN`
    if (diff < 86400) return `HACE ${Math.floor(diff / 3600)} H`
    return `HACE ${Math.floor(diff / 86400)} D`
  }

  async function handleLike() {
    setLiked(!liked)
    setLikesCount((c: number) => liked ? c - 1 : c + 1)
    await toggleLike(post.id)
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
    <div className="bg-black border-b border-slate-800 md:border md:rounded-xl md:mb-4 md:overflow-hidden">

      {/* Header — igual que Instagram */}
      <div className="flex items-center justify-between px-3 py-3">
        <Link href={`/app/perfil/${post.profiles?.username}`} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-500 ring-offset-2 ring-offset-black flex-shrink-0">
            {post.profiles?.avatar_url ? (
              <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm">
                {post.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">{post.profiles?.full_name}</p>
            <p className="text-slate-400 text-xs">@{post.profiles?.username}</p>
          </div>
        </Link>
        <button className="text-slate-400 p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Imagen si existe */}
      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full object-cover" />
      )}

      {/* Botones de acción — igual que Instagram */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="transition active:scale-90">
            <Heart
              size={26}
              className={liked ? 'text-red-500 fill-red-500' : 'text-white'}
              strokeWidth={1.8}
            />
          </button>
          <button onClick={() => setShowComments(!showComments)} className="transition active:scale-90">
            <MessageCircle size={26} className="text-white" strokeWidth={1.8} />
          </button>
          <button className="transition active:scale-90">
            <Send size={24} className="text-white" strokeWidth={1.8} />
          </button>
        </div>
        <button className="transition active:scale-90">
          <Bookmark size={24} className="text-white" strokeWidth={1.8} />
        </button>
      </div>

      {/* Likes */}
      {likesCount > 0 && (
        <p className="px-3 pb-1 text-sm font-semibold text-white">
          {likesCount} {likesCount === 1 ? 'me gusta' : 'me gusta'}
        </p>
      )}

      {/* Caption */}
      <div className="px-3 pb-2">
        <span className="text-sm text-white">
          <Link href={`/app/perfil/${post.profiles?.username}`} className="font-semibold mr-2">
            {post.profiles?.username}
          </Link>
          {post.content}
        </span>
      </div>

      {/* Ver comentarios */}
      {commentsCount > 0 && !showComments && (
        <button
          onClick={() => setShowComments(true)}
          className="px-3 pb-2 text-slate-500 text-sm"
        >
          Ver los {commentsCount} comentarios
        </button>
      )}

      {/* Comentarios expandidos */}
      {showComments && post.comments?.length > 0 && (
        <div className="px-3 pb-2 space-y-2">
          {post.comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xs flex-shrink-0 mt-0.5">
                {comment.profiles?.avatar_url ? (
                  <img src={comment.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  comment.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'
                )}
              </div>
              <p className="text-sm text-white">
                <span className="font-semibold mr-1.5">{comment.profiles?.username}</span>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tiempo */}
      <p className="px-3 pb-2 text-slate-500 text-xs">{timeAgo(post.created_at)}</p>

      {/* Input comentario */}
      {showComments && (
        <form onSubmit={handleComment} className="flex items-center gap-3 px-3 py-2.5 border-t border-slate-800">
          <input
            name="content"
            placeholder="Añade un comentario..."
            required
            className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={commenting}
            className="text-amber-500 font-semibold text-sm disabled:opacity-50"
          >
            Publicar
          </button>
        </form>
      )}
    </div>
  )
}