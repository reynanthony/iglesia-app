'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import Link from 'next/link'

export default function NotificationBell({ userId }: { userId: string }) {
  const [unread, setUnread] = useState(0)
  const supabase = useRef(createClient()).current

  async function loadUnread() {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)
    setUnread(count ?? 0)
  }

  useEffect(() => {
    loadUnread().catch(console.error)
    const interval = setInterval(() => loadUnread().catch(console.error), 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Link
      href="/app/notificaciones"
      onClick={() => setUnread(0)}
      className="relative p-2.5 rounded-xl transition block"
      style={{ color: 'rgba(246,243,235,0.60)' }}
      title="Notificaciones"
    >
      <Bell size={20} />
      {unread > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  )
}
