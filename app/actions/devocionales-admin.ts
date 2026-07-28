'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor'].includes(profile.role)) throw new Error('Sin permisos')
  return supabase
}

async function uploadImage(supabase: Awaited<ReturnType<typeof createClient>>, file: File) {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('devocionales').upload(path, file, { contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('devocionales').getPublicUrl(path)
  return data.publicUrl
}

export async function createDevocional(formData: FormData) {
  const supabase = await getAdminClient()
  const image = formData.get('image') as File
  let image_url: string | null = null
  if (image && image.size > 0) image_url = await uploadImage(supabase, image)

  await supabase.from('devocionales').insert({
    title: (formData.get('title') as string).trim(),
    content: (formData.get('content') as string).trim(),
    author: (formData.get('author') as string).trim() || 'Pastor Principal',
    verse: (formData.get('verse') as string).trim() || null,
    verse_ref: (formData.get('verse_ref') as string).trim() || null,
    image_url,
    published: true,
  })

  revalidatePath('/admin/devocionales')
  revalidatePath('/devocionales')
  revalidatePath('/biblia')
  redirect('/admin/devocionales')
}

export async function updateDevocional(id: string, formData: FormData) {
  const supabase = await getAdminClient()
  const image = formData.get('image') as File

  const updates: Record<string, unknown> = {
    title: (formData.get('title') as string).trim(),
    content: (formData.get('content') as string).trim(),
    author: (formData.get('author') as string).trim() || 'Pastor Principal',
    verse: (formData.get('verse') as string).trim() || null,
    verse_ref: (formData.get('verse_ref') as string).trim() || null,
  }

  if (image && image.size > 0) {
    const url = await uploadImage(supabase, image)
    if (url) updates.image_url = url
  }

  const { error } = await supabase.from('devocionales').update(updates).eq('id', id)
  if (error) redirect(`/admin/devocionales/${id}/editar?error=1`)

  revalidatePath('/admin/devocionales')
  revalidatePath('/devocionales')
  revalidatePath('/biblia')
  redirect('/admin/devocionales')
}

export async function deleteDevocional(id: string) {
  const supabase = await getAdminClient()
  await supabase.from('devocionales').delete().eq('id', id)
  revalidatePath('/admin/devocionales')
  revalidatePath('/devocionales')
}

export async function toggleDevocionalPublished(id: string, published: boolean) {
  const supabase = await getAdminClient()
  await supabase.from('devocionales').update({ published }).eq('id', id)
  revalidatePath('/admin/devocionales')
  revalidatePath('/devocionales')
}
