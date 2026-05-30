'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

interface VideoPlayerProps {
  ytId: string
  thumbnail?: string | null
  title?: string
}

export default function VideoPlayer({ ytId, thumbnail, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  const thumb = thumbnail ?? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
  const src   = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`

  if (playing) {
    return (
      <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={src}
          title={title ?? 'Prédica'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          // sandbox blocks YouTube from navigating parent window to app store
          sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
          style={{ border: 'none' }}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="relative w-full bg-black cursor-pointer group"
      style={{ paddingTop: '56.25%' }}
      onClick={() => setPlaying(true)}
      aria-label={`Reproducir: ${title ?? 'video'}`}
    >
      <img
        src={thumb}
        alt={title ?? ''}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.85 }}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full transition group-hover:scale-110 duration-200 shadow-2xl"
          style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.95)' }}
        >
          <Play size={28} style={{ color: '#1a1a1a', marginLeft: 4 }} />
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.70), transparent)' }}>
          <p className="text-white font-bold text-sm line-clamp-2 leading-tight">{title}</p>
        </div>
      )}
    </button>
  )
}
