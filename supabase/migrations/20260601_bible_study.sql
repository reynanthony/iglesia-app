-- ── BIBLE STUDY MODULE ──────────────────────────────────────────
-- Tables for series and sessions, with fully public read access.

CREATE TABLE IF NOT EXISTS bible_study_series (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  description  TEXT,
  book         TEXT,
  theme        TEXT,
  cover_color  TEXT        NOT NULL DEFAULT '#76ABAE',
  status       TEXT        NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','upcoming','archived')),
  order_index  INT         NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bible_study_sessions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id    UUID        NOT NULL REFERENCES bible_study_series(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  slug         TEXT        NOT NULL,
  reference    TEXT,
  summary      TEXT,
  content      TEXT,
  objectives   TEXT[]      DEFAULT '{}',
  order_index  INT         NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (series_id, slug)
);

CREATE TABLE IF NOT EXISTS bible_study_questions (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID  NOT NULL REFERENCES bible_study_sessions(id) ON DELETE CASCADE,
  question    TEXT  NOT NULL,
  order_index INT   NOT NULL DEFAULT 0
);

-- ── RLS ─────────────────────────────────────────────────────────
ALTER TABLE bible_study_series    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_study_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_study_questions ENABLE ROW LEVEL SECURITY;

-- Public read: everyone sees active rows; leaders/admins see all
CREATE POLICY "Público lee series activas"
  ON bible_study_series FOR SELECT
  USING (
    is_active = true
    OR (auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid()
      AND role IN ('admin','pastor','lider')
    ))
  );

CREATE POLICY "Público lee sesiones activas"
  ON bible_study_sessions FOR SELECT
  USING (
    is_active = true
    OR (auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid()
      AND role IN ('admin','pastor','lider')
    ))
  );

CREATE POLICY "Público lee preguntas"
  ON bible_study_questions FOR SELECT USING (true);

-- Write: leaders only
CREATE POLICY "Líderes insertan series"
  ON bible_study_series FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
    AND role IN ('admin','pastor','lider')
  ));

CREATE POLICY "Líderes actualizan series"
  ON bible_study_series FOR UPDATE
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
    AND role IN ('admin','pastor','lider')
  ));

CREATE POLICY "Líderes eliminan series"
  ON bible_study_series FOR DELETE
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
    AND role IN ('admin','pastor','lider')
  ));

CREATE POLICY "Líderes insertan sesiones"
  ON bible_study_sessions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
    AND role IN ('admin','pastor','lider')
  ));

CREATE POLICY "Líderes actualizan sesiones"
  ON bible_study_sessions FOR UPDATE
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
    AND role IN ('admin','pastor','lider')
  ));

CREATE POLICY "Líderes eliminan sesiones"
  ON bible_study_sessions FOR DELETE
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
    AND role IN ('admin','pastor','lider')
  ));

CREATE POLICY "Líderes gestionan preguntas"
  ON bible_study_questions FOR ALL
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
    AND role IN ('admin','pastor','lider')
  ));
