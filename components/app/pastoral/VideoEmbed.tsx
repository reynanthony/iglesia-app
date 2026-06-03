'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

function toEmbed(url: string): string | null {
  if (!url) return null
  if (url.includes('/embed/')) return url
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&playsinline=1`
  return null
}

export default function VideoEmbed({ url, className = '' }: { url: string; className?: string }) {
  const [playing, setPlaying] = useState(false)
  const embedUrl = toEmbed(url)

  if (!embedUrl) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-[12px] font-bold px-4 py-2 rounded-xl transition ${className}`}
        style={{ background: 'rgba(118,171,174,0.12)', color: '#76ABAE' }}>
        <Play size={12} /> Ver video
      </a>
    )
  }

  const videoId = embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/)?.[1]
  const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null

  if (playing) {
    return (
      <div className={`relative rounded-xl overflow-hidden ${className}`} style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`${embedUrl}&autoplay=1`}
          title="Video pastoral"
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
      onClick={() => setPlaying(true)}
      className={`relative w-full rounded-xl overflow-hidden block ${className}`}
      style={{ paddingTop: '56.25%', background: '#0a0a0a' }}
      aria-label="Reproducir video"
    >
      {thumb && (
        <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.75 }} />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.95)' }}>
          <Play size={20} style={{ color: '#111', marginLeft: 3 }} />
        </div>
      </div>
    </button>
  )
}
