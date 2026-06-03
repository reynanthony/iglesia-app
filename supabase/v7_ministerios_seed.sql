-- ============================================================
-- El Manantial — Ministerios seed (8 ministerios principales)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Asegurar que la columna description existe
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS description TEXT;

INSERT INTO ministries (name, slug, description, color, icon) VALUES
  ('Damas',       'damas',        'Un espacio de crecimiento, comunidad y fe para las mujeres de El Manantial. Aquí cada mujer es valorada, equipada y enviada a impactar su familia y entorno.',      '#8B6F7A', '⭐'),
  ('Caballeros',  'caballeros',   'Hombres comprometidos con Dios, la familia y el servicio a la comunidad. Forjando carácter e identidad bíblica en cada etapa de la vida.',                        '#1A4A6E', '⚡'),
  ('Jóvenes',     'jovenes',      'La próxima generación en movimiento — adorando, creciendo y transformando ciudades. Un espacio seguro para preguntar, crecer y servir con propósito.',            '#C4773B', '🔥'),
  ('Matrimonios', 'matrimonios',  'Fortalecemos los hogares con el amor de Dios como fundamento. Parejas que crecen juntas en fe, comunicación y propósito familiar.',                              '#8B4A5C', '❤️'),
  ('Niños',       'ninos',        'Sembrando la Palabra en el corazón de los más pequeños. Un ambiente lleno de amor, creatividad y verdad bíblica para que los niños conozcan a Jesús.',           '#4A8B7A', '👶'),
  ('Evangelismo', 'evangelismo',  'Llevando el mensaje de salvación a cada rincón de nuestra comunidad. Equipamos a cada creyente para compartir su fe con valentía y amor.',                      '#2A6B6E', '🌍'),
  ('Adoración',   'adoracion',    'Un equipo dedicado a guiar a la iglesia a la presencia de Dios. Músicos, cantores y técnicos que sirven con excelencia para crear atmósferas de encuentro.',    '#76ABAE', '🎵')
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  color       = EXCLUDED.color,
  icon        = EXCLUDED.icon;
