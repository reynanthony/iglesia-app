-- ─────────────────────────────────────────────────────────────
-- v12 · Invitaciones a grupos + Chat por grupo
-- ─────────────────────────────────────────────────────────────

-- ── group_invitations ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_invitations (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id         UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  invited_user_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invited_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (group_id, invited_user_id)
);

ALTER TABLE group_invitations ENABLE ROW LEVEL SECURITY;

-- Usuarios ven sus propias invitaciones
CREATE POLICY "invited_user_sees_own" ON group_invitations
  FOR SELECT USING (invited_user_id = auth.uid());

-- Admin/pastor/líder gestiona todas las invitaciones
CREATE POLICY "leaders_manage_invitations" ON group_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin','pastor','lider')
    )
  );

-- ── group_messages ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id   UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;

-- Solo miembros leen mensajes del grupo
CREATE POLICY "members_read_group_messages" ON group_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_messages.group_id AND user_id = auth.uid()
    )
  );

-- Solo miembros envían mensajes al grupo
CREATE POLICY "members_insert_group_messages" ON group_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_messages.group_id AND user_id = auth.uid()
    )
  );

-- ── Actualizar visibilidad de grupos ─────────────────────────
-- Antes: todos veían todos los grupos activos.
-- Ahora: grupos privados solo visibles para miembros o invitados.
--        Admins/pastores/líderes ven todo.
DROP POLICY IF EXISTS "Todos ven grupos activos" ON groups;

CREATE POLICY "users_see_relevant_groups" ON groups
  FOR SELECT USING (
    (
      is_active = true
      AND (
        is_private = false
        OR EXISTS (
          SELECT 1 FROM group_members
          WHERE group_id = groups.id AND user_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM group_invitations
          WHERE group_id = groups.id
            AND invited_user_id = auth.uid()
            AND status = 'pending'
        )
      )
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin','pastor','lider')
    )
  );
