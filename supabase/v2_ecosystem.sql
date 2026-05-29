-- ============================================================
-- El Manantial — Migración v2.0: Ecosistema Digital
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Idempotente: se puede ejecutar varias veces sin errores
-- ============================================================

-- ── FASE 1: Admin Mensajes ──────────────────────────────────
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS read       BOOLEAN   DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_by    UUID      REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS read_at    TIMESTAMPTZ;

-- ── FASE 1: Seguridad ───────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins leen activity_log" ON activity_log;
CREATE POLICY "Admins leen activity_log"
  ON activity_log FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor'))
  );
DROP POLICY IF EXISTS "Sistema inserta activity_log" ON activity_log;
CREATE POLICY "Sistema inserta activity_log"
  ON activity_log FOR INSERT WITH CHECK (true);

-- ── FASE 2: Reacciones Espirituales ────────────────────────
CREATE TABLE IF NOT EXISTS reactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('orando','amen','edifico','gracias')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Todos ven reacciones" ON reactions;
CREATE POLICY "Todos ven reacciones"
  ON reactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuarios gestionan sus reacciones" ON reactions;
CREATE POLICY "Usuarios gestionan sus reacciones"
  ON reactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── FASE 2: Categorías de Posts ────────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS category TEXT CHECK (
    category IN ('testimonio','reflexion','evento','servicio','peticion','devocional')
  );

-- ── FASE 3: Peticiones de Oración ──────────────────────────
CREATE TABLE IF NOT EXISTS prayer_requests (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  body              TEXT,
  is_anonymous      BOOLEAN DEFAULT false,
  status            TEXT DEFAULT 'nueva' CHECK (status IN ('nueva','seguimiento','respondida')),
  testimony_post_id UUID REFERENCES posts(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prayer_participants (
  request_id  UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (request_id, user_id)
);

ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados ven peticiones" ON prayer_requests;
CREATE POLICY "Autenticados ven peticiones"
  ON prayer_requests FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Propietario crea peticiones" ON prayer_requests;
CREATE POLICY "Propietario crea peticiones"
  ON prayer_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Propietario actualiza sus peticiones" ON prayer_requests;
CREATE POLICY "Propietario actualiza sus peticiones"
  ON prayer_requests FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Propietario elimina sus peticiones" ON prayer_requests;
CREATE POLICY "Propietario elimina sus peticiones"
  ON prayer_requests FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Autenticados ven participantes" ON prayer_participants;
CREATE POLICY "Autenticados ven participantes"
  ON prayer_participants FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Usuarios gestionan su participación" ON prayer_participants;
CREATE POLICY "Usuarios gestionan su participación"
  ON prayer_participants FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── FASE 4: Grupos ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS groups (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  type        TEXT CHECK (type IN (
    'jovenes','caballeros','damas','matrimonios',
    'evangelismo','intercesion','alabanza','general'
  )),
  image_url   TEXT,
  created_by  UUID REFERENCES profiles(id),
  is_active   BOOLEAN DEFAULT true,
  is_private  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id    UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role        TEXT DEFAULT 'member' CHECK (role IN ('member','leader')),
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos ven grupos activos" ON groups;
CREATE POLICY "Todos ven grupos activos"
  ON groups FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins gestionan grupos" ON groups;
CREATE POLICY "Admins gestionan grupos"
  ON groups FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
  );
DROP POLICY IF EXISTS "Todos ven miembros" ON group_members;
CREATE POLICY "Todos ven miembros"
  ON group_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuarios gestionan su membresía" ON group_members;
CREATE POLICY "Usuarios gestionan su membresía"
  ON group_members FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── FASE 5: Discipulado ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS discipleship_stages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  color       TEXT,
  icon        TEXT
);

INSERT INTO discipleship_stages (name, description, order_index, color, icon)
VALUES
  ('Visitante',       'Conociendo la comunidad y la fe', 1, '#94A3B8', 'user'),
  ('Nuevo creyente',  'Comenzando el camino de fe',      2, '#86EFAC', 'heart'),
  ('Fundamentos',     'Aprendiendo las bases bíblicas',  3, '#6EE7B7', 'book-open'),
  ('Bautismo',        'Declarando la fe públicamente',   4, '#60A5FA', 'droplets'),
  ('Servicio',        'Sirviendo en la iglesia',         5, '#C084FC', 'hand-helping'),
  ('Discipulado',     'Acompañando a otros en la fe',    6, '#F59E0B', 'users'),
  ('Liderazgo',       'Liderando con propósito',         7, '#F87171', 'crown')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS user_discipleship (
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  stage_id    UUID REFERENCES discipleship_stages(id),
  started_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  notes       TEXT,
  assigned_by UUID REFERENCES profiles(id)
);

ALTER TABLE discipleship_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_discipleship ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos ven etapas" ON discipleship_stages;
CREATE POLICY "Todos ven etapas"
  ON discipleship_stages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Autenticados ven su discipulado" ON user_discipleship;
CREATE POLICY "Autenticados ven su discipulado"
  ON user_discipleship FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Líderes gestionan discipulado" ON user_discipleship;
CREATE POLICY "Líderes gestionan discipulado"
  ON user_discipleship FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
  );

-- ── RLS en contact_messages ──────────────────────────────────
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins leen mensajes de contacto" ON contact_messages;
CREATE POLICY "Admins leen mensajes de contacto"
  ON contact_messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor'))
  );
