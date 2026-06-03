-- ============================================================
-- El Manantial — v6: Push Notifications (device tokens)
-- ============================================================

CREATE TABLE IF NOT EXISTS device_tokens (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token      TEXT        NOT NULL,
  platform   TEXT        NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gestionan sus propios tokens" ON device_tokens;
CREATE POLICY "Usuarios gestionan sus propios tokens"
  ON device_tokens FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Líderes leen tokens para notificaciones" ON device_tokens;
CREATE POLICY "Líderes leen tokens para notificaciones"
  ON device_tokens FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

-- Tabla de notificaciones enviadas (historial)
CREATE TABLE IF NOT EXISTS push_notifications_log (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  sent_by    UUID        REFERENCES profiles(id),
  title      TEXT        NOT NULL,
  body       TEXT        NOT NULL,
  target     TEXT        NOT NULL DEFAULT 'all',  -- 'all' | user_id
  sent_at    TIMESTAMPTZ DEFAULT NOW(),
  success    INTEGER     DEFAULT 0,
  failed     INTEGER     DEFAULT 0
);

ALTER TABLE push_notifications_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Líderes ven historial de notificaciones" ON push_notifications_log;
CREATE POLICY "Líderes ven historial de notificaciones"
  ON push_notifications_log FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

DROP POLICY IF EXISTS "Líderes crean notificaciones" ON push_notifications_log;
CREATE POLICY "Líderes crean notificaciones"
  ON push_notifications_log FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));
