// Lista curada de referencias para "Verso del día". Solo apunta a la referencia
// y un tema corto — el texto real siempre se obtiene en vivo de la misma API
// que usa el lector (lib/bible.ts), para que nunca haya una cita incorrecta.
export type VerseOfDayRef = {
  bookId: string
  chapter: number
  verse: number
  label: string
  theme: string
}

export const VERSE_OF_DAY_REFS: VerseOfDayRef[] = [
  { bookId: 'JHN', chapter: 3,   verse: 16, label: 'Juan 3:16',          theme: 'Amor' },
  { bookId: 'PSA', chapter: 23,  verse: 1,  label: 'Salmos 23:1',        theme: 'Confianza' },
  { bookId: 'PHP', chapter: 4,   verse: 13, label: 'Filipenses 4:13',    theme: 'Fortaleza' },
  { bookId: 'JER', chapter: 29,  verse: 11, label: 'Jeremías 29:11',     theme: 'Esperanza' },
  { bookId: 'ROM', chapter: 8,   verse: 28, label: 'Romanos 8:28',       theme: 'Propósito' },
  { bookId: 'ISA', chapter: 41,  verse: 10, label: 'Isaías 41:10',       theme: 'Fortaleza' },
  { bookId: 'PRO', chapter: 3,   verse: 5,  label: 'Proverbios 3:5',     theme: 'Confianza' },
  { bookId: 'MAT', chapter: 11,  verse: 28, label: 'Mateo 11:28',        theme: 'Descanso' },
  { bookId: '2CO', chapter: 5,   verse: 17, label: '2 Corintios 5:17',   theme: 'Nueva vida' },
  { bookId: 'JOS', chapter: 1,   verse: 9,  label: 'Josué 1:9',          theme: 'Valentía' },
  { bookId: 'PSA', chapter: 46,  verse: 1,  label: 'Salmos 46:1',        theme: 'Refugio' },
  { bookId: 'EPH', chapter: 2,   verse: 8,  label: 'Efesios 2:8',        theme: 'Gracia' },
  { bookId: 'GAL', chapter: 5,   verse: 22, label: 'Gálatas 5:22',       theme: 'Fruto del Espíritu' },
  { bookId: 'JAS', chapter: 1,   verse: 5,  label: 'Santiago 1:5',       theme: 'Sabiduría' },
  { bookId: '1PE', chapter: 5,   verse: 7,  label: '1 Pedro 5:7',        theme: 'Ansiedad' },
  { bookId: 'NUM', chapter: 6,   verse: 24, label: 'Números 6:24',       theme: 'Bendición' },
  { bookId: 'DEU', chapter: 31,  verse: 6,  label: 'Deuteronomio 31:6',  theme: 'Valentía' },
  { bookId: 'PSA', chapter: 34,  verse: 18, label: 'Salmos 34:18',       theme: 'Consuelo' },
  { bookId: 'MAT', chapter: 6,   verse: 33, label: 'Mateo 6:33',         theme: 'Prioridades' },
  { bookId: 'COL', chapter: 3,   verse: 23, label: 'Colosenses 3:23',    theme: 'Propósito' },
  { bookId: 'PSA', chapter: 121, verse: 1,  label: 'Salmos 121:1',       theme: 'Ayuda' },
  { bookId: 'HEB', chapter: 11,  verse: 1,  label: 'Hebreos 11:1',       theme: 'Fe' },
  { bookId: 'PSA', chapter: 27,  verse: 1,  label: 'Salmos 27:1',        theme: 'Valentía' },
  { bookId: 'ROM', chapter: 12,  verse: 2,  label: 'Romanos 12:2',       theme: 'Transformación' },
  { bookId: 'PSA', chapter: 37,  verse: 4,  label: 'Salmos 37:4',        theme: 'Alegría' },
  { bookId: 'ISA', chapter: 40,  verse: 31, label: 'Isaías 40:31',       theme: 'Fortaleza' },
  { bookId: 'JHN', chapter: 14,  verse: 27, label: 'Juan 14:27',         theme: 'Paz' },
  { bookId: '1CO', chapter: 13,  verse: 4,  label: '1 Corintios 13:4',   theme: 'Amor' },
  { bookId: 'PSA', chapter: 118, verse: 24, label: 'Salmos 118:24',      theme: 'Gratitud' },
  { bookId: 'MIC', chapter: 6,   verse: 8,  label: 'Miqueas 6:8',        theme: 'Justicia' },
]

// Determinista según el día del año — el mismo verso todo el día, distinto cada día.
export function pickVerseOfDay(date = new Date()): VerseOfDayRef {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const diff = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start
  const dayOfYear = Math.floor(diff / 86400000)
  return VERSE_OF_DAY_REFS[dayOfYear % VERSE_OF_DAY_REFS.length]
}
