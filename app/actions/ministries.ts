'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMinistryContent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const ministry_id = formData.get('ministry_id') as string

  const role = profile?.role ?? ''
  if (!['admin', 'pastor', 'moderador', 'lider'].includes(role)) {
    return { error: 'No tienes permiso para publicar en ministerios' }
  }

  if (role === 'lider') {
    const { data: assignment } = await supabase
      .from('ministry_assignments')
      .select('id')
      .eq('user_id', user.id)
      .eq('ministry_id', ministry_id)
      .single()
    if (!assignment) {
      return { error: 'Solo puedes publicar en los ministerios que te fueron asignados' }
    }
  }
  const title = formData.get('title') as string
  const body = formData.get('body') as string
  const type = formData.get('type') as string
  const video_url = formData.get('video_url') as string
  const imageFile = formData.get('image') as File

  if (!title?.trim()) return { error: 'El titulo es requerido' }

  let image_url: string | undefined

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop()
    const path = user.id + '/' + Date.now() + '.' + ext
    const { error: uploadError } = await supabase.storage
      .from('posts')
      .upload(path, imageFile)

    if (!uploadError) {
      const { data } = supabase.storage.from('posts').getPublicUrl(path)
      image_url = data.publicUrl
    }
  }

  const { error } = await supabase
    .from('ministry_content')
    .insert({
      ministry_id,
      user_id: user.id,
      title: title.trim(),
      body: body?.trim() ?? '',
      type: type || 'articulo',
      video_url: video_url?.trim() || null,
      image_url,
    })

  if (error) return { error: 'No se pudo publicar' }

  revalidatePath('/ministerios/' + ministry_id)
  return { success: true }
}

export async function deleteMinistryContent(contentId: string, ministrySlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('ministry_content')
    .delete()
    .eq('id', contentId)
    .eq('user_id', user.id)

  revalidatePath('/ministerios/' + ministrySlug)
}