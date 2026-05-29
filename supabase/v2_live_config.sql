-- ============================================================
-- El Manantial — Fase 6: Configuración de transmisión en vivo
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS site_config (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_config (key, value) VALUES
  ('is_live',    'false'),
  ('live_url',   ''),
  ('live_title', 'Culto en vivo')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos leen config del sitio" ON site_config;
CREATE POLICY "Todos leen config del sitio"
  ON site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins gestionan config" ON site_config;
CREATE POLICY "Admins gestionan config"
  ON site_config FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')
  ));
