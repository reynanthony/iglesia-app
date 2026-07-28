-- Fase A3: tabla dedicada para prédicas (sermons), reemplazo de la colección Directus 'predicas'
CREATE TABLE IF NOT EXISTS public.sermons (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  video_url     text,
  thumbnail_url text,
  series        text,
  speaker       text,
  sermon_date   date,
  published     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "sermons_public_read" ON public.sermons FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "sermons_admin_all" ON public.sermons FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor', 'lider')));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO storage.buckets (id, name, public) VALUES ('sermons', 'sermons', true) ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "sermons_public_read_storage" ON storage.objects FOR SELECT USING (bucket_id = 'sermons');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "sermons_admin_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sermons' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor', 'lider')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "sermons_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'sermons' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor', 'lider')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
