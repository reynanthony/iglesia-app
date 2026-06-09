'use server'

import { getChapterContent } from '@/lib/bible'

export async function fetchVerseCount(bookId: string, chapter: number): Promise<number> {
  const data = await getChapterContent(bookId, chapter)
  return data?.verseCount ?? 0
}
