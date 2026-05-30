import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { findBook, prevChapter, nextChapter, getChapterContent, ALL_BOOKS } from '@/lib/bible'

export const revalidate = 86400

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

export default async function BibleChapterPage({
  params,
}: {
  params: Promise<{ bookId: string; chapter: string }>
}) {
  const { bookId, chapter } = await params
  const book = findBook(bookId)
  if (!book) notFound()

  const chapterNum = parseInt(chapter, 10)
  if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapters) notFound()

  const content = await getChapterContent(book.id, chapterNum)

  const prev = prevChapter(book.id, chapterNum)
  const next = nextChapter(book.id, chapterNum)

  return (
    <div>

      {/* TOP NAV */}
      <div style={{ background: '#051828', borderBottom: '1px solid rgba(118,171,174,0.10)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/biblia"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] flex-shrink-0"
            style={{ color: `${TEAL}70` }}>
            <ArrowLeft size={11} /> Biblia
          </Link>
          <div className="flex-1 flex items-center justify-center gap-3">
            <span className="text-[12px] font-black text-white">{book.name} {chapterNum}</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] px-2 py-0.5 rounded"
              style={{ background: `${TEAL}18`, color: TEAL }}>RVR1960</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {prev ? (
              <Link href={`/biblia/lectura/${prev.bookId}/${prev.chapter}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-white/10"
                style={{ border: '1px solid rgba(118,171,174,0.20)' }}>
                <ChevronLeft size={14} style={{ color: `${TEAL}80` }} />
              </Link>
            ) : <div className="w-8 h-8" />}
            {next ? (
              <Link href={`/biblia/lectura/${next.bookId}/${next.chapter}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-white/10"
                style={{ border: '1px solid rgba(118,171,174,0.20)' }}>
                <ChevronRight size={14} style={{ color: `${TEAL}80` }} />
              </Link>
            ) : <div className="w-8 h-8" />}
          </div>
        </div>
      </div>

      {/* CHAPTER HEADER */}
      <section style={{ background: NAVY }}>
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 text-[9px] font-black uppercase tracking-[0.25em]"
            style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}>
            <BookOpen size={10} /> {book.name}
          </div>
          <h1 className="font-display font-black tracking-tighter text-white"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.88 }}>
            Capítulo {chapterNum}
          </h1>
          {content && (
            <p className="text-[11px] mt-4" style={{ color: 'rgba(246,243,235,0.35)' }}>
              {content.verseCount} versículos
            </p>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ background: CREAM }}>
        <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
          {content ? (
            <>
              {/* Bible HTML from API.Bible */}
              <style>{`
                .bible-content .v {
                  font-size: 0.6rem; font-weight: 800; vertical-align: super;
                  margin-right: 3px; color: ${TEAL}; letter-spacing: 0.05em;
                }
                .bible-content p {
                  margin-bottom: 1.25rem; line-height: 1.85;
                  color: ${NAVY}CC; font-size: 1rem;
                }
                .bible-content .s1, .bible-content .s2 {
                  font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
                  letter-spacing: 0.15em; color: ${SAGE}; margin: 2rem 0 0.75rem;
                }
                .bible-content .q1, .bible-content .q2 {
                  padding-left: 1.5rem; border-left: 2px solid ${TEAL}40;
                  margin-bottom: 0.5rem;
                }
              `}</style>
              <div className="bible-content"
                dangerouslySetInnerHTML={{ __html: content.content }} />
            </>
          ) : (
            <div className="text-center py-24">
              <BookOpen size={40} style={{ color: `${TEAL}60`, margin: '0 auto 16px' }} />
              <p className="font-black text-lg mb-2" style={{ color: NAVY }}>Contenido no disponible</p>
              <p className="text-sm" style={{ color: `${NAVY}60` }}>
                Verifica que la clave <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#EDEAE0' }}>BIBLE_API_KEY</code> esté configurada.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CHAPTER NAVIGATION */}
      <section style={{ background: '#EDEAE0', borderTop: '1px solid #D2CDB8' }}>
        <div className="max-w-3xl mx-auto px-6 py-10 flex items-center justify-between gap-4">
          {prev ? (
            <Link href={`/biblia/lectura/${prev.bookId}/${prev.chapter}`}
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition"
              style={{ background: CREAM, color: NAVY, border: '1px solid #D2CDB8' }}>
              <ChevronLeft size={14} />
              {prev.bookId !== book.id ? findBook(prev.bookId)?.name : `Cap. ${prev.chapter}`}
            </Link>
          ) : <div />}

          {/* Chapter list quick-jump */}
          <div className="flex flex-wrap gap-1.5 justify-center flex-1 max-w-xs mx-auto">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map(n => (
              <Link key={n} href={`/biblia/lectura/${book.id}/${n}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition"
                style={{
                  background: n === chapterNum ? NAVY : '#D2CDB8',
                  color: n === chapterNum ? CREAM : NAVY,
                }}>
                {n}
              </Link>
            ))}
          </div>

          {next ? (
            <Link href={`/biblia/lectura/${next.bookId}/${next.chapter}`}
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition"
              style={{ background: NAVY, color: CREAM }}>
              {next.bookId !== book.id ? findBook(next.bookId)?.name : `Cap. ${next.chapter}`}
              <ChevronRight size={14} />
            </Link>
          ) : <div />}
        </div>
      </section>

      {/* BOOK LIST */}
      <section style={{ background: CREAM, borderTop: '1px solid #D2CDB8' }}>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6" style={{ color: SAGE }}>— Otros libros</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
            {ALL_BOOKS.map(b => (
              <Link key={b.id} href={`/biblia/lectura/${b.id}/1`}
                className="px-2 py-1.5 rounded-lg text-center transition"
                style={{
                  background: b.id === book.id ? NAVY : '#EDEAE0',
                  color: b.id === book.id ? CREAM : `${NAVY}80`,
                  fontSize: '10px', fontWeight: 700,
                }}>
                {b.name.split(' ').length > 1 ? b.name.replace(' ', ' ') : b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ background: NAVY }}>
        <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/biblia"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'rgba(246,243,235,0.45)' }}>
            <ArrowLeft size={12} /> Biblia
          </Link>
          <Link href="/registro"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl"
            style={{ background: TEAL, color: NAVY }}>
            Unirme a la comunidad <ArrowRight size={12} />
          </Link>
        </div>
      </section>

    </div>
  )
}
