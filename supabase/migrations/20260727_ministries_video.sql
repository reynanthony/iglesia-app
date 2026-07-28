-- Fase A1: columna video_url en ministries (reemplazo de Directus 'ministerios')
ALTER TABLE public.ministries ADD COLUMN IF NOT EXISTS video_url text;
