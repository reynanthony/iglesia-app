-- v28: progreso de lectura persistente por versículo + marca explícita de "leído"

ALTER TABLE bible_reading_log
  ADD COLUMN IF NOT EXISTS read_up_to_verse INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS marked_read_at TIMESTAMPTZ;
