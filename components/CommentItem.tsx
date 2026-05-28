'use client'

import { useState } from 'react'
import { Heart, CornerDownRight } from 'lucide-react'
import { toggleCommentLike, createReply } from '@/app/actions/posts'

export default function CommentItem({
  comment,
  postId,
  currentUserId,
  replies = [],
  depth = 0,
}: {
  comment: any
  postId: string
  currentUserId: string
  replies?: any[]
  depth?: number
}) {
  const [showReply, setShowReply] = useState(false)
  const [replying, setReplying] = useState(false)
  const [liked, setLiked] = useState(
    comment.comment_likes?.some((l: any) => l.user_id === currentUserId)
  )
  const [likesCount, setLikesCount] = useState(comment.comment_likes?.length ?? 0)

  async function handleLike() {
    setLiked(!liked)
    setLikesCount((c: number) => liked ? c - 1 : c + 1)
    await toggleCommentLike(comment.id)
  }

  async function handleReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setReplying(true)
    const formData = new FormData(form)
    formData.append('post_id', postId)
    formData.append('parent_id', comment.id)
    await createReply(formData)
    form.reset()
    setReplying(false)
    setShowReply(false)
  }

  return (
    <div className={depth > 0 ? 'ml-8 pl-3' : ''} style={depth > 0 ? { borderLeft: '1px solid #0D3352' } : {}}>
      <div className="flex gap-2 items-start group">

        {/* Avatar */}
        <div
          className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
          style={{ background: '#0D3352', color: '#76ABAE' }}
        >
          {comment.profiles?.avatar_url ? (
            <img src={comment.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            comment.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ color: '#F6F3EB' }}>
            <span className="font-semibold mr-1.5">{comment.profiles?.username}</span>
            {comment.content}
          </p>

          {/* Acciones */}
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs transition active:scale-95"
              style={{ color: liked ? '#F87171' : 'rgba(246,243,235,0.40)' }}
            >
              <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>

            {depth === 0 && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 text-xs transition"
                style={{ color: 'rgba(246,243,235,0.40)' }}
              >
                <CornerDownRight size={12} />
                Responder
              </button>
            )}
          </div>

          {/* Input respuesta */}
          {showReply && (
            <form onSubmit={handleReply} className="flex items-center gap-2 mt-2">
              <input
                name="content"
                placeholder={`Responder a ${comment.profiles?.username ? `@${comment.profiles.username}` : 'este usuario'}...`}
                required
                autoFocus
                className="flex-1 rounded-xl px-3 py-1.5 text-xs focus:outline-none transition"
                style={{
                  background: '#0B2D47',
                  border: '1px solid #0D3352',
                  color: '#F6F3EB',
                }}
              />
              <button
                type="submit"
                disabled={replying}
                className="font-semibold text-xs disabled:opacity-50"
                style={{ color: '#76ABAE' }}
              >
                {replying ? '...' : 'Enviar'}
              </button>
              <button
                type="button"
                onClick={() => setShowReply(false)}
                className="text-xs"
                style={{ color: 'rgba(246,243,235,0.40)' }}
              >
                Cancelar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Respuestas anidadas */}
      {replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              replies={[]}
              depth={1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
