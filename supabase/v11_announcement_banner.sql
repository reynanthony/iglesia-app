-- Distingue banners inline de overlays de pantalla completa
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS is_banner BOOLEAN NOT NULL DEFAULT false;

-- Los banners se muestran como barra en el feed; los overlays como pantalla completa al abrir la app.
-- Actualiza el índice de la policy para reflejar la nueva columna (no necesario, las policies existentes siguen válidas).
