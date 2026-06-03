'use server'

import { createClient } from '@/lib/supabase/server'
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
  const { supabase, userId } = await requireLeader()

  const title  = (formData.get('title') as string)?.trim()
  const body   = (formData.get('body')  as string)?.trim()
  const target = (formData.get('target') as string) ?? 'all'  // 'all' | specific user_id

  if (!title || !body) return

  // Fetch tokens
  const query = supabase.from('device_tokens').select('token, platform, user_id')
  if (target !== 'all') query.eq('user_id', target)
  const { data: tokens } = await query

  if (!tokens || tokens.length === 0) {
    await supabase.from('push_notifications_log').insert({
      sent_by: userId, title, body, target, success: 0, failed: 0,
    })
    return
  }

  // Send via Supabase Edge Function
  const { data: { session } } = await supabase.auth.getSession()
  let successCount = 0
  let failedCount  = 0

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-push`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ title, body, tokens: tokens.map(t => t.token) }),
      }
    )
    if (res.ok) {
      const result = await res.json()
      successCount = result.success ?? tokens.length
      failedCount  = result.failed ?? 0
    } else {
      failedCount = tokens.length
    }
  } catch {
    failedCount = tokens.length
  }

  await supabase.from('push_notifications_log').insert({
    sent_by: userId, title, body, target,
    success: successCount,
    failed:  failedCount,
  })

  revalidatePath('/admin/notificaciones')
}
