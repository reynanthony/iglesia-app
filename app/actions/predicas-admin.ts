'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cmsCreate, cmsUpdate, cmsDelete, cmsUploadFile } from '@/lib/directus'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role)) throw new Error('Sin permisos')
}

export async function createPredica(formData: FormData) {
  await getAdminClient()
  const image = formData.get('image') as File
  let thumbnail: string | null = null
  if (image && image.size > 0) thumbnail = await cmsUploadFile(image)

  await cmsCreate('predicas', {
    status: 'published',
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    video_url: (formData.get('video_url') as string).trim() || null,
    series: (formData.get('series') as string).trim() || null,
    speaker: (formData.get('speaker') as string).trim() || null,
    date: (formData.get('date') as string) || null,
    thumbnail,
  })

  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
  redirect('/admin/predicas')
}

export async function updatePredica(id: string, formData: FormData) {
  await getAdminClient()
  const image = formData.get('image') as File

  const updates: Record<string, unknown> = {
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    video_url: (formData.get('video_url') as string).trim() || null,
    series: (formData.get('series') as string).trim() || null,
    speaker: (formData.get('speaker') as string).trim() || null,
    date: (formData.get('date') as string) || null,
  }

  if (image && image.size > 0) {
    const uuid = await cmsUploadFile(image)
    if (uuid) updates.thumbnail = uuid
  }

  const result = await cmsUpdate('predicas', id, updates)
  if (!result) redirect(`/admin/predicas/${id}/editar?error=1`)

  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
  redirect('/admin/predicas')
}

export async function deletePredica(id: string) {
  await getAdminClient()
  await cmsDelete('predicas', id)
  revalidatePath('/admin/predicas')
  revalidatePath('/predicas')
}
