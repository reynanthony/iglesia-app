'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const content = formData.get('content') as string
  if (!content?.trim()) return { error: 'El contenido no puede estar vacío' }

  const { error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, content: content.trim() })

  if (error) return { error: 'No se pudo publicar' }

  revalidatePath('/app/feed')
  return { success: true }
}

export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
  }

  revalidatePath('/app/feed')
}

export async function createComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const content = formData.get('content') as string
  const post_id = formData.get('post_id') as string
  if (!content?.trim()) return { error: 'Comentario vacío' }

  const { error } = await supabase
    .from('comments')
    .insert({ post_id, user_id: user.id, content: content.trim() })

  if (error) return { error: 'No se pudo comentar' }

  revalidatePath('/app/feed')
  return { success: true }
}