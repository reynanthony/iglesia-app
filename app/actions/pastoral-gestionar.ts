'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const GESTIONAR = '/app/pastoral/gestionar'

async function getPastor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase
    .from('profiles').select('role, id, is_consejo_pastoral').eq('id', user.id).single()
  if (!profile || (!['admin', 'pastor'].includes(profile.role) && !profile.is_consejo_pastoral))
    throw new Error('Sin permisos')
  return { supabase, userId: profile.id as string }
}

async function uploadFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  folder: string,
) {
  const ext  = file.name.split('.').pop() ?? 'bin'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('pastoral').upload(path, file, { contentType: file.type })
  if (error) return null
  return supabase.storage.from('pastoral').getPublicUrl(path).data.publicUrl
}

// ── CANAL ──────────────────────────────────────────────────────

export async function canalPostFromApp(formData: FormData) {
  const { supabase, userId } = await getPastor()
  const externalUrl = (formData.get('media_url_external') as string ?? '').trim() || null
  const media       = formData.get('media') as File
  const media_type  = (formData.get('media_type') as string) || 'text'
  let media_url     = externalUrl
  if (media && media.size > 0) media_url = await uploadFile(supabase, media, 'mensajes')

  await supabase.from('pastoral_messages').insert({
    author_id: userId,
    body:      (formData.get('body') as string).trim() || null,
    media_url,
    media_type,
    pinned:    formData.get('pinned') === 'on',
  })
  revalidatePath(GESTIONAR)
  revalidatePath('/app/pastoral')
  revalidatePath('/app/pastoral/canal')
  redirect(GESTIONAR)
}

export async function canalDeleteFromApp(id: string) {
  const { supabase } = await getPastor()
  await supabase.from('pastoral_messages').delete().eq('id', id)
  revalidatePath(GESTIONAR)
  revalidatePath('/app/pastoral/canal')
}

// ── REFLEXIONES ────────────────────────────────────────────────

export async function reflexionCreateFromApp(formData: FormData) {
  const { supabase } = await getPastor()
  const externalUrl = (formData.get('media_url_external') as string).trim() || null
  const media       = formData.get('media') as File
  const media_type  = (formData.get('media_type') as string) || 'text'
  let media_url     = externalUrl
  if (media && media.size > 0) media_url = await uploadFile(supabase, media, 'reflexiones')

  const dur = formData.get('duration_seconds') as string
  const weekFeatured = formData.get('week_featured') === 'on'
  if (weekFeatured) {
    await supabase.from('pastoral_reflections').update({ week_featured: false }).eq('week_featured', true)
  }
  await supabase.from('pastoral_reflections').insert({
    title:            (formData.get('title') as string).trim() || null,
    body:             (formData.get('body') as string).trim() || null,
    media_url,
    media_type,
    duration_seconds: dur ? parseInt(dur) : null,
    week_featured:    weekFeatured,
    published:        true,
  })
  revalidatePath(GESTIONAR)
  revalidatePath('/app/pastoral')
  redirect(GESTIONAR)
}

export async function reflexionDeleteFromApp(id: string) {
  const { supabase } = await getPastor()
  await supabase.from('pastoral_reflections').delete().eq('id', id)
  revalidatePath(GESTIONAR)
  revalidatePath('/app/pastoral')
}

// ── ENCUENTROS ─────────────────────────────────────────────────

export async function encuentroCreateFromApp(formData: FormData) {
  const { supabase } = await getPastor()
  const thumb = formData.get('thumbnail') as File
  let thumbnail_url: string | null = null
  if (thumb && thumb.size > 0) thumbnail_url = await uploadFile(supabase, thumb, 'encuentros')

  await supabase.from('pastoral_encounters').insert({
    title:       (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    type:        formData.get('type') as string,
    live_url:    (formData.get('live_url') as string).trim() || null,
    scheduled_at: (formData.get('scheduled_at') as string) || null,
    thumbnail_url,
    status:      'scheduled',
  })
  revalidatePath(GESTIONAR)
  revalidatePath('/app/pastoral')
  redirect(GESTIONAR)
}

export async function encuentroStatusFromApp(id: string, status: string) {
  const { supabase } = await getPastor()
  await supabase.from('pastoral_encounters').update({ status }).eq('id', id)
  revalidatePath(GESTIONAR)
  revalidatePath('/app/pastoral')
  revalidatePath('/app/pastoral/encuentros')
}

export async function encuentroDeleteFromApp(id: string) {
  const { supabase } = await getPastor()
  await supabase.from('pastoral_encounters').delete().eq('id', id)
  revalidatePath(GESTIONAR)
  revalidatePath('/app/pastoral')
}
