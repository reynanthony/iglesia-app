import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import BibleVerseOfDay from '@/components/public/BibleVerseOfDay'
import BibleContinue from '@/components/public/BibleContinue'
import BibleSelector from '@/components/public/BibleSelector'
import { findBook } from '@/lib/bible'
import { createClient } from '@/lib/supabase/server'
import { BG, CARD, MUTED, GOLD, INK } from '@/lib/gold-theme'

const NAVY  = CARD
const TEAL  = GOLD
const CREAM = INK

export default async function BibliaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let initialLastRead: { bookId: string; chapterNum: number; bookName: string } | null = null
  let initialBookmarks: Array<{
    bookId: string; chapterNum: number; verseNum: string; ref: string; text: string; savedAt: string
  }> | undefined

  if (user) {
    const [positionResult, bookmarksResult] = await Promise.all([
      supabase.from('bible_reading_position').select('book_id, chapter').eq('user_id', user.id).maybeSingle(),
      supabase.from('bible_bookmarks').select('book_id, chapter, verse, verse_text, created_at')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(6),
    ])
    if (positionResult.data) {
      const book = findBook(positionResult.data.book_id)
      if (book) {
        initialLastRead = { bookId: book.id, chapterNum: positionResult.data.chapter, bookName: book.name }
      }
    }
    initialBookmarks = (bookmarksResult.data ?? []).map(r => {
      const book = findBook(r.book_id)
      return {
        bookId: r.book_id,
        chapterNum: r.chapter,
        verseNum: String(r.verse),
        ref: `${book?.name ?? r.book_id} ${r.chapter}:${r.verse}`,
        text: r.verse_text,
        savedAt: r.created_at,
      }
    })
  }

  return (
    <div>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: BG, minHeight: '72vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 70% at 85% 30%, rgba(199,154,42,0.10), transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 select-none">
          <span className="font-black leading-none" style={{ fontSize: 'clamp(12rem, 26vw, 24rem)', opacity: 0.04, color: TEAL }}>
            BIB
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-16 md:pt-44 md:pb-20 flex flex-col justify-end"
          style={{ minHeight: '72vh' }}>
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px" style={{ background: MUTED }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: MUTED }}>
              La Palabra · RVR1960
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <h1 className="font-display font-black tracking-tighter text-white"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
              La Palabra<br /><em style={{ color: TEAL }}>que transforma.</em>
            </h1>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-6" style={{ color: MUTED }}>
                Lee la Biblia completa en Reina Valera 1960 con marcadores, notas y lectura continua.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/biblia/lectura/JHN/1"
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl"
                  style={{ background: CREAM, color: NAVY }}>
                  <BookOpen size={12} /> Comenzar a leer
                </Link>
                <Link href="/devocionales"
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition hover:opacity-80"
                  style={{ background: 'rgba(134,155,126,0.12)', color: '#869B7E', border: '1px solid rgba(134,155,126,0.30)' }}>
                  Devocionales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VERSO DEL DÍA — visible para todos, incluso primera visita ══ */}
      <BibleVerseOfDay />

      {/* ══ CONTINUAR LEYENDO + MARCADORES ═════════════════ */}
      <BibleContinue initialLastRead={initialLastRead} initialBookmarks={initialBookmarks} />

      {/* ══ SELECTOR DE LIBROS ══════════════════════════════ */}
      <BibleSelector />

      {/* ══ CTA ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #101217 0%, ${NAVY} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-10" style={{ color: MUTED }}>
                — También en la comunidad
              </p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.85 }}>
                La Palabra<br />es mejor<br /><em style={{ color: TEAL }}>en comunidad.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-relaxed mb-4" style={{ color: MUTED }}>
                Únete para compartir reflexiones, pedir oración y crecer en la fe con nuestra comunidad en línea.
              </p>
              <Link href="/registro"
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                Crear mi cuenta <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
