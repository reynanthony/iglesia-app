'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const NEXT_CAMPAIGN = '__next__'

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^?&/]+)/)
  return m ? m[1] : null
}

function isVideoUrl(url: string | null): boolean {
  if (!url) return false
  return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url)
}

// Mismo enfoque que HeroVideo — cubre el contenedor manteniendo 16:9
function YTCover({ ytId }: { ytId: string }) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function fit() {
      const wrap = wrapRef.current; const frame = frameRef.current
      if (!wrap || !frame) return
      const { width: w, height: h } = wrap.getBoundingClientRect()
      frame.style.width  = `${Math.max(w, h * (16 / 9))}px`
      frame.style.height = `${Math.max(h, w * (9 / 16))}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <iframe
        ref={frameRef}
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1`}
        title="Video"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', border: 'none' }}
        allow="autoplay; encrypted-media"
      />
    </div>
  )
}

export interface AnnouncementData {
  id: string
  title: string
  description: string | null
  content_type: string
  priority: 'critical' | 'high' | 'normal'
  image_url: string | null
  video_url: string | null
  cta_label: string | null
  cta_destination: string | null
  show_frequency: string
}

const PRIORITY_CONFIG = {
  critical: { label: 'URGENTE',    color: '#F87171', bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.30)' },
  high:     { label: 'IMPORTANTE', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.30)'  },
  normal:   { label: 'ANUNCIO',    color: '#76ABAE', bg: 'rgba(118,171,174,0.15)', border: 'rgba(118,171,174,0.30)' },
}

const GRADIENT_FALLBACK: Record<string, string> = {
  critical:         'linear-gradient(160deg, #1a0a0a 0%, #2d0f0f 40%, #1a0505 100%)',
  high:             'linear-gradient(160deg, #0f1000 0%, #1f1a00 40%, #0a0f00 100%)',
  normal:           'linear-gradient(160deg, #061E30 0%, #0B2D47 50%, #061E30 100%)',
  pastoral_message: 'linear-gradient(160deg, #061E30 0%, #0a2040 40%, #061E30 100%)',
  event:            'linear-gradient(160deg, #0a0a1a 0%, #101030 40%, #06061E 100%)',
  live_invitation:  'linear-gradient(160deg, #1a0606 0%, #2d1010 40%, #1a0505 100%)',
}

interface Props {
  announcement: AnnouncementData
  onContinue: () => void
}

export default function AnnouncementScreen({ announcement, onContinue }: Props) {
  const router = useRouter()
  const pc     = PRIORITY_CONFIG[announcement.priority] ?? PRIORITY_CONFIG.normal
  const bg     = GRADIENT_FALLBACK[announcement.content_type] ?? GRADIENT_FALLBACK.normal

  const ytId     = getYouTubeId(announcement.video_url ?? '') || getYouTubeId(announcement.image_url ?? '')
  const videoUrl = isVideoUrl(announcement.image_url) ? announcement.image_url
                 : isVideoUrl(announcement.video_url) ? announcement.video_url
                 : null

  const isNext    = announcement.cta_destination === NEXT_CAMPAIGN
  const ctaTarget = isNext
    ? null
    : (announcement.cta_destination ?? null)
  const showCtaBtn = isNext || !!ctaTarget
  const ctaLabel   = announcement.cta_label ?? (isNext ? 'Ver siguiente →' : 'Más información')

  function handleCta() {
    if (isNext || !ctaTarget) { onContinue(); return }
    onContinue()
    if (ctaTarget.startsWith('http')) window.open(ctaTarget, '_blank')
    else router.push(ctaTarget)
  }

  return (
    <div className="elm-fade-in fixed inset-0 z-[9999] flex flex-col" style={{ background: '#000' }}>

      {/* Hero visual */}
      <div className="absolute inset-0">
        {ytId   ? <YTCover ytId={ytId} /> :
         videoUrl ? (
           <video src={videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
         ) : announcement.image_url ? (
           <img src={announcement.image_url} alt={announcement.title} className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full" style={{ background: bg }} />
         )}

        {/* Scrim */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.10) 30%, rgba(6,30,48,0.85) 65%, rgba(6,30,48,0.98) 100%)',
        }} />
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col justify-end flex-1 px-6"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 32px, 48px)' }}
      >
        <div className="elm-slide-up mb-5">
          <span
            className="text-[9px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full"
            style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}
          >
            {pc.label}
          </span>
        </div>

        <h1
          className="elm-slide-up elm-delay-1 font-black tracking-tight leading-[0.92] mb-4"
          style={{ fontSize: 'clamp(2rem, 8vw, 3.2rem)', color: '#F6F3EB' }}
        >
          {announcement.title}
        </h1>

        {announcement.description && (
          <p
            className="elm-slide-up elm-delay-2 text-sm leading-relaxed mb-8 max-w-sm"
            style={{ color: 'rgba(246,243,235,0.60)' }}
          >
            {announcement.description}
          </p>
        )}

        <div className="elm-slide-up elm-delay-3 space-y-3">
          {showCtaBtn && (
            <button
              onClick={handleCta}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-transform active:scale-[0.97]"
              style={{ background: '#F6F3EB', color: '#061E30' }}
            >
              {ctaLabel}
            </button>
          )}

          <button
            onClick={onContinue}
            className="w-full py-3.5 rounded-2xl font-bold text-sm transition-transform active:scale-[0.97]"
            style={{ background: 'rgba(246,243,235,0.08)', color: 'rgba(246,243,235,0.60)', border: '1px solid rgba(246,243,235,0.12)' }}
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  )
}
