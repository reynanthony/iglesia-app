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

interface Props {
  groupId: string
  currentUserId: string
  currentProfile: { full_name: string; username: string; avatar_url?: string | null }
}

export default function GroupChat({ groupId, currentUserId, currentProfile }: Props) {
  const [messages, setMessages]     = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending]       = useState(false)
  const [atBottom, setAtBottom]     = useState(true)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const supabase   = useRef(createClient()).current
  const channelRef = useRef<any>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('group_messages')
        .select('*, profiles(full_name, username, avatar_url)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(60)
      if (data) setMessages(data as Message[])
    }
    load()

    const channel = supabase.channel(`group-chat-${groupId}`)
    channelRef.current = channel
    channel
      .on('broadcast', { event: 'msg' }, ({ payload }) => {
        setMessages(prev => [...prev, payload as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [groupId])

  useEffect(() => {
    if (atBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80)
  }

  async function send() {
    const content = inputValue.trim()
    if (!content || sending) return
    setSending(true)
    setInputValue('')
    setAtBottom(true)

    const { data, error } = await supabase
      .from('group_messages')
      .insert({ group_id: groupId, user_id: currentUserId, content })
      .select()
      .single()

    if (!error && data) {
      const msg: Message = { ...data, profiles: currentProfile }
      channelRef.current?.send({ type: 'broadcast', event: 'msg', payload: msg })
      setMessages(prev => [...prev, msg])
    }
    setSending(false)
    inputRef.current?.focus()
  }

  const fmt = (d: string) => {
    const t = new Date(d)
    return `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`
  }

  const fmtDate = (d: string) => {
    const t = new Date(d)
    const today = new Date()
    const yest  = new Date(today); yest.setDate(today.getDate() - 1)
    if (t.toDateString() === today.toDateString()) return 'Hoy'
    if (t.toDateString() === yest.toDateString())  return 'Ayer'
    const M = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    return `${t.getUTCDate()} de ${M[t.getUTCMonth()]}`
  }

  const grouped: Record<string, Message[]> = {}
  messages.forEach(m => {
    const k = new Date(m.created_at).toDateString()
    if (!grouped[k]) grouped[k] = []
    grouped[k].push(m)
  })

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#061E30' }}>

      {/* Mensajes */}
      <div ref={scrollRef} onScroll={handleScroll}
        className="flex-1 overflow-y-auto" style={{ padding: '12px 12px 0' }}>

        {messages.length === 0 && (
          <div className="flex justify-center mt-10">
            <span className="text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
              style={{ background: '#0D3352', color: 'rgba(246,243,235,0.40)' }}>
              Sé el primero en escribir
            </span>
          </div>
        )}

        {Object.entries(grouped).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            <div className="flex justify-center my-4">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full"
                style={{ background: '#0D3352', color: 'rgba(246,243,235,0.40)' }}>
                {fmtDate(msgs[0].created_at)}
              </span>
            </div>

            {msgs.map((msg, i) => {
              const isMe    = msg.user_id === currentUserId
              const prev    = msgs[i - 1]
              const next    = msgs[i + 1]
              const isFirst = !prev || prev.user_id !== msg.user_id
              const isLast  = !next || next.user_id !== msg.user_id

              const radius = isFirst
                ? isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                : isLast
                  ? isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px'
                  : isMe ? '16px 4px 4px 16px' : '4px 16px 16px 4px'

              return (
                <div key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  style={{ marginBottom: isLast ? 8 : 2 }}>

                  {!isMe && (
                    <div className="w-7 flex-shrink-0 self-end">
                      {isLast && (
                        <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold"
                          style={{ background: '#0D3352', color: '#76ABAE' }}>
                          {msg.profiles?.avatar_url
                            ? <img src={msg.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                            : msg.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ maxWidth: '70%' }}>
                    {!isMe && isFirst && (
                      <p className="text-[11px] font-bold mb-1"
                        style={{ color: 'rgba(246,243,235,0.40)', paddingLeft: 12 }}>
                        {msg.profiles?.full_name}
                      </p>
                    )}
                    <div className="px-3 py-2"
                      style={{
                        background: isMe ? 'linear-gradient(135deg, #093C5D, #76ABAE)' : '#0D3352',
                        borderRadius: radius,
                        border: isMe ? 'none' : '1px solid #1A3D5C',
                      }}>
                      <div className="flex items-end gap-3">
                        <p className="text-sm leading-relaxed break-words flex-1" style={{ color: '#F6F3EB' }}>
                          {msg.content}
                        </p>
                        <span className="text-[10px] flex-shrink-0 self-end whitespace-nowrap"
                          style={{ color: 'rgba(246,243,235,0.35)' }}>
                          {fmt(msg.created_at)}
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

      {/* Scroll to bottom */}
      {!atBottom && (
        <button
          onClick={() => { setAtBottom(true); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
          className="absolute right-4 flex items-center justify-center w-9 h-9 rounded-full"
          style={{ bottom: 72, background: '#0D3352', border: '1px solid #1A3D5C', color: 'rgba(246,243,235,0.60)' }}>
          <ArrowDown size={16} />
        </button>
      )}

      {/* Input */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3"
        style={{ borderTop: '1px solid #0D3352', background: '#061E30' }}>
        <div className="flex-1 flex items-center px-4 rounded-2xl"
          style={{ background: '#0B2D47', border: '1px solid #0D3352', minHeight: 48 }}>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Escribe un mensaje…"
            autoComplete="off"
            className="flex-1 bg-transparent text-sm focus:outline-none py-3"
            style={{ color: '#F6F3EB' }}
          />
        </div>
        <button
          onClick={send}
          disabled={sending || !inputValue.trim()}
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition active:scale-95 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #093C5D, #76ABAE)' }}>
          <Send size={18} style={{ color: 'white' }} />
        </button>
      </div>
    </div>
  )
}
