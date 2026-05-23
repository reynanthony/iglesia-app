'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, ThumbsUp, Smile } from 'lucide-react'
import Link from 'next/link'

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
    if (d.toDateString() === today.toDateString()) return 'Hoy'
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
    return d.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const grouped: Record<string, Message[]> = {}
  messages.forEach((msg) => {
    const key = new Date(msg.created_at).toDateString()
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(msg)
  })

  return (
    <div className="flex flex-col h-full bg-black">

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
              💬
            </div>
            <p className="text-slate-600 text-sm">Comienza la conversación</p>
          </div>
        )}

        {Object.entries(grouped).map(([dateKey, msgs]) => (
          <div key={dateKey}>

            {/* Fecha */}
            <div className="flex justify-center my-5">
              <span className="text-[11px] text-slate-600 font-medium capitalize tracking-wide">
                {formatDate(msgs[0].created_at)}
              </span>
            </div>

            {msgs.map((msg, i) => {
              const isMe = msg.user_id === currentUserId
              const prevMsg = msgs[i - 1]
              const nextMsg = msgs[i + 1]
              const isFirst = !prevMsg || prevMsg.user_id !== msg.user_id
              const isLast = !nextMsg || nextMsg.user_id !== msg.user_id

              const myRadius = isFirst && isLast ? 'rounded-2xl rounded-br-sm'
                : isFirst ? 'rounded-2xl rounded-br-md'
                : isLast ? 'rounded-2xl rounded-tr-md rounded-br-sm'
                : 'rounded-2xl rounded-r-md'

              const theirRadius = isFirst && isLast ? 'rounded-2xl rounded-bl-sm'
                : isFirst ? 'rounded-2xl rounded-bl-md'
                : isLast ? 'rounded-2xl rounded-tl-md rounded-bl-sm'
                : 'rounded-2xl rounded-l-md'

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${isLast ? 'mb-4' : 'mb-0.5'}`}
                >
                  {/* Avatar */}
                  <div className="w-8 flex-shrink-0">
                    {!isMe && isLast && (
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-800">
                        {msg.profiles?.avatar_url ? (
                          <img src={msg.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-300 font-semibold text-xs">
                            {msg.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Columna burbuja */}
                  <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'} gap-0.5`}>

                    {/* Nombre */}
                    {!isMe && isFirst && (
                      <Link href={`/app/perfil/${msg.profiles?.username}`}>
                        <p className="text-xs font-semibold text-slate-400 ml-3 mb-0.5 hover:text-white transition">
                          {msg.profiles?.full_name}
                        </p>
                      </Link>
                    )}

                    {/* Burbuja */}
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed break-words ${isMe ? myRadius : theirRadius} ${
                        isMe
                          ? 'bg-slate-800 text-white'
                          : 'bg-[#1c1c1e] text-white border border-slate-800'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Hora — solo en el último del grupo */}
                    {isLast && (
                      <p className={`text-[10px] text-slate-600 ${isMe ? 'mr-1' : 'ml-3'} mt-0.5`}>
                        {formatTime(msg.created_at)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input — estilo Instagram DM */}
      <div className="px-4 py-3 border-t border-slate-900">
        <div className="flex items-center gap-3 border border-slate-800 rounded-full px-4 py-2.5 focus-within:border-slate-600 transition bg-transparent">

          <button type="button" className="text-slate-600 hover:text-slate-400 transition flex-shrink-0">
            <Smile size={20} />
          </button>

          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
            placeholder="Mensaje..."
            autoComplete="off"
            className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-700 focus:outline-none"
          />

          {inputValue.trim() ? (
            <button
              onClick={sendMsg}
              disabled={sending}
              className="text-blue-500 hover:text-blue-400 font-semibold text-sm flex-shrink-0 transition disabled:opacity-50"
            >
              Enviar
            </button>
          ) : (
            <button
              type="button"
              className="text-slate-600 hover:text-slate-400 transition flex-shrink-0"
            >
              <ThumbsUp size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}