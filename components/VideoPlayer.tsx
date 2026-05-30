'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

interface VideoPlayerProps {
  ytId: string
  thumbnail?: string | null
  title?: string
  autoplay?: boolean
}

export default function VideoPlayer({ ytId, thumbnail, title, autoplay = true }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  const thumb = thumbnail ?? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`

  if (playing) {
    return (
      <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${ytId}?${autoplay ? 'autoplay=1&' : ''}rel=0&modestbranding=1&playsinline=1`}
          title={title ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
    )
  }

  return (
    <div
      className="relative w-full cursor-pointer group bg-black"
      style={{ paddingTop: '56.25%' }}
      onClick={() => setPlaying(true)}
      role="button"
      aria-label={`Reproducir: ${title ?? 'video'}`}
    >
      {/* Thumbnail */}
      <img
        src={thumb}
        alt={title ?? ''}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.85 }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full transition group-hover:scale-110 duration-200"
          style={{
            width: 72,
            height: 72,
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.40)',
          }}
        >
          <Play size={28} style={{ color: '#1a1a1a', marginLeft: 4 }} />
        </div>
      </div>

      {/* Bottom gradient for title */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.70), transparent)' }}>
          <p className="text-white font-bold text-sm line-clamp-2 leading-tight">{title}</p>
        </div>
      )}
    </div>
  )
}
