'use server'

import { getChapterContent } from '@/lib/bible-content'
import { createClient } from '@/lib/supabase/server'

export async function fetchVerseCount(bookId: string, chapter: number): Promise<number> {
  const data = await getChapterContent(bookId, chapter)
  return data?.verseCount ?? 0
}

export async function upsertBibleHighlight(
  bookId: string, chapter: number, verse: number, colorIndex: number,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_highlights').upsert(
    { user_id: user.id, book_id: bookId, chapter, verse, color_index: colorIndex },
    { onConflict: 'user_id,book_id,chapter,verse' },
  )
}

export async function deleteBibleHighlight(
  bookId: string, chapter: number, verse: number,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_highlights')
    .delete()
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .eq('chapter', chapter)
    .eq('verse', verse)
}

export async function upsertBibleNote(
  bookId: string, chapter: number, verse: number, content: string,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_notes').upsert(
    { user_id: user.id, book_id: bookId, chapter, verse, content, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,book_id,chapter,verse' },
  )
}

export async function deleteBibleNote(
  bookId: string, chapter: number, verse: number,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_notes')
    .delete()
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .eq('chapter', chapter)
    .eq('verse', verse)
}

export async function upsertBibleBookmark(
  bookId: string, chapter: number, verse: number, verseText: string,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_bookmarks').upsert(
    { user_id: user.id, book_id: bookId, chapter, verse, verse_text: verseText },
    { onConflict: 'user_id,book_id,chapter,verse' },
  )
}

export async function deleteBibleBookmark(
  bookId: string, chapter: number, verse: number,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_bookmarks')
    .delete()
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .eq('chapter', chapter)
    .eq('verse', verse)
}

export async function upsertReadingPosition(
  bookId: string, chapter: number,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_reading_position').upsert(
    { user_id: user.id, book_id: bookId, chapter, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
}

// Marca explícita del botón "Marcar como leído" — distinta del progreso
// pasivo de scroll (updateReadProgress). Al confirmarlo, también se
// considera el capítulo recorrido de punta a punta.
export async function logChapterRead(
  bookId: string, chapter: number, verseCount: number,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const now = new Date().toISOString()
  await supabase.from('bible_reading_log').upsert(
    {
      user_id: user.id, book_id: bookId, chapter,
      last_read_at: now, marked_read_at: now, read_up_to_verse: verseCount,
    },
    { onConflict: 'user_id,book_id,chapter' },
  )
}

// Progreso pasivo: hasta qué verso ha llegado el scroll, para que la
// atenuación de versos ya leídos persista entre visitas. No toca
// marked_read_at — esa es una confirmación aparte, explícita.
export async function updateReadProgress(
  bookId: string, chapter: number, upToVerse: number,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('bible_reading_log').upsert(
    { user_id: user.id, book_id: bookId, chapter, last_read_at: new Date().toISOString(), read_up_to_verse: upToVerse },
    { onConflict: 'user_id,book_id,chapter' },
  )
}
