import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const sub = await request.json()
    if (!sub?.endpoint) return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await supabase.from('device_tokens').upsert(
      {
        user_id:  user.id,
        token:    sub.endpoint,
        platform: 'web',
        push_sub: sub,
      },
      { onConflict: 'user_id,token' }
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
