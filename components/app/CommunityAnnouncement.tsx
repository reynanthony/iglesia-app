'use client'

import { useState, useEffect } from 'react'
import { X, Megaphone, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const STORAGE_KEY = 'cm_ann_dismissed'

export default function CommunityAnnouncement({
  text,
  id,
  href,
  ctaLabel,
}: {
  text: string
  id: string
  href?: string | null
  ctaLabel?: string | null
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (dismissed !== id) setVisible(true)
  }, [id])

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, id)
    setVisible(false)
  }

  if (!visible) return null

  const isExternal = href?.startsWith('http')

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 flex-shrink-0"
      style={{
        background: 'rgba(201,162,39,0.08)',
        borderBottom: '1px solid rgba(201,162,39,0.18)',
      }}
    >
      <Megaphone size={13} style={{ color: '#C9A227', flexShrink: 0 }} />
      <p className="text-[12px] font-medium flex-1 leading-snug line-clamp-2"
        style={{ color: 'rgba(246,243,235,0.75)' }}>
        {text}
      </p>
      {href && (
        isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-lg"
            style={{ color: '#C9A227', background: 'rgba(201,162,39,0.12)' }}
          >
            {ctaLabel || 'Ver'}<ChevronRight size={11} />
          </a>
        ) : (
          <Link
            href={href}
            className="flex-shrink-0 flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-lg"
            style={{ color: '#C9A227', background: 'rgba(201,162,39,0.12)' }}
          >
            {ctaLabel || 'Ver'}<ChevronRight size={11} />
          </Link>
        )
      )}
      <button onClick={dismiss} className="flex-shrink-0 p-1 rounded-lg transition"
        style={{ color: 'rgba(246,243,235,0.35)' }} aria-label="Cerrar anuncio">
        <X size={13} />
      </button>
    </div>
  )
}
