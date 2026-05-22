'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send } from 'lucide-react'

type Message = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: { full_name: string; username: string } | null
}

export default function ChatBox({ 
  currentUserId, 
  currentProfile 
}: { 
  currentUserId: string
  currentProfile: { full_name: string; username: string }
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = useRef(createClient()).current
  const channelRef = useRef<any>(null)

  // Cargar mensajes iniciales
  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(full_name, username)')
        .order('created_at', { ascending: true })
        .limit(50)
      if (data) setMessages(data as Message[])
    }
    loadMessages()

    // Suscripción broadcast
    const channel = supabase.channel('chat-room')
    channelRef.current = channel

    channel
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        setMessages((prev) => [...prev, payload as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const content = (form.elements.namedItem('content') as HTMLInputElement).value.trim()
    if (!content) return

    setSending(true)

    // Guardar en base de datos
    const { data, error } = await supabase
      .from('messages')
      .insert({ user_id: currentUserId, content })
      .select()
      .single()

    if (!error && data) {
      const newMessage: Message = {
        ...data,
        profiles: currentProfile,
      }

      // Broadcast a todos los clientes
      channelRef.current?.send({
        type: 'broadcast',
        event: 'new_message',
        payload: newMessage,
      })

      // Agregar al estado local inmediatamente
      setMessages((prev) => [...prev, newMessage])
      form.reset()
    }

    setSending(false)
  }

  const timeAgo = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full">

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-3xl mb-3">💬</p>
            <p className="text-sm">Sé el primero en escribir</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.user_id === currentUserId
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold text-xs flex-shrink-0">
                {msg.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <p className="text-xs text-slate-500 px-1">{msg.profiles?.full_name}</p>
                )}
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-amber-500 text-slate-950 rounded-tr-sm'
                    : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <p className="text-xs text-slate-600 px-1">{timeAgo(msg.created_at)}</p>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            name="content"
            placeholder="Escribe un mensaje..."
            required
            autoComplete="off"
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={sending}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  )
}