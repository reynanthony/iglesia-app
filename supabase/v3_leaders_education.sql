-- ============================================================
-- El Manantial — Fase 7: Líderes, Equipo Pastoral y Educación
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Líderes / equipo pastoral (visible en /nosotros)
CREATE TABLE IF NOT EXISTS church_leaders (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  bio         TEXT,
  avatar_url  TEXT,
  category    TEXT DEFAULT 'pastoral' CHECK (category IN ('pastoral','ministerio','general')),
  order_index INTEGER DEFAULT 0,
  is_public   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE church_leaders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos ven líderes públicos" ON church_leaders;
CREATE POLICY "Todos ven líderes públicos"
  ON church_leaders FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Admins gestionan líderes" ON church_leaders;
CREATE POLICY "Admins gestionan líderes"
  ON church_leaders FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')
  ));

-- Campos de líder en cada ministerio
ALTER TABLE ministries
  ADD COLUMN IF NOT EXISTS leader_name       TEXT,
  ADD COLUMN IF NOT EXISTS leader_title      TEXT,
  ADD COLUMN IF NOT EXISTS leader_bio        TEXT,
  ADD COLUMN IF NOT EXISTS leader_avatar_url TEXT;

-- Devocionales (para /biblia)
CREATE TABLE IF NOT EXISTS devocionales (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  author      TEXT DEFAULT 'Pastor Principal',
  verse       TEXT,
  verse_ref   TEXT,
  image_url   TEXT,
  published   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE devocionales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos leen devocionales publicados" ON devocionales;
CREATE POLICY "Todos leen devocionales publicados"
  ON devocionales FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admins gestionan devocionales" ON devocionales;
CREATE POLICY "Admins gestionan devocionales"
  ON devocionales FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')
  ));

-- Seed: sample leader data
INSERT INTO church_leaders (name, title, bio, category, order_index) VALUES
  ('Pastor Principal',      'Pastor General',           'Fundador y pastor principal de Iglesia El Manantial. Con más de 15 años de ministerio, lidera la visión de la iglesia con fe y pasión por ver vidas transformadas.',           'pastoral', 1),
  ('Pastora de Damas',      'Pastora Asociada',         'Lidera el ministerio de mujeres y acompaña a la iglesia en consejería y cuidado pastoral. Su corazón es ver a cada persona crecer en su identidad en Cristo.',          'pastoral', 2),
  ('Líder de Jóvenes',      'Director de Juventud',     'Apasionado por la próxima generación. Dirige el ministerio de jóvenes con energía, creatividad y un firme fundamento bíblico.',                                             'ministerio', 3),
  ('Líder de Adoración',    'Director de Alabanza',     'Lidera el equipo de adoración con excelencia y espíritu de servicio. Cree que la adoración genuina transforma atmósferas y abre el corazón a Dios.',                       'ministerio', 4)
ON CONFLICT DO NOTHING;
