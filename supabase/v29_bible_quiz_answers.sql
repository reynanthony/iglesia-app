-- v29: guardar las respuestas del cuestionario para poder mostrar el
-- resultado completo (no solo el puntaje) cuando el usuario vuelve a
-- entrar a un capítulo ya cuestionado, sin borrarlo ni obligarlo a repetir.

ALTER TABLE bible_reading_log
  ADD COLUMN IF NOT EXISTS quiz_answers JSONB;
