'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Flag } from 'lucide-react'
import { toggleLike, createComment, reportPost } from '@/app/actions/posts'
import Link from 'next/link'
import CommentItem from '@/components/CommentItem'
import SocialEmbedCard from '@/components/SocialEmbedCard'
import { detectSocialEmbed } from '@/lib/social-embed'

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
    if (diff < 60) return 'ahora'
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
    return `hace ${Math.floor(diff / 86400)} d`
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
    <div
      style={{
        background: '#0A0A0A',
        borderBottom: '1px solid #1A1A1A',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        {post.profiles?.username ? (
          <Link href={`/app/perfil/${post.profiles.username}`} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
              style={{ background: '#1A1A1A', color: '#8A8A8A' }}
            >
              {post.profiles.avatar_url
                ? <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                : post.profiles.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight" style={{ color: '#F5F5F5' }}>{post.profiles.full_name}</p>
              <p className="text-xs" style={{ color: '#4D4D4D' }}>@{post.profiles.username}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
              style={{ background: '#1A1A1A', color: '#8A8A8A' }}
            >
              {post.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight" style={{ color: '#F5F5F5' }}>{post.profiles?.full_name ?? 'Usuario'}</p>
            </div>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg transition"
            style={{ color: '#4D4D4D' }}
          >
            <svg width="18" height="4" viewBox="0 0 18 4" fill="currentColor">
              <circle cx="2" cy="2" r="2"/><circle cx="9" cy="2" r="2"/><circle cx="16" cy="2" r="2"/>
            </svg>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div
                className="absolute right-0 top-full mt-1 rounded-xl shadow-xl z-20 overflow-hidden w-40"
                style={{ background: '#141414', border: '1px solid #2A2A2A' }}
              >
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
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left disabled:opacity-50 transition"
                  style={{ color: reported ? '#8A8A8A' : '#F87171' }}
                >
                  <Flag size={14} />
                  {reported ? 'Reportado' : 'Reportar'}
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

      {/* Contenido */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-sm leading-relaxed" style={{ color: '#F5F5F5' }}>
          {post.profiles?.username ? (
            <Link
              href={`/app/perfil/${post.profiles.username}`}
              className="font-bold mr-1.5"
              style={{ color: '#F5F5F5' }}
            >
              {post.profiles.username}
            </Link>
          ) : (
            <span className="font-bold mr-1.5">{post.profiles?.full_name ?? 'Usuario'}</span>
          )}
          {post.content}
        </p>
      </div>

      {/* Video embed (YouTube, Facebook, Instagram, TikTok) */}
      {(() => {
        const embed = detectSocialEmbed(post.content ?? '')
        return embed ? (
          <div className="px-4 pb-2 pt-1">
            <SocialEmbedCard embed={embed} />
          </div>
        ) : null
      })()}

      {/* Acciones */}
      <div className="flex items-center gap-5 px-4 py-3">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 transition active:scale-90"
          style={{ color: liked ? '#F87171' : '#4D4D4D' }}
        >
          <Heart size={20} strokeWidth={1.8} fill={liked ? 'currentColor' : 'none'} />
          {likesCount > 0 && (
            <span className="text-xs font-bold" style={{ color: liked ? '#F87171' : '#4D4D4D' }}>
              {likesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 transition active:scale-90"
          style={{ color: '#4D4D4D' }}
        >
          <MessageCircle size={20} strokeWidth={1.8} />
          {totalComments > 0 && (
            <span className="text-xs font-bold">{totalComments}</span>
          )}
        </button>

        <span className="text-xs ml-auto" style={{ color: '#2A2A2A' }}>
          {timeAgo(post.created_at)}
        </span>
      </div>

      {/* Comentarios */}
      {totalComments > 0 && !showComments && (
        <button
          onClick={() => setShowComments(true)}
          className="px-4 pb-3 text-xs font-bold transition"
          style={{ color: '#4D4D4D' }}
        >
          Ver {totalComments} comentario{totalComments !== 1 ? 's' : ''}
        </button>
      )}

      {showComments && topLevelComments.length > 0 && (
        <div className="px-4 pb-3 space-y-3">
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

      {showComments && (
        <form
          onSubmit={handleComment}
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderTop: '1px solid #1A1A1A' }}
        >
          <input
            name="content"
            placeholder="Añade un comentario…"
            required
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: '#F5F5F5' }}
          />
          <button
            type="submit"
            disabled={commenting}
            className="text-xs font-black uppercase tracking-wider disabled:opacity-50 transition"
            style={{ color: '#F5F5F5' }}
          >
            Publicar
          </button>
        </form>
      )}
    </div>
  )
}
