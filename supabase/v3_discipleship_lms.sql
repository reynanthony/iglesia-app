-- ============================================================
-- El Manantial — Migración v3.0: LMS Discipulado
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Idempotente: se puede ejecutar varias veces sin errores
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- TABLAS
-- ════════════════════════════════════════════════════════════

-- ── 1. Programas de formación ────────────────────────────────
CREATE TABLE IF NOT EXISTS discipleship_programs (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title             TEXT        NOT NULL,
  slug              TEXT        NOT NULL UNIQUE,
  description       TEXT,
  thumbnail_url     TEXT,
  order_index       INTEGER     NOT NULL DEFAULT 0,
  required_stage_id UUID        REFERENCES discipleship_stages(id),
  is_active         BOOLEAN     DEFAULT true,
  created_by        UUID        REFERENCES profiles(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Cursos (dentro de un programa) ───────────────────────
CREATE TABLE IF NOT EXISTS discipleship_courses (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id       UUID        NOT NULL REFERENCES discipleship_programs(id) ON DELETE CASCADE,
  title            TEXT        NOT NULL,
  slug             TEXT        NOT NULL,
  description      TEXT,
  author           TEXT,
  thumbnail_url    TEXT,
  duration_minutes INTEGER     DEFAULT 0,
  level            TEXT        DEFAULT 'basico' CHECK (level IN ('basico','intermedio','avanzado')),
  order_index      INTEGER     NOT NULL DEFAULT 0,
  is_active        BOOLEAN     DEFAULT true,
  ministry_id      UUID        REFERENCES ministries(id),
  created_by       UUID        REFERENCES profiles(id),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, slug)
);

-- ── 3. Lecciones (dentro de un curso) ───────────────────────
CREATE TABLE IF NOT EXISTS discipleship_lessons (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id   UUID        NOT NULL REFERENCES discipleship_courses(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  body        TEXT,
  video_url   TEXT,
  audio_url   TEXT,
  pdf_url     TEXT,
  order_index INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Versículos bíblicos por lección ──────────────────────
CREATE TABLE IF NOT EXISTS lesson_bible_verses (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id   UUID    NOT NULL REFERENCES discipleship_lessons(id) ON DELETE CASCADE,
  reference   TEXT    NOT NULL,
  verse_text  TEXT    NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- ── 5. Desafíos prácticos por lección ───────────────────────
CREATE TABLE IF NOT EXISTS lesson_challenges (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id   UUID    NOT NULL REFERENCES discipleship_lessons(id) ON DELETE CASCADE,
  week_number INTEGER DEFAULT 1,
  description TEXT    NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- ── 6. Inscripciones de usuarios a cursos ───────────────────
CREATE TABLE IF NOT EXISTS user_course_enrollments (
  user_id        UUID        NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  course_id      UUID        NOT NULL REFERENCES discipleship_courses(id) ON DELETE CASCADE,
  enrolled_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at   TIMESTAMPTZ,
  last_lesson_id UUID        REFERENCES discipleship_lessons(id),
  progress_pct   INTEGER     DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  PRIMARY KEY (user_id, course_id)
);

-- ── 7. Lecciones completadas por usuario ────────────────────
CREATE TABLE IF NOT EXISTS user_lesson_completions (
  user_id      UUID        NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  lesson_id    UUID        NOT NULL REFERENCES discipleship_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

-- ── 8. Diario de reflexión (una entrada por usuario × lección)
CREATE TABLE IF NOT EXISTS user_reflections (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID        NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  lesson_id             UUID        NOT NULL REFERENCES discipleship_lessons(id) ON DELETE CASCADE,
  what_learned          TEXT,
  god_spoke             TEXT,
  must_change           TEXT,
  must_apply            TEXT,
  is_shared_with_mentor BOOLEAN     DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ── 9. Pares mentor–discípulo ────────────────────────────────
CREATE TABLE IF NOT EXISTS discipleship_mentors (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id   UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by UUID        REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  status      TEXT        DEFAULT 'active' CHECK (status IN ('active','paused','completed')),
  notes       TEXT,
  UNIQUE(mentor_id, student_id)
);

-- ── 10. Observaciones del mentor sobre el discípulo ─────────
CREATE TABLE IF NOT EXISTS mentor_observations (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 11. Programa asignado a un grupo (integración grupos) ───
ALTER TABLE groups
  ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES discipleship_programs(id);


-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════

-- ── discipleship_programs ────────────────────────────────────
ALTER TABLE discipleship_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados ven programas" ON discipleship_programs;
CREATE POLICY "Autenticados ven programas"
  ON discipleship_programs FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      is_active = true
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
    )
  );

DROP POLICY IF EXISTS "Líderes gestionan programas" ON discipleship_programs;
CREATE POLICY "Líderes gestionan programas"
  ON discipleship_programs FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

-- ── discipleship_courses ─────────────────────────────────────
ALTER TABLE discipleship_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados ven cursos" ON discipleship_courses;
CREATE POLICY "Autenticados ven cursos"
  ON discipleship_courses FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      is_active = true
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
    )
  );

DROP POLICY IF EXISTS "Líderes gestionan cursos" ON discipleship_courses;
CREATE POLICY "Líderes gestionan cursos"
  ON discipleship_courses FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

-- ── discipleship_lessons ─────────────────────────────────────
ALTER TABLE discipleship_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados ven lecciones" ON discipleship_lessons;
CREATE POLICY "Autenticados ven lecciones"
  ON discipleship_lessons FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      is_active = true
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
    )
  );

DROP POLICY IF EXISTS "Líderes gestionan lecciones" ON discipleship_lessons;
CREATE POLICY "Líderes gestionan lecciones"
  ON discipleship_lessons FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

-- ── lesson_bible_verses ──────────────────────────────────────
ALTER TABLE lesson_bible_verses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados ven versículos" ON lesson_bible_verses;
CREATE POLICY "Autenticados ven versículos"
  ON lesson_bible_verses FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Líderes gestionan versículos" ON lesson_bible_verses;
CREATE POLICY "Líderes gestionan versículos"
  ON lesson_bible_verses FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

-- ── lesson_challenges ────────────────────────────────────────
ALTER TABLE lesson_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados ven desafíos" ON lesson_challenges;
CREATE POLICY "Autenticados ven desafíos"
  ON lesson_challenges FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Líderes gestionan desafíos" ON lesson_challenges;
CREATE POLICY "Líderes gestionan desafíos"
  ON lesson_challenges FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

-- ── user_course_enrollments ──────────────────────────────────
ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver inscripciones propias y de discípulos" ON user_course_enrollments;
CREATE POLICY "Ver inscripciones propias y de discípulos"
  ON user_course_enrollments FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM discipleship_mentors
      WHERE mentor_id = auth.uid()
        AND student_id = user_course_enrollments.user_id
        AND status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin','pastor','lider')
    )
  );

DROP POLICY IF EXISTS "Usuarios gestionan sus inscripciones" ON user_course_enrollments;
CREATE POLICY "Usuarios gestionan sus inscripciones"
  ON user_course_enrollments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── user_lesson_completions ──────────────────────────────────
ALTER TABLE user_lesson_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver lecciones completadas" ON user_lesson_completions;
CREATE POLICY "Ver lecciones completadas"
  ON user_lesson_completions FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM discipleship_mentors
      WHERE mentor_id = auth.uid()
        AND student_id = user_lesson_completions.user_id
        AND status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin','pastor','lider')
    )
  );

DROP POLICY IF EXISTS "Usuarios gestionan sus lecciones completadas" ON user_lesson_completions;
CREATE POLICY "Usuarios gestionan sus lecciones completadas"
  ON user_lesson_completions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── user_reflections ─────────────────────────────────────────
ALTER TABLE user_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver reflexiones propias y compartidas con mentor" ON user_reflections;
CREATE POLICY "Ver reflexiones propias y compartidas con mentor"
  ON user_reflections FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      is_shared_with_mentor = true
      AND EXISTS (
        SELECT 1 FROM discipleship_mentors
        WHERE mentor_id = auth.uid()
          AND student_id = user_reflections.user_id
          AND status = 'active'
      )
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin','pastor')
    )
  );

DROP POLICY IF EXISTS "Usuarios gestionan sus reflexiones" ON user_reflections;
CREATE POLICY "Usuarios gestionan sus reflexiones"
  ON user_reflections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── discipleship_mentors ─────────────────────────────────────
ALTER TABLE discipleship_mentors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver pares de mentoría" ON discipleship_mentors;
CREATE POLICY "Ver pares de mentoría"
  ON discipleship_mentors FOR SELECT
  USING (
    auth.uid() = mentor_id
    OR auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
  );

DROP POLICY IF EXISTS "Líderes gestionan mentoría" ON discipleship_mentors;
CREATE POLICY "Líderes gestionan mentoría"
  ON discipleship_mentors FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider')));

-- ── mentor_observations ──────────────────────────────────────
ALTER TABLE mentor_observations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver observaciones del mentor" ON mentor_observations;
CREATE POLICY "Ver observaciones del mentor"
  ON mentor_observations FOR SELECT
  USING (
    auth.uid() = mentor_id
    OR auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor'))
  );

DROP POLICY IF EXISTS "Mentores crean observaciones" ON mentor_observations;
CREATE POLICY "Mentores crean observaciones"
  ON mentor_observations FOR INSERT
  WITH CHECK (
    auth.uid() = mentor_id
    AND EXISTS (
      SELECT 1 FROM discipleship_mentors
      WHERE mentor_id = auth.uid()
        AND student_id = mentor_observations.student_id
        AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Mentores actualizan sus observaciones" ON mentor_observations;
CREATE POLICY "Mentores actualizan sus observaciones"
  ON mentor_observations FOR UPDATE
  USING (auth.uid() = mentor_id);

DROP POLICY IF EXISTS "Mentores y admins eliminan observaciones" ON mentor_observations;
CREATE POLICY "Mentores y admins eliminan observaciones"
  ON mentor_observations FOR DELETE
  USING (
    auth.uid() = mentor_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor'))
  );


-- ════════════════════════════════════════════════════════════
-- DATOS DE EJEMPLO
-- Programa "Fundamentos de la Fe" con 2 cursos y 8 lecciones
-- ════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_stage_id   UUID;
  v_prog_id    UUID;
  v_course1_id UUID;
  v_course2_id UUID;
  v_lesson_id  UUID;
BEGIN

  -- Etapa requerida: Nuevo creyente (order_index = 2)
  SELECT id INTO v_stage_id FROM discipleship_stages WHERE order_index = 2;

  -- ── Programa ────────────────────────────────────────────
  INSERT INTO discipleship_programs
    (title, slug, description, order_index, required_stage_id, is_active)
  VALUES (
    'Fundamentos de la Fe',
    'fundamentos-de-la-fe',
    'Un recorrido por las bases esenciales del cristiano: quién es Dios, qué hizo por nosotros y cómo vivir en respuesta a su amor.',
    1, v_stage_id, true
  )
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_prog_id
    FROM discipleship_programs WHERE slug = 'fundamentos-de-la-fe';

  -- ── Curso 1: Salvación ──────────────────────────────────
  INSERT INTO discipleship_courses
    (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (
    v_prog_id,
    'Salvación',
    'salvacion',
    '¿Qué significa ser salvo? Descubre el plan de Dios para restaurar tu relación con Él.',
    'Pastor Principal', 'basico', 1, true
  )
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_course1_id
    FROM discipleship_courses WHERE program_id = v_prog_id AND slug = 'salvacion';

  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_course1_id) THEN

    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_course1_id, 'El problema del pecado',
      'Todos hemos fallado y nos hemos quedado cortos de la gloria de Dios. Esta lección explora qué es el pecado, de dónde viene y por qué nos separa de Él.',
      1, true),
    (v_course1_id, 'El amor de Dios por nosotros',
      'A pesar del pecado, Dios nunca dejó de amarnos. Descubre cómo ese amor incondicional es la raíz de todo el plan de salvación.',
      2, true),
    (v_course1_id, 'La obra de Cristo en la cruz',
      'Jesús murió en nuestro lugar para pagar la deuda que nosotros no podíamos pagar. Esta lección profundiza en el significado de la expiación.',
      3, true),
    (v_course1_id, 'La resurrección: victoria sobre la muerte',
      'La resurrección no es solo un evento histórico: es la garantía de nuestra vida eterna y la prueba de que Cristo es quien dice ser.',
      4, true),
    (v_course1_id, 'Cómo recibir la salvación',
      'El arrepentimiento, la fe y la confesión: los pasos para recibir la gracia de Dios y comenzar una nueva vida en Cristo.',
      5, true);

    -- Versículos: Lección 1
    SELECT id INTO v_lesson_id FROM discipleship_lessons WHERE course_id = v_course1_id AND order_index = 1;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_lesson_id, 'Romanos 3:23',
      'Por cuanto todos pecaron, y están destituidos de la gloria de Dios.',
      1),
    (v_lesson_id, 'Romanos 6:23',
      'Porque la paga del pecado es muerte, mas la dádiva de Dios es vida eterna en Cristo Jesús Señor nuestro.',
      2);
    INSERT INTO lesson_challenges (lesson_id, week_number, description, order_index) VALUES
    (v_lesson_id, 1,
      'Escribe una oración honesta reconociendo ante Dios las áreas donde has fallado esta semana. No es una lista de pecados, sino una conversación.',
      1);

    -- Versículos: Lección 3
    SELECT id INTO v_lesson_id FROM discipleship_lessons WHERE course_id = v_course1_id AND order_index = 3;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_lesson_id, 'Juan 3:16',
      'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
      1),
    (v_lesson_id, '1 Pedro 2:24',
      'Quien llevó él mismo nuestros pecados en su cuerpo sobre el madero, para que nosotros, estando muertos a los pecados, vivamos a la justicia; y por cuya herida fuisteis sanados.',
      2);

    -- Versículos y desafío: Lección 5
    SELECT id INTO v_lesson_id FROM discipleship_lessons WHERE course_id = v_course1_id AND order_index = 5;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_lesson_id, 'Romanos 10:9',
      'Que si confesares con tu boca que Jesús es el Señor, y creyeres en tu corazón que Dios le levantó de los muertos, serás salvo.',
      1),
    (v_lesson_id, 'Hechos 2:38',
      'Arrepentíos, y bautícese cada uno de vosotros en el nombre de Jesucristo para perdón de los pecados; y recibiréis el don del Espíritu Santo.',
      2);
    INSERT INTO lesson_challenges (lesson_id, week_number, description, order_index) VALUES
    (v_lesson_id, 1,
      'Si aún no lo has hecho, habla esta semana con tu pastor o líder sobre el paso del bautismo. Si ya eres bautizado, comparte tu historia de salvación con alguien cercano.',
      1);

  END IF;

  -- ── Curso 2: La Biblia ──────────────────────────────────
  INSERT INTO discipleship_courses
    (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (
    v_prog_id,
    'La Biblia',
    'la-biblia',
    'La Palabra de Dios: su origen, su propósito y cómo leerla para transformar tu vida.',
    'Pastor Principal', 'basico', 2, true
  )
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_course2_id
    FROM discipleship_courses WHERE program_id = v_prog_id AND slug = 'la-biblia';

  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_course2_id) THEN

    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_course2_id, '¿Qué es la Biblia?',
      'La Biblia no es un libro ordinario: es la revelación de Dios a la humanidad, inspirada por el Espíritu Santo y preservada a través de los siglos. Aprende sobre su origen, su estructura y por qué podemos confiar en ella.',
      1, true),
    (v_course2_id, 'Cómo leer la Biblia',
      'Métodos prácticos para leer, entender y aplicar las Escrituras a tu vida diaria. Desde la lectura devocional hasta el estudio inductivo básico: observar, interpretar, aplicar.',
      2, true),
    (v_course2_id, 'La Biblia y mi vida',
      'La Palabra de Dios no es solo historia: es viva y activa, y tiene el poder de transformar tu manera de pensar, sentir y actuar. Esta lección te ayuda a hacer de la Biblia un hábito diario.',
      3, true);

    -- Versículos: Lección 1
    SELECT id INTO v_lesson_id FROM discipleship_lessons WHERE course_id = v_course2_id AND order_index = 1;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_lesson_id, '2 Timoteo 3:16-17',
      'Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia, a fin de que el hombre de Dios sea perfecto, enteramente preparado para toda buena obra.',
      1);

    -- Versículos y desafío: Lección 3
    SELECT id INTO v_lesson_id FROM discipleship_lessons WHERE course_id = v_course2_id AND order_index = 3;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_lesson_id, 'Hebreos 4:12',
      'Porque la palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos; y penetra hasta partir el alma y el espíritu, las coyunturas y los tuétanos, y discierne los pensamientos y las intenciones del corazón.',
      1);
    INSERT INTO lesson_challenges (lesson_id, week_number, description, order_index) VALUES
    (v_lesson_id, 1,
      'Comprométete a leer la Biblia cada día esta semana — aunque sean 5 minutos. Al terminar cada lectura, escribe una sola frase de lo que Dios te habló. Al final de la semana, comparte una de esas frases en la comunidad.',
      1);

  END IF;

END $$;
