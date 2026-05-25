'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role, id').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role)) throw new Error('Sin permisos')
  return { supabase, userId: profile.id as string }
}

async function uploadImage(supabase: Awaited<ReturnType<typeof createClient>>, file: File) {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `predicas/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('posts').upload(path, file, { contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('posts').getPublicUrl(path)
  return data.publicUrl
}

export async function createPredica(formData: FormData) {
  const { supabase, userId } = await getAdminClient()
  const image = formData.get('image') as File

  let image_url: string | null = null
  if (image && image.size > 0) image_url = await uploadImage(supabase, image)

  const ministry_id = (formData.get('ministry_id') as string) || null

  await supabase.from('ministry_content').insert({
    title: (formData.get('title') as string).trim(),
    body: (formData.get('body') as string).trim(),
    video_url: (formData.get('video_url') as string).trim() || null,
    image_url,
    type: 'video',
    ministry_id: ministry_id || null,
    user_id: userId,
    pinned: formData.get('pinned') === 'on',
  })

  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
  redirect('/admin/predicas')
}

export async function updatePredica(id: string, formData: FormData) {
  const { supabase } = await getAdminClient()
  const image = formData.get('image') as File

  const updates: Record<string, unknown> = {
    title: (formData.get('title') as string).trim(),
    body: (formData.get('body') as string).trim(),
    video_url: (formData.get('video_url') as string).trim() || null,
    ministry_id: (formData.get('ministry_id') as string) || null,
    pinned: formData.get('pinned') === 'on',
  }

  if (image && image.size > 0) {
    const url = await uploadImage(supabase, image)
    if (url) updates.image_url = url
  }

  await supabase.from('ministry_content').update(updates).eq('id', id)

  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
  redirect('/admin/predicas')
}

export async function deletePredica(id: string) {
  const { supabase } = await getAdminClient()
  await supabase.from('ministry_content').delete().eq('id', id)
  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
}
