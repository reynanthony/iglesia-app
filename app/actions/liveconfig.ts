'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor'].includes(p?.role ?? '')) return null
  return supabase
}

async function setConfig(key: string, value: string) {
  const supabase = await assertAdmin()
  if (!supabase) return
  await supabase.from('site_config')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  revalidatePath('/admin/en-vivo')
  revalidatePath('/app/en-vivo')
}

export async function setLiveUrl(formData: FormData): Promise<void> {
  const url   = (formData.get('live_url') as string).trim()
  const title = (formData.get('live_title') as string)?.trim() || 'Culto en vivo'
  await setConfig('live_url', url)
  await setConfig('live_title', title)
}

export async function toggleLive(formData: FormData): Promise<void> {
  const value = formData.get('is_live') === 'on' ? 'true' : 'false'
  await setConfig('is_live', value)
}
