-- Add Web Push subscription storage to device_tokens
ALTER TABLE device_tokens
  ADD COLUMN IF NOT EXISTS push_sub JSONB;

-- Allow platform 'web' if not already in check constraint
-- (The existing CHECK already includes 'web' from v6)
