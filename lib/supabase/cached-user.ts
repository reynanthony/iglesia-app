import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

// cache() deduplicates calls within a single React render tree (one request).
// Both layout and page components can call these — only ONE network round-trip occurs.
export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, role')
    .eq('id', userId)
    .single()
  return profile
})
