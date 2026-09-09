import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { findBook } from '@/lib/bible'
import { createClient } from '@/lib/supabase/server'
import { getChapterQuiz, regenerateChapterQuiz } from '@/app/actions/bible-quiz'
import ChapterQuiz from '@/components/public/ChapterQuiz'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

export const revalidate = 0

export default async function ChapterQuizPage({
  params,
}: {
  params: Promise<{ bookId: string; chapter: string }>
}) {
  const { bookId, chapter } = await params
  const book = findBook(bookId)
  const chapterNum = parseInt(chapter, 10)
  if (!book || isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapters) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    isAdmin = !!profile && ['admin', 'pastor'].includes(profile.role)
  }

  let questions = null
  let error: string | null = null
  try {
    questions = await getChapterQuiz(book.id, chapterNum)
  } catch (e) {
    error = e instanceof Error ? e.message : 'No se pudo generar el cuestionario.'
  }

  const regenerateAction = regenerateChapterQuiz.bind(null, book.id, chapterNum)

  return (
    <div style={{ background: BG, color: INK, minHeight: '100vh' }}>
      <div className="max-w-xl mx-auto px-6 py-12 md:py-16">
        <Link href={`/biblia/lectura/${book.id}/${chapterNum}`}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.30em] mb-6 transition hover:opacity-70"
          style={{ color: MUTED }}>
          <ArrowLeft size={11} /> {book.name} {chapterNum}
        </Link>

        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: `${GOLD}99` }}>
          Cuestionario
        </p>
        <h1 className="font-black tracking-tighter mb-8" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.2rem)', lineHeight: 0.95 }}>
          {book.name} {chapterNum}
        </h1>

        {error && (
          <div className="rounded-2xl p-6 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-sm mb-1" style={{ color: INK }}>No se pudo generar el cuestionario.</p>
            <p className="text-xs" style={{ color: MUTED }}>{error}</p>
          </div>
        )}

        {questions && <ChapterQuiz bookId={book.id} chapter={chapterNum} questions={questions} />}

        {isAdmin && !error && (
          <form action={regenerateAction} className="mt-6">
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition"
              style={{ background: CARD, border: `1px solid ${BORDER}`, color: MUTED }}>
              <RefreshCw size={12} /> Regenerar cuestionario
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
