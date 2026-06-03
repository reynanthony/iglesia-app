-- ── SEED: Estudio Bíblico ───────────────────────────────────────
DO $$
DECLARE
  sid_juan      UUID;
  sid_salmos    UUID;
  sid_filipenses UUID;
  sid_genesis   UUID;
  sid_proverbios UUID;
  sess1 UUID; sess2 UUID; sess3 UUID;
BEGIN

-- ── SERIES ──────────────────────────────────────────────────────
INSERT INTO bible_study_series (title, slug, description, book, theme, cover_color, status, order_index)
VALUES
  ('Evangelio de Juan',
   'evangelio-de-juan',
   'Un recorrido profundo por el cuarto evangelio. Juan escribió para que creyéramos que Jesús es el Cristo, el Hijo de Dios, y para que creyendo tuviéramos vida en su nombre.',
   'Evangelio de Juan', 'La identidad de Cristo', '#76ABAE', 'active', 1),

  ('Salmos selectos',
   'salmos-selectos',
   'Doce salmos cuidadosamente elegidos que cubren la adoración, el lamento, la confianza y la alabanza. Un viaje por la vida interior del pueblo de Dios.',
   'Salmos', 'Adoración y vida interior', '#869B7E', 'upcoming', 2),

  ('Filipenses: El gozo que trasciende',
   'filipenses',
   'Pablo escribe desde la cárcel y la palabra que más repite es "gozo". Este estudio explora cómo el evangelio transforma nuestra perspectiva en cualquier circunstancia.',
   'Filipenses', 'Gozo en toda circunstancia', '#C084FC', 'upcoming', 3),

  ('Génesis 1–11: Los orígenes',
   'genesis-1-11',
   'Los primeros once capítulos de la Biblia responden las preguntas más profundas: ¿quiénes somos?, ¿de dónde venimos?, ¿qué salió mal? Una base indispensable para entender toda la Escritura.',
   'Génesis 1–11', 'Los orígenes de todo', '#60A5FA', 'archived', 4),

  ('Proverbios: Sabiduría práctica',
   'proverbios-tematico',
   'Un estudio temático del libro de Proverbios organizado por áreas de vida: dinero, trabajo, relaciones, palabras, familia e integridad.',
   'Proverbios', 'Sabiduría para la vida diaria', '#F59E0B', 'archived', 5)
ON CONFLICT (slug) DO NOTHING;

-- Retrieve IDs
SELECT id INTO sid_juan       FROM bible_study_series WHERE slug = 'evangelio-de-juan';
SELECT id INTO sid_salmos     FROM bible_study_series WHERE slug = 'salmos-selectos';
SELECT id INTO sid_filipenses FROM bible_study_series WHERE slug = 'filipenses';
SELECT id INTO sid_genesis    FROM bible_study_series WHERE slug = 'genesis-1-11';
SELECT id INTO sid_proverbios FROM bible_study_series WHERE slug = 'proverbios-tematico';

-- ── SESIONES: Evangelio de Juan ─────────────────────────────────

INSERT INTO bible_study_sessions (series_id, title, slug, reference, summary, content, objectives, order_index)
VALUES (sid_juan,
  'El Verbo eterno',
  'el-verbo-eterno',
  'Juan 1:1–5',
  'Juan abre su evangelio con la declaración más audaz de la Escritura: el Verbo existía antes de la creación, era con Dios, y era Dios.',
  E'El Prólogo de Juan (1:1–18) es diferente a cualquier otro comienzo de evangelio. Mateo comienza con la genealogía de Abraham, Marcos arranca con el ministerio de Juan el Bautista, y Lucas con una investigación histórica detallada. Juan, en cambio, nos transporta más allá del tiempo mismo: "En el principio era el Verbo".\n\nEsta frase resuena deliberadamente con Génesis 1:1: "En el principio creó Dios...". No es coincidencia. Juan está haciendo una afirmación teológica poderosa: el Verbo —en griego, Logos— es eterno. Existía antes de que cualquier cosa existiera.\n\nEl concepto de Logos era central tanto en la filosofía griega como en el pensamiento judío. Para los griegos, el Logos era la razón ordenadora del universo. Para los judíos, la Palabra de Dios era el instrumento por el cual Dios creaba y se comunicaba con su pueblo. Juan toma ambas ideas y las aplica a Jesús: Él es la Palabra divina que creó todo lo que existe, que da sentido a la realidad, y que ahora se ha hecho carne.\n\nTres afirmaciones paralelas abren el evangelio:\n• "En el principio era el Verbo" — preexistencia eterna\n• "El Verbo era con Dios" — relación y distinción dentro de la deidad\n• "El Verbo era Dios" — plena naturaleza divina\n\nLuego Juan añade: "En él estaba la vida, y la vida era la luz de los hombres." Vida y luz son dos de los grandes temas del cuarto evangelio. Jesús no solo trae vida — Él es la fuente de toda vida. No solo ilumina el camino — Él es la luz misma.\n\nEl versículo 5 introduce la tensión dramática que recorre todo el libro: "La luz brilla en las tinieblas, y las tinieblas no la han comprendido." La palabra griega para "comprender" también puede traducirse "extinguir" o "apoderarse de". Las tinieblas intentaron apagarla — y fracasaron.',
  ARRAY[
    'Comprender el concepto bíblico del Logos y su significado para judíos y griegos del siglo I',
    'Identificar las tres afirmaciones paralelas sobre el Verbo en Juan 1:1–2',
    'Reconocer la tensión entre luz y oscuridad como tema central del evangelio',
    'Conectar Juan 1:1 con Génesis 1:1 y entender la implicación teológica'
  ],
  1)
ON CONFLICT (series_id, slug) DO NOTHING
RETURNING id INTO sess1;

INSERT INTO bible_study_sessions (series_id, title, slug, reference, summary, content, objectives, order_index)
VALUES (sid_juan,
  'El testimonio del Bautista',
  'el-testimonio-del-bautista',
  'Juan 1:6–18',
  'Antes de que Jesús aparezca en escena, Juan el Bautista ya está testificando de Él. ¿Qué función cumple el testimonio en el plan de Dios?',
  E'Juan el evangelista introduce a otro Juan —Juan el Bautista— de una manera muy específica: "Hubo un hombre enviado de Dios, que se llamaba Juan" (v.6). Nótese el contraste: el Verbo simplemente era; Juan "hubo". El Verbo era desde la eternidad; Juan fue enviado en el tiempo.\n\nLa función del Bautista es clara: "Vino como testigo, para dar testimonio de la luz" (v.7). No era la luz —el texto es enfático en ese punto (v.8)—, sino alguien que apuntaba hacia ella. Esta distinción es importante porque algunos en el siglo I confundían a Juan el Bautista con el Mesías.\n\nLuego el texto da un giro doloroso: "En el mundo estaba, y el mundo fue hecho por él; pero el mundo no le conoció. A lo suyo vino, y los suyos no le recibieron" (vv.10–11). El Creador entró en su creación, y la creación lo rechazó. Vino a su pueblo específico —Israel, "los suyos"— y fue rechazado por la mayoría.\n\nPero el evangelio no termina ahí. El versículo 12 es uno de los más importantes de todo el Nuevo Testamento: "A todos los que le recibieron, a los que creen en su nombre, les dio potestad de ser hechos hijos de Dios."\n\nEl Prólogo culmina con el versículo 18, que resume todo el evangelio: "A Dios nadie le vio jamás; el unigénito Hijo, que está en el seno del Padre, él le ha dado a conocer." El propósito de Jesús es revelar al Padre. Cada milagro, cada enseñanza, cada conversación en el cuarto evangelio es Dios haciéndose conocer a través de su Hijo.',
  ARRAY[
    'Entender la función específica de Juan el Bautista como testigo, no como la luz',
    'Reflexionar sobre el rechazo del Verbo por parte de "los suyos" y sus implicaciones',
    'Profundizar en el significado de "recibir" a Jesús y "creer en su nombre"',
    'Comprender que Jesús vino a revelar al Padre: la misión central del Hijo'
  ],
  2)
ON CONFLICT (series_id, slug) DO NOTHING
RETURNING id INTO sess2;

INSERT INTO bible_study_sessions (series_id, title, slug, reference, summary, content, objectives, order_index)
VALUES (sid_juan,
  'Los primeros discípulos',
  'los-primeros-discipulos',
  'Juan 1:35–51',
  'Cinco hombres siguen a Jesús en el primer capítulo. Cada llamado es diferente. ¿Qué dice eso sobre cómo Dios nos encuentra a cada uno?',
  E'Después del testimonio de Juan el Bautista, el evangelio describe cómo Jesús comienza a reunir a sus primeros seguidores. Lo notable es que cada llamado ocurre de manera distinta — ninguno es idéntico al otro.\n\nAndrés y otro discípulo (probablemente Juan, el autor del evangelio) siguen a Jesús porque el Bautista los señala hacia Él: "He aquí el Cordero de Dios" (v.36). Se acercan, preguntan dónde vive Jesús, y Él los invita: "Venid y ved" (v.39). Pasan el día con Él. A veces el discipulado comienza con una simple invitación a estar presente.\n\nAndrés luego busca a su hermano Simón Pedro y lo lleva a Jesús. No predicó un sermón elaborado — simplemente dijo: "Hemos hallado al Mesías" (v.41). La evangelización más efectiva a menudo ocurre en las relaciones más cercanas.\n\nFilipe es llamado directamente por Jesús: "Sígueme" (v.43). Dos palabras. Sin preámbulos, sin condiciones. Y Felipe responde. Hay momentos en que Dios habla con una claridad desconcertante, sin intermediarios.\n\nNatanael es el caso más interesante. Cuando Felipe lo invita, responde con escepticismo: "¿De Nazaret puede salir algo bueno?" (v.46). Pero Felipe no argumenta — repite la misma invitación de Jesús: "Ven y ve." Natanael acepta, llega, y Jesús lo conoce antes de que lleguen a saludarse. "Antes que Felipe te llamara, cuando estabas debajo de la higuera, te vi" (v.48). El conocimiento sobrenatural de Jesús deshace el escepticismo de Natanael de inmediato.\n\nCada llamado es una ventana a cómo Dios trabaja: a través de la comunidad, de las relaciones personales, de la invitación directa, del conocimiento íntimo que solo Él tiene de cada uno de nosotros.',
  ARRAY[
    'Identificar los diferentes medios por los que cada discípulo llegó a Jesús',
    'Reflexionar sobre cómo Andrés modela la evangelización relacional',
    'Entender la importancia de la invitación "ven y ve" como método de discipulado',
    'Meditar en el conocimiento personal que Jesús tiene de cada creyente'
  ],
  3)
ON CONFLICT (series_id, slug) DO NOTHING
RETURNING id INTO sess3;

-- ── PREGUNTAS: Sesión 1 ─────────────────────────────────────────
IF sess1 IS NOT NULL THEN
  INSERT INTO bible_study_questions (session_id, question, order_index) VALUES
    (sess1, '¿Por qué crees que Juan abre su evangelio con "En el principio" en lugar de con el nacimiento o el ministerio de Jesús?', 0),
    (sess1, '¿Qué nos dice la frase "el Verbo era con Dios Y el Verbo era Dios" sobre la naturaleza y la identidad de Cristo?', 1),
    (sess1, '¿Cómo describes "las tinieblas" en tu propia vida o en el mundo que te rodea?', 2),
    (sess1, 'Si Jesús es "la luz de los hombres", ¿qué implicaciones prácticas tiene eso para cómo vives esta semana?', 3)
  ON CONFLICT DO NOTHING;
END IF;

-- ── PREGUNTAS: Sesión 2 ─────────────────────────────────────────
IF sess2 IS NOT NULL THEN
  INSERT INTO bible_study_questions (session_id, question, order_index) VALUES
    (sess2, 'Juan el Bautista no era la luz, pero señalaba hacia ella. ¿Qué significa para ti ser "testigo" de la luz en tu contexto cotidiano?', 0),
    (sess2, 'El texto dice que Jesús vino "a lo suyo" y no fue recibido. ¿Qué te provoca emocionalmente esa afirmación?', 1),
    (sess2, '¿Cuál es la diferencia entre "conocer de" Jesús y "recibir" a Jesús, según el versículo 12?', 2),
    (sess2, '"A Dios nadie le vio jamás; el Hijo le ha dado a conocer." ¿Qué aspectos del carácter del Padre ves más claramente a través de la vida de Jesús en el evangelio?', 3)
  ON CONFLICT DO NOTHING;
END IF;

-- ── PREGUNTAS: Sesión 3 ─────────────────────────────────────────
IF sess3 IS NOT NULL THEN
  INSERT INTO bible_study_questions (session_id, question, order_index) VALUES
    (sess3, '¿A cuál de los primeros discípulos (Andrés, Felipe, Natanael) te identificas más en tu manera de haber llegado a la fe? ¿Por qué?', 0),
    (sess3, 'Andrés llevó a su hermano a Jesús sin un discurso elaborado. ¿A quién cercano a ti sientes el impulso de llevar?', 1),
    (sess3, 'Natanael llegó escéptico y Jesús lo conocía antes de que hablaran. ¿Cómo impacta tu fe el hecho de que Jesús te conoce profundamente?', 2),
    (sess3, '¿Qué significa para ti la invitación "ven y ve"? ¿Hay algo en tu vida de fe en lo que estás esperando certeza antes de actuar?', 3)
  ON CONFLICT DO NOTHING;
END IF;

-- ── SESIÓN PLACEHOLDER: Salmos ──────────────────────────────────
INSERT INTO bible_study_sessions (series_id, title, slug, reference, summary, content, objectives, order_index)
VALUES (sid_salmos,
  'Salmo 23: El buen pastor',
  'salmo-23-el-buen-pastor',
  'Salmo 23',
  'El salmo más conocido de David describe a Dios como un pastor que provee, guía, restaura y protege. Una meditación sobre la confianza radical.',
  E'El Salmo 23 es probablemente el texto bíblico más memorizado en el mundo. Su brevedad contrasta con su profundidad. En seis versículos, David traza toda la trayectoria de la vida de fe: provisión, descanso, restauración, guía, protección, y finalmente, la esperanza de vivir en la casa del Señor para siempre.\n\nLa imagen del pastor era inmediatamente comprensible para los oyentes del siglo X a.C. en Palestina. Un pastor no era un administrador a distancia — vivía con el rebaño, lo conocía individualmente, sacrificaba su comodidad y seguridad por él.\n\nDavid empieza con una afirmación que lo cambia todo: "El Señor es mi pastor." No "un pastor" ni "el pastor de Israel", sino "mi pastor". La relación es personal. Y de esa relación fluye todo lo demás: "Nada me faltará."\n\nEl valle de sombra de muerte (v.4) es el punto de inflexión del salmo. Antes, David habla de lo que Dios hace: le hace descansar, le guía, restaura su alma. Aquí, David habla directamente a Dios: "Tú estarás conmigo." Cuando la vida se pone oscura, la teología abstracta no alcanza — lo que nos sostiene es una presencia.',
  ARRAY[
    'Analizar la metáfora del pastor en el contexto cultural del Antiguo Testamento',
    'Identificar el giro personal en el versículo 4 y su significado para la fe en tiempos difíciles',
    'Reflexionar sobre qué significa que "el Señor es MI pastor"'
  ],
  1)
ON CONFLICT (series_id, slug) DO NOTHING;

END $$;
