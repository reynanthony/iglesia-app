-- v21: Personal Bible study — highlights and notes per user

CREATE TABLE IF NOT EXISTS bible_highlights (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id      TEXT NOT NULL,
  chapter      INTEGER NOT NULL,
  verse        INTEGER NOT NULL,
  color_index  INTEGER NOT NULL CHECK (color_index >= 0 AND color_index <= 3),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter, verse)
);

ALTER TABLE bible_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own highlights" ON bible_highlights
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS bible_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id     TEXT NOT NULL,
  chapter     INTEGER NOT NULL,
  verse       INTEGER NOT NULL,
  content     TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter, verse)
);

ALTER TABLE bible_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notes" ON bible_notes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
