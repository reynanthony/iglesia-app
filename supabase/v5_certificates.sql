-- ============================================================
-- El Manantial — v5: Certificaciones digitales de discipulado
-- ============================================================

CREATE TABLE IF NOT EXISTS discipleship_certificates (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id  UUID        NOT NULL REFERENCES discipleship_programs(id) ON DELETE CASCADE,
  issued_at   TIMESTAMPTZ DEFAULT NOW(),
  issued_by   UUID        REFERENCES profiles(id),
  UNIQUE(user_id, program_id)
);

ALTER TABLE discipleship_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver certificados propios y públicos" ON discipleship_certificates;
CREATE POLICY "Ver certificados propios y públicos"
  ON discipleship_certificates FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
  );

DROP POLICY IF EXISTS "Líderes emiten certificados" ON discipleship_certificates;
CREATE POLICY "Líderes emiten certificados"
  ON discipleship_certificates FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

DROP POLICY IF EXISTS "Líderes eliminan certificados" ON discipleship_certificates;
CREATE POLICY "Líderes eliminan certificados"
  ON discipleship_certificates FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')));
