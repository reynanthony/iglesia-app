'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Heart, MessageCircle, AlertTriangle, X } from 'lucide-react'
import Link from 'next/link'

type Notification = {
  id: string
  type: 'like' | 'comment' | 'report'
  read: boolean
  created_at: string
  post_id: string
  profiles: { full_name: string; username: string; avatar_url?: string | null } | null
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const supabase = useRef(createClient()).current

  const unread = notifications.filter(n => !n.read).length

  async function loadNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*, profiles:actor_id(full_name, username, avatar_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setNotifications(data as Notification[])
  }

  useEffect(() => {
    loadNotifications().catch(console.error)
    const interval = setInterval(() => {
      loadNotifications().catch(console.error)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  async function markAllRead() {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const timeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 60) return 'ahora'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
  }

  const getIcon = (type: string) => {
    if (type === 'like') return <Heart size={14} className="text-red-400 fill-red-400" />
    if (type === 'comment') return <MessageCircle size={14} className="text-blue-400" />
    return <AlertTriangle size={14} className="text-amber-400" />
  }

  const getText = (n: Notification) => {
    const name = n.profiles?.full_name ?? 'Alguien'
    if (n.type === 'like') return `${name} le dio me gusta a tu publicacion`
    if (n.type === 'comment') return `${name} comento en tu publicacion`
    return `${name} reporto una publicacion`
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open && unread > 0) markAllRead() }}
        className="relative p-2 hover:bg-slate-800 rounded-xl transition"
      >
        <Bell size={20} className="text-slate-300" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-0" onClick={() => setOpen(false)} />

         <div className="fixed right-2 top-16 w-[calc(100vw-16px)] md:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-[75vh] flex flex-col">

            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 flex-shrink-0">
              <h3 className="font-semibold text-sm">Notificaciones</h3>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-sm">
                  Sin notificaciones
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href="/app/feed"
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-800 transition ${!n.read ? 'bg-slate-800/50' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700">
                        {n.profiles?.avatar_url ? (
                          <img src={n.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                            {n.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                        {getIcon(n.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 leading-snug">{getText(n)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>

                    {!n.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}