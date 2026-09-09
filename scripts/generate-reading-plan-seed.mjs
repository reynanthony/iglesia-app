// Script de un solo uso: genera el SQL de seed para supabase/v26_bible_reading_plans_seed.sql
// Materializa los días de cada plan respetando límites de libro (nunca cruza de
// un libro a otro dentro del mismo día). No forma parte del runtime de la app.
//
// Uso: node scripts/generate-reading-plan-seed.mjs > supabase/v26_bible_reading_plans_seed.sql

// Duplicado minimo de lib/bible.ts (id, name, chapters) para no depender de un
// transpilador TS en este script de un solo uso.
const OT_BOOKS = [
  { id: 'GEN', name: 'Génesis', chapters: 50 },
]

const PLANS = [
  {
    slug: 'juan-21-dias',
    title: 'Evangelio de Juan en 21 días',
    description: 'Recorre el Evangelio de Juan capítulo por capítulo, un día a la vez.',
    category: 'evangelios',
    order_index: 1,
    books: [{ id: 'JHN', chapters: 21 }],
    chunk: 1,
  },
  {
    slug: 'genesis-25-dias',
    title: 'Génesis en 25 días',
    description: 'Los orígenes de todo: creación, pacto y las primeras familias de la fe.',
    category: 'pentateuco',
    order_index: 2,
    books: [{ id: 'GEN', chapters: 50 }],
    chunk: 2,
  },
  {
    slug: 'salmos-30-dias',
    title: 'Salmos en 30 días',
    description: 'Un mes de oración, alabanza y consuelo a través del salterio completo.',
    category: 'sabiduria',
    order_index: 3,
    books: [{ id: 'PSA', chapters: 150 }],
    chunk: 5,
  },
  {
    slug: 'proverbios-31-dias',
    title: 'Proverbios en 31 días',
    description: 'Un capítulo de sabiduría práctica por cada día del mes.',
    category: 'sabiduria',
    order_index: 4,
    books: [{ id: 'PRO', chapters: 31 }],
    chunk: 1,
  },
  {
    slug: 'nuevo-testamento',
    title: 'El Nuevo Testamento',
    description: 'De los Evangelios a Apocalipsis, en tramos breves y sostenibles cada día.',
    category: 'nuevo-testamento',
    order_index: 5,
    chunk: 3,
    books: [
      { id: 'MAT', chapters: 28 }, { id: 'MRK', chapters: 16 }, { id: 'LUK', chapters: 24 },
      { id: 'JHN', chapters: 21 }, { id: 'ACT', chapters: 28 }, { id: 'ROM', chapters: 16 },
      { id: '1CO', chapters: 16 }, { id: '2CO', chapters: 13 }, { id: 'GAL', chapters: 6 },
      { id: 'EPH', chapters: 6 }, { id: 'PHP', chapters: 4 }, { id: 'COL', chapters: 4 },
      { id: '1TH', chapters: 5 }, { id: '2TH', chapters: 3 }, { id: '1TI', chapters: 6 },
      { id: '2TI', chapters: 4 }, { id: 'TIT', chapters: 3 }, { id: 'PHM', chapters: 1 },
      { id: 'HEB', chapters: 13 }, { id: 'JAS', chapters: 5 }, { id: '1PE', chapters: 5 },
      { id: '2PE', chapters: 3 }, { id: '1JN', chapters: 5 }, { id: '2JN', chapters: 1 },
      { id: '3JN', chapters: 1 }, { id: 'JUD', chapters: 1 }, { id: 'REV', chapters: 22 },
    ],
  },
]

function esc(s) {
  return s.replace(/'/g, "''")
}

function buildDays(books, chunk) {
  const days = []
  for (const book of books) {
    for (let start = 1; start <= book.chapters; start += chunk) {
      const end = Math.min(start + chunk - 1, book.chapters)
      days.push({ bookId: book.id, chapterStart: start, chapterEnd: end })
    }
  }
  return days
}

let sql = '-- v26 seed: planes de lectura iniciales (generado por scripts/generate-reading-plan-seed.mjs)\n\n'

for (const plan of PLANS) {
  const days = buildDays(plan.books, plan.chunk)
  sql += `-- ${plan.title} (${days.length} días)\n`
  sql += `WITH plan AS (\n`
  sql += `  INSERT INTO bible_reading_plans (title, slug, description, duration_days, category, order_index)\n`
  sql += `  VALUES ('${esc(plan.title)}', '${plan.slug}', '${esc(plan.description)}', ${days.length}, '${plan.category}', ${plan.order_index})\n`
  sql += `  RETURNING id\n`
  sql += `)\n`
  sql += `INSERT INTO bible_reading_plan_days (plan_id, day_number, book_id, chapter_start, chapter_end)\n`
  sql += `SELECT id, v.day_number, v.book_id, v.chapter_start, v.chapter_end FROM plan, (VALUES\n`
  sql += days
    .map((d, i) => `  (${i + 1}, '${d.bookId}', ${d.chapterStart}, ${d.chapterEnd})`)
    .join(',\n')
  sql += `\n) AS v(day_number, book_id, chapter_start, chapter_end);\n\n`
}

process.stdout.write(sql)
