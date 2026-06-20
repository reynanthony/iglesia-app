'use client'

import { useEffect, useRef, useState } from 'react'
import { detectSocialEmbed } from '@/lib/social-embed'

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])
  return mobile
}

// ── YouTube ──────────────────────────────────────────────────────
function YTCover({ ytId, opacity, fallbackUrl }: { ytId: string; opacity: number; fallbackUrl?: string }) {
  const isMobile = useIsMobile()
  const wrapRef  = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [src, setSrc]               = useState('')
  const [thumbOpacity, setThumbOpacity] = useState(1)

  // Resize para que el iframe cubra todo en 16:9 (solo desktop)
  useEffect(() => {
    if (isMobile) return
    function fit() {
      const wrap  = wrapRef.current
      const frame = frameRef.current
      if (!wrap || !frame) return
      const { width: w, height: h } = wrap.getBoundingClientRect()
      const iw = Math.max(w, h * (16 / 9)) * 1.05
      const ih = Math.max(h, w * (9 / 16)) * 1.05
      frame.style.width  = `${iw}px`
      frame.style.height = `${ih}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

    const origin = encodeURIComponent(window.location.origin)
    const ytUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1&disablekb=1&fs=0&enablejsapi=1&origin=${origin}`

    const t1       = setTimeout(() => setSrc(ytUrl), 500)
    const fallback = setTimeout(() => setThumbOpacity(0), 10000)
    let playTimer: ReturnType<typeof setTimeout>

    function onMsg(e: MessageEvent) {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data?.event === 'onReady') {
          frameRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }), '*'
          )
        }
        if (data?.event === 'onStateChange') {
          const s = data.info
          if (s === 0 || s === 3) { clearTimeout(playTimer); setThumbOpacity(1) }
          if (s === 1) {
            clearTimeout(fallback); clearTimeout(playTimer)
            playTimer = setTimeout(() => setThumbOpacity(0), 500)
          }
        }
      } catch { /* ignorar */ }
    }

    window.addEventListener('message', onMsg)
    return () => {
      clearTimeout(t1); clearTimeout(fallback); clearTimeout(playTimer)
      window.removeEventListener('message', onMsg)
    }
  }, [ytId, isMobile])

  const thumbUrl = fallbackUrl || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {isMobile ? (
        /* Mobile: imagen estática en vez del iframe */
        <img src={thumbUrl} alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center" />
      ) : (
        <>
          <iframe
            ref={frameRef}
            src={src}
            title="Video de fondo"
            allow="autoplay; encrypted-media"
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              border: 'none',
              width: '100%', height: '100%',
            }}
          />
          {/* Bloqueador de clicks */}
          <div className="absolute inset-0" style={{ zIndex: 5, pointerEvents: 'auto', cursor: 'default', background: 'transparent' }} />
          {/* Cover/thumbnail — se desvanece cuando el video corre */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 10,
              pointerEvents: 'none',
              backgroundImage: `url(${thumbUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#000',
              opacity: thumbOpacity,
              transition: 'opacity 1.5s ease',
              transform: 'translateZ(0)',
            }}
          />
        </>
      )}
    </div>
  )
}

// ── Vimeo ─────────────────────────────────────────────────────────
function VimeoCover({ vimeoId, opacity, fallbackUrl }: { vimeoId: string; opacity: number; fallbackUrl?: string }) {
  const isMobile = useIsMobile()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {isMobile && fallbackUrl ? (
        /* Mobile: imagen estática */
        <img src={fallbackUrl} alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center" />
      ) : (
        /* Desktop: iframe con cover correcto */
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
          title="Video de fondo"
          allow="autoplay; encrypted-media"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            /* Truco de cover para iframes 16:9 */
            width: 'calc(177.78vh)',
            height: 'calc(56.25vw)',
            minWidth: '100%',
            minHeight: '100%',
            border: 'none',
          }}
          loading="eager"
        />
      )}
    </div>
  )
}

// ── Export principal ───────────────────────────────────────────────
export function HeroVideo({
  url,
  opacity = 0.60,
  fallbackUrl,
}: {
  url: string
  opacity?: number
  fallbackUrl?: string
}) {
  const embed = detectSocialEmbed(url)

  if (embed?.platform === 'youtube') {
    const ytId = embed.embedUrl.replace('https://www.youtube.com/embed/', '').split('?')[0]
    return <YTCover ytId={ytId} opacity={opacity} fallbackUrl={fallbackUrl} />
  }

  if (embed?.platform === 'vimeo') {
    const vimeoId = embed.embedUrl.replace('https://player.vimeo.com/video/', '')
    return <VimeoCover vimeoId={vimeoId} opacity={opacity} fallbackUrl={fallbackUrl} />
  }

  // Video directo (mp4, webm) — object-cover funciona bien en mobile
  return (
    <video autoPlay muted loop playsInline preload="auto"
      className="absolute inset-0 w-full h-full object-cover object-center"
      style={{ opacity }}>
      <source src={url} type="video/mp4" />
      <source src={url} type="video/webm" />
    </video>
  )
}
