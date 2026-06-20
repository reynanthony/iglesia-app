-- v22: Vincula church_leaders con profiles para sincronizar foto y datos del perfil
ALTER TABLE church_leaders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_church_leaders_user_id
  ON church_leaders(user_id) WHERE user_id IS NOT NULL;
