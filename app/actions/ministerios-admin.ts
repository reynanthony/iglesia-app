'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function toSlug(name: string) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '').trim()
    .replace(/\s+/g, '-')
}

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
  const { error } = await supabase.storage.from('ministerios').upload(path, file, { contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('ministerios').getPublicUrl(path)
  return data.publicUrl
}

export async function createMinistry(formData: FormData) {
  const supabase = await getAdminClient()
  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string).trim()
  const parent_id = (formData.get('parent_id') as string) || null
  const image = formData.get('image') as File

  let image_url: string | null = null
  if (image && image.size > 0) image_url = await uploadImage(supabase, image)

  await supabase.from('ministries').insert({
    name,
    slug: toSlug(name),
    description,
    parent_id: parent_id || null,
    image_url,
    icon: '⛪',
    color: '#000000',
  })

  revalidatePath('/admin/ministerios')
  revalidatePath('/ministerios')
  redirect('/admin/ministerios')
}

export async function updateMinistry(id: string, formData: FormData) {
  const supabase = await getAdminClient()
  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string).trim()
  const parent_id = (formData.get('parent_id') as string) || null
  const image = formData.get('image') as File

  const updates: Record<string, unknown> = {
    name,
    slug: toSlug(name),
    description,
    parent_id: parent_id || null,
  }

  if (image && image.size > 0) {
    const url = await uploadImage(supabase, image)
    if (url) updates.image_url = url
  }

  await supabase.from('ministries').update(updates).eq('id', id)

  revalidatePath('/admin/ministerios')
  revalidatePath('/ministerios')
  redirect('/admin/ministerios')
}

export async function deleteMinistry(id: string) {
  const supabase = await getAdminClient()
  await supabase.from('ministries').delete().eq('id', id)
  revalidatePath('/admin/ministerios')
  revalidatePath('/ministerios')
}
