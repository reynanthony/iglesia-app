-- Fase A2: event_rsvps pasa de referenciar ids de Directus (texto libre) a una FK real hacia events(id)
-- Las filas actuales apuntan a ids falsos ('1','2','3' del fallback hardcodeado) o a ids de Directus muertos
-- no son recuperables. Confirmado con el usuario antes de aplicar.
DELETE FROM public.event_rsvps;

ALTER TABLE public.event_rsvps
  DROP CONSTRAINT IF EXISTS event_rsvps_user_id_directus_event_id_key;

ALTER TABLE public.event_rsvps RENAME COLUMN directus_event_id TO event_id_old;
ALTER TABLE public.event_rsvps ADD COLUMN event_id uuid REFERENCES public.events(id) ON DELETE CASCADE;
ALTER TABLE public.event_rsvps DROP COLUMN event_id_old;
ALTER TABLE public.event_rsvps ALTER COLUMN event_id SET NOT NULL;
ALTER TABLE public.event_rsvps ADD CONSTRAINT event_rsvps_user_event_unique UNIQUE(user_id, event_id);
