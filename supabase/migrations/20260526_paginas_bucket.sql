INSERT INTO storage.buckets (id, name, public) VALUES ('paginas', 'paginas', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "public_read_paginas" ON storage.objects FOR SELECT USING (bucket_id = 'paginas');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "admin_upload_paginas" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'paginas' AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor')
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
