'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, BookOpen, Loader2, Search, Check, Sun, Moon } from 'lucide-react'
import { OT_BOOKS, NT_BOOKS, type BibleBook } from '@/lib/bible'
import { fetchVerseCount } from '@/app/actions/bible'

type ReadingLog = Record<string, Record<number, { readUpTo: number; read: boolean }>>
type SelTheme = 'light' | 'dark'

interface SelPalette {
  bg: string; border: string; cardBg: string; cardBorder: string
  text: string; textDim: string; textDim2: string; breadcrumbBg: string
}

const SEL: Record<SelTheme, SelPalette> = {
  light: {
    bg: '#F6F3EB', border: '#D2CDB8', cardBg: '#FFFFFF', cardBorder: '#E3DDD2',
    text: '#093C5D', textDim: 'rgba(9,60,93,0.5)', textDim2: 'rgba(9,60,93,0.6)',
    breadcrumbBg: 'rgba(246,243,235,0.97)',
  },
  dark: {
    bg: '#101217', border: '#292E3B', cardBg: '#181A22', cardBorder: '#292E3B',
    text: '#FFFFFF', textDim: 'rgba(255,255,255,0.5)', textDim2: 'rgba(255,255,255,0.62)',
    breadcrumbBg: 'rgba(16,18,23,0.95)',
  },
}

const GOLD  = '#C9A227'
const TEAL  = '#76ABAE'

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

export default function BibleSelector({ readingLog }: { readingLog?: ReadingLog }) {
  const router                        = useRouter()
  const sectionRef                    = useRef<HTMLDivElement>(null)
  const [step, setStep]               = useState<Step>('books')
  const [book, setBook]               = useState<BibleBook | null>(null)
  const [isOT, setIsOT]               = useState(true)
  const [chapter, setChapter]         = useState<number | null>(null)
  const [verseCount, setVerseCount]   = useState(0)
  const [loadingVerses, setLoading]   = useState(false)
  const [fading, setFading]           = useState(false)
  const [theme, setTheme]             = useState<SelTheme>('light')

  const accent = isOT ? GOLD : TEAL
  const s = SEL[theme]

  // Comparte preferencia con el tema oscuro/claro del lector (bible-theme):
  // 'dark' allá equivale a 'dark' acá, cualquier otro valor es 'light'.
  useEffect(() => {
    const saved = localStorage.getItem('bible-theme')
    setTheme(saved === 'dark' ? 'dark' : 'light')
  }, [])

  function toggleTheme() {
    const next: SelTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('bible-theme', next === 'dark' ? 'dark' : 'cream')
  }

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
    <section id="selector" ref={sectionRef} style={{ background: s.bg, borderBottom: `1px solid ${s.border}`, transition: 'background 0.2s' }}>

      {/* ── Sticky breadcrumb ── */}
      <div
        className="sticky top-0 z-20 w-full flex items-center gap-2.5 px-6 py-2.5 overflow-x-auto no-scrollbar"
        style={{ background: s.breadcrumbBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${s.border}` }}
      >
        <BookOpen size={10} style={{ color: s.textDim, flexShrink: 0 }} />

        {step === 'books' && (
          <>
            <Crumb label="La Biblia" dim s={s} />
            <Sep s={s} />
            <Crumb label="RVR1960" color={TEAL} bold s={s} />
            <Sep s={s} />
            <Crumb label="Elige un libro" dim s={s} />
          </>
        )}

        {step === 'chapters' && (
          <>
            <CrumbBtn label="Libros" onClick={goToBooks} s={s} />
            <Sep s={s} />
            <Crumb label={book?.name ?? ''} color={accent} bold s={s} />
            <Sep s={s} />
            <Crumb label="Elige un capítulo" dim s={s} />
          </>
        )}

        {step === 'verses' && (
          <>
            <CrumbBtn label="Libros" onClick={goToBooks} s={s} />
            <Sep s={s} />
            <CrumbBtn label={book?.name ?? ''} onClick={goToChapters} color={accent} s={s} />
            <Sep s={s} />
            <Crumb label={`Capítulo ${chapter}`} color={accent} bold s={s} />
            <Sep s={s} />
            <Crumb label="Elige un versículo" dim s={s} />
          </>
        )}

        <div className="ml-auto flex-shrink-0 flex items-center gap-4">
          <button onClick={toggleTheme}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-60"
            style={{ color: s.textDim2 }}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            {theme === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
            <span className="text-[9px] font-bold uppercase tracking-[0.32em]">
              {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </span>
          </button>
          <Link href="/biblia/buscar"
            className="flex items-center gap-1.5 transition-opacity hover:opacity-60"
            style={{ color: s.textDim2 }}>
            <Search size={11} />
            <span className="text-[9px] font-bold uppercase tracking-[0.32em]">Buscar</span>
          </Link>
        </div>
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
            <Testament label="Antiguo Testamento" accent={GOLD} cats={OT_CATS} onSelect={(b) => selectBook(b, true)} readingLog={readingLog} s={s} />
            <Testament label="Nuevo Testamento"   accent={TEAL} cats={NT_CATS} onSelect={(b) => selectBook(b, false)} readingLog={readingLog} s={s} />
          </div>
        )}

        {/* STEP 2: Chapters */}
        {step === 'chapters' && book && (
          <div>
            <StepHeading
              eyebrow={isOT ? 'Antiguo Testamento' : 'Nuevo Testamento'}
              title={book.name}
              sub={`${book.chapters} capítulos · RVR1960`}
              accent={accent}
              s={s}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: 8 }}>
              {Array.from({ length: book.chapters }, (_, i) => i + 1).map(n => {
                const progress = readingLog?.[book.id]?.[n]
                return (
                  <ChapterCard
                    key={n} n={n} accent={accent} s={s}
                    loading={loadingVerses && chapter === n}
                    read={!!progress?.read}
                    inProgress={!progress?.read && !!progress && progress.readUpTo > 0}
                    onClick={() => selectChapter(n)}
                  />
                )
              })}
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
              s={s}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: 7 }}>
              {(() => {
                const readUpTo = readingLog?.[book.id]?.[chapter]?.readUpTo ?? 0
                return Array.from({ length: verseCount }, (_, i) => i + 1).map(n => (
                  <VerseCard key={n} n={n} accent={accent} s={s} read={n <= readUpTo} onClick={() => selectVerse(n)} />
                ))
              })()}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

/* ─── Testament section ─── */
function Testament({
  label, accent, cats, onSelect, readingLog, s,
}: {
  label: string
  accent: string
  cats: { label: string; books: BibleBook[] }[]
  onSelect: (b: BibleBook) => void
  readingLog?: ReadingLog
  s: SelPalette
}) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1" style={{ background: s.border }} />
        <p className="font-black uppercase" style={{ fontSize: 11, letterSpacing: '0.40em', color: accent }}>
          {label}
        </p>
        <div className="h-px flex-1" style={{ background: s.border }} />
      </div>
      <div className="space-y-10">
        {cats.map(cat => (
          <div key={cat.label}>
            <p className="font-bold uppercase mb-4" style={{ fontSize: 10, letterSpacing: '0.30em', color: s.textDim2 }}>
              {cat.label}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 10 }}>
              {cat.books.map(b => {
                const bookLog = readingLog?.[b.id]
                const chaptersRead = bookLog ? Object.keys(bookLog).length : 0
                return (
                  <BookCard key={b.id} book={b} accent={accent} chaptersRead={chaptersRead} s={s} onClick={() => onSelect(b)} />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Book card — flat, modern, accent stripe ─── */
function BookCard({
  book, accent, chaptersRead, s, onClick,
}: { book: BibleBook; accent: string; chaptersRead: number; s: SelPalette; onClick: () => void }) {
  const pct = Math.min(100, Math.round((chaptersRead / book.chapters) * 100))
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start justify-between rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] focus-visible:outline-none text-left overflow-hidden"
      style={{
        height: 92,
        padding: '13px 14px 12px',
        background: s.cardBg,
        border: `1px solid ${s.cardBorder}`,
        borderTop: `3px solid ${accent}`,
        cursor: 'pointer',
      }}
    >
      <span
        className="relative font-black leading-tight"
        style={{ fontSize: 13, color: s.text, lineHeight: 1.28, zIndex: 1 }}
      >
        {book.name}
      </span>
      <span
        className="relative inline-flex items-center self-start px-1.5 py-0.5 rounded-md font-bold"
        style={{ fontSize: 9, color: accent, background: `${accent}14`, zIndex: 1 }}
      >
        {pct > 0 ? `${chaptersRead}/${book.chapters} leídos` : `${book.chapters} cap.`}
      </span>

      {/* Hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: `${accent}08` }}
      />

      {/* Progreso de lectura */}
      {pct > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: `${accent}20` }}>
          <div className="h-full" style={{ width: `${pct}%`, background: accent }} />
        </div>
      )}
    </button>
  )
}

/* ─── Chapter card ─── */
function ChapterCard({
  n, accent, loading, read, inProgress, s, onClick,
}: { n: number; accent: string; loading?: boolean; read?: boolean; inProgress?: boolean; s: SelPalette; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="group relative flex items-center justify-center rounded-lg transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.95] focus-visible:outline-none"
      style={{
        height: 58,
        background: read ? accent : s.cardBg,
        border: `1px solid ${read ? accent : inProgress ? `${accent}80` : s.cardBorder}`,
        cursor: loading ? 'default' : 'pointer',
      }}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" style={{ color: accent }} />
      ) : read ? (
        <Check size={16} strokeWidth={3} style={{ color: '#FFFFFF' }} />
      ) : (
        <span className="font-black" style={{ fontSize: 16, color: s.text }}>{n}</span>
      )}
      {inProgress && !read && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
      )}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ boxShadow: `inset 0 0 0 1.5px ${read ? '#FFFFFF' : accent}` }}
      />
    </button>
  )
}

/* ─── Verse card ─── */
function VerseCard({
  n, accent, read, s, onClick,
}: { n: number; accent: string; read?: boolean; s: SelPalette; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center justify-center rounded-lg transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.95] focus-visible:outline-none"
      style={{
        height: 48,
        background: read ? `${accent}14` : s.cardBg,
        border: `1px solid ${read ? `${accent}60` : s.cardBorder}`,
        cursor: 'pointer',
      }}
    >
      <span className="font-bold" style={{ fontSize: 13, color: read ? accent : s.text }}>{n}</span>
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ boxShadow: `inset 0 0 0 1.5px ${accent}` }}
      />
    </button>
  )
}

/* ─── Step heading ─── */
function StepHeading({
  eyebrow, title, sub, accent, s,
}: { eyebrow: string; title: string; sub: string; accent: string; s: SelPalette }) {
  return (
    <div className="mb-12">
      <p className="font-bold uppercase mb-2" style={{ fontSize: 9, letterSpacing: '0.42em', color: `${accent}90` }}>
        {eyebrow}
      </p>
      <h2 className="font-black tracking-tighter leading-none mb-2"
        style={{ fontSize: 'clamp(2.8rem, 9vw, 6rem)', color: s.text }}>
        {title}
      </h2>
      <p style={{ fontSize: 13, color: s.textDim2 }}>{sub}</p>
    </div>
  )
}

/* ─── Breadcrumb helpers ─── */
function Crumb({
  label, color, bold, dim, s,
}: { label: string; color?: string; bold?: boolean; dim?: boolean; s: SelPalette }) {
  return (
    <span
      className="text-[9px] uppercase tracking-[0.34em] whitespace-nowrap flex-shrink-0"
      style={{ color: color ?? (dim ? s.textDim : s.text), fontWeight: bold ? 900 : 700 }}
    >
      {label}
    </span>
  )
}

function CrumbBtn({
  label, onClick, color, s,
}: { label: string; onClick: () => void; color?: string; s: SelPalette }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 flex-shrink-0 transition-opacity hover:opacity-60"
      style={{ color: color ?? s.textDim2 }}
    >
      <ChevronLeft size={10} />
      <span className="text-[9px] font-bold uppercase tracking-[0.32em]">{label}</span>
    </button>
  )
}

function Sep({ s }: { s: SelPalette }) {
  return <span className="flex-shrink-0 select-none" style={{ color: s.border, fontSize: 9 }}>·</span>
}
