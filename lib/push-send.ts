import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

let vapidSet = false
function ensureVapid() {
  if (vapidSet) return
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )
  vapidSet = true
}

export async function sendPush({
  title,
  body,
  url = '/app/comunidad',
  targetUserId,
  sentBy,
}: {
  title: string
  body: string
  url?: string
  targetUserId?: string
  sentBy: string
}) {
  ensureVapid()
  const supabase = await createClient()

  let query = supabase
    .from('device_tokens')
    .select('push_sub, user_id')
    .eq('platform', 'web')
    .not('push_sub', 'is', null)

  if (targetUserId) query = query.eq('user_id', targetUserId)

  const { data: tokens } = await query
  if (!tokens?.length) return { success: 0, failed: 0 }

  const payload = JSON.stringify({ title, body, url, icon: '/api/pwa-icon?size=192' })
  let success = 0
  let failed = 0
  const staleEndpoints: string[] = []

  await Promise.allSettled(
    tokens.map(async ({ push_sub }) => {
      if (!push_sub) return
      try {
        await webpush.sendNotification(push_sub as webpush.PushSubscription, payload)
        success++
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          staleEndpoints.push(push_sub.endpoint)
        }
        failed++
      }
    })
  )

  if (staleEndpoints.length) {
    await supabase.from('device_tokens').delete().in('token', staleEndpoints)
  }

  await supabase.from('push_notifications_log').insert({
    sent_by: sentBy,
    title,
    body,
    target: targetUserId ?? 'all',
    success,
    failed,
  })

  return { success, failed }
}
