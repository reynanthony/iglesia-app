'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function assertAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor', 'moderador'].includes(p?.role ?? '')) return null
  return supabase
}

export async function completeOnboarding(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)
}

export async function markAnnouncementSeen(announcementId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('announcement_views').upsert(
    { announcement_id: announcementId, user_id: user.id },
    { onConflict: 'announcement_id,user_id' }
  )
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await assertAdminClient()
  if (!supabase) return { error: 'Sin permisos' }

  const { data: { user } } = await supabase.auth.getUser()
  const endDateRaw = (formData.get('end_date') as string)?.trim()
  const audienceRaw = formData.get('audience') as string

  const { error } = await supabase.from('announcements').insert({
    title:           (formData.get('title') as string).trim(),
    description:     (formData.get('description') as string)?.trim() || null,
    content_type:    (formData.get('content_type') as string) || 'image',
    priority:        (formData.get('priority') as string) || 'normal',
    image_url:       (formData.get('image_url') as string)?.trim() || null,
    video_url:       (formData.get('video_url') as string)?.trim() || null,
    cta_label:       (formData.get('cta_label') as string)?.trim() || 'Más información',
    cta_destination: (formData.get('cta_destination') as string)?.trim() || null,
    start_date:      (formData.get('start_date') as string) || new Date().toISOString(),
    end_date:        endDateRaw ? new Date(endDateRaw).toISOString() : null,
    is_active:       formData.get('is_active') === 'on',
    show_frequency:  (formData.get('show_frequency') as string) || 'once',
    audience:        audienceRaw ? [audienceRaw] : ['all'],
    is_banner:       formData.get('is_banner') === 'on',
    created_by:      user?.id ?? null,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/campanas')
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const supabase = await assertAdminClient()
  if (!supabase) return { error: 'Sin permisos' }

  const endDateRaw = (formData.get('end_date') as string)?.trim()
  const audienceRaw = formData.get('audience') as string

  const { error } = await supabase.from('announcements').update({
    title:           (formData.get('title') as string).trim(),
    description:     (formData.get('description') as string)?.trim() || null,
    content_type:    (formData.get('content_type') as string) || 'image',
    priority:        (formData.get('priority') as string) || 'normal',
    image_url:       (formData.get('image_url') as string)?.trim() || null,
    video_url:       (formData.get('video_url') as string)?.trim() || null,
    cta_label:       (formData.get('cta_label') as string)?.trim() || 'Más información',
    cta_destination: (formData.get('cta_destination') as string)?.trim() || null,
    start_date:      (formData.get('start_date') as string) || new Date().toISOString(),
    end_date:        endDateRaw ? new Date(endDateRaw).toISOString() : null,
    is_active:       formData.get('is_active') === 'on',
    show_frequency:  (formData.get('show_frequency') as string) || 'once',
    audience:        audienceRaw ? [audienceRaw] : ['all'],
    is_banner:       formData.get('is_banner') === 'on',
    updated_at:      new Date().toISOString(),
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/campanas')
}

export async function toggleAnnouncementActive(id: string, value: boolean): Promise<void> {
  const supabase = await assertAdminClient()
  if (!supabase) return
  await supabase
    .from('announcements')
    .update({ is_active: value, updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/campanas')
}

export async function resetAllAnnouncementViews(): Promise<{ error?: string; partial?: boolean }> {
  const supabase = await assertAdminClient()
  if (!supabase) return { error: 'Sin permisos' }

  try {
    const svc = (await import('@/lib/supabase/service')).createServiceClient()
    await svc.from('announcement_views').delete().neq('announcement_id', '')
  } catch {
    // Sin service role key: borrar solo las vistas del usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('announcement_views').delete().eq('user_id', user.id)
    }
    revalidatePath('/admin/campanas')
    return { partial: true }
  }

  revalidatePath('/admin/campanas')
  return {}
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = await assertAdminClient()
  if (!supabase) return
  await supabase.from('announcements').delete().eq('id', id)
  revalidatePath('/admin/campanas')
  redirect('/admin/campanas')
}
