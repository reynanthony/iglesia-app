-- v26: Planes de lectura bíblica multi-día (solo referencias) + progreso

CREATE TABLE IF NOT EXISTS bible_reading_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  thumbnail_url TEXT,
  duration_days INTEGER NOT NULL,
  category      TEXT,
  order_index   INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bible_reading_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos ven planes activos" ON bible_reading_plans
  FOR SELECT USING (is_active = true);

CREATE TABLE IF NOT EXISTS bible_reading_plan_days (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id       UUID NOT NULL REFERENCES bible_reading_plans(id) ON DELETE CASCADE,
  day_number    INTEGER NOT NULL,
  book_id       TEXT NOT NULL,
  chapter_start INTEGER NOT NULL,
  chapter_end   INTEGER NOT NULL,
  UNIQUE(plan_id, day_number)
);

ALTER TABLE bible_reading_plan_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos ven días de planes activos" ON bible_reading_plan_days
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bible_reading_plans p WHERE p.id = plan_id AND p.is_active = true)
  );

CREATE TABLE IF NOT EXISTS user_reading_plan_enrollments (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id      UUID NOT NULL REFERENCES bible_reading_plans(id) ON DELETE CASCADE,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  current_day  INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, plan_id)
);

ALTER TABLE user_reading_plan_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own enrollments" ON user_reading_plan_enrollments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_reading_plan_day_completions (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_day_id  UUID NOT NULL REFERENCES bible_reading_plan_days(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, plan_day_id)
);

ALTER TABLE user_reading_plan_day_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own day completions" ON user_reading_plan_day_completions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
