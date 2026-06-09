'use client'

import { Bell } from 'lucide-react'
import type { AnnouncementData } from './AnnouncementScreen'

interface Props {
  announcement: AnnouncementData
  hasBottomNav?: boolean
  onOpen: () => void
}

export default function AnnouncementFloat({ announcement, hasBottomNav, onOpen }: Props) {
  const bottomStyle = hasBottomNav
    ? 'calc(56px + env(safe-area-inset-bottom, 0px) + 16px)'
    : 'calc(env(safe-area-inset-bottom, 0px) + 20px)'

  return (
    <button
      onClick={onOpen}
      className="elm-scale-in fixed right-4 z-[9000] flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full"
      style={{
        bottom: bottomStyle,
        background: '#0B2D47',
        border: '1px solid rgba(118,171,174,0.35)',
        color: '#F6F3EB',
        WebkitTapHighlightColor: 'transparent',
        filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.55))',
      }}
    >
      <span className="relative flex-shrink-0">
        <Bell size={15} style={{ color: '#76ABAE' }} />
        <span
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
          style={{ background: '#F87171', boxShadow: '0 0 0 2px #0B2D47' }}
        />
      </span>
      <span
        className="text-xs font-bold"
        style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {announcement.title || 'Ver anuncio'}
      </span>
    </button>
  )
}
