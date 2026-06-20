'use server'

import { getChapterContent } from '@/lib/bible'
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
