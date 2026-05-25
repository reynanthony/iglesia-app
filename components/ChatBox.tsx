'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Smile, Paperclip, Mic, Send } from 'lucide-react'

type Message = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: { full_name: string; username: string; avatar_url?: string | null } | null
}

function CheckMarks() {
  return (
    <svg viewBox="0 0 18 18" className="w-4 h-3.5 inline-block ml-1 flex-shrink-0" fill="none">
      <path d="M1.5 9.5L6 14L11 7" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 14L17 4" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 9.5L9 14" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
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
  const bottomRef = useRef<HTMLDivElement>(null)
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMsg() {
    const content = inputValue.trim()
    if (!content || sending) return
    setSending(true)
    setInputValue('')

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

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return 'HOY'
    if (d.toDateString() === yesterday.toDateString()) return 'AYER'
    return d.toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
  }

  const grouped: Record<string, Message[]> = {}
  messages.forEach((msg) => {
    const key = new Date(msg.created_at).toDateString()
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(msg)
  })

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ backgroundColor: '#0b141a' }}
    >
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-3 py-2">

        {messages.length === 0 && (
          <div className="flex justify-center mt-8">
            <div className="bg-[#182229] text-slate-400 text-xs px-4 py-2 rounded-lg">
              Los mensajes son solo visibles para los miembros 🔒
            </div>
          </div>
        )}

        {Object.entries(grouped).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            <div className="flex justify-center my-3">
              <div className="bg-[#182229] text-slate-400 text-[11px] font-medium px-3 py-1 rounded-lg shadow">
                {formatDate(msgs[0].created_at)}
              </div>
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
                  className={`flex items-end gap-1.5 mb-0.5 ${isMe ? 'justify-end' : 'justify-start'} ${isLast ? 'mb-2' : ''}`}
                >
                  {/* Avatar */}
                  <div className="w-8 flex-shrink-0 self-end mb-1">
                    {!isMe && isLast && (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        {msg.profiles?.avatar_url ? (
                          <img src={msg.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#3B6FA0]/30 flex items-center justify-center text-[#2F5D8C] font-semibold text-xs">
                            {msg.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Burbuja */}
                  <div
                    className="relative max-w-[65%] md:max-w-[55%]"
                    style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))' }}
                  >
                    {/* Cola */}
                    {isFirst && (
                      <div
                        className="absolute top-0 w-0 h-0"
                        style={isMe ? {
                          right: '-8px',
                          borderLeft: '8px solid #005c4b',
                          borderBottom: '8px solid transparent',
                        } : {
                          left: '-8px',
                          borderRight: '8px solid #202c33',
                          borderBottom: '8px solid transparent',
                        }}
                      />
                    )}

                    {/* Contenido */}
                    <div
                      className="px-3 pt-1.5 pb-1"
                      style={{
                        backgroundColor: isMe ? '#005c4b' : '#202c33',
                        borderRadius: isFirst
                          ? isMe ? '8px 0px 8px 8px' : '0px 8px 8px 8px'
                          : '8px',
                      }}
                    >
                      {/* Nombre */}
                      {!isMe && isFirst && (
                        <p className="text-[#2F5D8C] text-xs font-semibold mb-0.5">
                          {msg.profiles?.full_name}
                        </p>
                      )}

                      {/* Texto con espacio para la hora */}
                      <div className="relative">
                        <p className="text-white text-sm leading-relaxed break-words">
                          {msg.content}
                          <span className="inline-block w-24" />
                        </p>
                        <div className="absolute bottom-0 right-0 flex items-center gap-1">
                          <span className="text-[11px] text-white/50 whitespace-nowrap">
                            {formatTime(msg.created_at)}
                          </span>
                          {isMe && <CheckMarks />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 px-2 py-2" style={{ backgroundColor: '#0b141a' }}>
        <div
          className="flex-1 flex items-end gap-2 rounded-3xl px-4 py-2.5 min-h-[48px]"
          style={{ backgroundColor: '#202c33' }}
        >
          <button className="text-slate-400 hover:text-slate-300 transition flex-shrink-0 pb-0.5">
            <Smile size={22} />
          </button>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
            placeholder="Mensaje"
            autoComplete="off"
            className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none py-0.5"
          />
          {!inputValue && (
            <button className="text-slate-400 hover:text-slate-300 transition flex-shrink-0 pb-0.5">
              <Paperclip size={20} />
            </button>
          )}
        </div>

        <button
          onClick={inputValue.trim() ? sendMsg : undefined}
          disabled={sending}
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: '#00a884' }}
        >
          {inputValue.trim()
            ? <Send size={20} className="text-white ml-0.5" />
            : <Mic size={20} className="text-white" />
          }
        </button>
      </div>
    </div>
  )
}