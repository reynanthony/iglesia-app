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
  if (!profile || !['admin', 'pastor', 'moderador'].includes(profile.role)) throw new Error('Sin permisos')
}

export async function createEvento(formData: FormData) {
  await getAdminClient()
  const image = formData.get('image') as File
  let imagen: string | null = null
  if (image && image.size > 0) imagen = await cmsUploadFile(image)

  await cmsCreate('eventos', {
    status: 'published',
    titulo: (formData.get('titulo') as string).trim(),
    descripcion: (formData.get('descripcion') as string).trim() || null,
    fecha_inicio: (formData.get('fecha_inicio') as string) || null,
    fecha_fin: (formData.get('fecha_fin') as string) || null,
    lugar: (formData.get('lugar') as string).trim() || null,
    categoria: (formData.get('categoria') as string).trim() || null,
    badge: (formData.get('badge') as string) || 'Próximo',
    imagen,
    visible: true,
  })

  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
  redirect('/admin/eventos')
}

export async function updateEvento(id: string, formData: FormData) {
  await getAdminClient()
  const image = formData.get('image') as File

  const updates: Record<string, unknown> = {
    titulo: (formData.get('titulo') as string).trim(),
    descripcion: (formData.get('descripcion') as string).trim() || null,
    fecha_inicio: (formData.get('fecha_inicio') as string) || null,
    fecha_fin: (formData.get('fecha_fin') as string) || null,
    lugar: (formData.get('lugar') as string).trim() || null,
    categoria: (formData.get('categoria') as string).trim() || null,
    badge: (formData.get('badge') as string) || 'Próximo',
  }

  if (image && image.size > 0) {
    const uuid = await cmsUploadFile(image)
    if (uuid) updates.imagen = uuid
  }

  const result = await cmsUpdate('eventos', id, updates)
  if (!result) redirect(`/admin/eventos/${id}/editar?error=1`)

  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
  redirect('/admin/eventos')
}

export async function deleteEvento(id: string) {
  await getAdminClient()
  await cmsDelete('eventos', id)
  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
  redirect('/admin/eventos')
}

export async function toggleEventoVisible(id: string, visible: boolean) {
  await getAdminClient()
  await cmsUpdate('eventos', id, { visible })
  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
}
