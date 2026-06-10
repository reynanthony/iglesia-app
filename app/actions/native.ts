'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, userId: user.id }
}

async function requireLeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role)) redirect('/app')
  return { supabase, userId: user.id }
}

// ── DEVICE TOKENS ─────────────────────────────────────────────

export async function saveDeviceToken(token: string, platform: string): Promise<void> {
  const { supabase, userId } = await requireAuth()
  await supabase.from('device_tokens').upsert(
    { user_id: userId, token, platform },
    { onConflict: 'user_id,token', ignoreDuplicates: true }
  )
}

export async function removeDeviceToken(token: string): Promise<void> {
  const { supabase, userId } = await requireAuth()
  await supabase.from('device_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('token', token)
}

// ── PUSH NOTIFICATIONS (ADMIN) ────────────────────────────────

export async function sendPushNotification(formData: FormData): Promise<void> {
  const { userId } = await requireLeader()

  const title  = (formData.get('title') as string)?.trim()
  const body   = (formData.get('body')  as string)?.trim()
  const target = (formData.get('target') as string) ?? 'all'

  if (!title || !body) return

  const { sendPush } = await import('@/lib/push-send')
  await sendPush({
    title,
    body,
    targetUserId: target !== 'all' ? target : undefined,
    sentBy: userId,
  })

  revalidatePath('/admin/notificaciones')
}

export async function deletePushLog(id: string): Promise<void> {
  await requireLeader()
  try {
    const svc = createServiceClient()
    await svc.from('push_notifications_log').delete().eq('id', id)
  } catch {
    const { supabase } = await requireLeader()
    await supabase.from('push_notifications_log').delete().eq('id', id)
  }
  revalidatePath('/admin/notificaciones')
}
