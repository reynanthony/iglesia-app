-- Fase A4: bucket de storage para devocionales (la tabla y su RLS ya existen desde v3_leaders_education.sql)
INSERT INTO storage.buckets (id, name, public) VALUES ('devocionales', 'devocionales', true) ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "devocionales_public_read_storage" ON storage.objects FOR SELECT USING (bucket_id = 'devocionales');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "devocionales_admin_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'devocionales' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "devocionales_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'devocionales' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
