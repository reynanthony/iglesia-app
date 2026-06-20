-- v21: Delegación de admin por ministerio
-- El admin puede dar acceso administrativo a líderes para su propio ministerio.

-- 1. can_admin en ministry_assignments
ALTER TABLE ministry_assignments
  ADD COLUMN IF NOT EXISTS can_admin BOOLEAN NOT NULL DEFAULT false;

-- Índice para la lookup rápida en proxy (¿tiene este usuario acceso delegado?)
CREATE INDEX IF NOT EXISTS idx_ministry_assignments_can_admin
  ON ministry_assignments(user_id) WHERE can_admin = true;

-- 2. ministry_id (opcional) en groups para que los líderes gestionen sus grupos
ALTER TABLE groups
  ADD COLUMN IF NOT EXISTS ministry_id UUID REFERENCES ministries(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_groups_ministry_id
  ON groups(ministry_id) WHERE ministry_id IS NOT NULL;
