-- v27: registro de avance de lectura + cuestionarios de capítulo generados por IA

CREATE TABLE IF NOT EXISTS bible_reading_log (
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id       TEXT NOT NULL,
  chapter       INTEGER NOT NULL,
  first_read_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at  TIMESTAMPTZ DEFAULT NOW(),
  quiz_correct  INTEGER,
  quiz_total    INTEGER,
  quiz_done_at  TIMESTAMPTZ,
  PRIMARY KEY (user_id, book_id, chapter)
);

ALTER TABLE bible_reading_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reading log" ON bible_reading_log
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS bible_chapter_quizzes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id      TEXT NOT NULL,
  chapter      INTEGER NOT NULL,
  questions    JSONB NOT NULL,
  model        TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, chapter)
);

ALTER TABLE bible_chapter_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos ven cuestionarios" ON bible_chapter_quizzes
  FOR SELECT USING (true);
