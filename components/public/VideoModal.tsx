'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, X } from 'lucide-react'
import { detectSocialEmbed } from '@/lib/social-embed'

export function VideoPlayButton({ url, label = 'Ver video' }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const embed = detectSocialEmbed(url)
  const embedSrc = embed
    ? embed.platform === 'youtube'
      ? embed.embedUrl + '?autoplay=1&rel=0'
      : embed.platform === 'vimeo'
      ? embed.embedUrl + '?autoplay=1'
      : null
    : null

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ color: 'rgba(246,243,235,0.88)' }}
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-full border border-white/30 hover:border-white/70 transition"
          style={{ background: 'rgba(255,255,255,0.10)' }}>
          <Play size={13} className="ml-0.5 text-white" />
        </span>
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(5,24,40,0.92)', backdropFilter: 'blur(8px)' }}
        >
          {/* Backdrop — botón invisible para cerrar con clic fuera */}
          <button
            onClick={() => { setOpen(false); triggerRef.current?.focus() }}
            aria-label="Cerrar reproductor"
            tabIndex={-1}
            className="absolute inset-0 w-full h-full"
            style={{ background: 'transparent', border: 'none', cursor: 'default' }}
          />

          <button
            ref={closeRef}
            onClick={() => { setOpen(false); triggerRef.current?.focus() }}
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}
            aria-label="Cerrar"
          >
            <X size={18} aria-hidden="true" />
          </button>

          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '16/9' }}
          >
            {embedSrc ? (
              <iframe
                src={embedSrc}
                title={label}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              />
            ) : (
              <video src={url} controls autoPlay className="w-full h-full bg-black" />
            )}
          </div>
        </div>
      )}
    </>
  )
}
