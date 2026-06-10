import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, body, url = '/app/comunidad', targetUserId } = await request.json()
    if (!title || !body) return NextResponse.json({ error: 'Missing title/body' }, { status: 400 })

    // Fetch web push subscriptions
    let query = supabase
      .from('device_tokens')
      .select('push_sub, user_id')
      .eq('platform', 'web')
      .not('push_sub', 'is', null)

    if (targetUserId) query = query.eq('user_id', targetUserId)

    const { data: tokens } = await query
    if (!tokens?.length) return NextResponse.json({ success: 0, failed: 0 })

    const payload = JSON.stringify({ title, body, url, icon: '/icon-192.png' })
    let success = 0
    let failed  = 0
    const staleEndpoints: string[] = []

    await Promise.allSettled(
      tokens.map(async ({ push_sub, user_id }) => {
        if (!push_sub) return
        try {
          await webpush.sendNotification(push_sub as webpush.PushSubscription, payload)
          success++
        } catch (err: any) {
          // 404/410 = subscription expired — remove it
          if (err.statusCode === 404 || err.statusCode === 410) {
            staleEndpoints.push(push_sub.endpoint)
          }
          failed++
        }
      })
    )

    // Clean up expired subscriptions
    if (staleEndpoints.length) {
      await supabase.from('device_tokens').delete().in('token', staleEndpoints)
    }

    // Log
    await supabase.from('push_notifications_log').insert({
      sent_by: user.id,
      title,
      body,
      target:  targetUserId ?? 'all',
      success,
      failed,
    })

    return NextResponse.json({ success, failed })
  } catch (err) {
    console.error('[push/send]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
