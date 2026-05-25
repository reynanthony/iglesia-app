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
  const { error } = await supabase.storage.from('eventos').upload(path, file, { contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('eventos').getPublicUrl(path)
  return data.publicUrl
}

export async function createEvento(formData: FormData) {
  const supabase = await getAdminClient()
  const image = formData.get('image') as File

  let image_url: string | null = null
  if (image && image.size > 0) image_url = await uploadImage(supabase, image)

  await supabase.from('events').insert({
    titulo: (formData.get('titulo') as string).trim(),
    descripcion: (formData.get('descripcion') as string).trim(),
    fecha_inicio: formData.get('fecha_inicio'),
    fecha_fin: (formData.get('fecha_fin') as string) || null,
    lugar: (formData.get('lugar') as string).trim(),
    categoria: (formData.get('categoria') as string).trim(),
    badge: (formData.get('badge') as string) || 'Próximo',
    image_url,
    visible: true,
  })

  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
  redirect('/admin/eventos')
}

export async function updateEvento(id: string, formData: FormData) {
  const supabase = await getAdminClient()
  const image = formData.get('image') as File

  const updates: Record<string, unknown> = {
    titulo: (formData.get('titulo') as string).trim(),
    descripcion: (formData.get('descripcion') as string).trim(),
    fecha_inicio: formData.get('fecha_inicio'),
    fecha_fin: (formData.get('fecha_fin') as string) || null,
    lugar: (formData.get('lugar') as string).trim(),
    categoria: (formData.get('categoria') as string).trim(),
    badge: (formData.get('badge') as string) || 'Próximo',
  }

  if (image && image.size > 0) {
    const url = await uploadImage(supabase, image)
    if (url) updates.image_url = url
  }

  await supabase.from('events').update(updates).eq('id', id)

  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
  redirect('/admin/eventos')
}

export async function deleteEvento(id: string) {
  const supabase = await getAdminClient()
  await supabase.from('events').delete().eq('id', id)
  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
}

export async function toggleEventoVisible(id: string, visible: boolean) {
  const supabase = await getAdminClient()
  await supabase.from('events').update({ visible }).eq('id', id)
  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
}
