'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function requireLeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role))
    redirect('/admin')
  return supabase
}

// ── SERIES ───────────────────────────────────────────────────────

export async function createSeries(formData: FormData) {
  const supabase = await requireLeader()
  const title = formData.get('title') as string
  const slug = slugify(formData.get('slug') as string || title)

  const { data, error } = await supabase.from('bible_study_series').insert({
    title,
    slug,
    description:  formData.get('description') as string || null,
    book:         formData.get('book') as string || null,
    theme:        formData.get('theme') as string || null,
    cover_color:  formData.get('cover_color') as string || '#76ABAE',
    status:       formData.get('status') as string || 'active',
    order_index:  parseInt(formData.get('order_index') as string || '0', 10),
    is_active:    formData.get('is_active') !== 'false',
  }).select('id').single()

  if (error || !data) redirect('/admin/estudio-biblico')
  revalidatePath('/admin/estudio-biblico')
  revalidatePath('/educacion/estudio-biblico')
  redirect(`/admin/estudio-biblico/${data.id}`)
}

export async function updateSeries(id: string, formData: FormData) {
  const supabase = await requireLeader()
  const title = formData.get('title') as string
  const slug = slugify(formData.get('slug') as string || title)

  const { error } = await supabase.from('bible_study_series').update({
    title,
    slug,
    description:  formData.get('description') as string || null,
    book:         formData.get('book') as string || null,
    theme:        formData.get('theme') as string || null,
    cover_color:  formData.get('cover_color') as string || '#76ABAE',
    status:       formData.get('status') as string || 'active',
    order_index:  parseInt(formData.get('order_index') as string || '0', 10),
    is_active:    formData.get('is_active') !== 'false',
    updated_at:   new Date().toISOString(),
  }).eq('id', id)

  if (error) redirect('/admin/estudio-biblico')
  revalidatePath('/admin/estudio-biblico')
  revalidatePath('/educacion/estudio-biblico')
  redirect(`/admin/estudio-biblico/${id}`)
}

export async function deleteSeries(id: string) {
  const supabase = await requireLeader()
  await supabase.from('bible_study_series').delete().eq('id', id)
  revalidatePath('/admin/estudio-biblico')
  revalidatePath('/educacion/estudio-biblico')
  redirect('/admin/estudio-biblico')
}

// ── SESSIONS ─────────────────────────────────────────────────────

export async function createSession(seriesId: string, formData: FormData) {
  const supabase = await requireLeader()
  const title = formData.get('title') as string
  const slug = slugify(formData.get('slug') as string || title)
  const objectivesRaw = (formData.get('objectives') as string || '').trim()
  const objectives = objectivesRaw
    ? objectivesRaw.split('\n').map(s => s.trim()).filter(Boolean)
    : []

  const { data, error } = await supabase.from('bible_study_sessions').insert({
    series_id:    seriesId,
    title,
    slug,
    reference:    formData.get('reference') as string || null,
    summary:      formData.get('summary') as string || null,
    content:      formData.get('content') as string || null,
    objectives,
    order_index:  parseInt(formData.get('order_index') as string || '0', 10),
    is_active:    formData.get('is_active') !== 'false',
  }).select('id').single()

  if (error) throw new Error(error.message)

  // Insert questions if provided
  const questionsRaw = (formData.get('questions') as string || '').trim()
  if (questionsRaw) {
    const questions = questionsRaw.split('\n').map((q, i) => ({
      session_id: data.id,
      question: q.trim(),
      order_index: i,
    })).filter(q => q.question)
    if (questions.length) {
      await supabase.from('bible_study_questions').insert(questions)
    }
  }

  revalidatePath(`/admin/estudio-biblico/${seriesId}`)
  redirect(`/admin/estudio-biblico/${seriesId}`)
}

export async function updateSession(id: string, seriesId: string, formData: FormData) {
  const supabase = await requireLeader()
  const title = formData.get('title') as string
  const slug = slugify(formData.get('slug') as string || title)
  const objectivesRaw = (formData.get('objectives') as string || '').trim()
  const objectives = objectivesRaw
    ? objectivesRaw.split('\n').map(s => s.trim()).filter(Boolean)
    : []

  const { error } = await supabase.from('bible_study_sessions').update({
    title,
    slug,
    reference:    formData.get('reference') as string || null,
    summary:      formData.get('summary') as string || null,
    content:      formData.get('content') as string || null,
    objectives,
    order_index:  parseInt(formData.get('order_index') as string || '0', 10),
    is_active:    formData.get('is_active') !== 'false',
    updated_at:   new Date().toISOString(),
  }).eq('id', id)

  if (error) throw new Error(error.message)

  // Replace questions
  await supabase.from('bible_study_questions').delete().eq('session_id', id)
  const questionsRaw = (formData.get('questions') as string || '').trim()
  if (questionsRaw) {
    const questions = questionsRaw.split('\n').map((q, i) => ({
      session_id: id,
      question: q.trim(),
      order_index: i,
    })).filter(q => q.question)
    if (questions.length) {
      await supabase.from('bible_study_questions').insert(questions)
    }
  }

  revalidatePath(`/admin/estudio-biblico/${seriesId}`)
  redirect(`/admin/estudio-biblico/${seriesId}`)
}

export async function deleteSession(id: string, seriesId: string) {
  const supabase = await requireLeader()
  await supabase.from('bible_study_sessions').delete().eq('id', id)
  revalidatePath(`/admin/estudio-biblico/${seriesId}`)
  redirect(`/admin/estudio-biblico/${seriesId}`)
}
