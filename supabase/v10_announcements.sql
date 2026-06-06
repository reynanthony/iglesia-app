-- ── ANNOUNCEMENT ENGINE ─────────────────────────────────────────
-- Tracking de onboarding + tabla de campañas institucionales

-- 1. Marcar onboarding completado en el perfil de cada usuario
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- 2. Tabla principal de anuncios/campañas
CREATE TABLE IF NOT EXISTS announcements (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  description      TEXT,
  content_type     TEXT        NOT NULL DEFAULT 'image'
                   CHECK (content_type IN ('image','video','pastoral_message','event','course','live_invitation')),
  priority         TEXT        NOT NULL DEFAULT 'normal'
                   CHECK (priority IN ('critical','high','normal')),
  image_url        TEXT,
  video_url        TEXT,
  cta_label        TEXT        NOT NULL DEFAULT 'Más información',
  cta_destination  TEXT,
  start_date       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date         TIMESTAMPTZ,
  is_active        BOOLEAN     NOT NULL DEFAULT true,
  show_frequency   TEXT        NOT NULL DEFAULT 'once'
                   CHECK (show_frequency IN ('once','daily','session','always')),
  audience         TEXT[]      NOT NULL DEFAULT ARRAY['all'],
  created_by       UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Registro de vistas por usuario (para frecuencia 'once' cross-device)
CREATE TABLE IF NOT EXISTS announcement_views (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id  UUID        NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id          UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seen_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (announcement_id, user_id)
);

-- ── RLS ──────────────────────────────────────────────────────────
ALTER TABLE announcements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_views  ENABLE ROW LEVEL SECURITY;

-- Anuncios: usuarios autenticados leen los activos; admins leen todos
CREATE POLICY "Auth lee anuncios activos"
  ON announcements FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      is_active = true
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('admin','pastor','moderador')
      )
    )
  );

CREATE POLICY "Admins gestionan anuncios"
  ON announcements FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin','pastor','moderador')
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin','pastor','moderador')
    )
  );

-- Vistas: cada usuario gestiona las suyas
CREATE POLICY "Usuarios leen sus vistas"
  ON announcement_views FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuarios insertan sus vistas"
  ON announcement_views FOR INSERT
  WITH CHECK (user_id = auth.uid());
