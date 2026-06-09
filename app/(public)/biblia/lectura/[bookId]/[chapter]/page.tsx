import { notFound } from 'next/navigation'
import { findBook, prevChapter, nextChapter, getChapterContent, ALL_BOOKS } from '@/lib/bible'
import { BibleReader } from '@/components/public/BibleReader'

export const revalidate = 86400

export default async function BibleChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookId: string; chapter: string }>
  searchParams: Promise<{ verse?: string }>
}) {
  const { bookId, chapter } = await params
  const { verse } = await searchParams
  const book = findBook(bookId)
  if (!book) notFound()

  const chapterNum = parseInt(chapter, 10)
  if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapters) notFound()

  const content = await getChapterContent(book.id, chapterNum)
  const prev = prevChapter(book.id, chapterNum)
  const next = nextChapter(book.id, chapterNum)

  const startVerse = verse ? parseInt(verse, 10) : undefined

  return (
    <BibleReader
      bookId={book.id}
      bookName={book.name}
      chapterNum={chapterNum}
      content={content?.content ?? null}
      verseCount={content?.verseCount ?? 0}
      prev={prev}
      next={next}
      allBooks={ALL_BOOKS}
      startVerse={startVerse}
    />
  )
}
