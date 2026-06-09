'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Watch {
  table: string
  filter?: string
  events?: ('INSERT' | 'UPDATE' | 'DELETE')[]
}

export default function RealtimeRefresh({ watches, channelName }: { watches: Watch[]; channelName: string }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const uid = Math.random().toString(36).slice(2, 7)
    const channel = supabase.channel(`${channelName}-${uid}`)

    watches.forEach(({ table, filter, events = ['INSERT', 'UPDATE', 'DELETE'] }) => {
      events.forEach(event => {
        channel.on(
          'postgres_changes' as any,
          { event, schema: 'public', table, ...(filter ? { filter } : {}) },
          () => router.refresh()
        )
      })
    })

    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [channelName])

  return null
}
