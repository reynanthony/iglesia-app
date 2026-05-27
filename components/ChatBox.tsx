'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, ArrowDown } from 'lucide-react'

type Message = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: { full_name: string; username: string; avatar_url?: string | null } | null
}

export default function ChatBox({
  currentUserId,
  currentProfile
}: {
  currentUserId: string
  currentProfile: { full_name: string; username: string; avatar_url?: string | null }
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [atBottom, setAtBottom] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = useRef(createClient()).current
  const channelRef = useRef<any>(null)

  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(full_name, username, avatar_url)')
        .order('created_at', { ascending: true })
        .limit(50)
      if (data) setMessages(data as Message[])
    }
    loadMessages()

    const channel = supabase.channel('chat-room')
    channelRef.current = channel
    channel
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        setMessages((prev) => [...prev, payload as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    if (atBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    setAtBottom(nearBottom)
  }

  async function sendMsg() {
    const content = inputValue.trim()
    if (!content || sending) return
    setSending(true)
    setInputValue('')
    setAtBottom(true)

    const { data, error } = await supabase
      .from('messages')
      .insert({ user_id: currentUserId, content })
      .select()
      .single()

    if (!error && data) {
      const newMessage: Message = { ...data, profiles: currentProfile }
      channelRef.current?.send({
        type: 'broadcast',
        event: 'new_message',
        payload: newMessage,
      })
      setMessages((prev) => [...prev, newMessage])
    }
    setSending(false)
    inputRef.current?.focus()
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return 'Hoy'
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
    const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`
  }

  const grouped: Record<string, Message[]> = {}
  messages.forEach((msg) => {
    const key = new Date(msg.created_at).toDateString()
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(msg)
  })

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#0A0A0A' }}>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        style={{ padding: '12px 12px 0' }}
      >
        {messages.length === 0 && (
          <div className="flex justify-center mt-10">
            <span
              className="text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
              style={{ background: '#161614', color: '#4D4D4D' }}
            >
              Los mensajes son visibles solo para miembros
            </span>
          </div>
        )}

        {Object.entries(grouped).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            {/* Separador de fecha */}
            <div className="flex justify-center my-4">
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full"
                style={{ background: '#161614', color: '#4D4D4D' }}
              >
                {formatDate(msgs[0].created_at)}
              </span>
            </div>

            {msgs.map((msg, i) => {
              const isMe = msg.user_id === currentUserId
              const prevMsg = msgs[i - 1]
              const nextMsg = msgs[i + 1]
              const isFirst = !prevMsg || prevMsg.user_id !== msg.user_id
              const isLast = !nextMsg || nextMsg.user_id !== msg.user_id

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  style={{ marginBottom: isLast ? 8 : 2 }}
                >
                  {/* Avatar — solo para el último mensaje del grupo (otros) */}
                  {!isMe && (
                    <div className="w-7 flex-shrink-0 self-end">
                      {isLast ? (
                        <div
                          className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: '#1A1A1A', color: '#8A8A8A' }}
                        >
                          {msg.profiles?.avatar_url
                            ? <img src={msg.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                            : msg.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Burbuja */}
                  <div style={{ maxWidth: '70%' }}>
                    {/* Nombre (primera de grupo, otros) */}
                    {!isMe && isFirst && (
                      <p
                        className="text-[11px] font-bold mb-1"
                        style={{ color: '#8A8A8A', paddingLeft: 12 }}
                      >
                        {msg.profiles?.full_name}
                      </p>
                    )}

                    <div
                      className="px-3 py-2"
                      style={{
                        background: isMe
                          ? 'linear-gradient(135deg, #1B7A5E, #22A67A)'
                          : '#1A1510',
                        borderRadius: isFirst
                          ? isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                          : isLast
                            ? isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px'
                            : isMe ? '16px 4px 4px 16px' : '4px 16px 16px 4px',
                        border: isMe ? 'none' : '1px solid #2A2018',
                      }}
                    >
                      <div className="flex items-end gap-3">
                        <p className="text-sm leading-relaxed break-words flex-1" style={{ color: '#F5F5F5' }}>
                          {msg.content}
                        </p>
                        <span
                          className="text-[10px] flex-shrink-0 self-end whitespace-nowrap"
                          style={{ color: '#4D4D4D' }}
                        >
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        <div ref={bottomRef} style={{ height: 8 }} />
      </div>

      {/* Botón scroll to bottom */}
      {!atBottom && (
        <button
          onClick={() => { setAtBottom(true); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
          className="absolute right-4 flex items-center justify-center w-9 h-9 rounded-full transition"
          style={{
            bottom: 72,
            background: '#1A1A1A',
            border: '1px solid #2A2A2A',
            color: '#8A8A8A',
          }}
        >
          <ArrowDown size={16} />
        </button>
      )}

      {/* Input */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 py-3"
        style={{ borderTop: '1px solid #1A1A1A', background: '#0A0A0A' }}
      >
        <div
          className="flex-1 flex items-center gap-3 px-4 rounded-2xl"
          style={{
            background: '#111111',
            border: '1px solid #1A1A1A',
            minHeight: 48,
          }}
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
            placeholder="Escribe un mensaje…"
            autoComplete="off"
            className="flex-1 bg-transparent text-sm focus:outline-none py-3"
            style={{ color: '#F5F5F5' }}
          />
        </div>

        <button
          onClick={sendMsg}
          disabled={sending || !inputValue.trim()}
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition active:scale-95 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #1B7A5E, #22A67A)' }}
        >
          <Send size={18} style={{ color: 'white' }} />
        </button>
      </div>
    </div>
  )
}
