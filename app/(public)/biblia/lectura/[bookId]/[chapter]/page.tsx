import { notFound } from 'next/navigation'
import { findBook, prevChapter, nextChapter, getChapterContent, ALL_BOOKS } from '@/lib/bible'
import { BibleReader } from '@/components/public/BibleReader'
import { createClient } from '@/lib/supabase/server'
import type { RelatedContent } from '@/components/public/BibleReader'

function parseReferenceChapter(reference: string): { bookName: string; chapter: number } | null {
  const m = reference.match(/^(.+?)\s+(\d+)(?:[:\s,–—-]|$)/)
  if (!m) return null
  return { bookName: m[1].trim().toLowerCase(), chapter: parseInt(m[2], 10) }
}

function referencesChapter(reference: string, bookId: string, chapterNum: number): boolean {
  const book = findBook(bookId)
  if (!book) return false
  const parsed = parseReferenceChapter(reference)
  if (!parsed) return false
  const nameVariants = [book.name.toLowerCase()]
  if (book.id === 'PSA') nameVariants.push('salmo')
  return nameVariants.includes(parsed.bookName) && parsed.chapter === chapterNum
}

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

  const [content, supabase] = await Promise.all([
    getChapterContent(book.id, chapterNum),
    createClient(),
  ])

  const prev = prevChapter(book.id, chapterNum)
  const next = nextChapter(book.id, chapterNum)
  const startVerse = verse ? parseInt(verse, 10) : undefined

  const { data: { user } } = await supabase.auth.getUser()

  let initialHighlights: Record<string, number> | undefined
  let initialNotes: Record<string, string> | undefined

  // Name pattern for querying related content (Salmos -> Salmo%)
  const bookNamePattern = book.id === 'PSA' ? 'Salmo%' : `${book.name}%`

  const [hlResult, noteResult, verseResult, sessionResult] = await Promise.all([
    user
      ? supabase.from('bible_highlights')
          .select('verse, color_index')
          .eq('user_id', user.id)
          .eq('book_id', book.id)
          .eq('chapter', chapterNum)
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('bible_notes')
          .select('verse, content')
          .eq('user_id', user.id)
          .eq('book_id', book.id)
          .eq('chapter', chapterNum)
      : Promise.resolve({ data: null }),
    supabase.from('lesson_bible_verses')
      .select(`
        reference,
        discipleship_lessons!inner(
          id, title, is_active,
          discipleship_courses!inner(
            slug, is_active,
            discipleship_programs!inner(slug)
          )
        )
      `)
      .ilike('reference', `${bookNamePattern}%`),
    supabase.from('bible_study_sessions')
      .select(`
        id, title, slug, reference,
        bible_study_series!inner(title, slug, status, is_active)
      `)
      .eq('is_active', true)
      .ilike('reference', `${bookNamePattern}%`),
  ])

  if (hlResult.data) {
    initialHighlights = Object.fromEntries(
      hlResult.data.map((r: any) => [String(r.verse), r.color_index]),
    )
  }
  if (noteResult.data) {
    initialNotes = Object.fromEntries(
      noteResult.data.map((r: any) => [String(r.verse), r.content]),
    )
  }

  const relatedLessons = (verseResult.data ?? [])
    .filter((v: any) => {
      const lesson = v.discipleship_lessons
      const course = lesson?.discipleship_courses
      return lesson?.is_active && course?.is_active &&
        referencesChapter(v.reference, book.id, chapterNum)
    })
    .map((v: any) => ({
      id: v.discipleship_lessons.id as string,
      title: v.discipleship_lessons.title as string,
      reference: v.reference as string,
      programSlug: v.discipleship_lessons.discipleship_courses.discipleship_programs.slug as string,
      courseSlug: v.discipleship_lessons.discipleship_courses.slug as string,
    }))
    .filter((l, i, arr) => arr.findIndex(x => x.id === l.id) === i)

  const relatedSessions = (sessionResult.data ?? [])
    .filter((s: any) => {
      const series = s.bible_study_series
      return series?.is_active && series?.status === 'active' &&
        referencesChapter(s.reference, book.id, chapterNum)
    })
    .map((s: any) => ({
      id: s.id as string,
      title: s.title as string,
      reference: s.reference as string,
      seriesSlug: s.bible_study_series.slug as string,
      sessionSlug: s.slug as string,
      seriesTitle: s.bible_study_series.title as string,
    }))

  const relatedContent: RelatedContent | undefined =
    relatedLessons.length > 0 || relatedSessions.length > 0
      ? { lessons: relatedLessons, sessions: relatedSessions }
      : undefined

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
      userId={user?.id}
      initialHighlights={initialHighlights}
      initialNotes={initialNotes}
      relatedContent={relatedContent}
    />
  )
}
