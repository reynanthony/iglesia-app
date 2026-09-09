-- v25: Bible bookmarks (versículos guardados) + última posición de lectura, por usuario

CREATE TABLE IF NOT EXISTS bible_bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id     TEXT NOT NULL,
  chapter     INTEGER NOT NULL,
  verse       INTEGER NOT NULL,
  verse_text  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter, verse)
);

ALTER TABLE bible_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own bookmarks" ON bible_bookmarks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS bible_reading_position (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id     TEXT NOT NULL,
  chapter     INTEGER NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bible_reading_position ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reading position" ON bible_reading_position
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
