'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getPastoralClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase
    .from('profiles').select('role, id').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor'].includes(profile.role)) throw new Error('Sin permisos')
  return { supabase, userId: profile.id as string }
}

async function uploadPastoralFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  folder: string,
) {
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('pastoral').upload(path, file, { contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('pastoral').getPublicUrl(path)
  return data.publicUrl
}

// ── MENSAJES ────────────────────────────────────────────────

export async function createPastoralMessage(formData: FormData) {
  const { supabase, userId } = await getPastoralClient()
  const media = formData.get('media') as File
  const externalUrl = (formData.get('media_url_external') as string ?? '').trim() || null
  let media_url: string | null = externalUrl
  const media_type = (formData.get('media_type') as string) || 'text'
  if (media && media.size > 0) media_url = await uploadPastoralFile(supabase, media, 'mensajes')

  await supabase.from('pastoral_messages').insert({
    author_id: userId,
    body: (formData.get('body') as string).trim() || null,
    media_url,
    media_type,
    pinned: formData.get('pinned') === 'on',
  })
  revalidatePath('/admin/pastoral/mensajes')
  revalidatePath('/app/pastoral')
  revalidatePath('/app/pastoral/canal')
  redirect('/admin/pastoral/mensajes')
}

export async function deletePastoralMessage(id: string) {
  const { supabase } = await getPastoralClient()
  await supabase.from('pastoral_messages').delete().eq('id', id)
  revalidatePath('/admin/pastoral/mensajes')
  revalidatePath('/app/pastoral/canal')
}

// ── REFLEXIONES ─────────────────────────────────────────────

export async function createPastoralReflection(formData: FormData) {
  const { supabase } = await getPastoralClient()
  const media = formData.get('media') as File
  const externalUrl = (formData.get('media_url_external') as string).trim() || null
  let media_url: string | null = externalUrl
  const media_type = (formData.get('media_type') as string) || 'text'
  if (media && media.size > 0) media_url = await uploadPastoralFile(supabase, media, 'reflexiones')

  const dur = formData.get('duration_seconds') as string
  await supabase.from('pastoral_reflections').insert({
    title: (formData.get('title') as string).trim() || null,
    body: (formData.get('body') as string).trim() || null,
    media_url,
    media_type,
    duration_seconds: dur ? parseInt(dur) : null,
    week_featured: formData.get('week_featured') === 'on',
    published: true,
  })
  revalidatePath('/admin/pastoral/reflexiones')
  revalidatePath('/app/pastoral')
  redirect('/admin/pastoral/reflexiones')
}

export async function deletePastoralReflection(id: string) {
  const { supabase } = await getPastoralClient()
  await supabase.from('pastoral_reflections').delete().eq('id', id)
  revalidatePath('/admin/pastoral/reflexiones')
  revalidatePath('/app/pastoral')
}

export async function toggleWeekFeatured(id: string, current: boolean) {
  const { supabase } = await getPastoralClient()
  // Un solo week_featured a la vez
  if (!current) {
    await supabase.from('pastoral_reflections').update({ week_featured: false }).neq('id', id)
  }
  await supabase.from('pastoral_reflections').update({ week_featured: !current }).eq('id', id)
  revalidatePath('/admin/pastoral/reflexiones')
  revalidatePath('/app/pastoral')
}

// ── ENCUENTROS ──────────────────────────────────────────────

export async function createPastoralEncounter(formData: FormData) {
  const { supabase } = await getPastoralClient()
  const thumb = formData.get('thumbnail') as File
  let thumbnail_url: string | null = null
  if (thumb && thumb.size > 0) thumbnail_url = await uploadPastoralFile(supabase, thumb, 'encuentros')

  const scheduledRaw = formData.get('scheduled_at') as string
  await supabase.from('pastoral_encounters').insert({
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    type: formData.get('type') as string,
    live_url: (formData.get('live_url') as string).trim() || null,
    scheduled_at: scheduledRaw || null,
    thumbnail_url,
    notes_markdown: (formData.get('notes_markdown') as string).trim() || null,
    status: 'scheduled',
  })
  revalidatePath('/admin/pastoral/encuentros')
  revalidatePath('/app/pastoral')
  redirect('/admin/pastoral/encuentros')
}

export async function updateEncounterStatus(id: string, status: string) {
  const { supabase } = await getPastoralClient()
  await supabase.from('pastoral_encounters').update({ status }).eq('id', id)
  revalidatePath('/admin/pastoral/encuentros')
  revalidatePath('/app/pastoral/encuentros')
}

export async function deletePastoralEncounter(id: string) {
  const { supabase } = await getPastoralClient()
  await supabase.from('pastoral_encounters').delete().eq('id', id)
  revalidatePath('/admin/pastoral/encuentros')
  revalidatePath('/app/pastoral')
}

// ── PREGUNTAS ───────────────────────────────────────────────

export async function updatePastoralReflection(id: string, formData: FormData) {
  const { supabase } = await getPastoralClient()
  const media = formData.get('media') as File
  const externalUrl = (formData.get('media_url_external') as string ?? '').trim() || null
  const { data: current } = await supabase.from('pastoral_reflections').select('media_url').eq('id', id).single()
  let media_url: string | null = externalUrl ?? current?.media_url ?? null
  const media_type = (formData.get('media_type') as string) || 'text'
  if (media && media.size > 0) media_url = await uploadPastoralFile(supabase, media, 'reflexiones')

  const dur = formData.get('duration_seconds') as string
  const weekFeatured = formData.get('week_featured') === 'on'
  if (weekFeatured) {
    await supabase.from('pastoral_reflections').update({ week_featured: false }).neq('id', id)
  }
  await supabase.from('pastoral_reflections').update({
    title: (formData.get('title') as string).trim() || null,
    body: (formData.get('body') as string).trim() || null,
    media_url,
    media_type,
    duration_seconds: dur ? parseInt(dur) : null,
    week_featured: weekFeatured,
  }).eq('id', id)
  revalidatePath('/admin/pastoral/reflexiones')
  revalidatePath('/app/pastoral')
  redirect('/admin/pastoral/reflexiones')
}

export async function updatePastoralEncounter(id: string, formData: FormData) {
  const { supabase } = await getPastoralClient()
  const thumb = formData.get('thumbnail') as File
  const { data: current } = await supabase.from('pastoral_encounters').select('thumbnail_url').eq('id', id).single()
  let thumbnail_url = current?.thumbnail_url ?? null
  if (thumb && thumb.size > 0) thumbnail_url = await uploadPastoralFile(supabase, thumb, 'encuentros')

  const scheduledRaw = formData.get('scheduled_at') as string
  await supabase.from('pastoral_encounters').update({
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    type: formData.get('type') as string,
    live_url: (formData.get('live_url') as string).trim() || null,
    scheduled_at: scheduledRaw || null,
    thumbnail_url,
    notes_markdown: (formData.get('notes_markdown') as string).trim() || null,
  }).eq('id', id)
  revalidatePath('/admin/pastoral/encuentros')
  revalidatePath('/app/pastoral')
  revalidatePath(`/app/pastoral/encuentros/${id}`)
  redirect('/admin/pastoral/encuentros')
}

export async function answerPastoralQuestion(formData: FormData) {
  const { supabase } = await getPastoralClient()
  const id = formData.get('id') as string
  const mediaUrl  = (formData.get('media') as string ?? '').trim() || null
  const mediaFile = formData.get('media_file') as File
  let answer_media_url: string | null = mediaUrl
  const answer_media_type = (formData.get('answer_media_type') as string) || 'text'
  if (mediaFile && mediaFile.size > 0) answer_media_url = await uploadPastoralFile(supabase, mediaFile, 'respuestas')

  await supabase.from('pastoral_questions').update({
    answer_body: (formData.get('answer_body') as string).trim() || null,
    answer_media_url,
    answer_media_type,
    is_public: formData.get('is_public') === 'on',
    status: 'answered',
    answered_at: new Date().toISOString(),
  }).eq('id', id)

  revalidatePath('/admin/pastoral/preguntas')
  revalidatePath('/app/pastoral/preguntas')
  redirect('/admin/pastoral/preguntas')
}
