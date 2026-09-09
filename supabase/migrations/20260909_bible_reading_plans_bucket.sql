-- Bucket de storage para portadas de planes de lectura bíblica
INSERT INTO storage.buckets (id, name, public) VALUES ('bible-reading-plans', 'bible-reading-plans', true) ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "bible_reading_plans_public_read_storage" ON storage.objects FOR SELECT USING (bucket_id = 'bible-reading-plans');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bible_reading_plans_admin_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'bible-reading-plans' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bible_reading_plans_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'bible-reading-plans' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
