import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPush } from '@/lib/push-send'

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

    const { title, body, url, targetUserId } = await request.json()
    if (!title || !body) return NextResponse.json({ error: 'Missing title/body' }, { status: 400 })

    const result = await sendPush({ title, body, url, targetUserId, sentBy: user.id })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[push/send]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
