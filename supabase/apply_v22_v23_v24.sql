-- ══════════════════════════════════════════════════════════════
-- APLICAR EN SUPABASE DASHBOARD → SQL Editor
-- Incluye v22 (RSVPs + prayer public read), v23 (is_public),
-- y v24 (prayer_responses)
-- ══════════════════════════════════════════════════════════════

-- ── v22: Event RSVPs ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_rsvps (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  directus_event_id TEXT NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, directus_event_id)
);
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_rsvps_public_read"  ON event_rsvps FOR SELECT USING (true);
CREATE POLICY "event_rsvps_user_insert"  ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "event_rsvps_user_delete"  ON event_rsvps FOR DELETE USING (auth.uid() = user_id);

-- ── v22: Prayer public read ───────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'prayer_requests' AND policyname = 'prayer_requests_public_read'
  ) THEN
    EXECUTE 'CREATE POLICY prayer_requests_public_read ON prayer_requests FOR SELECT USING (true)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'prayer_participants' AND policyname = 'prayer_participants_public_read'
  ) THEN
    EXECUTE 'CREATE POLICY prayer_participants_public_read ON prayer_participants FOR SELECT USING (true)';
  END IF;
END $$;

-- ── v23: is_public en prayer_requests ────────────────────────
ALTER TABLE prayer_requests
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE;

-- ── v24: prayer_responses ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS prayer_responses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body         TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE prayer_responses ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='prayer_responses' AND policyname='prayer_responses_public_read') THEN
    EXECUTE 'CREATE POLICY prayer_responses_public_read ON prayer_responses FOR SELECT USING (true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='prayer_responses' AND policyname='prayer_responses_user_insert') THEN
    EXECUTE 'CREATE POLICY prayer_responses_user_insert ON prayer_responses FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='prayer_responses' AND policyname='prayer_responses_user_delete') THEN
    EXECUTE 'CREATE POLICY prayer_responses_user_delete ON prayer_responses FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END $$;
