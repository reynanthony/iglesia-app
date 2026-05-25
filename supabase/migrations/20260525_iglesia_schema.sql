-- ══════════════════════════════════════════════════
-- 1. TABLA: events (para /eventos)
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo       text NOT NULL,
  descripcion  text,
  fecha_inicio date NOT NULL,
  fecha_fin    date,
  lugar        text,
  categoria    text,
  badge        text DEFAULT 'Próximo',
  image_url    text,
  visible      boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "events_public_read" ON public.events FOR SELECT USING (visible = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "events_admin_all" ON public.events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ══════════════════════════════════════════════════
-- 2. TABLA: contact_messages (para /contacto)
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     text NOT NULL,
  email      text NOT NULL,
  asunto     text DEFAULT 'Información general',
  mensaje    text NOT NULL,
  leido      boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "contact_public_insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "contact_admin_read" ON public.contact_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ══════════════════════════════════════════════════
-- 3. COLUMNAS NUEVAS en tablas existentes
-- ══════════════════════════════════════════════════
ALTER TABLE public.ministries
  ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.ministry_content
  ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;

-- ══════════════════════════════════════════════════
-- 4. STORAGE BUCKETS
-- ══════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES ('eventos', 'eventos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('ministerios', 'ministerios', true)
ON CONFLICT (id) DO NOTHING;

-- Lectura pública
DO $$ BEGIN
  CREATE POLICY "eventos_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'eventos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "ministerios_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'ministerios');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Upload solo admin/pastor
DO $$ BEGIN
  CREATE POLICY "eventos_admin_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'eventos' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "ministerios_admin_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ministerios' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Delete solo admin/pastor
DO $$ BEGIN
  CREATE POLICY "eventos_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'eventos' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "ministerios_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'ministerios' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')
  ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
