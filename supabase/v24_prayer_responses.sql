-- v24: Prayer responses — users can attach their own prayer to someone else's

CREATE TABLE IF NOT EXISTS prayer_responses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body         TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE prayer_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prayer_responses_public_read"  ON prayer_responses FOR SELECT USING (true);
CREATE POLICY "prayer_responses_user_insert"  ON prayer_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prayer_responses_user_delete"  ON prayer_responses FOR DELETE USING (auth.uid() = user_id);
