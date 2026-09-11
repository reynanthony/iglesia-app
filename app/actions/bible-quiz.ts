'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { findBook } from '@/lib/bible'
import { getChapterPlainText } from '@/lib/bible-content'
import { generateChapterQuiz, type QuizQuestion } from '@/lib/groq'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor'].includes(profile.role)) throw new Error('Sin permisos')
  return supabase
}

async function generateAndCache(bookId: string, chapter: number): Promise<QuizQuestion[]> {
  const book = findBook(bookId)
  if (!book) throw new Error('Libro no encontrado')

  const plainText = await getChapterPlainText(bookId, chapter)
  if (!plainText) throw new Error('No se pudo cargar el texto del capítulo')

  const questions = await generateChapterQuiz(book.name, chapter, plainText)

  const service = createServiceClient()
  await service.from('bible_chapter_quizzes').upsert(
    { book_id: bookId, chapter, questions, model: 'openai/gpt-oss-120b' },
    { onConflict: 'book_id,chapter' },
  )

  return questions
}

export async function getChapterQuiz(bookId: string, chapter: number): Promise<QuizQuestion[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('bible_chapter_quizzes')
    .select('questions')
    .eq('book_id', bookId)
    .eq('chapter', chapter)
    .maybeSingle()

  if (data?.questions) return data.questions as QuizQuestion[]

  return generateAndCache(bookId, chapter)
}

export async function saveQuizResult(
  bookId: string, chapter: number, correct: number, total: number,
  answers: Record<number, number>,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_reading_log').upsert(
    {
      user_id: user.id, book_id: bookId, chapter,
      last_read_at: new Date().toISOString(),
      quiz_correct: correct, quiz_total: total, quiz_done_at: new Date().toISOString(),
      quiz_answers: answers,
    },
    { onConflict: 'user_id,book_id,chapter' },
  )
}

export interface SavedQuizResult {
  correct: number
  total: number
  answers: Record<number, number>
}

export async function getSavedQuizResult(bookId: string, chapter: number): Promise<SavedQuizResult | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('bible_reading_log')
    .select('quiz_correct, quiz_total, quiz_answers, quiz_done_at')
    .eq('user_id', user.id).eq('book_id', bookId).eq('chapter', chapter)
    .maybeSingle()
  if (!data?.quiz_done_at || !data.quiz_answers) return null
  return { correct: data.quiz_correct ?? 0, total: data.quiz_total ?? 0, answers: data.quiz_answers }
}

export async function regenerateChapterQuiz(bookId: string, chapter: number): Promise<void> {
  await getAdminClient()
  const service = createServiceClient()
  await service.from('bible_chapter_quizzes').delete().eq('book_id', bookId).eq('chapter', chapter)
  await generateAndCache(bookId, chapter)
  revalidatePath(`/biblia/lectura/${bookId}/${chapter}/cuestionario`)
}
