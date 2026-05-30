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

  if (playing) {
    return (
      <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title ?? 'Prédica'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="relative w-full bg-black block"
      style={{ paddingTop: '56.25%' }}
      onClick={() => setPlaying(true)}
      aria-label={`Reproducir: ${title ?? 'video'}`}
    >
      <img
        src={thumb}
        alt={title ?? ''}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.82 }}
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full shadow-2xl"
          style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.95)' }}
        >
          <Play size={30} style={{ color: '#111', marginLeft: 5 }} />
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}>
          <p className="text-white font-bold text-sm line-clamp-1 text-left">{title}</p>
        </div>
      )}
    </button>
  )
}
