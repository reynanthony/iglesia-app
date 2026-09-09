'use client'

import { useState } from 'react'
import { Flame, ThumbsUp, BookOpen, Sparkles, X } from 'lucide-react'
import { toggleReaction } from '@/app/actions/reactions'
import { hapticLight } from '@/lib/haptics'
import { MUTED, GOLD, INK } from '@/lib/gold-theme'

type ReactionType = 'orando' | 'amen' | 'edifico' | 'gracias'

interface Reaction { user_id: string; type: ReactionType }

const REACTIONS: {
  type: ReactionType
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>
  label: string
  activeColor: string
}[] = [
  { type: 'orando',  icon: Flame,    label: 'Orando',  activeColor: GOLD },
  { type: 'amen',    icon: ThumbsUp, label: 'Amén',    activeColor: INK },
  { type: 'edifico', icon: BookOpen, label: 'Edificó', activeColor: '#F59E0B' },
  { type: 'gracias', icon: Sparkles, label: 'Gracias', activeColor: '#F87171' },
]

export default function ReactionBar({
  postId,
  currentUserId,
  reactions: initialReactions,
  inline = false,
}: {
  postId: string
  currentUserId: string
  reactions: Reaction[]
  inline?: boolean
}) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions ?? [])
  const [pickerOpen, setPickerOpen] = useState(false)

  const myReaction = reactions.find(r => r.user_id === currentUserId)
  const totalCount = reactions.length

  const counts = REACTIONS.reduce(
    (acc, r) => ({ ...acc, [r.type]: reactions.filter(x => x.type === r.type).length }),
    {} as Record<ReactionType, number>,
  )

  const currentDef = myReaction ? REACTIONS.find(r => r.type === myReaction.type) : null

  async function handleSelect(type: ReactionType) {
    setPickerOpen(false)
    hapticLight()
    setReactions(prev => {
      const mine = prev.find(r => r.user_id === currentUserId)
      if (mine) {
        if (mine.type === type) return prev.filter(r => r.user_id !== currentUserId)
        return prev.map(r => r.user_id === currentUserId ? { ...r, type } : r)
      }
      return [...prev, { user_id: currentUserId, type }]
    })
    await toggleReaction(postId, type)
  }

  const Icon = currentDef?.icon ?? Flame

  /* ── Inline mode (horizontal, for PostCard feed) ── */
  if (inline) {
    return (
      <div className="relative flex items-center gap-1.5">
        <button
          onClick={() => setPickerOpen(p => !p)}
          className="flex items-center gap-1.5 transition-transform active:scale-90 motion-reduce:active:scale-100"
          aria-label="Reaccionar"
        >
          <Icon
            size={20}
            strokeWidth={1.8}
            style={{ color: myReaction ? (currentDef?.activeColor ?? GOLD) : MUTED }}
          />
          {totalCount > 0 && (
            <span className="text-xs font-bold"
              style={{ color: myReaction ? (currentDef?.activeColor ?? GOLD) : MUTED }}>
              {totalCount}
            </span>
          )}
        </button>
        {pickerOpen && (
          <>
            <button
              onClick={() => setPickerOpen(false)}
              aria-label="Cerrar reacciones"
              tabIndex={-1}
              className="fixed inset-0 z-40 w-full h-full"
              style={{ background: 'transparent', border: 'none', cursor: 'default' }}
            />
            <div className="absolute z-50 flex flex-row gap-1 p-2 rounded-2xl"
              style={{
                bottom: '32px', left: 0,
                background: 'rgba(11,45,71,0.55)', backdropFilter: 'blur(20px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 40px -14px rgba(0,0,0,0.6)',
              }}>
              {REACTIONS.map(r => {
                const RIcon = r.icon
                const isSelected = myReaction?.type === r.type
                return (
                  <button key={r.type} onClick={() => handleSelect(r.type)}
                    className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A2A]/50"
                    style={{ background: isSelected ? `${GOLD}26` : 'transparent' }}>
                    <RIcon size={18} strokeWidth={isSelected ? 2.5 : 1.8}
                      style={{ color: isSelected ? r.activeColor : MUTED }} />
                    <span className="text-[9px] font-bold leading-none"
                      style={{ color: isSelected ? r.activeColor : MUTED }}>
                      {r.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    )
  }

  /* ── TikTok vertical mode (ShortsCard) ── */
  return (
    <div className="relative flex flex-col items-center gap-0.5">
      {/* Main reaction button */}
      <button
        onClick={() => setPickerOpen(p => !p)}
        className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90 motion-reduce:active:scale-100"
        style={{
          background: myReaction ? `${currentDef?.activeColor ?? GOLD}30` : 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px) saturate(160%)',
          border: `1px solid ${myReaction ? `${currentDef?.activeColor ?? GOLD}70` : 'rgba(255,255,255,0.14)'}`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 8px 18px -6px rgba(0,0,0,0.5)',
        }}
        aria-label="Reaccionar"
      >
        <Icon
          size={22}
          strokeWidth={1.8}
          style={{ color: myReaction ? (currentDef?.activeColor ?? GOLD) : '#fff' }}
        />
      </button>
      {totalCount > 0 && (
        <span className="text-[11px] font-bold text-white leading-none">{totalCount}</span>
      )}

      {/* Reaction picker */}
      {pickerOpen && (
        <>
          {/* Backdrop */}
          <button
            onClick={() => setPickerOpen(false)}
            aria-label="Cerrar reacciones"
            tabIndex={-1}
            className="fixed inset-0 z-40 w-full h-full"
            style={{ background: 'transparent', border: 'none', cursor: 'default' }}
          />
          {/* Picker panel */}
          <div
            className="absolute z-50 flex flex-col gap-1.5 p-2 rounded-2xl"
            style={{
              right: '52px',
              bottom: 0,
              background: 'rgba(11,45,71,0.55)',
              backdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 40px -14px rgba(0,0,0,0.6)',
              minWidth: 130,
            }}
          >
            {REACTIONS.map(r => {
              const RIcon = r.icon
              const isSelected = myReaction?.type === r.type
              return (
                <button
                  key={r.type}
                  onClick={() => handleSelect(r.type)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition"
                  style={{
                    background: isSelected ? `${GOLD}26` : 'transparent',
                    color: isSelected ? r.activeColor : MUTED,
                  }}
                >
                  <RIcon
                    size={16}
                    strokeWidth={isSelected ? 2.5 : 1.8}
                    style={{ color: isSelected ? r.activeColor : MUTED, flexShrink: 0 }}
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold leading-none">{r.label}</p>
                    {counts[r.type] > 0 && (
                      <p className="text-[10px] mt-0.5 leading-none" style={{ color: MUTED }}>
                        {counts[r.type]}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
