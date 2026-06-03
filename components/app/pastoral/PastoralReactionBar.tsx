'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ReactionType = 'orando' | 'amen' | 'edifico' | 'gracias'
interface Reaction { user_id: string; type: ReactionType }

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'orando',  emoji: '🙏', label: 'Orando'  },
  { type: 'amen',    emoji: '✝️',  label: 'Amén'    },
  { type: 'edifico', emoji: '📖', label: 'Edificó' },
  { type: 'gracias', emoji: '🕊️', label: 'Gracias'  },
]

export default function PastoralReactionBar({
  messageId, currentUserId, reactions: initial,
}: {
  messageId: string
  currentUserId: string
  reactions: Reaction[]
}) {
  const [reactions, setReactions] = useState<Reaction[]>(initial)
  const [loading, setLoading] = useState(false)

  const myReaction = reactions.find(r => r.user_id === currentUserId)

  const counts = REACTIONS.reduce(
    (acc, r) => ({ ...acc, [r.type]: reactions.filter(x => x.type === r.type).length }),
    {} as Record<ReactionType, number>,
  )

  async function handleReact(type: ReactionType) {
    if (loading) return
    setLoading(true)

    const supabase = createClient()
    if (myReaction?.type === type) {
      setReactions(p => p.filter(r => r.user_id !== currentUserId))
      await supabase.from('pastoral_message_reactions')
        .delete().eq('message_id', messageId).eq('user_id', currentUserId)
    } else if (myReaction) {
      setReactions(p => p.map(r => r.user_id === currentUserId ? { ...r, type } : r))
      await supabase.from('pastoral_message_reactions')
        .update({ type }).eq('message_id', messageId).eq('user_id', currentUserId)
    } else {
      setReactions(p => [...p, { user_id: currentUserId, type }])
      await supabase.from('pastoral_message_reactions')
        .insert({ message_id: messageId, user_id: currentUserId, type })
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {REACTIONS.map(r => {
        const isSelected = myReaction?.type === r.type
        const count = counts[r.type]
        return (
          <button
            key={r.type}
            onClick={() => handleReact(r.type)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95"
            style={{
              background: isSelected ? 'rgba(134,155,126,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isSelected ? 'rgba(134,155,126,0.35)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <span style={{ fontSize: 14 }}>{r.emoji}</span>
            {count > 0 && (
              <span className="text-[11px] font-bold"
                style={{ color: isSelected ? '#869B7E' : 'rgba(246,243,235,0.35)' }}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
