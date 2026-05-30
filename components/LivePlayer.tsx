'use client'

import { useState } from 'react'
import { Play, Radio } from 'lucide-react'

interface LivePlayerProps {
  url: string       // raw URL from site_config
  title?: string
}

function toEmbedUrl(url: string): string | null {
  if (!url) return null
  if (url.includes('/embed/')) return url

  // Standard video ID: watch?v=, live/ID, shorts/ID
  const byId = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (byId) return `https://www.youtube.com/embed/${byId[1]}?rel=0&modestbranding=1&playsinline=1`

  // Channel ID: /channel/UCxxxxxx
  const byChannelId = url.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]+)/)
  if (byChannelId) return `https://www.youtube.com/embed/live_stream?channel=${byChannelId[1]}&rel=0&modestbranding=1`

  // @username/live
  const byUsername = url.match(/youtube\.com\/@([^/?#]+)/)
  if (byUsername) return `https://www.youtube.com/embed/live_stream?user=${byUsername[1]}&rel=0&modestbranding=1`

  return null
}

export default function LivePlayer({ url, title }: LivePlayerProps) {
  const [playing, setPlaying] = useState(false)
  const embedUrl = toEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 py-20" style={{ background: '#0a0a0a' }}>
        <Radio size={28} className="text-red-400" />
        <p className="text-white font-bold text-sm">{title ?? 'Transmisión en vivo'}</p>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="text-[12px] font-bold px-5 py-2.5 rounded-xl"
          style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa' }}>
          Ver en YouTube →
        </a>
      </div>
    )
  }

  if (playing) {
    return (
      <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title={title ?? 'En vivo'}
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
      aria-label={`Ver en vivo: ${title ?? 'transmisión'}`}
    >
      {/* Dark background */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        {/* Pulsing live dot */}
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] px-4 py-2 rounded-full mb-2"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.30)' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-400" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
          </span>
          En vivo
        </span>

        {/* Play button */}
        <div className="flex items-center justify-center rounded-full shadow-2xl"
          style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.95)' }}>
          <Play size={30} style={{ color: '#111', marginLeft: 5 }} />
        </div>

        {title && (
          <p className="text-white font-bold text-sm px-6 text-center mt-2 line-clamp-1">{title}</p>
        )}
      </div>
    </button>
  )
}
