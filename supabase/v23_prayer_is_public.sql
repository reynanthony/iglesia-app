-- v23: Add is_public field to prayer_requests
-- Controls whether a prayer appears on the public /oracion wall.
-- Defaults to TRUE so existing prayers remain visible.

ALTER TABLE prayer_requests
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE;
