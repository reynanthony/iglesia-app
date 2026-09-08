'use client'

import { useState } from 'react'
import { Radio } from 'lucide-react'
import LiveChatBox from '@/components/app/LiveChatBox'
import LivePlayer from '@/components/LivePlayer'
import { GOLD, GOLD_INK, MUTED, BORDER, SURFACE } from '@/lib/gold-theme'

interface Props {
  liveUrl: string
  liveTitle: string
  currentUserId: string
  currentProfile: { full_name: string; username: string; avatar_url: string | null }
}

export default function LiveVideoChat({ liveUrl, liveTitle, currentUserId, currentProfile }: Props) {
  const [tab, setTab] = useState<'video' | 'chat'>('video')

  return (
    <div className="flex flex-col md:flex-row flex-1" style={{ minHeight: 0 }}>

      {/* Pestañas — solo en mobile, para no tener que hacer scroll entre video y chat */}
      <div className="md:hidden flex justify-center py-2.5 flex-shrink-0" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div
          className="inline-flex gap-1 rounded-full p-1"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          {(['video', 'chat'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition"
              style={tab === t
                ? { background: GOLD, color: GOLD_INK }
                : { color: MUTED }}
            >
              {t === 'video' ? 'En vivo' : 'Chat'}
            </button>
          ))}
        </div>
      </div>

      {/* Video player */}
      <div className={`md:flex-1 bg-black ${tab === 'chat' ? 'hidden md:block' : ''}`}>
        {liveUrl
          ? <LivePlayer url={liveUrl} title={liveTitle} />
          : <div className="flex items-center justify-center py-20">
              <Radio size={24} style={{ color: GOLD, opacity: 0.4 }} />
            </div>
        }
      </div>

      {/* Live chat */}
      <div className={`flex-col md:flex md:w-80 md:border-l ${tab === 'video' ? 'hidden md:flex' : 'flex'}`}
        style={{ borderColor: BORDER, minHeight: 320 }}>
        <div className="px-4 py-3 flex-shrink-0 hidden md:block" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: MUTED }}>Chat del culto</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <LiveChatBox currentUserId={currentUserId} currentProfile={currentProfile} />
        </div>
      </div>
    </div>
  )
}
