import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FCM_KEY = Deno.env.get('FCM_SERVER_KEY') ?? ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Verify caller is authenticated leader
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) return new Response('Unauthorized', { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role)) {
      return new Response('Forbidden', { status: 403 })
    }

    const { title, body, tokens } = await req.json() as {
      title: string
      body:  string
      tokens: string[]
    }

    if (!title || !body || !tokens?.length) {
      return new Response('Bad Request', { status: 400 })
    }

    // Send via FCM HTTP v1 (legacy) — batch in chunks of 500
    let success = 0
    let failed  = 0
    const chunkSize = 500

    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize)
      const res = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `key=${FCM_KEY}`,
        },
        body: JSON.stringify({
          registration_ids: chunk,
          notification: { title, body },
          priority: 'high',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        success += data.success ?? chunk.length
        failed  += data.failure ?? 0
      } else {
        failed += chunk.length
      }
    }

    return new Response(JSON.stringify({ success, failed }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
