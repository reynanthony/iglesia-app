-- ============================================================
-- El Manantial — LMS: Corrección RLS pública + Datos de ejemplo
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Ruta de administración: /admin/discipulado/programas
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- 1. CORREGIR RLS: permitir lectura pública de contenido activo
--    (la web pública /educacion/discipulado debe ver programas
--    sin requerir sesión iniciada)
-- ════════════════════════════════════════════════════════════

-- Programas activos son públicos; admin/pastor/líder ven todos
DROP POLICY IF EXISTS "Autenticados ven programas" ON discipleship_programs;
CREATE POLICY "Todos ven programas activos"
  ON discipleship_programs FOR SELECT
  USING (
    is_active = true
    OR (
      auth.uid() IS NOT NULL
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
    )
  );

-- Cursos activos son públicos
DROP POLICY IF EXISTS "Autenticados ven cursos" ON discipleship_courses;
CREATE POLICY "Todos ven cursos activos"
  ON discipleship_courses FOR SELECT
  USING (
    is_active = true
    OR (
      auth.uid() IS NOT NULL
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
    )
  );

-- Lecciones activas son públicas (solo metadata; body se muestra al inscripto)
DROP POLICY IF EXISTS "Autenticados ven lecciones" ON discipleship_lessons;
CREATE POLICY "Todos ven lecciones activas"
  ON discipleship_lessons FOR SELECT
  USING (
    is_active = true
    OR (
      auth.uid() IS NOT NULL
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','pastor','lider'))
    )
  );


-- ════════════════════════════════════════════════════════════
-- 2. DATOS DE EJEMPLO — un programa por etapa con sus cursos
--    Administrá este contenido en: /admin/discipulado/programas
-- ════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_stage2 UUID; v_stage3 UUID; v_stage4 UUID;
  v_stage5 UUID; v_stage6 UUID; v_stage7 UUID;

  v_prog  UUID;
  v_c1    UUID; v_c2    UUID; v_c3    UUID;
  v_l     UUID;
BEGIN

  SELECT id INTO v_stage2 FROM discipleship_stages WHERE order_index = 2;
  SELECT id INTO v_stage3 FROM discipleship_stages WHERE order_index = 3;
  SELECT id INTO v_stage4 FROM discipleship_stages WHERE order_index = 4;
  SELECT id INTO v_stage5 FROM discipleship_stages WHERE order_index = 5;
  SELECT id INTO v_stage6 FROM discipleship_stages WHERE order_index = 6;
  SELECT id INTO v_stage7 FROM discipleship_stages WHERE order_index = 7;

  -- ────────────────────────────────────────────────────────
  -- ETAPA 2 · Nuevo creyente
  -- Programa: Fundamentos de la Fe (ya existe del seed anterior)
  -- ────────────────────────────────────────────────────────
  INSERT INTO discipleship_programs (title, slug, description, order_index, required_stage_id, is_active)
  VALUES (
    'Fundamentos de la Fe',
    'fundamentos-de-la-fe',
    'Un recorrido por las bases esenciales del cristiano: quién es Dios, qué hizo por nosotros y cómo vivir en respuesta a su amor. Ideal para quienes acaban de comenzar su camino de fe.',
    1, v_stage2, true
  )
  ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    required_stage_id = EXCLUDED.required_stage_id;

  SELECT id INTO v_prog FROM discipleship_programs WHERE slug = 'fundamentos-de-la-fe';

  -- Curso 1: Salvación
  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Salvación', 'salvacion',
    '¿Qué significa ser salvo? Descubre el plan de Dios para restaurar tu relación con Él y cómo recibir ese regalo de gracia.',
    'Pastor Principal', 'basico', 1, true)
  ON CONFLICT (program_id, slug) DO UPDATE SET description = EXCLUDED.description;

  SELECT id INTO v_c1 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'salvacion';

  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c1) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c1, 'El problema del pecado',
      'Todos hemos fallado y nos hemos quedado cortos de la gloria de Dios. Esta lección explora qué es el pecado, de dónde viene y por qué nos separa de Él.',
      1, true),
    (v_c1, 'El amor de Dios por nosotros',
      'A pesar del pecado, Dios nunca dejó de amarnos. Descubre cómo ese amor incondicional es la raíz de todo el plan de salvación.',
      2, true),
    (v_c1, 'La obra de Cristo en la cruz',
      'Jesús murió en nuestro lugar para pagar la deuda que nosotros no podíamos pagar. Esta lección profundiza en el significado de la expiación.',
      3, true),
    (v_c1, 'La resurrección: victoria sobre la muerte',
      'La resurrección no es solo un evento histórico: es la garantía de nuestra vida eterna y la prueba de que Cristo es quien dice ser.',
      4, true),
    (v_c1, 'Cómo recibir la salvación',
      'El arrepentimiento, la fe y la confesión: los pasos para recibir la gracia de Dios y comenzar una nueva vida en Cristo.',
      5, true);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c1 AND order_index = 1;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, 'Romanos 3:23', 'Por cuanto todos pecaron, y están destituidos de la gloria de Dios.', 1),
    (v_l, 'Romanos 6:23', 'Porque la paga del pecado es muerte, mas la dádiva de Dios es vida eterna en Cristo Jesús Señor nuestro.', 2);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c1 AND order_index = 3;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, 'Juan 3:16', 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.', 1);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c1 AND order_index = 5;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, 'Romanos 10:9', 'Que si confesares con tu boca que Jesús es el Señor, y creyeres en tu corazón que Dios le levantó de los muertos, serás salvo.', 1);
    INSERT INTO lesson_challenges (lesson_id, week_number, description, order_index) VALUES
    (v_l, 1, 'Habla esta semana con tu pastor o líder sobre el paso del bautismo. Si ya eres bautizado, comparte tu historia de salvación con alguien cercano.', 1);
  END IF;

  -- Curso 2: La Biblia
  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'La Biblia', 'la-biblia',
    'La Palabra de Dios: su origen, su propósito y cómo leerla de manera que transforme tu vida cotidiana.',
    'Pastor Principal', 'basico', 2, true)
  ON CONFLICT (program_id, slug) DO UPDATE SET description = EXCLUDED.description;

  SELECT id INTO v_c2 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'la-biblia';

  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c2) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c2, '¿Qué es la Biblia?',
      'La Biblia no es un libro ordinario: es la revelación de Dios a la humanidad, inspirada por el Espíritu Santo y preservada a través de los siglos.',
      1, true),
    (v_c2, 'Cómo leer la Biblia',
      'Métodos prácticos para leer, entender y aplicar las Escrituras: la lectura devocional y el método inductivo básico (observar, interpretar, aplicar).',
      2, true),
    (v_c2, 'La Biblia y mi vida',
      'La Palabra de Dios es viva y activa, y tiene el poder de transformar tu manera de pensar, sentir y actuar. Aprende a hacer de la Biblia un hábito diario.',
      3, true);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c2 AND order_index = 1;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, '2 Timoteo 3:16', 'Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia.', 1);
  END IF;

  -- ────────────────────────────────────────────────────────
  -- ETAPA 3 · Fundamentos
  -- Programa: Bases de la Vida Cristiana
  -- ────────────────────────────────────────────────────────
  INSERT INTO discipleship_programs (title, slug, description, order_index, required_stage_id, is_active)
  VALUES (
    'Bases de la Vida Cristiana',
    'bases-de-la-vida-cristiana',
    'La oración, el Espíritu Santo, la comunidad de fe y los sacramentos: los pilares prácticos que sostienen una vida cristiana sólida y creciente.',
    2, v_stage3, true
  )
  ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    required_stage_id = EXCLUDED.required_stage_id;

  SELECT id INTO v_prog FROM discipleship_programs WHERE slug = 'bases-de-la-vida-cristiana';

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'La Oración', 'la-oracion',
    'Más que un ritual: la oración es una conversación viva con Dios. Aprende a orar con fe, constancia y expectativa.',
    'Pastor Principal', 'basico', 1, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c1 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'la-oracion';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c1) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c1, '¿Por qué orar?', 'La oración no cambia a Dios — nos cambia a nosotros. En esta lección exploramos qué es la oración bíblica y por qué es fundamental en la vida cristiana.', 1, true),
    (v_c1, 'Cómo orar: el Padre Nuestro como modelo', 'Jesús nos enseñó a orar con un modelo que incluye adoración, petición, arrepentimiento y dependencia. Desmenuzamos cada parte del Padre Nuestro.', 2, true),
    (v_c1, 'La oración y el ayuno', 'El ayuno potencia la oración al disciplinar el cuerpo y agudizar el espíritu. Aprende qué es el ayuno bíblico y cómo practicarlo de manera saludable.', 3, true),
    (v_c1, 'Perseverancia en la oración', 'Dios no siempre responde de inmediato, pero siempre responde. Esta lección te ayuda a mantener la fe en la espera y a entender los distintos tipos de respuesta divina.', 4, true);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c1 AND order_index = 1;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, 'Filipenses 4:6', 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.', 1);
    INSERT INTO lesson_challenges (lesson_id, week_number, description, order_index) VALUES
    (v_l, 1, 'Reserva 10 minutos cada mañana esta semana exclusivamente para hablar con Dios. No pidas nada los primeros 5 minutos: solo agrádecele.', 1);
  END IF;

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'El Espíritu Santo', 'el-espiritu-santo',
    'Quién es el Espíritu Santo, cuál es su rol en tu vida y cómo vivir en plena dependencia de su guía y poder.',
    'Pastor Principal', 'basico', 2, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c2 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'el-espiritu-santo';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c2) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c2, 'Quién es el Espíritu Santo', 'El Espíritu Santo no es una fuerza ni una energía: es una Persona de la Trinidad. Esta lección presenta su carácter, sus nombres y su rol en la historia de la salvación.', 1, true),
    (v_c2, 'El fruto del Espíritu', 'Amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza. Estos no son logros humanos, sino el resultado natural de vivir bajo la influencia del Espíritu.', 2, true),
    (v_c2, 'Los dones espirituales', 'Dios equipa a cada creyente con dones específicos para edificar a la iglesia. Aprende a identificar, desarrollar y usar los dones que Él te ha dado.', 3, true);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c2 AND order_index = 1;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, 'Juan 14:26', 'Mas el Consolador, el Espíritu Santo, a quien el Padre enviará en mi nombre, él os enseñará todas las cosas.', 1);
  END IF;

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'La Iglesia', 'la-iglesia',
    'La iglesia no es un edificio ni una organización: es el cuerpo vivo de Cristo. Entiende su misión, sus sacramentos y tu lugar dentro de ella.',
    'Pastor Principal', 'basico', 3, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c3 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'la-iglesia';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c3) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c3, '¿Qué es la iglesia?', 'La iglesia es la comunidad de personas que han sido llamadas y transformadas por Dios. Esta lección explora su naturaleza, propósito y estructura.', 1, true),
    (v_c3, 'Los sacramentos: Bautismo y Santa Cena', 'El bautismo y la Santa Cena no son simples rituales: son actos de obediencia cargados de significado teológico y espiritual.', 2, true),
    (v_c3, 'Mi lugar en el cuerpo', 'Cada miembro tiene una función única e irremplazable. Esta lección te ayuda a descubrir tu rol específico dentro de la comunidad de fe.', 3, true);
  END IF;

  -- ────────────────────────────────────────────────────────
  -- ETAPA 4 · Bautismo
  -- Programa: El Bautismo: Un Nuevo Comienzo
  -- ────────────────────────────────────────────────────────
  INSERT INTO discipleship_programs (title, slug, description, order_index, required_stage_id, is_active)
  VALUES (
    'El Bautismo: Un Nuevo Comienzo',
    'el-bautismo-un-nuevo-comienzo',
    'El bautismo en agua es la declaración pública más poderosa que un creyente puede hacer. Este programa profundiza en su significado bíblico y te prepara para dar ese paso de fe.',
    3, v_stage4, true
  )
  ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    required_stage_id = EXCLUDED.required_stage_id;

  SELECT id INTO v_prog FROM discipleship_programs WHERE slug = 'el-bautismo-un-nuevo-comienzo';

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'El significado del bautismo', 'significado-del-bautismo',
    'Un estudio bíblico completo sobre qué es el bautismo, por qué importa y qué está declarando quien lo recibe.',
    'Pastor Principal', 'basico', 1, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c1 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'significado-del-bautismo';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c1) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c1, 'El bautismo en el Nuevo Testamento', 'Desde el bautismo de Jesús hasta las instrucciones de Pablo: el bautismo tiene raíces profundas en las Escrituras. Esta lección recorre los textos clave.', 1, true),
    (v_c1, 'Morir y resucitar con Cristo', 'El bautismo por inmersión es una dramatización viviente de la muerte y resurrección de Jesús. Esta lección explica la teología del bautismo como identificación con Cristo.', 2, true),
    (v_c1, 'La vida después del bautismo', 'El bautismo no es el final del camino: es el comienzo de una nueva identidad. Esta lección habla de cómo vivir de acuerdo con esa declaración pública.', 3, true);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c1 AND order_index = 2;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, 'Romanos 6:4', 'Porque somos sepultados juntamente con él para muerte por el bautismo, a fin de que como Cristo resucitó de los muertos por la gloria del Padre, así también nosotros andemos en vida nueva.', 1);
    INSERT INTO lesson_challenges (lesson_id, week_number, description, order_index) VALUES
    (v_l, 1, 'Si ya fuiste bautizado, escribe lo que ese día significó para vos. Si aún no lo hiciste, habla con tu pastor esta semana para coordinar la fecha.', 1);
  END IF;

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Vivir como bautizado', 'vivir-como-bautizado',
    'El bautismo cambia tu identidad. Este curso te ayuda a alinear tu vida cotidiana con la declaración que hiciste.',
    'Pastor Principal', 'basico', 2, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c2 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'vivir-como-bautizado';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c2) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c2, 'Tu nueva identidad en Cristo', 'Ya no sos lo que eras: sos hijo de Dios, justificado, santificado, parte de una familia eterna. Esta lección ancla esa verdad en tu corazón.', 1, true),
    (v_c2, 'Vivir en santidad sin legalismo', 'La santidad no es perfección: es dirección. Aprende a caminar en obediencia a Dios sin caer en el perfeccionismo ni en la gracia barata.', 2, true),
    (v_c2, 'Testimonio y comunidad', 'Tu historia de fe es poderosa. Esta lección te enseña a contar lo que Dios hizo en tu vida y a encontrar tu lugar en la comunidad del bautismo.', 3, true);
  END IF;

  -- ────────────────────────────────────────────────────────
  -- ETAPA 5 · Servicio
  -- Programa: Sirviendo con Propósito
  -- ────────────────────────────────────────────────────────
  INSERT INTO discipleship_programs (title, slug, description, order_index, required_stage_id, is_active)
  VALUES (
    'Sirviendo con Propósito',
    'sirviendo-con-proposito',
    'Descubrí los dones que Dios te dio, encontrá tu área de servicio en la iglesia y aprendé a dar de tu tiempo, talento y recursos de manera intencional y sostenible.',
    4, v_stage5, true
  )
  ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    required_stage_id = EXCLUDED.required_stage_id;

  SELECT id INTO v_prog FROM discipleship_programs WHERE slug = 'sirviendo-con-proposito';

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Mis Dones Espirituales', 'mis-dones-espirituales',
    'Identificá los dones que el Espíritu Santo te dio y aprendé a usarlos para edificar la iglesia y servir a tu comunidad.',
    'Pastor Principal', 'basico', 1, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c1 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'mis-dones-espirituales';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c1) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c1, '¿Qué son los dones espirituales?', 'Los dones espirituales son capacidades sobrenaturales dadas por el Espíritu Santo para el bien común. Cada creyente tiene al menos uno.', 1, true),
    (v_c1, 'Los dones en 1 Corintios 12', 'Pablo describe una lista de dones y explica que todos son necesarios en el cuerpo. Ningún don es más importante que otro.', 2, true),
    (v_c1, 'Descubriendo mis dones personales', 'A través de preguntas prácticas, observación y confirmación de la comunidad, podés identificar los dones que Dios te dio.', 3, true),
    (v_c1, 'Usando mis dones en la iglesia', 'Los dones no son para exhibirse: son para servir. Esta lección conecta tus dones con las necesidades reales de la comunidad.', 4, true);
  END IF;

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Mayordomía y Finanzas', 'mayordomia-y-finanzas',
    'Todo lo que tenés le pertenece a Dios. Aprende los principios bíblicos de la mayordomía: tiempo, dinero y talentos al servicio del Reino.',
    'Pastor Principal', 'intermedio', 2, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c2 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'mayordomia-y-finanzas';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c2) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c2, 'El principio de la mayordomía', 'No somos dueños sino administradores de lo que Dios nos confió. Esta perspectiva cambia radicalmente cómo usamos nuestros recursos.', 1, true),
    (v_c2, 'Las primicias y el diezmo', 'El diezmo no es una obligación legal: es un acto de confianza y adoración. Esta lección explica su fundamento bíblico y su significado espiritual.', 2, true),
    (v_c2, 'Finanzas con sabiduría', 'Principios prácticos para manejar las finanzas personales con integridad, evitar deudas innecesarias y construir una vida económica ordenada bajo la gracia de Dios.', 3, true);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c2 AND order_index = 2;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, 'Malaquías 3:10', 'Traed todos los diezmos al alfolí y haya alimento en mi casa; y probadme ahora en esto, dice Jehová de los ejércitos, si no os abriré las ventanas de los cielos.', 1);
  END IF;

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Liderazgo de Servicio', 'liderazgo-de-servicio',
    'El mayor en el Reino es el que sirve. Este curso sienta las bases del liderazgo como servicio, a diferencia del liderazgo como poder.',
    'Pastor Principal', 'intermedio', 3, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c3 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'liderazgo-de-servicio';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c3) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c3, 'El modelo de Jesús', 'Jesús lavó los pies de sus discípulos la noche antes de morir. Ese acto define para siempre lo que es el liderazgo cristiano.', 1, true),
    (v_c3, 'Características del líder siervo', 'Humildad, integridad, visión, fidelidad: las marcas del liderazgo que Dios bendice y multiplica.', 2, true),
    (v_c3, 'Cómo desarrollar a otros', 'El liderazgo de servicio no se enfoca en su propia plataforma sino en levantar a los que lo rodean. Prácticas concretas para invertir en otros.', 3, true);
  END IF;

  -- ────────────────────────────────────────────────────────
  -- ETAPA 6 · Discipulado
  -- Programa: El Arte de Discipular
  -- ────────────────────────────────────────────────────────
  INSERT INTO discipleship_programs (title, slug, description, order_index, required_stage_id, is_active)
  VALUES (
    'El Arte de Discipular',
    'el-arte-de-discipular',
    'En esta etapa ya no solo eres discípulo — también comienzas a serlo para otros. Aprende a acompañar a alguien en su camino de fe con paciencia, gracia y propósito.',
    5, v_stage6, true
  )
  ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    required_stage_id = EXCLUDED.required_stage_id;

  SELECT id INTO v_prog FROM discipleship_programs WHERE slug = 'el-arte-de-discipular';

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Cómo discipular a otros', 'como-discipular-a-otros',
    'El mandato de Jesús fue ir y hacer discípulos — no solo convertidos. Este curso te enseña el proceso práctico de acompañar a alguien en su crecimiento espiritual.',
    'Pastor Principal', 'intermedio', 1, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c1 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'como-discipular-a-otros';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c1) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c1, 'La Gran Comisión y el discipulado', 'Mateo 28:18-20 no es solo una misión institucional: es el llamado personal de Jesús a cada creyente maduro. Esta lección lo hace personal y práctico.', 1, true),
    (v_c1, 'Las 4 fases del discipulado', 'Lo hago, vos mirás → Lo hago, vos ayudás → Vos lo hacés, yo ayudo → Vos lo hacés, vos enseñás. El modelo reproducible de discipulado de Jesús.', 2, true),
    (v_c1, 'La primera reunión con tu discípulo', 'Cómo arrancar la relación: expectativas, compromiso, formato de reuniones y primeros pasos. Guía práctica para la primera conversación.', 3, true),
    (v_c1, 'Preguntas que transforman', 'El discipulado no es dar respuestas: es hacer las preguntas correctas. Aprende el arte de la pregunta socrática aplicado a la guía espiritual.', 4, true),
    (v_c1, 'Cuando el discipulado se hace difícil', 'Habrá momentos de estancamiento, resistencia o frialdad espiritual. Esta lección te equipa para navegar esos momentos con gracia y firmeza.', 5, true);

    SELECT id INTO v_l FROM discipleship_lessons WHERE course_id = v_c1 AND order_index = 1;
    INSERT INTO lesson_bible_verses (lesson_id, reference, verse_text, order_index) VALUES
    (v_l, 'Mateo 28:19-20', 'Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado.', 1);
  END IF;

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Relaciones de Mentoría', 'relaciones-de-mentoria',
    'Las relaciones de mentoría saludables tienen estructura, límites y propósito. Aprende a construirlas de manera bíblica y sostenible.',
    'Pastor Principal', 'intermedio', 2, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c2 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'relaciones-de-mentoria';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c2) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c2, 'Modelo bíblico de mentoría', 'Pablo y Timoteo, Elías y Eliseo, Jesús y sus doce: la mentoría está en el corazón del diseño de Dios para el crecimiento espiritual.', 1, true),
    (v_c2, 'Estructura y frecuencia', 'Una mentoría sin estructura se desgasta. Esta lección ofrece un modelo de reuniones, temas y seguimiento que mantiene la relación fructífera.', 2, true),
    (v_c2, 'Límites sanos en la mentoría', 'La mentoría no reemplaza la terapia, el matrimonio ni la amistad profana. Aprende a establecer y mantener límites que protejan tanto al mentor como al discípulo.', 3, true);
  END IF;

  -- ────────────────────────────────────────────────────────
  -- ETAPA 7 · Liderazgo
  -- Programa: Liderazgo Transformador
  -- ────────────────────────────────────────────────────────
  INSERT INTO discipleship_programs (title, slug, description, order_index, required_stage_id, is_active)
  VALUES (
    'Liderazgo Transformador',
    'liderazgo-transformador',
    'Los líderes de la etapa 7 no solo dirigen: reproducen. Este programa forma líderes que multiplican discípulos, fortalecen la iglesia y dejan un legado que permanece.',
    6, v_stage7, true
  )
  ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    required_stage_id = EXCLUDED.required_stage_id;

  SELECT id INTO v_prog FROM discipleship_programs WHERE slug = 'liderazgo-transformador';

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Principios Bíblicos del Liderazgo', 'principios-biblicos-liderazgo',
    'Los grandes líderes bíblicos no se destacaron por su carisma sino por su obediencia. Un estudio profundo del liderazgo a través de Moisés, Nehemías, Pablo y Jesús.',
    'Pastor Principal', 'avanzado', 1, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c1 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'principios-biblicos-liderazgo';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c1) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c1, 'El líder que Dios llama', 'Dios no llama a los capacitados: capacita a los llamados. Esta lección estudia cómo Dios prepara a sus líderes y qué características busca en ellos.', 1, true),
    (v_c1, 'Carácter sobre carisma', 'La historia está llena de líderes carismáticos que fallaron moralmente. El liderazgo cristiano prioriza el carácter por encima de la capacidad o la visibilidad.', 2, true),
    (v_c1, 'La soledad del liderazgo', 'Liderar es costoso. Esta lección aborda la carga emocional y espiritual del liderazgo y cómo sostenerse en los momentos de aislamiento y presión.', 3, true),
    (v_c1, 'Rendir cuentas: el líder que se deja pastorear', 'Todo líder necesita ser liderado. La rendición de cuentas protege el carácter, previene el abuso y mantiene el corazón blando ante Dios.', 4, true);
  END IF;

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Cultura de Iglesia Saludable', 'cultura-iglesia-saludable',
    'Una iglesia saludable no surge por accidente: es el resultado de líderes que cuidan su propia alma y crean espacios donde otros pueden crecer.',
    'Pastor Principal', 'avanzado', 2, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c2 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'cultura-iglesia-saludable';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c2) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c2, 'Qué es una iglesia saludable', 'Más allá del tamaño o los programas: una iglesia saludable es aquella donde las personas crecen espiritualmente y son enviadas al mundo.', 1, true),
    (v_c2, 'Prevención del abuso espiritual', 'El abuso espiritual ocurre cuando el liderazgo se convierte en control. Esta lección identifica señales de alerta y cómo construir culturas seguras.', 2, true),
    (v_c2, 'Resolución de conflictos en la iglesia', 'El conflicto no es señal de que algo está mal: es una oportunidad para crecer. Principios bíblicos para resolver disputas con gracia y firmeza.', 3, true);
  END IF;

  INSERT INTO discipleship_courses (program_id, title, slug, description, author, level, order_index, is_active)
  VALUES (v_prog, 'Multiplicación y Legado', 'multiplicacion-y-legado',
    'El fin del liderazgo cristiano no es ser indispensable sino reproducirse. Aprende a formar nuevos líderes y a construir un legado que trascienda tu ministerio personal.',
    'Pastor Principal', 'avanzado', 3, true)
  ON CONFLICT (program_id, slug) DO NOTHING;

  SELECT id INTO v_c3 FROM discipleship_courses WHERE program_id = v_prog AND slug = 'multiplicacion-y-legado';
  IF NOT EXISTS (SELECT 1 FROM discipleship_lessons WHERE course_id = v_c3) THEN
    INSERT INTO discipleship_lessons (course_id, title, body, order_index, is_active) VALUES
    (v_c3, 'El líder que se reproduce', 'El mayor éxito de un líder no es lo que logró, sino lo que dejó en otros. Esta lección define la multiplicación como el objetivo final del liderazgo.', 1, true),
    (v_c3, 'Identificando y formando nuevos líderes', 'Cómo reconocer el potencial de liderazgo en otros, invertir en ellos y darles espacio para crecer con supervisión y libertad.', 2, true),
    (v_c3, 'Construyendo para la eternidad', 'El legado no es una estatua ni un edificio: es gente transformada que transforma a otros. Reflexión final sobre el significado del liderazgo cristiano a largo plazo.', 3, true);
  END IF;

END $$;
