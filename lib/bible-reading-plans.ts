import { findBook } from '@/lib/bible'

export function formatDayReference(bookId: string, chapterStart: number, chapterEnd: number): string {
  const name = findBook(bookId)?.name ?? bookId
  return chapterStart === chapterEnd ? `${name} ${chapterStart}` : `${name} ${chapterStart}–${chapterEnd}`
}
