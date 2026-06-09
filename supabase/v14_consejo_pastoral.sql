-- ─────────────────────────────────────────────────────────────
-- v14 — Consejo Pastoral
-- ─────────────────────────────────────────────────────────────

-- 1. Flag en profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_consejo_pastoral boolean NOT NULL DEFAULT false;

-- 2. Rol en ministry_assignments (lider = responsable, colaborador = apoya)
ALTER TABLE ministry_assignments
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'colaborador'
  CHECK (role IN ('lider', 'colaborador'));

-- 3. Índice para consultas rápidas del consejo
CREATE INDEX IF NOT EXISTS idx_profiles_consejo ON profiles(is_consejo_pastoral) WHERE is_consejo_pastoral = true;
