'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPrayerRequest(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title       = (formData.get('title') as string).trim()
  const body        = (formData.get('body') as string | null)?.trim() || null
  const is_anonymous = formData.get('is_anonymous') === 'on'

  if (!title) return

  await supabase.from('prayer_requests').insert({ user_id: user.id, title, body, is_anonymous })
  revalidatePath('/app/oracion')
  redirect('/app/oracion')
}

export async function createPublicPrayerRequest(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title        = (formData.get('title') as string).trim()
  const body         = (formData.get('body') as string | null)?.trim() || null
  const is_anonymous = formData.get('is_anonymous') === 'on'

  if (!title) return

  await supabase.from('prayer_requests').insert({ user_id: user.id, title, body, is_anonymous })
  revalidatePath('/oracion')
  revalidatePath('/app/oracion')
  redirect('/oracion')
}

export async function togglePrayerParticipation(requestId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('prayer_participants')
    .select('request_id')
    .eq('request_id', requestId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from('prayer_participants')
      .delete().eq('request_id', requestId).eq('user_id', user.id)
  } else {
    await supabase.from('prayer_participants')
      .insert({ request_id: requestId, user_id: user.id })
  }

  revalidatePath(`/app/oracion/${requestId}`)
  revalidatePath('/app/oracion')
}

export async function markPrayerAnswered(requestId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('prayer_requests')
    .update({ status: 'respondida', updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('user_id', user.id)

  revalidatePath(`/app/oracion/${requestId}`)
  revalidatePath('/app/oracion')
}

export async function markPrayerFollowUp(requestId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('prayer_requests')
    .update({ status: 'seguimiento', updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('user_id', user.id)

  revalidatePath(`/app/oracion/${requestId}`)
  revalidatePath('/app/oracion')
}

export async function togglePublicPrayer(requestId: string): Promise<{ success: boolean; needsLogin?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, needsLogin: true }

  const { data: existing } = await supabase
    .from('prayer_participants')
    .select('request_id')
    .eq('request_id', requestId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from('prayer_participants')
      .delete().eq('request_id', requestId).eq('user_id', user.id)
  } else {
    await supabase.from('prayer_participants')
      .insert({ request_id: requestId, user_id: user.id })
  }

  revalidatePath('/oracion')
  revalidatePath(`/app/oracion/${requestId}`)
  revalidatePath('/app/oracion')
  return { success: true }
}

export async function shareTestimony(requestId: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const body = (formData.get('body') as string)?.trim()
  if (!body) return

  // Verify owner
  const { data: req } = await supabase
    .from('prayer_requests')
    .select('id, title, status, user_id, testimony_post_id')
    .eq('id', requestId)
    .eq('user_id', user.id)
    .single()

  if (!req || req.status !== 'respondida' || req.testimony_post_id) return

  // Create post of category 'testimonio'
  const { data: post } = await supabase.from('posts').insert({
    user_id:  user.id,
    content:  body,
    category: 'testimonio',
  }).select('id').single()

  if (!post) return

  // Link testimony post to prayer request
  await supabase.from('prayer_requests')
    .update({ testimony_post_id: post.id, updated_at: new Date().toISOString() })
    .eq('id', requestId)

  revalidatePath(`/app/oracion/${requestId}`)
  revalidatePath('/app/oracion')
  revalidatePath('/app/comunidad')
  redirect(`/app/oracion/${requestId}`)
}
