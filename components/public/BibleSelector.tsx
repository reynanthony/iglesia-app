'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, BookOpen, Loader2 } from 'lucide-react'
import { OT_BOOKS, NT_BOOKS, type BibleBook } from '@/lib/bible'
import { fetchVerseCount } from '@/app/actions/bible'

const GOLD  = '#C9A227'
const TEAL  = '#76ABAE'
const NAVY  = '#093C5D'

const OT_CATS = [
  { label: 'Pentateuco',        books: OT_BOOKS.slice(0, 5)   },
  { label: 'Libros históricos', books: OT_BOOKS.slice(5, 17)  },
  { label: 'Poética',           books: OT_BOOKS.slice(17, 22) },
  { label: 'Profetas mayores',  books: OT_BOOKS.slice(22, 27) },
  { label: 'Profetas menores',  books: OT_BOOKS.slice(27)     },
]

const NT_CATS = [
  { label: 'Evangelios',          books: NT_BOOKS.slice(0, 4)   },
  { label: 'Historia apostólica', books: NT_BOOKS.slice(4, 5)   },
  { label: 'Epístolas de Pablo',  books: NT_BOOKS.slice(5, 18)  },
  { label: 'Epístolas generales', books: NT_BOOKS.slice(18, 26) },
  { label: 'Profecía',            books: NT_BOOKS.slice(26)     },
]

type Step = 'books' | 'chapters' | 'verses'

export default function BibleSelector() {
  const router                        = useRouter()
  const sectionRef                    = useRef<HTMLDivElement>(null)
  const [step, setStep]               = useState<Step>('books')
  const [book, setBook]               = useState<BibleBook | null>(null)
  const [isOT, setIsOT]               = useState(true)
  const [chapter, setChapter]         = useState<number | null>(null)
  const [verseCount, setVerseCount]   = useState(0)
  const [loadingVerses, setLoading]   = useState(false)
  const [fading, setFading]           = useState(false)

  const accent = isOT ? GOLD : TEAL

  function transition(fn: () => void) {
    setFading(true)
    setTimeout(() => { fn(); setFading(false) }, 160)
  }

  function scroll() {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function selectBook(b: BibleBook, ot: boolean) {
    transition(() => { setBook(b); setIsOT(ot); setStep('chapters') })
    scroll()
  }

  async function selectChapter(n: number) {
    setChapter(n)
    setLoading(true)
    const count = await fetchVerseCount(book!.id, n)
    setLoading(false)
    if (count === 0) {
      // API no disponible — ir directo al lector
      router.push(`/biblia/lectura/${book!.id}/${n}`)
      return
    }
    setVerseCount(count)
    transition(() => setStep('verses'))
    scroll()
  }

  function selectVerse(n: number) {
    router.push(`/biblia/lectura/${book!.id}/${chapter}?verse=${n}`, { scroll: false })
  }

  function goToBooks() {
    transition(() => { setStep('books'); setBook(null); setChapter(null) })
  }

  function goToChapters() {
    transition(() => { setStep('chapters'); setChapter(null) })
  }

  return (
    <section id="selector" ref={sectionRef} style={{ background: '#F6F3EB', borderBottom: '1px solid #D2CDB8' }}>

      {/* ── Sticky breadcrumb ── */}
      <div
        className="sticky top-0 z-20 w-full flex items-center gap-2.5 px-6 py-2.5 overflow-x-auto no-scrollbar"
        style={{ background: 'rgba(246,243,235,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #D2CDB8' }}
      >
        <BookOpen size={10} style={{ color: `${NAVY}45`, flexShrink: 0 }} />

        {step === 'books' && (
          <>
            <Crumb label="La Biblia" dim />
            <Sep />
            <Crumb label="NTV" color={TEAL} bold />
            <Sep />
            <Crumb label="Elige un libro" dim />
          </>
        )}

        {step === 'chapters' && (
          <>
            <CrumbBtn label="Libros" onClick={goToBooks} />
            <Sep />
            <Crumb label={book?.name ?? ''} color={accent} bold />
            <Sep />
            <Crumb label="Elige un capítulo" dim />
          </>
        )}

        {step === 'verses' && (
          <>
            <CrumbBtn label="Libros" onClick={goToBooks} />
            <Sep />
            <CrumbBtn label={book?.name ?? ''} onClick={goToChapters} color={accent} />
            <Sep />
            <Crumb label={`Capítulo ${chapter}`} color={accent} bold />
            <Sep />
            <Crumb label="Elige un versículo" dim />
          </>
        )}
      </div>

      {/* ── Content ── */}
      <div
        className="max-w-6xl mx-auto px-6 py-16 md:py-24"
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(8px)' : 'none',
          transition: 'opacity 0.16s ease, transform 0.16s ease',
        }}
      >

        {/* STEP 1: Books */}
        {step === 'books' && (
          <div className="space-y-20">
            <Testament label="Antiguo Testamento" accent={GOLD} cats={OT_CATS} onSelect={(b) => selectBook(b, true)} />
            <Testament label="Nuevo Testamento"   accent={TEAL} cats={NT_CATS} onSelect={(b) => selectBook(b, false)} />
          </div>
        )}

        {/* STEP 2: Chapters */}
        {step === 'chapters' && book && (
          <div>
            <StepHeading
              eyebrow={isOT ? 'Antiguo Testamento' : 'Nuevo Testamento'}
              title={book.name}
              sub={`${book.chapters} capítulos · NTV`}
              accent={accent}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: 8 }}>
              {Array.from({ length: book.chapters }, (_, i) => i + 1).map(n => (
                <ChapterCard
                  key={n} n={n} accent={accent}
                  loading={loadingVerses && chapter === n}
                  onClick={() => selectChapter(n)}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Verses */}
        {step === 'verses' && book && chapter && (
          <div>
            <StepHeading
              eyebrow={`${book.name} · Capítulo ${chapter}`}
              title="¿Desde qué versículo?"
              sub={`${verseCount} versículos en este capítulo`}
              accent={accent}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: 7 }}>
              {Array.from({ length: verseCount }, (_, i) => i + 1).map(n => (
                <VerseCard key={n} n={n} accent={accent} onClick={() => selectVerse(n)} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

/* ─── Testament section ─── */
function Testament({
  label, accent, cats, onSelect,
}: {
  label: string
  accent: string
  cats: { label: string; books: BibleBook[] }[]
  onSelect: (b: BibleBook) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1" style={{ background: '#D2CDB8' }} />
        <p className="font-black uppercase" style={{ fontSize: 11, letterSpacing: '0.40em', color: accent }}>
          {label}
        </p>
        <div className="h-px flex-1" style={{ background: '#D2CDB8' }} />
      </div>
      <div className="space-y-10">
        {cats.map(cat => (
          <div key={cat.label}>
            <p className="font-bold uppercase mb-4" style={{ fontSize: 10, letterSpacing: '0.30em', color: `${NAVY}70` }}>
              {cat.label}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 10 }}>
              {cat.books.map(b => (
                <BookCard key={b.id} book={b} accent={accent} onClick={() => onSelect(b)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Book card — cream-tinted, visually rich ─── */
function BookCard({ book, accent, onClick }: { book: BibleBook; accent: string; onClick: () => void }) {
  const isGold = accent === GOLD

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97] focus-visible:outline-none overflow-hidden"
      style={{
        height: 96,
        background: isGold
          ? 'linear-gradient(150deg, #FDF6E3 0%, #F0E6C0 100%)'
          : 'linear-gradient(150deg, #EAF4F5 0%, #D6EAEC 100%)',
        border: `1px solid ${isGold ? '#DDD0A0' : '#A8CCCE'}`,
        boxShadow: '0 2px 6px rgba(9,60,93,0.08), 0 1px 2px rgba(9,60,93,0.05)',
        cursor: 'pointer',
      }}
    >
      {/* Decorative watermark: large chapter count */}
      <span
        style={{
          position: 'absolute', right: 4, bottom: -4,
          fontSize: 52, fontWeight: 900, lineHeight: 1,
          color: isGold ? 'rgba(201,162,39,0.14)' : 'rgba(118,171,174,0.18)',
          userSelect: 'none', pointerEvents: 'none',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {book.chapters}
      </span>

      {/* Top accent dot */}
      <div
        style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 20, height: 2, borderRadius: 99,
          background: isGold
            ? 'linear-gradient(90deg, transparent, #C9A227, transparent)'
            : 'linear-gradient(90deg, transparent, #76ABAE, transparent)',
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <span
        className="relative font-black text-center leading-tight px-2.5 mt-2"
        style={{ fontSize: 12.5, color: NAVY, lineHeight: 1.25, zIndex: 1 }}
      >
        {book.name}
      </span>
      <span
        className="relative mt-1.5"
        style={{ fontSize: 8.5, color: accent, opacity: 0.75, zIndex: 1 }}
      >
        {book.chapters} cap.
      </span>

      {/* Hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: `${accent}0A`,
          boxShadow: `inset 0 0 0 1px ${accent}30`,
          borderRadius: 'inherit',
        }}
      />
    </button>
  )
}

/* ─── Chapter card ─── */
function ChapterCard({ n, accent, loading, onClick }: { n: number; accent: string; loading?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="group relative flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-[1.06] active:scale-[0.95] focus-visible:outline-none"
      style={{
        height: 62,
        background: 'linear-gradient(150deg, #EDEAE0 0%, #E3DDD2 100%)',
        border: `1px solid ${accent}30`,
        cursor: loading ? 'default' : 'pointer',
      }}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" style={{ color: accent }} />
      ) : (
        <span className="font-black" style={{ fontSize: 17, color: NAVY }}>{n}</span>
      )}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-xl"
        style={{ background: `${accent}14`, boxShadow: `inset 0 0 0 1px ${accent}50` }}
      />
    </button>
  )
}

/* ─── Verse card ─── */
function VerseCard({ n, accent, onClick }: { n: number; accent: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-[1.08] active:scale-[0.95] focus-visible:outline-none"
      style={{
        height: 54,
        background: 'linear-gradient(150deg, #F6F3EB 0%, #EDE9DF 100%)',
        border: `1px solid ${accent}25`,
        cursor: 'pointer',
      }}
    >
      <span className="font-bold" style={{ fontSize: 14, color: NAVY }}>{n}</span>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-xl"
        style={{ background: `${accent}12`, boxShadow: `inset 0 0 0 1px ${accent}45` }}
      />
    </button>
  )
}

/* ─── Step heading ─── */
function StepHeading({ eyebrow, title, sub, accent }: { eyebrow: string; title: string; sub: string; accent: string }) {
  return (
    <div className="mb-12">
      <p className="font-bold uppercase mb-2" style={{ fontSize: 9, letterSpacing: '0.42em', color: `${accent}90` }}>
        {eyebrow}
      </p>
      <h2 className="font-black tracking-tighter leading-none mb-2"
        style={{ fontSize: 'clamp(2.8rem, 9vw, 6rem)', color: NAVY }}>
        {title}
      </h2>
      <p style={{ fontSize: 13, color: `${NAVY}45` }}>{sub}</p>
    </div>
  )
}

/* ─── Breadcrumb helpers ─── */
function Crumb({ label, color, bold, dim }: { label: string; color?: string; bold?: boolean; dim?: boolean }) {
  return (
    <span
      className="text-[9px] uppercase tracking-[0.34em] whitespace-nowrap flex-shrink-0"
      style={{ color: color ?? (dim ? `${NAVY}38` : `${NAVY}60`), fontWeight: bold ? 900 : 700 }}
    >
      {label}
    </span>
  )
}

function CrumbBtn({ label, onClick, color }: { label: string; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 flex-shrink-0 transition-opacity hover:opacity-60"
      style={{ color: color ?? `${NAVY}55` }}
    >
      <ChevronLeft size={10} />
      <span className="text-[9px] font-bold uppercase tracking-[0.32em]">{label}</span>
    </button>
  )
}

function Sep() {
  return <span className="flex-shrink-0 select-none" style={{ color: '#D2CDB8', fontSize: 9 }}>·</span>
}
