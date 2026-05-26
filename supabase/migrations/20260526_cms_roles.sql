-- ============================================================
-- Phase 1: Ministry assignments (role scope)
-- ============================================================
CREATE TABLE IF NOT EXISTS ministry_assignments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  ministry_id UUID NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
  assigned_by UUID          REFERENCES profiles(id)   ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(user_id, ministry_id)
);

ALTER TABLE ministry_assignments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "admin_pastor_manage_assignments" ON ministry_assignments
    FOR ALL TO authenticated
    USING (EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')
    ))
    WITH CHECK (EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_see_own_assignments" ON ministry_assignments
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- Phase 3: pinned posts
-- ============================================================
ALTER TABLE posts ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false;

-- ============================================================
-- Phase 4: editable public pages
-- ============================================================
CREATE TABLE IF NOT EXISTS page_content (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page       TEXT NOT NULL UNIQUE,
  content    JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public_read_page_content" ON page_content
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "admin_pastor_write_page_content" ON page_content
    FOR ALL TO authenticated
    USING (EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')
    ))
    WITH CHECK (EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO page_content (page, content) VALUES
  ('home', '{
    "hero_tagline": "Iglesia El Manantial · Comunidad de fe",
    "hero_h1_line1": "Donde",
    "hero_h1_line2": "fluye",
    "hero_h1_line3": "la vida.",
    "hero_subtitle": "Una comunidad de fe viva donde encontrarás amor, propósito y una familia que te recibe como eres.",
    "services": [
      {"day":"Domingo",   "time":"10:00","label":"AM","type":"Servicio principal"},
      {"day":"Miércoles", "time":"7:00", "label":"PM","type":"Estudio bíblico"},
      {"day":"Viernes",   "time":"7:00", "label":"PM","type":"Noche de oración"}
    ],
    "verse": "Vengan a mí todos los que están cansados y yo les daré descanso.",
    "verse_ref": "Mateo 11:28",
    "featured_event_title": "Retiro Anual 2026",
    "featured_event_desc": "Junio 2026 · Un fin de semana de encuentro y renovación espiritual."
  }'),
  ('nosotros', '{
    "hero_tagline": "Quiénes somos · Desde 2008",
    "hero_body": "Nacimos de un sueño: ver una comunidad donde el amor de Dios fluyera libremente, como agua viva que transforma vidas.",
    "stat_year": "2008",
    "stat_families": "500+",
    "stat_generations": "3",
    "stat_ministries": "12+",
    "mission": "",
    "vision": ""
  }'),
  ('contacto', '{
    "address": "",
    "phone": "",
    "email": "",
    "schedule_sun": "10:00 AM",
    "schedule_wed": "7:00 PM",
    "schedule_fri": "7:00 PM",
    "maps_url": ""
  }')
ON CONFLICT (page) DO NOTHING;
