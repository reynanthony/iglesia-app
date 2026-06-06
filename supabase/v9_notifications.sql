-- ============================================================
-- El Manantial — v9: In-app notifications table + triggers
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id   UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  type       TEXT        NOT NULL CHECK (type IN ('like', 'comment', 'reply', 'report')),
  post_id    UUID        REFERENCES posts(id) ON DELETE CASCADE,
  read       BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios ven sus propias notificaciones" ON notifications;
CREATE POLICY "Usuarios ven sus propias notificaciones"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios actualizan sus notificaciones" ON notifications;
CREATE POLICY "Usuarios actualizan sus notificaciones"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Sistema inserta notificaciones" ON notifications;
CREATE POLICY "Sistema inserta notificaciones"
  ON notifications FOR INSERT WITH CHECK (true);

-- ── TRIGGER: nueva reacción → notificar al dueño del post ──

CREATE OR REPLACE FUNCTION notify_on_reaction()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  post_owner UUID;
BEGIN
  SELECT user_id INTO post_owner FROM posts WHERE id = NEW.post_id;
  -- No notificar si el actor es el dueño del post
  IF post_owner IS NOT NULL AND post_owner <> NEW.user_id THEN
    INSERT INTO notifications(user_id, actor_id, type, post_id)
    VALUES (post_owner, NEW.user_id, 'like', NEW.post_id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_reaction ON reactions;
CREATE TRIGGER trg_notify_reaction
  AFTER INSERT ON reactions
  FOR EACH ROW EXECUTE FUNCTION notify_on_reaction();

-- ── TRIGGER: nuevo comentario → notificar al dueño del post ──

CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  post_owner UUID;
  parent_owner UUID;
BEGIN
  SELECT user_id INTO post_owner FROM posts WHERE id = NEW.post_id;

  -- Notificar al dueño del post (comment en su post)
  IF post_owner IS NOT NULL AND post_owner <> NEW.user_id THEN
    INSERT INTO notifications(user_id, actor_id, type, post_id)
    VALUES (post_owner, NEW.user_id, 'comment', NEW.post_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Si es respuesta, notificar al autor del comentario padre
  IF NEW.parent_id IS NOT NULL THEN
    SELECT user_id INTO parent_owner FROM comments WHERE id = NEW.parent_id;
    IF parent_owner IS NOT NULL AND parent_owner <> NEW.user_id AND parent_owner <> post_owner THEN
      INSERT INTO notifications(user_id, actor_id, type, post_id)
      VALUES (parent_owner, NEW.user_id, 'reply', NEW.post_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_comment ON comments;
CREATE TRIGGER trg_notify_comment
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION notify_on_comment();

-- ── TRIGGER: reporte → notificar a admins/moderadores ──

CREATE OR REPLACE FUNCTION notify_on_report()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT id FROM profiles WHERE role IN ('admin', 'moderador')
  LOOP
    INSERT INTO notifications(user_id, actor_id, type, post_id)
    VALUES (rec.id, NEW.reporter_id, 'report', NEW.post_id)
    ON CONFLICT DO NOTHING;
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_report ON reports;
CREATE TRIGGER trg_notify_report
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION notify_on_report();
