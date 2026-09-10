'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, BookOpen, Loader2, Search, Check, Sun, Moon, Quote } from 'lucide-react'
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
              icon={Quote}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))', gap: 10 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))', gap: 12 }}>
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

/* ─── Book card — lomo de libro: letra inicial de fondo, progreso integrado ─── */
function BookCard({
  book, accent, chaptersRead, s, onClick,
}: { book: BibleBook; accent: string; chaptersRead: number; s: SelPalette; onClick: () => void }) {
  const pct = Math.min(100, Math.round((chaptersRead / book.chapters) * 100))
  const complete = pct >= 100
  const initial = book.name.charAt(0)
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col justify-end rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.97] focus-visible:outline-none text-left overflow-hidden"
      style={{
        aspectRatio: '3 / 4',
        background: s.cardBg,
        border: `1px solid ${s.cardBorder}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      {/* Letra inicial — marca de agua editorial */}
      <span
        aria-hidden
        className="font-display absolute -top-4 -right-1 font-black leading-none select-none pointer-events-none transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5"
        style={{ fontSize: 72, color: accent, opacity: 0.12 }}
      >
        {initial}
      </span>

      {/* Lavado de color al hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(165deg, ${accent}16, transparent 62%)` }}
      />

      {/* Insignia de completado */}
      {complete && (
        <div
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center z-[1]"
          style={{ background: accent, boxShadow: `0 2px 8px -2px ${accent}80` }}
        >
          <Check size={11} strokeWidth={3} style={{ color: '#FFFFFF' }} />
        </div>
      )}

      {/* Contenido */}
      <div className="relative z-[1] px-3.5 pt-3.5 pb-3">
        <p className="font-display font-black leading-[1.08] mb-1.5" style={{ fontSize: 15, color: s.text }}>
          {book.name}
        </p>
        <p className="font-bold uppercase tracking-wider" style={{ fontSize: 9, letterSpacing: '0.08em', color: pct > 0 ? accent : s.textDim }}>
          {pct > 0 ? `${chaptersRead} de ${book.chapters} leídos` : `${book.chapters} capítulos`}
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="relative h-[3px]" style={{ background: `${accent}18` }}>
        {pct > 0 && (
          <div className="h-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, background: accent }} />
        )}
      </div>

      {/* Borde de foco/hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${accent}55` }}
      />
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

/* ─── Verse card — chip circular, no caja cuadrada ─── */
function VerseCard({
  n, accent, read, s, onClick,
}: { n: number; accent: string; read?: boolean; s: SelPalette; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center justify-center rounded-full transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.95] focus-visible:outline-none"
      style={{
        aspectRatio: '1 / 1',
        width: '100%',
        background: read ? accent : s.cardBg,
        border: `1px solid ${read ? accent : s.cardBorder}`,
        cursor: 'pointer',
      }}
    >
      <span className="font-bold" style={{ fontSize: 13, color: read ? '#FFFFFF' : s.text }}>{n}</span>
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ boxShadow: `inset 0 0 0 1.5px ${read ? '#FFFFFF' : accent}` }}
      />
    </button>
  )
}

/* ─── Step heading ─── */
function StepHeading({
  eyebrow, title, sub, accent, s, icon: Icon,
}: { eyebrow: string; title: string; sub: string; accent: string; s: SelPalette; icon?: typeof Quote }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${accent}18` }}>
            <Icon size={12} style={{ color: accent }} />
          </div>
        )}
        <p className="font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.42em', color: `${accent}90` }}>
          {eyebrow}
        </p>
      </div>
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
