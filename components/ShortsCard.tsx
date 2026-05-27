'use client'

import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, X, Share2, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { toggleLike, createComment } from '@/app/actions/posts'
import { detectSocialEmbed, getAutoplayUrl, PLATFORM_LABEL } from '@/lib/social-embed'
import CommentItem from '@/components/CommentItem'

function useSaved(postId: string) {
  const key = 'saved-posts'
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(key) ?? '[]')
      setSaved(list.includes(postId))
    } catch { /* ignore */ }
  }, [postId])

  function toggle() {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(key) ?? '[]')
      const next = list.includes(postId) ? list.filter(id => id !== postId) : [...list, postId]
      localStorage.setItem(key, JSON.stringify(next))
      setSaved(next.includes(postId))
    } catch { /* ignore */ }
  }

  return { saved, toggle }
}

export default function ShortsCard({
  post,
  currentUserId,
}: {
  post: any
  currentUserId: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [liked, setLiked] = useState(
    post.likes?.some((l: any) => l.user_id === currentUserId) ?? false,
  )
  const [likesCount, setLikesCount] = useState(post.likes?.length ?? 0)
  const [showComments, setShowComments] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [tapLike, setTapLike] = useState(false)
  const [tapSave, setTapSave] = useState(false)
  const { saved, toggle: toggleSave } = useSaved(post.id)

  const embed = detectSocialEmbed(post.content ?? '')
  const hasMedia = !!(embed || post.image_url)
  const topLevel = post.comments?.filter((c: any) => !c.parent_id) ?? []
  const totalComments = post.comments?.length ?? 0

  const username  = post.profiles?.username  as string | null
  const fullName  = (post.profiles?.full_name ?? 'Usuario') as string
  const avatarUrl = post.profiles?.avatar_url as string | null
  const initial   = fullName[0]?.toUpperCase() ?? 'U'
  const profileHref = username ? `/app/perfil/${username}` : '#'

  /* ── IntersectionObserver: autoplay cuando el card es visible ── */
  useEffect(() => {
    if (!embed) return
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.intersectionRatio >= 0.7),
      { threshold: 0.7 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [embed])

  function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (s < 60)    return 'ahora'
    if (s < 3600)  return `${Math.floor(s / 60)} min`
    if (s < 86400) return `${Math.floor(s / 3600)} h`
    return `${Math.floor(s / 86400)} d`
  }

  async function handleLike() {
    setLiked((p: boolean) => !p)
    setLikesCount((c: number) => liked ? c - 1 : c + 1)
    setTapLike(true)
    setTimeout(() => setTapLike(false), 400)
    await toggleLike(post.id)
  }

  async function handleShare() {
    const text = post.content?.slice(0, 100) ?? ''
    const url  = `${window.location.origin}/app/feed`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Publicación', text, url })
        return
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url)
    } catch { /* ignore */ }
  }

  async function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCommenting(true)
    const fd = new FormData(e.currentTarget)
    fd.append('post_id', post.id)
    await createComment(fd)
    ;(e.currentTarget as HTMLFormElement).reset()
    setCommenting(false)
  }

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#000' }}
    >

      {/* ══════════════════════════════════════════
          FONDO / MEDIA
      ══════════════════════════════════════════ */}

      {embed ? (
        isVisible ? (
          <iframe
            key="playing"
            src={getAutoplayUrl(embed)}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: 'none' }}
          />
        ) : (
          /* Thumbnail silencioso mientras el card no es visible */
          <iframe
            key="idle"
            src={embed.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            style={{ border: 'none' }}
          />
        )
      ) : post.image_url ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${post.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(18px) brightness(0.45)',
              transform: 'scale(1.08)',
            }}
          />
          <img
            src={post.image_url}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'contain', zIndex: 1 }}
            draggable={false}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, #141414 0%, #0A0A0A 55%, #1A1A1A 100%)',
          }}
        />
      )}

      {/* ══════════════════════════════════════════
          GRADIENTES DE LEGIBILIDAD
      ══════════════════════════════════════════ */}

      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '55%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: 80,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
          zIndex: 2,
        }}
      />

      {/* ══════════════════════════════════════════
          TEXTO CENTRADO — solo si no hay media
      ══════════════════════════════════════════ */}
      {!hasMedia && (
        <div
          className="absolute inset-0 flex items-center justify-center px-8"
          style={{ zIndex: 3 }}
        >
          <p
            className="text-white font-bold text-center leading-snug"
            style={{
              fontSize: 'clamp(1.15rem, 4.5vw, 1.75rem)',
              textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            }}
          >
            {post.content}
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════
          BARRA DERECHA — acciones
      ══════════════════════════════════════════ */}
      <div
        className="absolute right-3 flex flex-col items-center gap-4"
        style={{ bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))', zIndex: 4 }}
      >
        {/* Avatar */}
        <Link href={profileHref}>
          <div
            className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center font-black text-sm"
            style={{ border: '2px solid rgba(255,255,255,0.8)', background: '#2A2A2A' }}
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              : <span className="text-white">{initial}</span>}
          </div>
        </Link>

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-0.5">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${tapLike ? 'animate-tap' : ''}`}
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          >
            <Heart
              size={22}
              strokeWidth={1.8}
              fill={liked ? '#F87171' : 'none'}
              style={{ color: liked ? '#F87171' : '#fff' }}
            />
          </div>
          {likesCount > 0 && (
            <span className="text-[11px] font-bold text-white leading-none">{likesCount}</span>
          )}
        </button>

        {/* Comentarios */}
        <button
          onClick={() => setShowComments(true)}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          >
            <MessageCircle size={22} strokeWidth={1.8} style={{ color: '#fff' }} />
          </div>
          {totalComments > 0 && (
            <span className="text-[11px] font-bold text-white leading-none">{totalComments}</span>
          )}
        </button>

        {/* Guardar */}
        <button
          onClick={() => { toggleSave(); setTapSave(true); setTimeout(() => setTapSave(false), 400) }}
          className="flex flex-col items-center gap-0.5"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${tapSave ? 'animate-tap' : ''}`}
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          >
            <Bookmark
              size={22}
              strokeWidth={1.8}
              fill={saved ? '#C9A96E' : 'none'}
              style={{ color: saved ? '#C9A96E' : '#fff' }}
            />
          </div>
        </button>

        {/* Compartir */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          >
            <Share2 size={20} strokeWidth={1.8} style={{ color: '#fff' }} />
          </div>
        </button>

        {/* Plataforma (solo si hay embed) */}
        {embed && (
          <a
            href={embed.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
          >
            <span className="text-[10px] font-bold leading-none" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {PLATFORM_LABEL[embed.platform]}
            </span>
          </a>
        )}
      </div>

      {/* ══════════════════════════════════════════
          INFO INFERIOR IZQUIERDA — autor + texto
      ══════════════════════════════════════════ */}
      <div
        className="absolute left-0 right-16 px-4"
        style={{ bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))', zIndex: 4 }}
      >
        <Link href={profileHref} className="inline-flex items-center gap-2 mb-1.5">
          <span
            className="font-black text-white text-sm"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
          >
            {username ? `@${username}` : fullName}
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {timeAgo(post.created_at)}
          </span>
        </Link>

        {hasMedia && post.content && (
          <p
            className="text-sm leading-snug line-clamp-3"
            style={{
              color: 'rgba(255,255,255,0.88)',
              textShadow: '0 1px 8px rgba(0,0,0,0.8)',
            }}
          >
            {post.content}
          </p>
        )}
      </div>

      {/* ══════════════════════════════════════════
          HOJA DE COMENTARIOS
      ══════════════════════════════════════════ */}
      {showComments && (
        <div
          className="absolute inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowComments(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col"
            style={{
              background: '#111111',
              maxHeight: '70%',
              border: '1px solid #1E1E1E',
              borderBottom: 'none',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
              style={{ borderBottom: '1px solid #1E1E1E' }}
            >
              <p className="font-bold text-sm" style={{ color: '#F5F5F5' }}>
                {totalComments} {totalComments === 1 ? 'comentario' : 'comentarios'}
              </p>
              <button onClick={() => setShowComments(false)} style={{ color: '#4D4D4D' }}>
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 py-2">
              {topLevel.length === 0 ? (
                <p className="text-center py-10 text-sm" style={{ color: '#4D4D4D' }}>
                  Sin comentarios. ¡Sé el primero!
                </p>
              ) : (
                topLevel.map((c: any) => (
                  <CommentItem
                    key={c.id}
                    comment={c}
                    postId={post.id}
                    currentUserId={currentUserId}
                    replies={post.comments?.filter((r: any) => r.parent_id === c.id) ?? []}
                  />
                ))
              )}
            </div>

            <form
              onSubmit={handleComment}
              className="flex gap-2 px-4 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid #1E1E1E' }}
            >
              <input
                name="content"
                placeholder="Escribe un comentario…"
                required
                autoFocus
                className="flex-1 text-sm rounded-xl px-3 py-2.5 focus:outline-none"
                style={{
                  background: '#1A1A1A',
                  color: '#F5F5F5',
                  border: '1px solid #2A2A2A',
                }}
              />
              <button
                type="submit"
                disabled={commenting}
                className="px-4 py-2 rounded-xl text-xs font-black transition disabled:opacity-40"
                style={{ background: '#F5F5F5', color: '#0A0A0A' }}
              >
                {commenting ? '…' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
