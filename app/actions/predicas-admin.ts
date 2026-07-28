'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role)) throw new Error('Sin permisos')
  return supabase
}

async function uploadThumbnail(supabase: Awaited<ReturnType<typeof createClient>>, file: File) {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('sermons').upload(path, file, { contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('sermons').getPublicUrl(path)
  return data.publicUrl
}

export async function createPredica(formData: FormData) {
  const supabase = await getAdminClient()
  const image = formData.get('image') as File
  let thumbnail_url: string | null = null
  if (image && image.size > 0) thumbnail_url = await uploadThumbnail(supabase, image)

  await supabase.from('sermons').insert({
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    video_url: (formData.get('video_url') as string).trim() || null,
    series: (formData.get('series') as string).trim() || null,
    speaker: (formData.get('speaker') as string).trim() || null,
    sermon_date: (formData.get('sermon_date') as string) || null,
    thumbnail_url,
    published: true,
  })

  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
  redirect('/admin/predicas')
}

export async function updatePredica(id: string, formData: FormData) {
  const supabase = await getAdminClient()
  const image = formData.get('image') as File

  const updates: Record<string, unknown> = {
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    video_url: (formData.get('video_url') as string).trim() || null,
    series: (formData.get('series') as string).trim() || null,
    speaker: (formData.get('speaker') as string).trim() || null,
    sermon_date: (formData.get('sermon_date') as string) || null,
  }

  if (image && image.size > 0) {
    const url = await uploadThumbnail(supabase, image)
    if (url) updates.thumbnail_url = url
  }

  const { error } = await supabase.from('sermons').update(updates).eq('id', id)
  if (error) redirect(`/admin/predicas/${id}/editar?error=1`)

  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
  redirect('/admin/predicas')
}

export async function deletePredica(id: string) {
  const supabase = await getAdminClient()
  await supabase.from('sermons').delete().eq('id', id)
  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
}
