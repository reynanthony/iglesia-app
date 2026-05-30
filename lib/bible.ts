const BIBLE_API_KEY = process.env.BIBLE_API_KEY
const BIBLE_ID      = '592420522e16049f-01' // Reina-Valera 1960
const BASE_URL      = 'https://api.scripture.api.bible/v1'

export type BibleChapterContent = {
  id: string
  reference: string
  content: string
  verseCount: number
  next?: { id: string; number: string; bookId: string }
  previous?: { id: string; number: string; bookId: string }
}

export type BibleBook = { id: string; name: string; chapters: number }

export const OT_BOOKS: BibleBook[] = [
  { id: 'GEN', name: 'Génesis',        chapters: 50 },
  { id: 'EXO', name: 'Éxodo',          chapters: 40 },
  { id: 'LEV', name: 'Levítico',       chapters: 27 },
  { id: 'NUM', name: 'Números',         chapters: 36 },
  { id: 'DEU', name: 'Deuteronomio',   chapters: 34 },
  { id: 'JOS', name: 'Josué',          chapters: 24 },
  { id: 'JDG', name: 'Jueces',         chapters: 21 },
  { id: 'RUT', name: 'Rut',            chapters:  4 },
  { id: '1SA', name: '1 Samuel',       chapters: 31 },
  { id: '2SA', name: '2 Samuel',       chapters: 24 },
  { id: '1KI', name: '1 Reyes',        chapters: 22 },
  { id: '2KI', name: '2 Reyes',        chapters: 25 },
  { id: '1CH', name: '1 Crónicas',     chapters: 29 },
  { id: '2CH', name: '2 Crónicas',     chapters: 36 },
  { id: 'EZR', name: 'Esdras',         chapters: 10 },
  { id: 'NEH', name: 'Nehemías',       chapters: 13 },
  { id: 'EST', name: 'Ester',          chapters: 10 },
  { id: 'JOB', name: 'Job',            chapters: 42 },
  { id: 'PSA', name: 'Salmos',         chapters: 150 },
  { id: 'PRO', name: 'Proverbios',     chapters: 31 },
  { id: 'ECC', name: 'Eclesiastés',    chapters: 12 },
  { id: 'SNG', name: 'Cantares',       chapters:  8 },
  { id: 'ISA', name: 'Isaías',         chapters: 66 },
  { id: 'JER', name: 'Jeremías',       chapters: 52 },
  { id: 'LAM', name: 'Lamentaciones',  chapters:  5 },
  { id: 'EZK', name: 'Ezequiel',       chapters: 48 },
  { id: 'DAN', name: 'Daniel',         chapters: 12 },
  { id: 'HOS', name: 'Oseas',          chapters: 14 },
  { id: 'JOL', name: 'Joel',           chapters:  3 },
  { id: 'AMO', name: 'Amós',           chapters:  9 },
  { id: 'OBA', name: 'Abdías',         chapters:  1 },
  { id: 'JON', name: 'Jonás',          chapters:  4 },
  { id: 'MIC', name: 'Miqueas',        chapters:  7 },
  { id: 'NAM', name: 'Nahúm',          chapters:  3 },
  { id: 'HAB', name: 'Habacuc',        chapters:  3 },
  { id: 'ZEP', name: 'Sofonías',       chapters:  3 },
  { id: 'HAG', name: 'Hageo',          chapters:  2 },
  { id: 'ZEC', name: 'Zacarías',       chapters: 14 },
  { id: 'MAL', name: 'Malaquías',      chapters:  4 },
]

export const NT_BOOKS: BibleBook[] = [
  { id: 'MAT', name: 'Mateo',              chapters: 28 },
  { id: 'MRK', name: 'Marcos',             chapters: 16 },
  { id: 'LUK', name: 'Lucas',              chapters: 24 },
  { id: 'JHN', name: 'Juan',               chapters: 21 },
  { id: 'ACT', name: 'Hechos',             chapters: 28 },
  { id: 'ROM', name: 'Romanos',            chapters: 16 },
  { id: '1CO', name: '1 Corintios',        chapters: 16 },
  { id: '2CO', name: '2 Corintios',        chapters: 13 },
  { id: 'GAL', name: 'Gálatas',            chapters:  6 },
  { id: 'EPH', name: 'Efesios',            chapters:  6 },
  { id: 'PHP', name: 'Filipenses',         chapters:  4 },
  { id: 'COL', name: 'Colosenses',         chapters:  4 },
  { id: '1TH', name: '1 Tesalonicenses',   chapters:  5 },
  { id: '2TH', name: '2 Tesalonicenses',   chapters:  3 },
  { id: '1TI', name: '1 Timoteo',          chapters:  6 },
  { id: '2TI', name: '2 Timoteo',          chapters:  4 },
  { id: 'TIT', name: 'Tito',               chapters:  3 },
  { id: 'PHM', name: 'Filemón',            chapters:  1 },
  { id: 'HEB', name: 'Hebreos',            chapters: 13 },
  { id: 'JAS', name: 'Santiago',           chapters:  5 },
  { id: '1PE', name: '1 Pedro',            chapters:  5 },
  { id: '2PE', name: '2 Pedro',            chapters:  3 },
  { id: '1JN', name: '1 Juan',             chapters:  5 },
  { id: '2JN', name: '2 Juan',             chapters:  1 },
  { id: '3JN', name: '3 Juan',             chapters:  1 },
  { id: 'JUD', name: 'Judas',              chapters:  1 },
  { id: 'REV', name: 'Apocalipsis',        chapters: 22 },
]

export const ALL_BOOKS = [...OT_BOOKS, ...NT_BOOKS]

export function findBook(id: string): BibleBook | undefined {
  return ALL_BOOKS.find(b => b.id === id.toUpperCase())
}

export function prevChapter(bookId: string, chapter: number): { bookId: string; chapter: number } | null {
  if (chapter > 1) return { bookId, chapter: chapter - 1 }
  const idx = ALL_BOOKS.findIndex(b => b.id === bookId)
  if (idx <= 0) return null
  const prev = ALL_BOOKS[idx - 1]
  return { bookId: prev.id, chapter: prev.chapters }
}

export function nextChapter(bookId: string, chapter: number): { bookId: string; chapter: number } | null {
  const book = findBook(bookId)
  if (!book) return null
  if (chapter < book.chapters) return { bookId, chapter: chapter + 1 }
  const idx = ALL_BOOKS.findIndex(b => b.id === bookId)
  if (idx >= ALL_BOOKS.length - 1) return null
  return { bookId: ALL_BOOKS[idx + 1].id, chapter: 1 }
}

export async function getChapterContent(
  bookId: string,
  chapter: string | number,
): Promise<BibleChapterContent | null> {
  if (!BIBLE_API_KEY) return null
  try {
    const chapterId = `${bookId.toUpperCase()}.${chapter}`
    const url = `${BASE_URL}/bibles/${BIBLE_ID}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`
    const res = await fetch(url, {
      headers: { 'api-key': BIBLE_API_KEY },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const { data } = await res.json()
    return data as BibleChapterContent
  } catch {
    return null
  }
}

export function hasBibleApi(): boolean {
  return !!BIBLE_API_KEY
}
