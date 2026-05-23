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

    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (post && post.user_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: post.user_id,
        actor_id: user.id,
        type: 'like',
        post_id: postId,
      })
    }
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

  if (!error) {
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', post_id)
      .single()

    if (post && post.user_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: post.user_id,
        actor_id: user.id,
        type: 'comment',
        post_id,
      })
    }
  }

  revalidatePath('/app/feed')
  return { success: true }
}

export async function reportPost(postId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('reports')
    .insert({ post_id: postId, reporter_id: user.id, reason })

  if (error) return { error: 'Ya reportaste esta publicación' }

  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')

  if (admins && admins.length > 0) {
    await supabase.from('notifications').insert(
      admins.map((admin: any) => ({
        user_id: admin.id,
        actor_id: user.id,
        type: 'report',
        post_id: postId,
      }))
    )
  }

  return { success: true }
}

export async function toggleCommentLike(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('comment_likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id })
  }

  revalidatePath('/app/feed')
}

export async function createReply(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const content = formData.get('content') as string
  const post_id = formData.get('post_id') as string
  const parent_id = formData.get('parent_id') as string

  if (!content?.trim()) return { error: 'Respuesta vacía' }

  const { error } = await supabase
    .from('comments')
    .insert({ post_id, user_id: user.id, content: content.trim(), parent_id })

  if (error) return { error: 'No se pudo responder' }

  revalidatePath('/app/feed')
  return { success: true }
}