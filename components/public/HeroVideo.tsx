'use client'

import { useEffect, useRef } from 'react'
import { detectSocialEmbed } from '@/lib/social-embed'

function YTCover({ ytId, opacity }: { ytId: string; opacity: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function fit() {
      const wrap = wrapRef.current
      const frame = frameRef.current
      if (!wrap || !frame) return
      const { width: w, height: h } = wrap.getBoundingClientRect()
      // Size the iframe so it covers the container at 16:9
      const iw = Math.max(w, h * (16 / 9))
      const ih = Math.max(h, w * (9 / 16))
      frame.style.width  = `${iw}px`
      frame.style.height = `${ih}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <iframe
        ref={frameRef}
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1`}
        title="Video de fondo"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', border: 'none' }}
        allow="autoplay; encrypted-media"
      />
    </div>
  )
}

export function HeroVideo({ url, opacity = 0.60 }: { url: string; opacity?: number }) {
  const embed = detectSocialEmbed(url)

  if (embed?.platform === 'youtube') {
    const ytId = embed.embedUrl.replace('https://www.youtube.com/embed/', '').split('?')[0]
    return <YTCover ytId={ytId} opacity={opacity} />
  }

  if (embed?.platform === 'vimeo') {
    const vimeoId = embed.embedUrl.replace('https://player.vimeo.com/video/', '')
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
          title="Video de fondo"
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          allow="autoplay; encrypted-media"
        />
      </div>
    )
  }

  // Direct file URL (mp4, webm, etc.)
  return (
    <video autoPlay muted loop playsInline
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity }}>
      <source src={url} type="video/mp4" />
      <source src={url} type="video/webm" />
    </video>
  )
}
