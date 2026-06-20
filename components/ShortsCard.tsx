'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Share2, Bookmark, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'
import Link from 'next/link'
import { createComment } from '@/app/actions/posts'
import { detectSocialEmbed, getAutoplayUrl, PLATFORM_LABEL } from '@/lib/social-embed'
import CommentItem from '@/components/CommentItem'
import ReactionBar from '@/components/app/ReactionBar'
import { openExternal } from '@/lib/open-external'

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
  const cardRef    = useRef<HTMLDivElement>(null)
  const iframeRef    = useRef<HTMLIFrameElement>(null)
  const touchStartY  = useRef(0)
  const didSwipe     = useRef(false)
  const [isVisible,     setIsVisible]     = useState(false)
  const [showComments,  setShowComments]  = useState(false)
  const [commenting,    setCommenting]    = useState(false)
  const [tapSave,       setTapSave]       = useState(false)
  const [isMuted,       setIsMuted]       = useState(true)
  const [isFullscreen,  setIsFullscreen]  = useState(false)
  const { saved, toggle: toggleSave } = useSaved(post.id)

  const embed     = detectSocialEmbed(post.content ?? '')
  const isYoutube = embed?.platform === 'youtube'
  const hasIframe = !!embed
  const hasMedia  = !!(embed || post.image_url)

  const topLevel     = post.comments?.filter((c: any) => !c.parent_id) ?? []
  const totalComments = post.comments?.length ?? 0

  const username   = post.profiles?.username  as string | null
  const fullName   = (post.profiles?.full_name ?? 'Usuario') as string
  const avatarUrl  = post.profiles?.avatar_url as string | null
  const initial    = fullName[0]?.toUpperCase() ?? 'U'
  const profileHref = username ? `/app/perfil/${username}` : '#'

  /* ── IntersectionObserver ─── */
  useEffect(() => {
    if (!embed) return
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio >= 0.7
        setIsVisible(visible)
        if (!visible) { setIsMuted(true); setIsFullscreen(false) }
      },
      { threshold: 0.7 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [embed])

  /* ── Toggle body class to hide header/nav when fullscreen ─── */
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('card-fullscreen')
      // Re-snap this card into view after the container resizes
      requestAnimationFrame(() => {
        cardRef.current?.parentElement?.scrollIntoView({ block: 'start', behavior: 'instant' })
      })
    } else {
      document.body.classList.remove('card-fullscreen')
    }
    return () => { document.body.classList.remove('card-fullscreen') }
  }, [isFullscreen])

  function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (s < 60)    return 'ahora'
    if (s < 3600)  return `${Math.floor(s / 60)} min`
    if (s < 86400) return `${Math.floor(s / 3600)} h`
    return `${Math.floor(s / 86400)} d`
  }

  function toggleMute() {
    const iframe = iframeRef.current
    if (!iframe) return
    const func = isMuted ? 'unMute' : 'mute'
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      'https://www.youtube.com',
    )
    setIsMuted(!isMuted)
  }

  async function handleShare() {
    const text = post.content?.slice(0, 100) ?? ''
    const url  = `${window.location.origin}/app/comunidad`
    if (navigator.share) {
      try { await navigator.share({ title: 'Publicación', text, url }); return }
      catch { /* cancelled */ }
    }
    try { await navigator.clipboard.writeText(url) } catch { /* ignore */ }
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

  /* ── Fullscreen: body class hides header/nav; card stays in snap flow ─── */
  const fullscreenStyle: React.CSSProperties = {}

  function handleCardTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
    didSwipe.current = false
  }

  function handleCardTouchEnd(e: React.TouchEvent) {
    if (Math.abs(touchStartY.current - e.changedTouches[0].clientY) > 10) {
      didSwipe.current = true
    }
  }

  function handleCardClick(e: React.MouseEvent) {
    if (didSwipe.current) { didSwipe.current = false; return }
    const target = e.target as HTMLElement
    if (target.closest('button, a, input, textarea')) return
    if (hasIframe || post.image_url) setIsFullscreen(f => !f)
  }

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#061E30', ...fullscreenStyle }}
      onTouchStart={handleCardTouchStart}
      onTouchEnd={handleCardTouchEnd}
      onClick={handleCardClick}
    >

      {/* ══ FONDO / MEDIA ══ */}

      {hasIframe && embed ? (
        isVisible ? (
          <iframe
            key="playing"
            ref={iframeRef}
            src={getAutoplayUrl(embed)}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            style={{ border: 'none' }}
          />
        ) : (
          <iframe
            key="idle"
            src={embed.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
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
          style={{ background: 'linear-gradient(160deg, #061E30 0%, #0B2D47 55%, #051828 100%)' }}
        />
      )}

      {/* ══ SCROLL OVERLAY — pan-y sobre iframes cross-origin ══ */}
      {hasIframe && (
        <div className="absolute inset-0" style={{ zIndex: 1, touchAction: 'pan-y' }} />
      )}

      {/* ══ GRADIENTES DE LEGIBILIDAD ══ */}
      <>
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '55%',
            background: 'linear-gradient(to top, rgba(6,30,48,0.88) 0%, rgba(6,30,48,0.5) 45%, transparent 100%)',
            zIndex: 2,
          }}
        />
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: 80,
            background: 'linear-gradient(to bottom, rgba(6,30,48,0.5), transparent)',
            zIndex: 2,
          }}
        />
      </>

      {/* ══ TEXTO CENTRADO — solo texto sin media ══ */}
      {!hasMedia && (
        <div
          className="absolute inset-0 flex items-center justify-center pl-8 pr-20 pb-32"
          style={{ zIndex: 3, pointerEvents: 'none' }}
        >
          <p
            className="text-white font-bold text-center leading-snug"
            style={{ fontSize: 'clamp(1.15rem, 4.5vw, 1.75rem)', textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}
          >
            {post.content}
          </p>
        </div>
      )}

      {/* ══ BOTÓN FULLSCREEN (esquina superior derecha) ══ */}
      {(hasIframe || post.image_url) && (
        <button
          onClick={() => setIsFullscreen(f => !f)}
          className="absolute active:scale-90 transition-transform"
          style={{ top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isFullscreen
            ? <Minimize2 size={16} strokeWidth={2} style={{ color: '#fff' }} />
            : <Maximize2 size={16} strokeWidth={2} style={{ color: '#fff' }} />
          }
        </button>
      )}

      {/* ══ BARRA DERECHA — acciones ══ */}
      <div
        className="absolute right-3 flex flex-col items-center gap-4"
        style={{ bottom: isFullscreen ? 'calc(24px + env(safe-area-inset-bottom, 0px))' : 'calc(72px + env(safe-area-inset-bottom, 0px))', zIndex: 10 }}
      >
        {/* Avatar */}
        <Link href={profileHref}>
          <div
            className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center font-black text-sm"
            style={{ border: '2px solid rgba(255,255,255,0.8)', background: '#0D3352' }}
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              : <span className="text-white">{initial}</span>}
          </div>
        </Link>

        {/* Volumen — YouTube visible */}
        {isYoutube && isVisible && (
          <button onClick={toggleMute} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: isMuted ? 'rgba(0,0,0,0.5)' : 'rgba(118,171,174,0.35)', backdropFilter: 'blur(6px)' }}
            >
              {isMuted
                ? <VolumeX size={20} strokeWidth={1.8} style={{ color: '#fff' }} />
                : <Volume2 size={20} strokeWidth={1.8} style={{ color: '#76ABAE' }} />
              }
            </div>
          </button>
        )}

        {/* Reacciones */}
        <ReactionBar postId={post.id} currentUserId={currentUserId} reactions={post.reactions ?? []} />

        {/* Comentarios */}
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
            <MessageCircle size={22} strokeWidth={1.8} style={{ color: '#fff' }} />
          </div>
          {totalComments > 0 && <span className="text-[11px] font-bold text-white leading-none">{totalComments}</span>}
        </button>

        {/* Guardar */}
        <button onClick={() => { toggleSave(); setTapSave(true); setTimeout(() => setTapSave(false), 400) }} className="flex flex-col items-center gap-0.5">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${tapSave ? 'animate-tap' : ''}`} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
            <Bookmark size={22} strokeWidth={1.8} fill={saved ? '#76ABAE' : 'none'} style={{ color: saved ? '#76ABAE' : '#fff' }} />
          </div>
        </button>

        {/* Compartir */}
        <button onClick={handleShare} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
            <Share2 size={20} strokeWidth={1.8} style={{ color: '#fff' }} />
          </div>
        </button>

        {/* Plataforma */}
        {embed && (
          <button onClick={() => openExternal(embed.originalUrl)} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
            <span className="text-[10px] font-bold leading-none" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {PLATFORM_LABEL[embed.platform]}
            </span>
          </button>
        )}
      </div>

      {/* ══ INFO INFERIOR IZQUIERDA ══ */}
      <div
        className="absolute left-0 right-16 px-4"
        style={{ bottom: isFullscreen ? 'calc(24px + env(safe-area-inset-bottom, 0px))' : 'calc(72px + env(safe-area-inset-bottom, 0px))', zIndex: 10 }}
      >
        <Link href={profileHref} className="inline-flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="font-black text-white text-sm" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            {username ? `@${username}` : fullName}
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {timeAgo(post.created_at)}
          </span>
          {post.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(118,171,174,0.25)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.35)' }}>
              {post.category}
            </span>
          )}
        </Link>
        {hasMedia && post.content && (
          <p className="text-sm leading-snug line-clamp-3"
            style={{ color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            {post.content}
          </p>
        )}
      </div>

      {/* ══ HOJA DE COMENTARIOS ══ */}
      {showComments && (
        <div className="absolute inset-0 z-50" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowComments(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col"
            style={{ background: '#061E30', maxHeight: 'min(70vh, calc(100dvh - 100px))', border: '1px solid #0D3352', borderBottom: 'none' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0" style={{ borderBottom: '1px solid #0D3352' }}>
              <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>
                {totalComments} {totalComments === 1 ? 'comentario' : 'comentarios'}
              </p>
              <button onClick={() => setShowComments(false)} style={{ color: 'rgba(246,243,235,0.40)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-4 py-2">
              {topLevel.length === 0 ? (
                <p className="text-center py-10 text-sm" style={{ color: 'rgba(246,243,235,0.40)' }}>
                  Sin comentarios. ¡Sé el primero!
                </p>
              ) : (
                topLevel.map((c: any) => (
                  <CommentItem key={c.id} comment={c} postId={post.id} currentUserId={currentUserId}
                    replies={post.comments?.filter((r: any) => r.parent_id === c.id) ?? []} />
                ))
              )}
            </div>
            <form onSubmit={handleComment} className="flex gap-2 px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid #0D3352' }}>
              <input
                name="content" placeholder="Escribe un comentario…" required autoFocus inputMode="text"
                className="flex-1 text-sm rounded-xl px-3 py-2.5 focus:outline-none"
                style={{ background: '#0B2D47', color: '#F6F3EB', border: '1px solid #0D3352' }}
              />
              <button type="submit" disabled={commenting}
                className="px-4 py-2 rounded-xl text-xs font-black transition disabled:opacity-40"
                style={{ background: '#F6F3EB', color: '#061E30' }}>
                {commenting ? '…' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
