-- ── PUBLICACIONES ──────────────────────────────────────────────
-- Landing pages editoriales para campañas, series, eventos especiales, etc.

CREATE TABLE IF NOT EXISTS publicaciones (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        UNIQUE NOT NULL,
  title         TEXT        NOT NULL,
  subtitle      TEXT,
  category      TEXT        NOT NULL DEFAULT 'general'
                CHECK (category IN ('campana','serie','evento-especial','ministerio','anuncio','general')),
  cover_image   TEXT,
  cover_color   TEXT        NOT NULL DEFAULT '#093C5D',
  excerpt       TEXT,
  body          TEXT,
  cta_label     TEXT        DEFAULT 'Más información',
  cta_url       TEXT,
  is_active     BOOLEAN     NOT NULL DEFAULT false,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_publicaciones_active  ON publicaciones(is_active);
CREATE INDEX IF NOT EXISTS idx_publicaciones_cat     ON publicaciones(category);
CREATE INDEX IF NOT EXISTS idx_publicaciones_pub     ON publicaciones(published_at DESC);

-- RLS
ALTER TABLE publicaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "publicaciones_public_read"
  ON publicaciones FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "publicaciones_admin_all"
  ON publicaciones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'pastor', 'moderador')
    )
  );

-- Storage bucket para imágenes de portada
INSERT INTO storage.buckets (id, name, public)
VALUES ('publicaciones', 'publicaciones', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "publicaciones_public_storage_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'publicaciones');

CREATE POLICY "publicaciones_admin_storage_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'publicaciones' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'pastor', 'moderador')
    )
  );

CREATE POLICY "publicaciones_admin_storage_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'publicaciones' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'pastor', 'moderador')
    )
  );
