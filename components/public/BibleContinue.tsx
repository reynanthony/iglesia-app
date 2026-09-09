'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Bookmark, ArrowRight, X } from 'lucide-react'
import type { BookmarkItem } from '@/components/public/BibleReader'
import { deleteBibleBookmark } from '@/app/actions/bible'
import { CARD, GOLD, INK } from '@/lib/gold-theme'

interface LastRead {
  bookId: string
  chapterNum: number
  bookName: string
}

const NAVY  = CARD
const TEAL  = GOLD
const CREAM = INK
const SAGE  = '#869B7E'

interface BibleContinueProps {
  initialLastRead?: LastRead | null
  initialBookmarks?: BookmarkItem[]
}

export default function BibleContinue({ initialLastRead, initialBookmarks }: BibleContinueProps) {
  const synced = initialBookmarks !== undefined
  const [lastRead, setLastRead] = useState<LastRead | null>(initialLastRead ?? null)
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(initialBookmarks ?? [])
  const [mounted, setMounted] = useState(synced)

  useEffect(() => {
    if (synced) return
    setMounted(true)
    try {
      const raw = localStorage.getItem('bible-last')
      if (raw) setLastRead(JSON.parse(raw))
    } catch { /* noop */ }
    try {
      const raw = localStorage.getItem('bible-bookmarks')
      if (raw) setBookmarks(JSON.parse(raw))
    } catch { /* noop */ }
  }, [synced])

  function removeBookmark(bk: BookmarkItem) {
    const updated = bookmarks.filter(b => b.ref !== bk.ref)
    setBookmarks(updated)
    if (synced) {
      deleteBibleBookmark(bk.bookId, bk.chapterNum, parseInt(bk.verseNum))
    } else {
      localStorage.setItem('bible-bookmarks', JSON.stringify(updated))
    }
  }

  if (!mounted || (!lastRead && bookmarks.length === 0)) return null

  return (
    <section style={{ background: '#F0EDE3', borderBottom: '1px solid #D2CDB8' }}>
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BookOpen size={14} style={{ color: TEAL }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: TEAL }}>
            Tu lectura
          </p>
        </div>

        <div className="flex flex-col gap-6">

          {/* Continuar leyendo */}
          {lastRead && (
            <Link
              href={`/biblia/lectura/${lastRead.bookId}/${lastRead.chapterNum}`}
              className="group flex items-center justify-between rounded-2xl px-6 py-5 transition-all"
              style={{
                background: CREAM,
                border: `1px solid rgba(199,154,42,0.25)`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(199,154,42,0.15)` }}
                >
                  <BookOpen size={16} style={{ color: TEAL }} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-0.5" style={{ color: SAGE }}>
                    Continuar leyendo
                  </p>
                  <p className="font-black text-base leading-tight" style={{ color: NAVY }}>
                    {lastRead.bookName} {lastRead.chapterNum}
                  </p>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: TEAL }} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {/* Versículos guardados */}
          {bookmarks.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.38em] mb-4" style={{ color: SAGE }}>
                — Versículos guardados ({bookmarks.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bookmarks.slice(0, 6).map(bk => (
                  <div
                    key={bk.ref}
                    className="group relative flex flex-col gap-2 rounded-2xl p-4"
                    style={{ background: CREAM, border: '1px solid #D2CDB8' }}
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => removeBookmark(bk)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(24,26,34,0.08)' }}
                      aria-label={`Eliminar marcador ${bk.ref}`}
                    >
                      <X size={10} style={{ color: NAVY }} />
                    </button>

                    <div className="flex items-center gap-2">
                      <Bookmark size={11} style={{ color: TEAL }} />
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: TEAL }}>
                        {bk.ref}
                      </p>
                    </div>
                    <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: `${NAVY}80` }}>
                      {bk.text}
                    </p>
                    <Link
                      href={`/biblia/lectura/${bk.bookId}/${bk.chapterNum}`}
                      className="mt-auto text-[9px] font-bold uppercase tracking-[0.25em] flex items-center gap-1 transition-opacity hover:opacity-60"
                      style={{ color: TEAL }}
                    >
                      Ir al capítulo <ArrowRight size={9} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
