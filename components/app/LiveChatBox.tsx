'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send } from 'lucide-react'
import { GOLD, GOLD_INK, MUTED, BORDER, SURFACE, CARD } from '@/lib/gold-theme'

type Msg = { id: string; text: string; name: string; avatar: string | null; ts: number }

export default function LiveChatBox({
  currentUserId,
  currentProfile,
}: {
  currentUserId: string
  currentProfile: { full_name: string; username: string; avatar_url?: string | null }
}) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput]       = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase  = useRef(createClient()).current

  useEffect(() => {
    const channel = supabase.channel('live-service')
    channel
      .on('broadcast', { event: 'live_msg' }, ({ payload }) => {
        setMessages(prev => [...prev.slice(-199), payload as Msg])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text) return
    setInput('')
    const msg: Msg = {
      id:     crypto.randomUUID(),
      text,
      name:   currentProfile.full_name || currentProfile.username,
      avatar: currentProfile.avatar_url ?? null,
      ts:     Date.now(),
    }
    // Optimistic local
    setMessages(prev => [...prev.slice(-199), msg])
    await supabase.channel('live-service').send({ type: 'broadcast', event: 'live_msg', payload: msg })
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        style={{ scrollbarWidth: 'none' }}>
        {messages.length === 0 && (
          <p className="text-center text-[12px] py-8" style={{ color: MUTED }}>
            Sé el primero en saludar 👋
          </p>
        )}
        {messages.map(m => {
          const isMe = m.name === (currentProfile.full_name || currentProfile.username)
          return (
            <div key={m.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0"
                style={{ background: CARD, color: GOLD }}>
                {m.avatar
                  ? <img src={m.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                  : m.name[0]?.toUpperCase()}
              </div>
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                {!isMe && (
                  <p className="text-[10px] font-bold px-1" style={{ color: GOLD }}>
                    {m.name}
                  </p>
                )}
                <div className="px-3 py-2 rounded-2xl text-[13px] leading-snug"
                  style={isMe
                    ? { background: GOLD, color: GOLD_INK, borderBottomRightRadius: 4 }
                    : { background: SURFACE, border: `1px solid ${BORDER}`, color: '#F6F3EB', borderBottomLeftRadius: 4 }}>
                  {m.text}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
        <input
          id="chat-input"
          name="message"
          aria-label="Escribe un mensaje"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Escribe un mensaje…"
          maxLength={300}
          className="flex-1 bg-transparent text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]/50"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
            padding: '8px 14px',
            color: '#F6F3EB',
          }}
        />
        <button onClick={send} disabled={!input.trim()}
          aria-label="Enviar mensaje"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 disabled:opacity-30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]/50"
          style={{ background: GOLD }}>
          <Send size={14} style={{ color: GOLD_INK }} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
