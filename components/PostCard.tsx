'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Flag } from 'lucide-react'
import { toggleLike, createComment, reportPost } from '@/app/actions/posts'
import Link from 'next/link'
import CommentItem from '@/components/CommentItem'

export default function PostCard({ post, currentUserId }: { post: any, currentUserId: string }) {
  const [showMenu, setShowMenu] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [reported, setReported] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [liked, setLiked] = useState(post.likes?.some((l: any) => l.user_id === currentUserId))
  const [likesCount, setLikesCount] = useState(post.likes?.length ?? 0)

  const topLevelComments = post.comments?.filter((c: any) => !c.parent_id) ?? []
  const totalComments = post.comments?.length ?? 0

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

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <Link href={`/app/perfil/${post.profiles?.username}`} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#000000] ring-offset-2 ring-offset-black flex-shrink-0">
            {post.profiles?.avatar_url ? (
              <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#000000]/20 flex items-center justify-center text-[#000000] font-bold text-sm">
                {post.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">{post.profiles?.full_name}</p>
            <p className="text-slate-400 text-xs">@{post.profiles?.username}</p>
          </div>
        </Link>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="text-slate-400 p-1 hover:text-white transition">
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden w-44">
                <button
                  onClick={async () => {
                    if (reported) return
                    setReporting(true)
                    setShowMenu(false)
                    await reportPost(post.id, 'Contenido inapropiado')
                    setReported(true)
                    setReporting(false)
                  }}
                  disabled={reporting || reported}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-slate-800 transition text-left disabled:opacity-50"
                >
                  <Flag size={14} className={reported ? 'text-[#000000]' : 'text-slate-400'} />
                  <span className={reported ? 'text-[#000000]' : 'text-slate-300'}>
                    {reported ? 'Reportado' : 'Reportar post'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Imagen */}
      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full object-cover" />
      )}

      {/* Botones */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="transition active:scale-90">
            <Heart size={26} className={liked ? 'text-red-500 fill-red-500' : 'text-white'} strokeWidth={1.8} />
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
        <p className="px-3 pb-1 text-sm font-semibold text-white">{likesCount} me gusta</p>
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
      {totalComments > 0 && !showComments && (
        <button onClick={() => setShowComments(true)} className="px-3 pb-2 text-slate-500 text-sm">
          Ver los {totalComments} comentarios
        </button>
      )}

      {/* Comentarios expandidos */}
      {showComments && topLevelComments.length > 0 && (
        <div className="px-3 pb-2 space-y-3">
          {topLevelComments.map((comment: any) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={post.id}
              currentUserId={currentUserId}
              replies={post.comments.filter((c: any) => c.parent_id === comment.id)}
            />
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
            className="text-[#000000] font-semibold text-sm disabled:opacity-50"
          >
            Publicar
          </button>
        </form>
      )}
    </div>
  )
}