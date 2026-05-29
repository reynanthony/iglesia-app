'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ReactionType = 'orando' | 'amen' | 'edifico' | 'gracias'

export async function toggleReaction(postId: string, type: ReactionType) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: existing } = await supabase
    .from('reactions')
    .select('id, type')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    if (existing.type === type) {
      // Remove reaction (toggle off)
      await supabase.from('reactions').delete().eq('id', existing.id)
    } else {
      // Change reaction type
      await supabase.from('reactions').update({ type }).eq('id', existing.id)
    }
  } else {
    // Add new reaction
    await supabase.from('reactions').insert({ post_id: postId, user_id: user.id, type })
  }

  revalidatePath('/app/comunidad')
}
