-- Add blocks JSONB column to publicaciones
ALTER TABLE publicaciones
  ADD COLUMN IF NOT EXISTS blocks JSONB NOT NULL DEFAULT '[]'::jsonb;
