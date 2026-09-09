import fs from 'fs'
import path from 'path'
import { ALL_BOOKS, type BibleChapterContent } from '@/lib/bible'

// ── Reina Valera 1960 — texto local, sin API externa ──────────────
// Este modulo usa fs/path (solo servidor). No lo importes desde
// componentes 'use client' — para esos casos usa @/lib/bible.

type RV1960Verse = { n: number; texto: string }
type RV1960Book = { orden: number; testamento: 'AT' | 'NT'; capitulos: Record<string, RV1960Verse[]> }
type RV1960Data = Record<string, RV1960Book>

let rv1960Cache: RV1960Data | null = null

function loadRV1960(): RV1960Data {
  if (rv1960Cache) return rv1960Cache
  const filePath = path.join(process.cwd(), 'lib', 'data', 'biblia-rvr1960.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  rv1960Cache = JSON.parse(raw) as RV1960Data
  return rv1960Cache
}

// El orden de ALL_BOOKS coincide 1:1 con el campo "orden" del JSON de RV1960,
// asi que el indice del arreglo mapea directo al nombre en espanol.
function rv1960BookName(bookId: string): string | null {
  const idx = ALL_BOOKS.findIndex(b => b.id === bookId.toUpperCase())
  if (idx === -1) return null
  const data = loadRV1960()
  const name = Object.keys(data).find(k => data[k].orden === idx + 1)
  return name ?? null
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildChapterHtml(verses: RV1960Verse[]): string {
  const spans = verses
    .map(v => `<span class="v" data-number="${v.n}">${v.n}</span> ${escapeHtml(v.texto)} `)
    .join('')
  return `<p>${spans.trim()}</p>`
}

export async function getChapterContent(
  bookId: string,
  chapter: string | number,
): Promise<BibleChapterContent | null> {
  try {
    const bookName = rv1960BookName(bookId)
    if (!bookName) return null
    const data = loadRV1960()
    const verses = data[bookName]?.capitulos?.[String(chapter)]
    if (!verses || verses.length === 0) return null
    return {
      id: `${bookId.toUpperCase()}.${chapter}`,
      reference: `${bookName} ${chapter}`,
      content: buildChapterHtml(verses),
      verseCount: verses.length,
    }
  } catch {
    return null
  }
}

export function hasBibleApi(): boolean {
  return true
}

// Extrae el texto plano de un solo versículo del HTML de un capítulo ya cargado.
// Reutiliza el mismo HTML que consume el lector, así que el texto siempre
// coincide exactamente con lo que el usuario ve al abrir el capítulo.
export function extractVerseText(html: string, verseNum: number): string | null {
  const re = new RegExp(
    `<span[^>]*class="v"[^>]*data-number="${verseNum}"[^>]*>.*?</span>([\\s\\S]*?)(?=<span[^>]*class="v"|</p>|$)`,
    'i',
  )
  const m = html.match(re)
  if (!m) return null
  const text = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return text || null
}

export async function getVerseOfDayText(
  bookId: string,
  chapter: number,
  verse: number,
): Promise<string | null> {
  const content = await getChapterContent(bookId, chapter)
  if (!content?.content) return null
  return extractVerseText(content.content, verse)
}
