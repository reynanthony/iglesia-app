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
  if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role)) redirect('/app')
  return supabase
}

// ── AUTH HELPERS ─────────────────────────────────────────────

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, userId: user.id }
}

// ── ESTUDIANTE: INSCRIPCIÓN Y PROGRESO ───────────────────────

export async function enrollInCourse(courseId: string): Promise<void> {
  const { supabase, userId } = await requireAuth()

  await supabase.from('user_course_enrollments')
    .upsert({ user_id: userId, course_id: courseId }, { onConflict: 'user_id,course_id', ignoreDuplicates: true })

  const { data: lesson } = await supabase
    .from('discipleship_lessons')
    .select('id, discipleship_courses!inner(slug, discipleship_programs!inner(slug))')
    .eq('course_id', courseId)
    .eq('is_active', true)
    .order('order_index')
    .limit(1)
    .single()

  revalidatePath('/app/discipulado')

  if (lesson) {
    const course = (lesson as any).discipleship_courses
    const program = course?.discipleship_programs
    redirect(`/educacion/discipulado/${program.slug}/${course.slug}/${lesson.id}`)
  }
}

export async function markLessonComplete(lessonId: string, courseId: string): Promise<void> {
  const { supabase, userId } = await requireAuth()

  // Auto-enroll si no está inscripto
  await supabase.from('user_course_enrollments')
    .upsert({ user_id: userId, course_id: courseId }, { onConflict: 'user_id,course_id', ignoreDuplicates: true })

  // Marcar lección como completada
  await supabase.from('user_lesson_completions')
    .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id', ignoreDuplicates: true })

  // Recalcular progreso del curso
  const { data: allLessons } = await supabase
    .from('discipleship_lessons')
    .select('id')
    .eq('course_id', courseId)
    .eq('is_active', true)

  const lessonIds = allLessons?.map((l: any) => l.id) ?? []
  const { count: completed } = await supabase
    .from('user_lesson_completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)

  const total = lessonIds.length
  const pct = total ? Math.round(((completed ?? 0) / total) * 100) : 0

  await supabase.from('user_course_enrollments').update({
    progress_pct: pct,
    last_lesson_id: lessonId,
    completed_at: pct === 100 ? new Date().toISOString() : null,
  }).eq('user_id', userId).eq('course_id', courseId)

  // Si el curso quedó 100%, verificar si se completa el programa → emitir certificado
  if (pct === 100) {
    const { data: course } = await supabase
      .from('discipleship_courses')
      .select('program_id')
      .eq('id', courseId)
      .single()
    if (course?.program_id) {
      await autoIssueCertificate(userId, course.program_id)
    }
  }

  revalidatePath('/app/discipulado')
}

// ── PROGRAMAS ─────────────────────────────────────────────────

export async function createProgram(formData: FormData) {
  const supabase = await requireLeader()
  const title = (formData.get('title') as string).trim()
  const { data, error } = await supabase
    .from('discipleship_programs')
    .insert({
      title,
      slug: slugify(title),
      description: (formData.get('description') as string).trim() || null,
      required_stage_id: formData.get('required_stage_id') as string || null,
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: true,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/discipulado/programas')
  redirect(`/admin/discipulado/programas/${data.id}`)
}

export async function updateProgram(id: string, formData: FormData): Promise<void> {
  const supabase = await requireLeader()
  await supabase.from('discipleship_programs').update({
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    required_stage_id: formData.get('required_stage_id') as string || null,
    order_index: parseInt(formData.get('order_index') as string) || 0,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id)
  revalidatePath(`/admin/discipulado/programas/${id}`)
  revalidatePath('/admin/discipulado/programas')
}

export async function deleteProgram(id: string) {
  const supabase = await requireLeader()
  await supabase.from('discipleship_programs').delete().eq('id', id)
  revalidatePath('/admin/discipulado/programas')
  redirect('/admin/discipulado/programas')
}

// ── CURSOS ────────────────────────────────────────────────────

export async function createCourse(programId: string, formData: FormData) {
  const supabase = await requireLeader()
  const title = (formData.get('title') as string).trim()
  const { data, error } = await supabase
    .from('discipleship_courses')
    .insert({
      program_id: programId,
      title,
      slug: slugify(title),
      description: (formData.get('description') as string).trim() || null,
      author: (formData.get('author') as string).trim() || null,
      level: formData.get('level') as string || 'basico',
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: true,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/discipulado/programas/${programId}`)
  redirect(`/admin/discipulado/cursos/${data.id}`)
}

export async function updateCourse(id: string, programId: string, formData: FormData): Promise<void> {
  const supabase = await requireLeader()
  await supabase.from('discipleship_courses').update({
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim() || null,
    author: (formData.get('author') as string).trim() || null,
    level: formData.get('level') as string || 'basico',
    order_index: parseInt(formData.get('order_index') as string) || 0,
    duration_minutes: parseInt(formData.get('duration_minutes') as string) || 0,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id)
  revalidatePath(`/admin/discipulado/cursos/${id}`)
  revalidatePath(`/admin/discipulado/programas/${programId}`)
}

export async function deleteCourse(id: string, programId: string) {
  const supabase = await requireLeader()
  await supabase.from('discipleship_courses').delete().eq('id', id)
  revalidatePath(`/admin/discipulado/programas/${programId}`)
  redirect(`/admin/discipulado/programas/${programId}`)
}

// ── LECCIONES ─────────────────────────────────────────────────

export async function createLesson(courseId: string, formData: FormData) {
  const supabase = await requireLeader()
  const { data, error } = await supabase
    .from('discipleship_lessons')
    .insert({
      course_id: courseId,
      title: (formData.get('title') as string).trim(),
      body: (formData.get('body') as string).trim() || null,
      video_url: (formData.get('video_url') as string).trim() || null,
      pdf_url: (formData.get('pdf_url') as string).trim() || null,
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: true,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/discipulado/cursos/${courseId}`)
  redirect(`/admin/discipulado/lecciones/${data.id}`)
}

export async function updateLesson(id: string, courseId: string, formData: FormData): Promise<void> {
  const supabase = await requireLeader()
  await supabase.from('discipleship_lessons').update({
    title: (formData.get('title') as string).trim(),
    body: (formData.get('body') as string).trim() || null,
    video_url: (formData.get('video_url') as string).trim() || null,
    pdf_url: (formData.get('pdf_url') as string).trim() || null,
    order_index: parseInt(formData.get('order_index') as string) || 0,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id)
  revalidatePath(`/admin/discipulado/lecciones/${id}`)
  revalidatePath(`/admin/discipulado/cursos/${courseId}`)
}

export async function deleteLesson(id: string, courseId: string) {
  const supabase = await requireLeader()
  await supabase.from('discipleship_lessons').delete().eq('id', id)
  revalidatePath(`/admin/discipulado/cursos/${courseId}`)
  redirect(`/admin/discipulado/cursos/${courseId}`)
}

// ── VERSÍCULOS ────────────────────────────────────────────────

export async function addBibleVerse(lessonId: string, formData: FormData) {
  const supabase = await requireLeader()
  const { data: lastVerse } = await supabase
    .from('lesson_bible_verses')
    .select('order_index')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()
  await supabase.from('lesson_bible_verses').insert({
    lesson_id: lessonId,
    reference: (formData.get('reference') as string).trim(),
    verse_text: (formData.get('verse_text') as string).trim(),
    order_index: ((lastVerse?.order_index ?? 0) + 1),
  })
  revalidatePath(`/admin/discipulado/lecciones/${lessonId}`)
}

export async function deleteBibleVerse(verseId: string, lessonId: string) {
  const supabase = await requireLeader()
  await supabase.from('lesson_bible_verses').delete().eq('id', verseId)
  revalidatePath(`/admin/discipulado/lecciones/${lessonId}`)
}

// ── DESAFÍOS ─────────────────────────────────────────────────

export async function addChallenge(lessonId: string, formData: FormData) {
  const supabase = await requireLeader()
  const { data: last } = await supabase
    .from('lesson_challenges')
    .select('order_index')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()
  await supabase.from('lesson_challenges').insert({
    lesson_id: lessonId,
    description: (formData.get('description') as string).trim(),
    week_number: parseInt(formData.get('week_number') as string) || 1,
    order_index: ((last?.order_index ?? 0) + 1),
  })
  revalidatePath(`/admin/discipulado/lecciones/${lessonId}`)
}

export async function deleteChallenge(challengeId: string, lessonId: string) {
  const supabase = await requireLeader()
  await supabase.from('lesson_challenges').delete().eq('id', challengeId)
  revalidatePath(`/admin/discipulado/lecciones/${lessonId}`)
}

// ── MENTORÍA (ADMIN) ─────────────────────────────────────────

export async function assignMentor(formData: FormData): Promise<void> {
  const supabase  = await requireLeader()
  const mentorId  = (formData.get('mentor_id')  as string).trim()
  const studentId = (formData.get('student_id') as string).trim()
  if (!mentorId || !studentId || mentorId === studentId) return

  await supabase.from('discipleship_mentors').upsert({
    mentor_id:   mentorId,
    student_id:  studentId,
    status:      'active',
    assigned_at: new Date().toISOString(),
  }, { onConflict: 'mentor_id,student_id' })

  revalidatePath('/admin/discipulado/mentores')
  revalidatePath('/app/mentoria')
}

export async function removeMentorPair(pairId: string): Promise<void> {
  const supabase = await requireLeader()
  await supabase.from('discipleship_mentors').delete().eq('id', pairId)
  revalidatePath('/admin/discipulado/mentores')
  revalidatePath('/app/mentoria')
}

export async function updateMentorPairStatus(pairId: string, status: string): Promise<void> {
  const supabase = await requireLeader()
  await supabase.from('discipleship_mentors').update({ status }).eq('id', pairId)
  revalidatePath('/admin/discipulado/mentores')
}

// ── MENTORÍA (MENTOR) ─────────────────────────────────────────

export async function addMentorObservation(studentId: string, formData: FormData): Promise<void> {
  const { supabase, userId } = await requireAuth()
  const content = (formData.get('content') as string)?.trim()
  if (!content) return

  const { data: pair } = await supabase
    .from('discipleship_mentors')
    .select('id')
    .eq('mentor_id', userId)
    .eq('student_id', studentId)
    .eq('status', 'active')
    .maybeSingle()
  if (!pair) return

  await supabase.from('mentor_observations').insert({
    mentor_id:  userId,
    student_id: studentId,
    content,
  })

  revalidatePath(`/app/mentoria/${studentId}`)
}

// ── CERTIFICACIONES ───────────────────────────────────────────

export async function issueCertificate(userId: string, programId: string): Promise<void> {
  const supabase = await requireLeader()
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('discipleship_certificates').upsert({
    user_id:    userId,
    program_id: programId,
    issued_by:  user?.id,
    issued_at:  new Date().toISOString(),
  }, { onConflict: 'user_id,program_id' })
  revalidatePath('/app/discipulado/certificados')
  revalidatePath(`/admin/discipulado`)
}

export async function revokeCertificate(certId: string): Promise<void> {
  const supabase = await requireLeader()
  await supabase.from('discipleship_certificates').delete().eq('id', certId)
  revalidatePath('/admin/discipulado')
}

export async function autoIssueCertificate(userId: string, programId: string): Promise<void> {
  // Verificar que todos los cursos activos del programa están completados
  const { supabase } = await requireAuth()

  const { data: courses } = await supabase
    .from('discipleship_courses')
    .select('id')
    .eq('program_id', programId)
    .eq('is_active', true)

  if (!courses || courses.length === 0) return

  const { count } = await supabase
    .from('user_course_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('course_id', courses.map(c => c.id))
    .not('completed_at', 'is', null)

  if ((count ?? 0) < courses.length) return

  // Todos completados → emitir certificado
  await supabase.from('discipleship_certificates').upsert({
    user_id:    userId,
    program_id: programId,
    issued_at:  new Date().toISOString(),
  }, { onConflict: 'user_id,program_id', ignoreDuplicates: true })

  revalidatePath('/app/discipulado')
  revalidatePath('/app/discipulado/certificados')
}

// ── REFLEXIONES ───────────────────────────────────────────────

export async function saveReflection(lessonId: string, formData: FormData): Promise<void> {
  const { supabase, userId } = await requireAuth()

  await supabase.from('user_reflections').upsert({
    user_id: userId,
    lesson_id: lessonId,
    what_learned: (formData.get('what_learned') as string)?.trim() || null,
    god_spoke:    (formData.get('god_spoke')    as string)?.trim() || null,
    must_change:  (formData.get('must_change')  as string)?.trim() || null,
    must_apply:   (formData.get('must_apply')   as string)?.trim() || null,
    is_shared_with_mentor: formData.get('is_shared_with_mentor') === 'on',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })

  revalidatePath(`/educacion/discipulado`)
}
