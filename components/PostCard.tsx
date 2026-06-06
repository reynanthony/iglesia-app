'use client'

import { useState } from 'react'
import { MessageCircle, Flag, Pencil, Trash2 } from 'lucide-react'
import { createComment, reportPost, deleteOwnPost, updateOwnPost } from '@/app/actions/posts'
import Link from 'next/link'
import CommentItem from '@/components/CommentItem'
import SocialEmbedCard from '@/components/SocialEmbedCard'
import { detectSocialEmbed } from '@/lib/social-embed'
import ReactionBar from '@/components/app/ReactionBar'

const PRIVILEGED_ROLES = ['admin', 'pastor', 'moderador', 'lider']

export default function PostCard({ post, currentUserId, currentUserRole }: { post: any, currentUserId: string, currentUserRole?: string }) {
  const [showMenu, setShowMenu] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [reported, setReported] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content ?? '')
  const [saving, setSaving] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const isOwn = post.user_id === currentUserId
  const canDelete = PRIVILEGED_ROLES.includes(currentUserRole ?? '')
  const [commenting, setCommenting] = useState(false)

  const topLevelComments = post.comments?.filter((c: any) => !c.parent_id) ?? []
  const totalComments = post.comments?.length ?? 0

  const timeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 60) return 'ahora'
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
    return `hace ${Math.floor(diff / 86400)} d`
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

  if (deleted) return null

  return (
    <div
      style={{
        background: '#061E30',
        borderBottom: '1px solid #0D3352',
      }}
    >
      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(6,30,48,0.85)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: '#061E30', border: '1px solid #0D3352' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #0D3352' }}>
              <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>Editar publicación</p>
              <button onClick={() => setEditing(false)} style={{ color: 'rgba(246,243,235,0.40)' }}>✕</button>
            </div>
            <div className="p-5">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={5}
                className="w-full bg-transparent text-sm focus:outline-none resize-none leading-relaxed"
                style={{ color: '#F6F3EB' }}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setEditing(false)}
                  className="text-sm px-4 py-2 rounded-xl transition"
                  style={{ color: 'rgba(246,243,235,0.40)' }}>
                  Cancelar
                </button>
                <button
                  disabled={saving || !editContent.trim()}
                  onClick={async () => {
                    setSaving(true)
                    await updateOwnPost(post.id, editContent)
                    setSaving(false)
                    setEditing(false)
                  }}
                  className="text-sm font-black px-5 py-2 rounded-xl transition disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #093C5D, #76ABAE)', color: '#F6F3EB' }}
                >
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        {post.profiles?.username ? (
          <Link href={`/app/perfil/${post.profiles.username}`} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
              style={{ background: '#0D3352', color: '#76ABAE' }}
            >
              {post.profiles.avatar_url
                ? <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                : post.profiles.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight" style={{ color: '#F6F3EB' }}>{post.profiles.full_name}</p>
              <p className="text-xs" style={{ color: 'rgba(246,243,235,0.40)' }}>@{post.profiles.username}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
              style={{ background: '#0D3352', color: '#76ABAE' }}
            >
              {post.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight" style={{ color: '#F6F3EB' }}>{post.profiles?.full_name ?? 'Usuario'}</p>
            </div>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg transition"
            style={{ color: 'rgba(246,243,235,0.40)' }}
          >
            <svg width="18" height="4" viewBox="0 0 18 4" fill="currentColor">
              <circle cx="2" cy="2" r="2"/><circle cx="9" cy="2" r="2"/><circle cx="16" cy="2" r="2"/>
            </svg>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div
                className="absolute right-0 top-full mt-1 rounded-xl shadow-xl z-20 overflow-hidden w-44"
                style={{ background: '#0B2D47', border: '1px solid #1A3D5C' }}
              >
                {isOwn && (
                  <button
                    onClick={() => { setEditing(true); setShowMenu(false) }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition"
                    style={{ color: '#F6F3EB' }}
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={async () => {
                      setShowMenu(false)
                      if (!confirm('¿Eliminar esta publicación?')) return
                      setDeleted(true)
                      const result = await deleteOwnPost(post.id)
                      if (result?.error) setDeleted(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition"
                    style={{ color: '#F87171' }}
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                )}
                {!isOwn && !canDelete && (
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
                    style={{ color: reported ? 'rgba(246,243,235,0.40)' : '#F87171' }}
                  >
                    <Flag size={14} />
                    {reported ? 'Reportado' : 'Reportar'}
                  </button>
                )}
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
        <p className="text-sm leading-relaxed" style={{ color: '#F6F3EB' }}>
          {post.profiles?.username ? (
            <Link
              href={`/app/perfil/${post.profiles.username}`}
              className="font-bold mr-1.5"
              style={{ color: '#F6F3EB' }}
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
      <div className="flex items-center gap-4 px-4 py-3">
        <ReactionBar
          postId={post.id}
          currentUserId={currentUserId}
          reactions={post.reactions ?? []}
          inline
        />

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 transition active:scale-90"
          style={{ color: 'rgba(246,243,235,0.40)' }}
        >
          <MessageCircle size={20} strokeWidth={1.8} />
          {totalComments > 0 && (
            <span className="text-xs font-bold">{totalComments}</span>
          )}
        </button>

        {post.category && (
          <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg ml-auto"
            style={{ background: 'rgba(118,171,174,0.12)', color: 'rgba(118,171,174,0.70)' }}>
            {post.category}
          </span>
        )}

        <span className="text-xs" style={{ color: 'rgba(246,243,235,0.30)', marginLeft: post.category ? 0 : 'auto' }}>
          {timeAgo(post.created_at)}
        </span>
      </div>

      {/* Comentarios */}
      {totalComments > 0 && !showComments && (
        <button
          onClick={() => setShowComments(true)}
          className="px-4 pb-3 text-xs font-bold transition"
          style={{ color: 'rgba(246,243,235,0.40)' }}
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
          style={{ borderTop: '1px solid #0D3352' }}
        >
          <input
            name="content"
            placeholder="Añade un comentario…"
            required
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: '#F6F3EB' }}
          />
          <button
            type="submit"
            disabled={commenting}
            className="text-xs font-black uppercase tracking-wider disabled:opacity-50 transition"
            style={{ color: '#F6F3EB' }}
          >
            Publicar
          </button>
        </form>
      )}
    </div>
  )
}
