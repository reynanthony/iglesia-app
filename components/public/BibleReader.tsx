'use client'

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Copy, Share2, ChevronLeft, ChevronRight,
  BookOpen, Check, X, Bookmark, FileText, Image, ScrollText,
} from 'lucide-react'
import type { BibleBook } from '@/lib/bible'
import {
  upsertBibleHighlight, deleteBibleHighlight,
  upsertBibleNote, deleteBibleNote,
} from '@/app/actions/bible'

// ── Types ──────────────────────────────────────────────────────
type Theme      = 'cream' | 'sepia' | 'dark'
type FontSize   = 'sm' | 'md' | 'lg'
type Highlights = Record<string, number>   // verse number → color index
type Notes      = Record<string, string>   // verse number → note text

export interface BookmarkItem {
  bookId: string
  chapterNum: number
  verseNum: string
  ref: string
  text: string
  savedAt: string
}

interface VerseSelection { num: string; ref: string; text: string }

export interface RelatedContent {
  lessons: Array<{
    id: string; title: string; reference: string
    programSlug: string; courseSlug: string
  }>
  sessions: Array<{
    id: string; title: string; reference: string
    seriesSlug: string; sessionSlug: string; seriesTitle: string
  }>
}

export interface BibleReaderProps {
  bookId: string
  bookName: string
  chapterNum: number
  content: string | null
  verseCount: number
  prev: { bookId: string; chapter: number } | null
  next: { bookId: string; chapter: number } | null
  allBooks: BibleBook[]
  startVerse?: number
  userId?: string
  initialHighlights?: Record<string, number>
  initialNotes?: Record<string, string>
  relatedContent?: RelatedContent
}

// ── Constants ─────────────────────────────────────────────────
const T = {
  cream: {
    bg: '#F6F3EB', text: '#093C5D', muted: 'rgba(9,60,93,0.48)',
    border: '#D2CDB8', verse: '#76ABAE', surface: '#EDEAE0',
    toolbar: 'rgba(246,243,235,0.94)', toolbarBorder: '#D2CDB8',
  },
  sepia: {
    bg: '#F5EDD8', text: '#3D2B1F', muted: 'rgba(61,43,31,0.48)',
    border: '#CDBB90', verse: '#A07A50', surface: '#EDE0C4',
    toolbar: 'rgba(245,237,216,0.94)', toolbarBorder: '#CDBB90',
  },
  dark: {
    bg: '#0F1923', text: 'rgba(246,243,235,0.88)', muted: 'rgba(246,243,235,0.36)',
    border: 'rgba(118,171,174,0.14)', verse: '#76ABAE', surface: '#0B2D47',
    toolbar: 'rgba(11,20,29,0.97)', toolbarBorder: 'rgba(118,171,174,0.12)',
  },
} as const

const FS: Record<FontSize, number> = { sm: 17, md: 20, lg: 24 }

const HL = [
  { bg: 'rgba(255,214,0,0.32)',   ring: 'rgba(195,155,0,0.50)',   dot: '#C49B00', label: 'Amarillo' },
  { bg: 'rgba(118,171,174,0.35)', ring: 'rgba(118,171,174,0.60)', dot: '#76ABAE', label: 'Teal'     },
  { bg: 'rgba(248,113,113,0.30)', ring: 'rgba(200,65,65,0.50)',   dot: '#DC4040', label: 'Rosa'     },
  { bg: 'rgba(134,155,126,0.38)', ring: 'rgba(95,125,85,0.55)',   dot: '#5F8060', label: 'Verde'    },
]

const DARK_HEADER = '#051828'
const TEAL        = '#76ABAE'
const CREAM_TEXT  = '#093C5D'
const SWIPE_MIN   = 52

// ── DOM helpers ────────────────────────────────────────────────

function walkVerseText(vSpan: HTMLElement): string {
  let text = ''
  let node: ChildNode | null = vSpan.nextSibling
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains('v')) break
    text += node.textContent ?? ''
    node = node.nextSibling
  }
  return text.replace(/\s+/g, ' ').trim()
}

function buildHighlightCSS(hl: Highlights): string {
  return Object.entries(hl)
    .filter(([, ci]) => HL[ci])
    .map(([v, ci]) => {
      const c = HL[ci]
      return (
        `.br-content p:has(.v[data-number="${v}"]),` +
        `.br-content .q1:has(.v[data-number="${v}"]),` +
        `.br-content .q2:has(.v[data-number="${v}"]),` +
        `.br-content .q3:has(.v[data-number="${v}"]) {` +
        ` background:${c.bg}; border-radius:4px; box-shadow:0 0 0 1.5px ${c.ring}; padding:1px 3px; cursor:pointer; font-weight:700; }` +
        ` .br-content .v[data-number="${v}"] { color:${c.dot} !important; }`
      )
    })
    .join('\n')
}

function buildNoteCSS(notes: Notes): string {
  return Object.keys(notes)
    .map(v =>
      `.br-content .v[data-number="${v}"]::after {` +
      ` content:''; display:inline-block; width:4px; height:4px;` +
      ` background:#76ABAE; border-radius:50%;` +
      ` margin-left:2px; vertical-align:super; }`
    )
    .join('\n')
}

function buildBookmarkCSS(nums: Set<string>): string {
  return Array.from(nums)
    .map(v =>
      `.br-content p:has(.v[data-number="${v}"]),` +
      `.br-content .q1:has(.v[data-number="${v}"]),` +
      `.br-content .q2:has(.v[data-number="${v}"]) {` +
      ` border-left:2.5px solid rgba(118,171,174,0.55); padding-left:7px; }`
    )
    .join('\n')
}

// ── Verse card (canvas) ────────────────────────────────────────

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

async function generateVerseCard(verse: VerseSelection): Promise<string | null> {
  try {
    const canvas = document.createElement('canvas')
    const W   = 1080
    const PAD = 108

    // First pass on an off-screen canvas to measure lines
    canvas.width  = W
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const vFontSize = verse.text.length < 100 ? 52 : verse.text.length < 200 ? 44 : verse.text.length < 320 ? 38 : 32
    const LINE_H    = vFontSize * 1.62
    ctx.font = `${vFontSize}px Georgia, “Times New Roman”, serif`
    const lines = wrapCanvasText(ctx, verse.text, W - PAD * 2)

    // Dynamic height: top padding + quote + text block + separator + reference + branding + bottom padding
    const TEXT_START = 260
    const textBlockH = lines.length * LINE_H
    const SEP_OFFSET = 64
    const REF_OFFSET = 58
    const BRAND_OFFSET = 64
    const BOTTOM_PAD  = 90
    const H = Math.round(TEXT_START + textBlockH + SEP_OFFSET + REF_OFFSET + BRAND_OFFSET + BOTTOM_PAD)

    canvas.height = H

    // Background
    ctx.fillStyle = '#051828'
    ctx.fillRect(0, 0, W, H)

    // Radial glow (top-right)
    const glow = ctx.createRadialGradient(W * 0.82, H * 0.15, 0, W * 0.82, H * 0.15, W * 0.65)
    glow.addColorStop(0, 'rgba(118,171,174,0.09)')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)

    // Opening quote mark
    ctx.font      = `bold 180px Georgia, “Times New Roman”, serif`
    ctx.fillStyle = 'rgba(118,171,174,0.16)'
    ctx.fillText('“', PAD - 12, 218)

    // Verse text
    ctx.font      = `${vFontSize}px Georgia, “Times New Roman”, serif`
    ctx.fillStyle = '#F6F3EB'
    lines.forEach((line, i) => ctx.fillText(line, PAD, TEXT_START + i * LINE_H))

    // Separator
    const sepY = TEXT_START + textBlockH + SEP_OFFSET
    ctx.strokeStyle = 'rgba(118,171,174,0.22)'
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(PAD, sepY)
    ctx.lineTo(W - PAD, sepY)
    ctx.stroke()

    // Reference
    ctx.font      = `bold 32px -apple-system, BlinkMacSystemFont, “Helvetica Neue”, sans-serif`
    ctx.fillStyle = '#76ABAE'
    ctx.fillText(`— ${verse.ref}  (NTV)`, PAD, sepY + REF_OFFSET)

    // Branding
    ctx.font      = `22px -apple-system, BlinkMacSystemFont, sans-serif`
    ctx.fillStyle = 'rgba(246,243,235,0.22)'
    ctx.fillText('El Manantial', PAD, sepY + REF_OFFSET + BRAND_OFFSET)

    return await new Promise<string | null>(resolve => {
      canvas.toBlob(
        blob => resolve(blob ? URL.createObjectURL(blob) : null),
        'image/png',
      )
    })
  } catch {
    return null
  }
}

// ── Component ─────────────────────────────────────────────────
export function BibleReader({
  bookId, bookName, chapterNum, content, verseCount, prev, next, allBooks, startVerse,
  userId, initialHighlights, initialNotes, relatedContent,
}: BibleReaderProps) {
  const router = useRouter()

  const [theme, setTheme]           = useState<Theme>('cream')
  const [fontSize, setFontSize]     = useState<FontSize>('md')
  const [showPanel, setShowPanel]   = useState(false)

  const [progress, setProgress]     = useState(0)
  const [verse, setVerse]           = useState<VerseSelection | null>(null)
  const [highlights, setHighlights] = useState<Highlights>({})
  const [notes, setNotes]           = useState<Notes>({})
  const [bookmarks, setBookmarks]   = useState<BookmarkItem[]>(() => {
    if (typeof window === 'undefined') return []
    const s = localStorage.getItem('bible-bookmarks')
    return s ? JSON.parse(s) : []
  })
  const [noteMode, setNoteMode]     = useState(false)
  const [noteText, setNoteText]     = useState('')
  const [copied, setCopied]         = useState(false)
  const [navigating, setNavigating] = useState(false)
  const [shareCardUrl, setShareCardUrl] = useState<string | null>(null)
  const [cardLoading, setCardLoading]   = useState(false)

  const contentRef    = useRef<HTMLDivElement>(null)
  const highlightsRef = useRef(highlights)
  const touchX        = useRef(0)
  const touchY        = useRef(0)

  // ── Audio TTS (pending activation) ────────────────────────
  // const [audioPlaying, setAudioPlaying] = useState(false)
  // const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  //
  // const handleAudio = useCallback(() => {
  //   if (!content || typeof window === 'undefined') return
  //   if (audioPlaying) {
  //     window.speechSynthesis.cancel()
  //     setAudioPlaying(false)
  //     return
  //   }
  //   const text = contentRef.current?.textContent ?? ''
  //   const utter = new SpeechSynthesisUtterance(text)
  //   utter.lang = 'es-419'
  //   utter.rate = 0.9
  //   const voices = window.speechSynthesis.getVoices()
  //   const spanish = voices.find(v => v.lang.startsWith('es'))
  //   if (spanish) utter.voice = spanish
  //   utter.onend = () => setAudioPlaying(false)
  //   utteranceRef.current = utter
  //   window.speechSynthesis.speak(utter)
  //   setAudioPlaying(true)
  // }, [audioPlaying, content])
  //
  // useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  const t  = T[theme]
  const fs = FS[fontSize]

  // Derived
  const isBookmarked = verse
    ? bookmarks.some(b => b.bookId === bookId && b.chapterNum === chapterNum && b.verseNum === verse.num)
    : false
  const activeHLci    = verse ? highlights[verse.num] : undefined
  const bookmarkNums  = new Set(
    bookmarks.filter(b => b.bookId === bookId && b.chapterNum === chapterNum).map(b => b.verseNum)
  )

  // ── Preferences ────────────────────────────────────────────
  useEffect(() => {
    const th = localStorage.getItem('bible-theme') as Theme | null
    const fz = localStorage.getItem('bible-fontsize') as FontSize | null
    if (th && th in T) setTheme(th)
    if (fz && fz in FS) setFontSize(fz)
  }, [])
  useEffect(() => { localStorage.setItem('bible-theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('bible-fontsize', fontSize) }, [fontSize])

  // ── Scroll to start verse ──────────────────────────────────
  useEffect(() => {
    if (!startVerse) return
    const id = setTimeout(() => {
      const el = contentRef.current
      if (!el) return
      const vSpan = el.querySelector<HTMLElement>(`.v[data-number="${startVerse}"]`)
      if (vSpan) {
        const para = vSpan.closest<HTMLElement>('p, .q1, .q2, .q3') ?? vSpan
        para.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }, 400)
    return () => clearTimeout(id)
  }, [startVerse, content])

  // ── Save last reading position ──────────────────────────────
  useEffect(() => {
    localStorage.setItem('bible-last', JSON.stringify({ bookId, chapterNum, bookName }))
  }, [bookId, chapterNum, bookName])

  // ── Scroll progress ─────────────────────────────────────────
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // ── Highlights ─────────────────────────────────────────────
  useEffect(() => { highlightsRef.current = highlights }, [highlights])

  useLayoutEffect(() => {
    if (initialHighlights !== undefined) {
      const hl = { ...initialHighlights }
      if (startVerse && hl[String(startVerse)] === undefined) {
        hl[String(startVerse)] = 0
      }
      setHighlights(hl)
    } else {
      const stored = localStorage.getItem(`bible-hl-${bookId}-${chapterNum}`)
      const hl: Highlights = stored ? JSON.parse(stored) : {}
      if (startVerse && hl[String(startVerse)] === undefined) {
        hl[String(startVerse)] = 0
      }
      setHighlights(hl)
    }
  }, [bookId, chapterNum, startVerse, initialHighlights])

  useEffect(() => {
    localStorage.setItem(`bible-hl-${bookId}-${chapterNum}`, JSON.stringify(highlights))
  }, [highlights, bookId, chapterNum])

  // ── Notes ──────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (initialNotes !== undefined) {
      setNotes(initialNotes)
    } else {
      const stored = localStorage.getItem(`bible-notes-${bookId}-${chapterNum}`)
      setNotes(stored ? JSON.parse(stored) : {})
    }
    setNoteMode(false)
    setNoteText('')
  }, [bookId, chapterNum, initialNotes])

  useEffect(() => {
    localStorage.setItem(`bible-notes-${bookId}-${chapterNum}`, JSON.stringify(notes))
  }, [notes, bookId, chapterNum])

  // ── Bookmarks ──────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('bible-bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  // ── Highlight actions ──────────────────────────────────────
  const toggleHighlight = useCallback((verseNum: string, colorIdx: number) => {
    const isRemoving = highlightsRef.current[verseNum] === colorIdx
    setHighlights(prev => {
      const next = { ...prev }
      if (isRemoving) delete next[verseNum]
      else next[verseNum] = colorIdx
      return next
    })
    if (userId) {
      if (isRemoving) deleteBibleHighlight(bookId, chapterNum, parseInt(verseNum))
      else upsertBibleHighlight(bookId, chapterNum, parseInt(verseNum), colorIdx)
    }
  }, [userId, bookId, chapterNum])

  const removeHighlight = useCallback((verseNum: string) => {
    setHighlights(prev => { const n = { ...prev }; delete n[verseNum]; return n })
    if (userId) deleteBibleHighlight(bookId, chapterNum, parseInt(verseNum))
  }, [userId, bookId, chapterNum])

  // ── Bookmark actions ───────────────────────────────────────
  const toggleBookmark = useCallback(() => {
    if (!verse) return
    setBookmarks(prev => {
      const exists = prev.some(
        b => b.bookId === bookId && b.chapterNum === chapterNum && b.verseNum === verse.num
      )
      if (exists) return prev.filter(
        b => !(b.bookId === bookId && b.chapterNum === chapterNum && b.verseNum === verse.num)
      )
      return [...prev, {
        bookId, chapterNum, verseNum: verse.num,
        ref: verse.ref, text: verse.text,
        savedAt: new Date().toISOString(),
      }]
    })
  }, [verse, bookId, chapterNum])

  // ── Note actions ───────────────────────────────────────────
  const openNote = useCallback(() => {
    if (!verse) return
    setNoteText(notes[verse.num] ?? '')
    setNoteMode(true)
  }, [verse, notes])

  const saveNote = useCallback(() => {
    if (!verse) return
    const trimmed = noteText.trim()
    setNotes(prev => {
      const next = { ...prev }
      if (trimmed) next[verse.num] = trimmed
      else delete next[verse.num]
      return next
    })
    setNoteMode(false)
    if (userId) {
      const verseInt = parseInt(verse.num)
      if (trimmed) upsertBibleNote(bookId, chapterNum, verseInt, trimmed)
      else deleteBibleNote(bookId, chapterNum, verseInt)
    }
  }, [verse, noteText, userId, bookId, chapterNum])

  // ── Verse tap (delegation) ──────────────────────────────────
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('v') && target.dataset.number) {
        const num = target.dataset.number
        setVerse({ num, ref: `${bookName} ${chapterNum}:${num}`, text: walkVerseText(target) })
        setNoteMode(false)
        return
      }
      const para = target.closest<HTMLElement>('.br-content p, .br-content .q1, .br-content .q2, .br-content .q3')
      if (para) {
        const vSpan = para.querySelector<HTMLElement>('.v[data-number]')
        if (vSpan) {
          const num = vSpan.dataset.number ?? ''
          if (highlightsRef.current[num] !== undefined) {
            setVerse({ num, ref: `${bookName} ${chapterNum}:${num}`, text: walkVerseText(vSpan) })
            setNoteMode(false)
          }
        }
      }
    }
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [bookName, chapterNum])

  // ── Swipe navigation ───────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
    touchY.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = touchX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchY.current - e.changedTouches[0].clientY)
    if (Math.abs(dx) < SWIPE_MIN || dy > 80) return
    if (dx > 0 && next) { setNavigating(true); router.push(`/biblia/lectura/${next.bookId}/${next.chapter}`) }
    if (dx < 0 && prev) { setNavigating(true); router.push(`/biblia/lectura/${prev.bookId}/${prev.chapter}`) }
  }, [prev, next, router])

  // ── Share / copy ───────────────────────────────────────────
  const handleCopy = async () => {
    if (!verse) return
    await navigator.clipboard.writeText(`"${verse.text}" — ${verse.ref} (NTV)`)
    setCopied(true)
    setTimeout(() => { setCopied(false); setVerse(null) }, 1800)
  }

  const handleShareText = async () => {
    if (!verse) return
    const text = `"${verse.text}" — ${verse.ref} (NTV)`
    if (navigator.share) { await navigator.share({ text }) }
    else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => { setCopied(false); setVerse(null); setShareCardUrl(null) }, 1800)
    }
    setShareCardUrl(null)
  }

  const handleOpenShare = async () => {
    if (!verse) return
    setCardLoading(true)
    const url = await generateVerseCard(verse)
    setCardLoading(false)
    if (url) {
      setShareCardUrl(url)
    } else {
      handleShareText()
    }
  }

  const handleShareImage = async () => {
    if (!verse || !shareCardUrl) return
    try {
      const res  = await fetch(shareCardUrl)
      const blob = await res.blob()
      const file = new File([blob], 'versiculo.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${verse.ref} (NTV)` })
      } else {
        const a = document.createElement('a')
        a.href     = shareCardUrl
        a.download = 'versiculo.png'
        a.click()
      }
    } catch {
      handleShareText()
    }
    URL.revokeObjectURL(shareCardUrl)
    setShareCardUrl(null)
    setVerse(null)
  }

  const closeShareCard = () => {
    if (shareCardUrl) URL.revokeObjectURL(shareCardUrl)
    setShareCardUrl(null)
  }

  const prevBook  = prev ? allBooks.find(b => b.id === prev.bookId) : null
  const nextBook  = next ? allBooks.find(b => b.id === next.bookId) : null
  const prevLabel = prev ? (prev.bookId !== bookId ? prevBook?.name : `Cap. ${prev.chapter}`) : null
  const nextLabel = next ? (next.bookId !== bookId ? nextBook?.name : `Cap. ${next.chapter}`) : null

  // ── Render ─────────────────────────────────────────────────
  return (
    <div
      style={{ background: t.bg, minHeight: '100vh', transition: 'background 0.25s' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
        style={{ background: t.border }}>
        <div className="h-full transition-all duration-150" style={{ width: `${progress}%`, background: TEAL }} />
      </div>

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40"
        style={{ background: DARK_HEADER, borderBottom: '1px solid rgba(118,171,174,0.10)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/biblia"
            className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.30em] transition hover:opacity-70"
            style={{ color: `${TEAL}70` }}>
            <ArrowLeft size={11} /> Biblia
          </Link>
          <Link
            href="/biblia"
            className="flex-1 flex items-center justify-center gap-2 text-[12px] font-black transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
            aria-label={`Cambiar libro o capítulo. Actualmente: ${bookName} ${chapterNum}`}>
            <span style={{ color: 'rgba(246,243,235,0.88)' }}>{bookName}</span>
            <span style={{ color: TEAL }}>{chapterNum}</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.28em] px-2 py-0.5 rounded"
              style={{ background: `${TEAL}18`, color: TEAL }}>NTV</span>
          </Link>
          <div className="flex-shrink-0 flex items-center gap-1">
            {prev ? (
              <Link href={`/biblia/lectura/${prev.bookId}/${prev.chapter}`}
                aria-label="Capítulo anterior"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
                style={{ border: '1px solid rgba(118,171,174,0.18)' }}>
                <ChevronLeft size={14} aria-hidden="true" style={{ color: `${TEAL}80` }} />
              </Link>
            ) : <div className="w-8" />}
            {next ? (
              <Link href={`/biblia/lectura/${next.bookId}/${next.chapter}`}
                aria-label="Capítulo siguiente"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
                style={{ border: '1px solid rgba(118,171,174,0.18)' }}>
                <ChevronRight size={14} aria-hidden="true" style={{ color: `${TEAL}80` }} />
              </Link>
            ) : <div className="w-8" />}
          </div>
        </div>
      </div>

      {/* ── Reading content ── */}
      <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 pb-36">
        <div className="flex items-baseline gap-4 mb-8">
          <span className="font-black tracking-tight"
            style={{ fontSize: 'clamp(0.95rem, 3vw, 1.25rem)', color: t.muted }}>{bookName}</span>
          <span className="font-black tracking-tighter leading-none"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: t.text }}>{chapterNum}</span>
          {verseCount > 0 && <span style={{ fontSize: 11, color: t.muted }}>{verseCount} vv.</span>}
        </div>

        {relatedContent && (relatedContent.lessons.length > 0 || relatedContent.sessions.length > 0) && (
          <div className="mb-8 p-4 rounded-2xl" style={{ background: `${TEAL}0A`, border: `1px solid ${TEAL}1A` }}>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-3"
              style={{ color: `${TEAL}80` }}>Recursos relacionados</p>
            <div className="space-y-2">
              {relatedContent.sessions.map(s => (
                <Link key={s.id}
                  href={`/educacion/estudio-biblico/${s.seriesSlug}/${s.sessionSlug}`}
                  className="flex items-start gap-3 p-3 rounded-xl transition hover:brightness-110"
                  style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}20` }}>
                  <BookOpen size={13} style={{ color: TEAL, flexShrink: 0, marginTop: 1 }} />
                  <div className="min-w-0">
                    <p style={{ fontSize: 10, color: `${TEAL}99`, fontWeight: 700, marginBottom: 1 }}>
                      {s.seriesTitle}
                    </p>
                    <p className="truncate" style={{ fontSize: 13, color: t.text, fontWeight: 700 }}>{s.title}</p>
                    <p style={{ fontSize: 10, color: t.muted }}>{s.reference}</p>
                  </div>
                </Link>
              ))}
              {relatedContent.lessons.map(l => (
                <Link key={l.id}
                  href={`/educacion/discipulado/${l.programSlug}/${l.courseSlug}/${l.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl transition hover:brightness-110"
                  style={{ background: `${TEAL}0A`, border: `1px solid ${TEAL}18` }}>
                  <ScrollText size={13} style={{ color: TEAL, flexShrink: 0, marginTop: 1 }} />
                  <div className="min-w-0">
                    <p style={{ fontSize: 10, color: `${TEAL}80`, fontWeight: 700, marginBottom: 1 }}>
                      Discipulado
                    </p>
                    <p className="truncate" style={{ fontSize: 13, color: t.text, fontWeight: 700 }}>{l.title}</p>
                    <p style={{ fontSize: 10, color: t.muted }}>{l.reference}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {content ? (
          <>
            <style suppressHydrationWarning>{`
              .br-content .v {
                font-size: 0.82em; font-weight: 900; vertical-align: super;
                margin-right: 4px; color: ${t.verse}; letter-spacing: 0.03em;
                cursor: pointer; user-select: none;
                display: inline-flex; align-items: center; justify-content: center;
                min-width: 1.7em; height: 1.55em; padding: 0 3px;
                border-radius: 5px;
                background: ${t.verse}14;
                border: 1px solid ${t.verse}28;
                transition: background 0.15s, color 0.15s, border-color 0.15s;
              }
              .br-content .v:hover {
                background: ${t.verse}30;
                border-color: ${t.verse}55;
                color: ${t.verse};
              }
              .br-content p {
                margin-bottom: ${fs <= 17 ? '1.15rem' : '1.5rem'};
                line-height: ${fs <= 17 ? 1.88 : fs <= 20 ? 1.92 : 2.0};
                color: ${t.text}; font-size: ${fs}px;
              }
              .br-content .s1, .br-content .s2 {
                display: block; font-size: ${Math.round(fs * 0.62)}px;
                font-weight: 800; text-transform: uppercase;
                letter-spacing: 0.18em; color: ${t.verse};
                margin: 2.5rem 0 0.75rem;
              }
              .br-content .q1 { padding-left: 1.5rem; }
              .br-content .q2 { padding-left: 3rem; }
              .br-content .q1, .br-content .q2 {
                border-left: 2px solid ${t.verse}38;
                margin-bottom: 0.4rem; font-style: italic;
              }
              @media (prefers-reduced-motion: reduce) {
                .br-content .v { transition: none; }
              }
              ${buildHighlightCSS(highlights)}
              ${buildNoteCSS(notes)}
              ${buildBookmarkCSS(bookmarkNums)}
            `}</style>
            <div
              ref={contentRef}
              className="br-content"
              style={{ opacity: navigating ? 0.4 : 1, transition: 'opacity 0.2s' }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </>
        ) : (
          <div className="text-center py-24">
            <BookOpen size={38} style={{ color: `${TEAL}50`, margin: '0 auto 14px' }} />
            <p className="font-black text-lg mb-1.5" style={{ color: t.text }}>Contenido no disponible</p>
            <p className="text-sm mb-6" style={{ color: t.muted }}>
              No se pudo cargar este capítulo. Verifica tu conexión o intenta de nuevo.
            </p>
            <a
              href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(bookName + ' ' + chapterNum)}&version=NTV`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl"
              style={{ background: TEAL, color: '#051828' }}>
              Leer en Bible Gateway
            </a>
          </div>
        )}
      </div>

      {/* ── Bottom toolbar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: t.toolbar, borderTop: `1px solid ${t.toolbarBorder}`,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}>
        {showPanel && (
          <div className="px-5 pt-3.5 pb-3" style={{ borderBottom: `1px solid ${t.toolbarBorder}` }}>
            <div className="max-w-xs mx-auto flex items-center justify-between gap-5">
              <div className="flex items-center gap-2.5">
                <button onClick={() => setFontSize(s => s === 'lg' ? 'md' : s === 'md' ? 'sm' : 'sm')}
                  aria-label="Reducir tamaño de letra"
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
                  style={{ background: t.surface, color: t.text, fontSize: 15, opacity: fontSize === 'sm' ? 0.3 : 1 }}>A</button>
                <div className="flex gap-1.5" role="group" aria-label="Tamaño de letra">
                  {(['sm', 'md', 'lg'] as FontSize[]).map(s => (
                    <button key={s} onClick={() => setFontSize(s)}
                      aria-label={s === 'sm' ? 'Pequeño' : s === 'md' ? 'Mediano' : 'Grande'}
                      aria-pressed={fontSize === s}
                      className="w-2 h-2 rounded-full transition-[transform,background] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
                      style={{ background: fontSize === s ? TEAL : t.border, transform: fontSize === s ? 'scale(1.3)' : 'scale(1)' }} />
                  ))}
                </div>
                <button onClick={() => setFontSize(s => s === 'sm' ? 'md' : s === 'md' ? 'lg' : 'lg')}
                  aria-label="Aumentar tamaño de letra"
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
                  style={{ background: t.surface, color: t.text, fontSize: 22, opacity: fontSize === 'lg' ? 0.3 : 1 }}>A</button>
              </div>
              <div className="flex gap-2" role="group" aria-label="Tema de color">
                {(['cream', 'sepia', 'dark'] as Theme[]).map(th => (
                  <button key={th} onClick={() => setTheme(th)}
                    aria-label={th === 'cream' ? 'Tema claro' : th === 'sepia' ? 'Tema sepia' : 'Tema oscuro'}
                    aria-pressed={theme === th}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
                    style={{
                      background: T[th].bg,
                      border: `2px solid ${theme === th ? TEAL : T[th].border}`,
                      boxShadow: theme === th ? `0 0 0 1px ${TEAL}40` : 'none',
                    }}>
                    {theme === th && <div className="w-2 h-2 rounded-full" aria-hidden="true" style={{ background: TEAL }} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto px-5 py-2.5 flex items-center justify-between gap-4">
          {prev ? (
            <Link href={`/biblia/lectura/${prev.bookId}/${prev.chapter}`}
              className="flex items-center gap-1.5 min-w-0 flex-1 text-[11px] font-bold transition hover:opacity-70"
              style={{ color: t.muted }}>
              <ChevronLeft size={16} style={{ flexShrink: 0, color: t.text, opacity: 0.45 }} />
              <span className="truncate">{prevLabel}</span>
            </Link>
          ) : <div className="flex-1" />}

          <div className="flex-shrink-0 flex items-center gap-2">
            {/* Audio button — pending activation */}
            {/* <button
              aria-label={audioPlaying ? 'Detener audio' : 'Escuchar capítulo'}
              onClick={handleAudio}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
              style={{ background: audioPlaying ? TEAL : t.surface, color: audioPlaying ? CREAM_TEXT : t.text }}>
              <Volume2 size={15} aria-hidden="true" />
            </button> */}
            <button onClick={() => setShowPanel(v => !v)}
              aria-label="Opciones de lectura"
              aria-expanded={showPanel}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-[13px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
              style={{ background: showPanel ? TEAL : t.surface, color: showPanel ? CREAM_TEXT : t.text }}>
              Aa
            </button>
          </div>

          {next ? (
            <Link href={`/biblia/lectura/${next.bookId}/${next.chapter}`}
              className="flex items-center gap-1.5 min-w-0 flex-1 justify-end text-[11px] font-bold transition hover:opacity-70"
              style={{ color: t.muted }}>
              <span className="truncate text-right">{nextLabel}</span>
              <ChevronRight size={16} style={{ flexShrink: 0, color: t.text, opacity: 0.45 }} />
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </div>

      {/* ── Verse action sheet ── */}
      {verse && !shareCardUrl && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(5,24,40,0.65)', backdropFilter: 'blur(8px)' }}
          onClick={() => { setVerse(null); setNoteMode(false) }}>
          <div className="rounded-t-3xl overflow-hidden"
            style={{
              background: DARK_HEADER, border: '1px solid rgba(118,171,174,0.14)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-3">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
            </div>

            {noteMode ? (
              /* ── Note editor mode ── */
              <>
                <div className="px-5 pt-3 pb-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: TEAL }}>
                    {verse.ref}
                  </p>
                  <textarea
                    autoFocus
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Escribe tu reflexión sobre este versículo…"
                    rows={4}
                    style={{
                      width: '100%', resize: 'none',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(118,171,174,0.22)',
                      borderRadius: '0.875rem', padding: '0.875rem 1rem',
                      fontSize: 15, lineHeight: 1.6,
                      color: 'rgba(246,243,235,0.88)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 px-5 pt-2 pb-5">
                  <button
                    onClick={() => setNoteMode(false)}
                    className="py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.14em] transition active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(246,243,235,0.82)' }}>
                    Cancelar
                  </button>
                  <button
                    onClick={saveNote}
                    className="py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.14em] transition active:scale-95"
                    style={{ background: TEAL, color: DARK_HEADER }}>
                    {noteText.trim() ? 'Guardar nota' : 'Eliminar nota'}
                  </button>
                </div>
              </>
            ) : (
              /* ── Normal mode ── */
              <>
                {/* Verse ref + text */}
                <div className="px-6 pt-3 pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: TEAL }}>
                    {verse.ref}
                  </p>
                  <p className="text-[15px] leading-relaxed line-clamp-3" style={{ color: 'rgba(246,243,235,0.84)' }}>
                    {verse.text}
                  </p>
                  {/* Show note preview if exists */}
                  {notes[verse.num] && (
                    <p className="text-[12px] leading-relaxed mt-2 italic line-clamp-2"
                      style={{ color: `${TEAL}80`, borderLeft: `2px solid ${TEAL}40`, paddingLeft: '0.625rem' }}>
                      {notes[verse.num]}
                    </p>
                  )}
                </div>

                {/* Highlight swatches */}
                <div className="px-6 pb-3" style={{ borderBottom: '1px solid rgba(118,171,174,0.10)' }}>
                  <div className="flex items-center gap-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] flex-shrink-0"
                      style={{ color: 'rgba(246,243,235,0.52)' }}>Resaltar</p>
                    <div className="flex gap-2.5 flex-1">
                      {HL.map((c, i) => (
                        <button key={i}
                          onClick={() => toggleHighlight(verse.num, i)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90"
                          style={{
                            background: c.bg,
                            boxShadow: `0 0 0 ${activeHLci === i ? 2 : 1.5}px ${activeHLci === i ? c.dot : c.ring}`,
                          }}
                          aria-label={c.label}>
                          {activeHLci === i && <Check size={12} style={{ color: c.dot }} />}
                        </button>
                      ))}
                    </div>
                    {activeHLci !== undefined && (
                      <button
                        onClick={() => { removeHighlight(verse.num); setVerse(null) }}
                        className="text-[10px] font-bold uppercase tracking-[0.18em] flex-shrink-0 transition hover:opacity-70"
                        style={{ color: 'rgba(246,243,235,0.57)' }}>
                        Quitar
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 action buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.375rem', padding: '0.75rem 1rem 1.25rem' }}>

                  {/* Copiar */}
                  <button onClick={handleCopy}
                    className="flex flex-col items-center gap-1.5 rounded-2xl transition active:scale-95"
                    style={{ padding: '0.75rem 0.25rem', minHeight: 64, background: 'rgba(255,255,255,0.07)' }}>
                    {copied
                      ? <Check size={17} style={{ color: TEAL }} />
                      : <Copy size={17} style={{ color: 'rgba(246,243,235,0.86)' }} />}
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: copied ? TEAL : 'rgba(246,243,235,0.82)' }}>
                      {copied ? 'Copiado' : 'Copiar'}
                    </span>
                  </button>

                  {/* Guardar */}
                  <button onClick={toggleBookmark}
                    className="flex flex-col items-center gap-1.5 rounded-2xl transition active:scale-95"
                    style={{ padding: '0.75rem 0.25rem', minHeight: 64, background: isBookmarked ? 'rgba(118,171,174,0.18)' : 'rgba(255,255,255,0.07)' }}>
                    <Bookmark size={17}
                      style={{ color: isBookmarked ? TEAL : 'rgba(246,243,235,0.86)', fill: isBookmarked ? TEAL : 'none' }} />
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: isBookmarked ? TEAL : 'rgba(246,243,235,0.82)' }}>
                      {isBookmarked ? 'Guardado' : 'Guardar'}
                    </span>
                  </button>

                  {/* Nota */}
                  <button onClick={openNote}
                    className="flex flex-col items-center gap-1.5 rounded-2xl transition active:scale-95"
                    style={{ padding: '0.75rem 0.25rem', minHeight: 64, background: notes[verse.num] ? 'rgba(118,171,174,0.10)' : 'rgba(255,255,255,0.07)' }}>
                    <FileText size={17} style={{ color: notes[verse.num] ? TEAL : 'rgba(246,243,235,0.86)' }} />
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: notes[verse.num] ? TEAL : 'rgba(246,243,235,0.82)' }}>
                      {notes[verse.num] ? 'Ver nota' : 'Nota'}
                    </span>
                  </button>

                  {/* Compartir */}
                  <button onClick={handleOpenShare}
                    className="flex flex-col items-center gap-1.5 rounded-2xl transition active:scale-95"
                    style={{ padding: '0.75rem 0.25rem', minHeight: 64, background: TEAL }}>
                    {cardLoading
                      ? <div className="w-[17px] h-[17px] rounded-full border-2 animate-spin" style={{ borderColor: `${DARK_HEADER}40`, borderTopColor: DARK_HEADER }} />
                      : <Share2 size={17} style={{ color: DARK_HEADER }} />}
                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: DARK_HEADER }}>
                      Compartir
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Share card modal ── */}
      {shareCardUrl && verse && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end"
          style={{ background: 'rgba(5,24,40,0.88)', backdropFilter: 'blur(12px)' }}
          onClick={closeShareCard}>
          <div className="rounded-t-3xl overflow-hidden"
            style={{
              background: DARK_HEADER, border: '1px solid rgba(118,171,174,0.14)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-3">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
            </div>

            {/* Card preview */}
            <div style={{ padding: '1rem 1.25rem 0.75rem' }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-3 text-center"
                style={{ color: 'rgba(246,243,235,0.84)' }}>Vista previa</p>
              <img
                src={shareCardUrl}
                alt="Tarjeta del versículo"
                className="w-full rounded-2xl"
                style={{ aspectRatio: '1/1', objectFit: 'cover', maxHeight: 280 }}
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 px-5 pt-2 pb-5">
              <button onClick={handleShareText}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.14em] transition active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(246,243,235,0.86)' }}>
                <Copy size={13} /> Compartir texto
              </button>
              <button onClick={handleShareImage}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.14em] transition active:scale-95"
                style={{ background: TEAL, color: DARK_HEADER }}>
                <Image size={13} /> Compartir imagen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
