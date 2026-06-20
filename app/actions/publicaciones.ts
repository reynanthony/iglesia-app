'use server'

import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor', 'moderador'].includes(profile.role))
    throw new Error('Sin permisos')
  return { supabase, userId: user.id }
}

export async function createPublicacion(formData: FormData) {
  const { supabase, userId } = await assertAdmin()

  const title = (formData.get('title') as string).trim()
  const rawSlug = (formData.get('slug') as string ?? '').trim()
  const slug = rawSlug || slugify(title) + '-' + Date.now().toString(36)

  const { error } = await supabase.from('publicaciones').insert({
    slug,
    title,
    subtitle:    (formData.get('subtitle') as string ?? '').trim() || null,
    category:    formData.get('category') as string || 'general',
    cover_image: (formData.get('cover_image') as string ?? '').trim() || null,
    cover_color: (formData.get('cover_color') as string ?? '').trim() || '#093C5D',
    excerpt:     (formData.get('excerpt') as string ?? '').trim() || null,
    body:        (formData.get('body') as string ?? '').trim() || null,
    cta_label:   (formData.get('cta_label') as string ?? '').trim() || 'Más información',
    cta_url:     (formData.get('cta_url') as string ?? '').trim() || null,
    is_active:   formData.get('is_active') === 'on',
    published_at: formData.get('published_at') as string || new Date().toISOString(),
    created_by:  userId,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/publicaciones')
  revalidatePath('/publicaciones')
  redirect('/admin/publicaciones')
}

export async function updatePublicacion(id: string, formData: FormData) {
  const { supabase } = await assertAdmin()

  const title = (formData.get('title') as string).trim()
  const rawSlug = (formData.get('slug') as string ?? '').trim()
  const slug = rawSlug || slugify(title)

  const { error } = await supabase.from('publicaciones').update({
    slug,
    title,
    subtitle:    (formData.get('subtitle') as string ?? '').trim() || null,
    category:    formData.get('category') as string || 'general',
    cover_image: (formData.get('cover_image') as string ?? '').trim() || null,
    cover_color: (formData.get('cover_color') as string ?? '').trim() || '#093C5D',
    excerpt:     (formData.get('excerpt') as string ?? '').trim() || null,
    body:        (formData.get('body') as string ?? '').trim() || null,
    cta_label:   (formData.get('cta_label') as string ?? '').trim() || 'Más información',
    cta_url:     (formData.get('cta_url') as string ?? '').trim() || null,
    is_active:   formData.get('is_active') === 'on',
    published_at: formData.get('published_at') as string || new Date().toISOString(),
    updated_at:  new Date().toISOString(),
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/publicaciones')
  revalidatePath('/publicaciones')
  redirect('/admin/publicaciones')
}

export async function togglePublicacionActive(id: string, value: boolean) {
  const { supabase } = await assertAdmin()
  await supabase.from('publicaciones').update({ is_active: value, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/admin/publicaciones')
  revalidatePath('/publicaciones')
}

export async function deletePublicacion(id: string) {
  const { supabase } = await assertAdmin()
  await supabase.from('publicaciones').delete().eq('id', id)
  revalidatePath('/admin/publicaciones')
  revalidatePath('/publicaciones')
}

export async function savePublicacionBlocks(id: string, blocks: any[]) {
  const { supabase } = await assertAdmin()
  const { error } = await supabase
    .from('publicaciones')
    .update({ blocks, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/publicaciones`)
  revalidatePath(`/admin/publicaciones`)
  return { ok: true }
}
