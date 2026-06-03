-- ============================================================
-- El Manantial — v8: Pastoral Room
-- Idempotente: se puede ejecutar múltiples veces sin errores
-- ============================================================

-- ── STORAGE BUCKET ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('pastoral', 'pastoral', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "pastoral_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'pastoral');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pastoral_admin_upload" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'pastoral' AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor')
      ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pastoral_admin_delete" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'pastoral' AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor')
      ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── TABLA 1: pastoral_messages (canal del pastor) ──────────
CREATE TABLE IF NOT EXISTS public.pastoral_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  body        text,
  media_url   text,
  media_type  text CHECK (media_type IN ('text','audio','video','image')),
  pinned      boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.pastoral_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "pastoral_messages_members_read" ON public.pastoral_messages
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pastoral_messages_pastor_insert" ON public.pastoral_messages
    FOR INSERT WITH CHECK (
      auth.uid() = author_id AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor')
      ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pastoral_messages_pastor_update" ON public.pastoral_messages
    FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor')));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pastoral_messages_pastor_delete" ON public.pastoral_messages
    FOR DELETE USING (
      EXISTS (SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor')));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── TABLA 2: pastoral_message_reactions ───────────────────
CREATE TABLE IF NOT EXISTS public.pastoral_message_reactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  uuid REFERENCES public.pastoral_messages(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('orando','amen','edifico','gracias')),
  created_at  timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

ALTER TABLE public.pastoral_message_reactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "pmr_members_read" ON public.pastoral_message_reactions
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pmr_members_manage" ON public.pastoral_message_reactions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── TABLA 3: pastoral_questions (pregunta al pastor) ──────
CREATE TABLE IF NOT EXISTS public.pastoral_questions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  question          text NOT NULL,
  category          text DEFAULT 'general'
                    CHECK (category IN ('doctrinal','consejo','orientacion','general')),
  status            text DEFAULT 'pending'
                    CHECK (status IN ('pending','answered')),
  answer_body       text,
  answer_media_url  text,
  answer_media_type text CHECK (answer_media_type IN ('text','audio','video')),
  is_public         boolean DEFAULT false,
  created_at        timestamptz DEFAULT now(),
  answered_at       timestamptz
);

ALTER TABLE public.pastoral_questions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "pq_owner_read" ON public.pastoral_questions
    FOR SELECT USING (
      auth.uid() = user_id
      OR is_public = true
      OR EXISTS (SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor'))
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pq_member_insert" ON public.pastoral_questions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pq_pastor_update" ON public.pastoral_questions
    FOR UPDATE USING (
      auth.uid() = user_id
      OR EXISTS (SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor'))
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── TABLA 4: pastoral_encounters (encuentros exclusivos) ──
CREATE TABLE IF NOT EXISTS public.pastoral_encounters (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  description    text,
  type           text DEFAULT 'clase'
                 CHECK (type IN ('clase','mentoria','conversatorio','preguntas')),
  status         text DEFAULT 'scheduled'
                 CHECK (status IN ('scheduled','live','finished')),
  live_url       text,
  scheduled_at   timestamptz,
  thumbnail_url  text,
  notes_markdown text,
  resources_json jsonb DEFAULT '[]',
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE public.pastoral_encounters ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "pe_members_read" ON public.pastoral_encounters
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pe_admin_all" ON public.pastoral_encounters
    FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor'))
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── TABLA 5: pastoral_reflections (feed corto) ─────────────
CREATE TABLE IF NOT EXISTS public.pastoral_reflections (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text,
  body             text,
  media_url        text,
  media_type       text DEFAULT 'text'
                   CHECK (media_type IN ('text','video','audio')),
  duration_seconds int,
  week_featured    boolean DEFAULT false,
  published        boolean DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE public.pastoral_reflections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "pr_members_read" ON public.pastoral_reflections
    FOR SELECT USING (auth.uid() IS NOT NULL AND published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pr_admin_all" ON public.pastoral_reflections
    FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin','pastor'))
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── REALTIME ────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime
  ADD TABLE public.pastoral_messages,
            public.pastoral_message_reactions,
            public.pastoral_encounters;
