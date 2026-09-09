'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { findBook } from '@/lib/bible'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, userId: user.id }
}

// ── ADMIN ────────────────────────────────────────────────────

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor'].includes(profile.role)) throw new Error('Sin permisos')
  return supabase
}

async function uploadPlanImage(supabase: Awaited<ReturnType<typeof createClient>>, file: File) {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('bible-reading-plans').upload(path, file, { contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('bible-reading-plans').getPublicUrl(path)
  return data.publicUrl
}

async function recalcDuration(supabase: Awaited<ReturnType<typeof createClient>>, planId: string) {
  const { count } = await supabase.from('bible_reading_plan_days')
    .select('*', { count: 'exact', head: true }).eq('plan_id', planId)
  await supabase.from('bible_reading_plans').update({ duration_days: count ?? 0 }).eq('id', planId)
}

export async function createReadingPlan(formData: FormData) {
  const supabase = await getAdminClient()
  const image = formData.get('image') as File
  let thumbnail_url: string | null = null
  if (image && image.size > 0) thumbnail_url = await uploadPlanImage(supabase, image)

  const title = (formData.get('title') as string).trim()
  const slugInput = ((formData.get('slug') as string) || '').trim()

  const { data, error } = await supabase.from('bible_reading_plans').insert({
    title,
    slug: slugify(slugInput || title),
    description: ((formData.get('description') as string) || '').trim() || null,
    category: ((formData.get('category') as string) || '').trim() || null,
    order_index: parseInt(formData.get('order_index') as string, 10) || 0,
    is_active: formData.get('is_active') === 'true',
    duration_days: 0,
    thumbnail_url,
  }).select('id').single()

  if (error || !data) redirect('/admin/biblia/planes/nuevo?error=1')

  revalidatePath('/admin/biblia/planes')
  revalidatePath('/biblia/planes')
  redirect(`/admin/biblia/planes/${data.id}`)
}

export async function updateReadingPlan(id: string, formData: FormData) {
  const supabase = await getAdminClient()
  const image = formData.get('image') as File
  const title = (formData.get('title') as string).trim()
  const slugInput = ((formData.get('slug') as string) || '').trim()

  const updates: Record<string, unknown> = {
    title,
    slug: slugify(slugInput || title),
    description: ((formData.get('description') as string) || '').trim() || null,
    category: ((formData.get('category') as string) || '').trim() || null,
    order_index: parseInt(formData.get('order_index') as string, 10) || 0,
    is_active: formData.get('is_active') === 'true',
  }

  if (image && image.size > 0) {
    const url = await uploadPlanImage(supabase, image)
    if (url) updates.thumbnail_url = url
  }

  const { error } = await supabase.from('bible_reading_plans').update(updates).eq('id', id)
  if (error) redirect(`/admin/biblia/planes/${id}?error=1`)

  revalidatePath('/admin/biblia/planes')
  revalidatePath(`/admin/biblia/planes/${id}`)
  revalidatePath('/biblia/planes')
  redirect('/admin/biblia/planes')
}

export async function deleteReadingPlan(id: string) {
  const supabase = await getAdminClient()
  await supabase.from('bible_reading_plans').delete().eq('id', id)
  revalidatePath('/admin/biblia/planes')
  revalidatePath('/biblia/planes')
}

export async function addReadingPlanDay(planId: string, formData: FormData) {
  const supabase = await getAdminClient()
  const dayNumber = parseInt(formData.get('day_number') as string, 10)
  const bookId = formData.get('book_id') as string
  const chapterStart = parseInt(formData.get('chapter_start') as string, 10)
  const chapterEnd = parseInt(formData.get('chapter_end') as string, 10) || chapterStart

  await supabase.from('bible_reading_plan_days').insert({
    plan_id: planId, day_number: dayNumber, book_id: bookId,
    chapter_start: chapterStart, chapter_end: chapterEnd,
  })

  await recalcDuration(supabase, planId)
  revalidatePath(`/admin/biblia/planes/${planId}`)
  revalidatePath('/biblia/planes')
}

export async function deleteReadingPlanDay(planId: string, dayId: string) {
  const supabase = await getAdminClient()
  await supabase.from('bible_reading_plan_days').delete().eq('id', dayId)
  await recalcDuration(supabase, planId)
  revalidatePath(`/admin/biblia/planes/${planId}`)
  revalidatePath('/biblia/planes')
}

export async function generateReadingPlanDays(planId: string, formData: FormData) {
  const supabase = await getAdminClient()
  const bookIds = formData.getAll('book_ids') as string[]
  const chunk = Math.max(1, parseInt(formData.get('chunk') as string, 10) || 1)

  if (bookIds.length > 0) {
    const { data: existing } = await supabase.from('bible_reading_plan_days')
      .select('day_number').eq('plan_id', planId).order('day_number', { ascending: false }).limit(1)
    let dayNumber = (existing?.[0]?.day_number ?? 0) + 1

    const rows: { plan_id: string; day_number: number; book_id: string; chapter_start: number; chapter_end: number }[] = []
    for (const bookId of bookIds) {
      const book = findBook(bookId)
      if (!book) continue
      for (let start = 1; start <= book.chapters; start += chunk) {
        const end = Math.min(start + chunk - 1, book.chapters)
        rows.push({ plan_id: planId, day_number: dayNumber, book_id: book.id, chapter_start: start, chapter_end: end })
        dayNumber++
      }
    }

    if (rows.length > 0) await supabase.from('bible_reading_plan_days').insert(rows)
    await recalcDuration(supabase, planId)
  }

  revalidatePath(`/admin/biblia/planes/${planId}`)
  revalidatePath('/biblia/planes')
}

export async function enrollInReadingPlan(planId: string, slug: string): Promise<void> {
  const { supabase, userId } = await requireAuth()

  await supabase.from('user_reading_plan_enrollments')
    .upsert({ user_id: userId, plan_id: planId }, { onConflict: 'user_id,plan_id', ignoreDuplicates: true })

  revalidatePath('/biblia/planes')
  redirect(`/biblia/planes/${slug}/dia/1`)
}

export async function markPlanDayComplete(planId: string, planDayId: string, dayNumber: number): Promise<void> {
  const { supabase, userId } = await requireAuth()

  // Auto-inscribe si aún no está inscripto (marcar un día implica participar del plan)
  await supabase.from('user_reading_plan_enrollments')
    .upsert({ user_id: userId, plan_id: planId }, { onConflict: 'user_id,plan_id', ignoreDuplicates: true })

  await supabase.from('user_reading_plan_day_completions')
    .upsert({ user_id: userId, plan_day_id: planDayId }, { onConflict: 'user_id,plan_day_id', ignoreDuplicates: true })

  const [{ data: plan }, { data: enrollment }] = await Promise.all([
    supabase.from('bible_reading_plans').select('duration_days').eq('id', planId).single(),
    supabase.from('user_reading_plan_enrollments').select('current_day').eq('user_id', userId).eq('plan_id', planId).single(),
  ])

  const isLastDay = plan ? dayNumber >= plan.duration_days : false
  const advancedDay = isLastDay ? dayNumber : dayNumber + 1
  const newCurrentDay = Math.max(enrollment?.current_day ?? 1, advancedDay)

  await supabase.from('user_reading_plan_enrollments').update({
    current_day: newCurrentDay,
    completed_at: isLastDay ? new Date().toISOString() : null,
  }).eq('user_id', userId).eq('plan_id', planId)

  revalidatePath('/biblia/planes')
}
