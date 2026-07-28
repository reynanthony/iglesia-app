-- La tabla ministries solo tenía una política de lectura pública — nunca existió
-- una política de escritura para admin/pastor, así que crear/editar/eliminar
-- ministerios se bloqueaba silenciosamente por RLS (0 filas afectadas, sin error).
DO $$ BEGIN
  CREATE POLICY "admin_pastor_write_ministries" ON public.ministries FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
