'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleEventRsvp(eventId: string): Promise<{ success: boolean; needsLogin?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, needsLogin: true }

  const { data: existing } = await supabase
    .from('event_rsvps')
    .select('id')
    .eq('user_id', user.id)
    .eq('directus_event_id', eventId)
    .maybeSingle()

  if (existing) {
    await supabase.from('event_rsvps')
      .delete()
      .eq('user_id', user.id)
      .eq('directus_event_id', eventId)
  } else {
    await supabase.from('event_rsvps')
      .insert({ user_id: user.id, directus_event_id: eventId })
  }

  revalidatePath('/eventos')
  return { success: true }
}
