-- v22: Event RSVPs + public read access for prayer wall

-- ── Event RSVPs ──────────────────────────────────────────────
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

-- ── Prayer public read ────────────────────────────────────────
-- Opens prayer_requests and prayer_participants to anonymous read
-- so the public /oracion page can show counts without login.
-- Uses DO block so it's idempotent (safe to run more than once).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename   = 'prayer_requests'
      AND policyname  = 'prayer_requests_public_read'
  ) THEN
    EXECUTE 'CREATE POLICY prayer_requests_public_read ON prayer_requests FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename   = 'prayer_participants'
      AND policyname  = 'prayer_participants_public_read'
  ) THEN
    EXECUTE 'CREATE POLICY prayer_participants_public_read ON prayer_participants FOR SELECT USING (true)';
  END IF;
END $$;
