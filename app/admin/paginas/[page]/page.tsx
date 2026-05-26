import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PageEditor from '@/components/admin/PageEditor'

const pagesMeta: Record<string, { label: string; fields: { key: string; label: string; type: 'text' | 'textarea' | 'url'; hint?: string }[] }> = {
  home: {
    label: 'Página de inicio',
    fields: [
      { key: 'hero_tagline',         label: 'Tagline del hero',          type: 'text',     hint: 'Ej: Iglesia El Manantial · Comunidad de fe' },
      { key: 'hero_h1_line1',        label: 'Hero — línea 1',            type: 'text' },
      { key: 'hero_h1_line2',        label: 'Hero — línea 2',            type: 'text' },
      { key: 'hero_h1_line3',        label: 'Hero — línea 3 (cursiva)',  type: 'text' },
      { key: 'hero_subtitle',        label: 'Subtítulo del hero',        type: 'textarea' },
      { key: 'verse',                label: 'Versículo destacado',       type: 'textarea' },
      { key: 'verse_ref',            label: 'Referencia del versículo',  type: 'text',     hint: 'Ej: Mateo 11:28' },
      { key: 'featured_event_title', label: 'Evento destacado — título', type: 'text' },
      { key: 'featured_event_desc',  label: 'Evento destacado — descripción', type: 'textarea' },
    ],
  },
  nosotros: {
    label: 'Quiénes somos',
    fields: [
      { key: 'hero_tagline',     label: 'Tagline',             type: 'text' },
      { key: 'hero_body',        label: 'Párrafo de apertura', type: 'textarea' },
      { key: 'stat_year',        label: 'Año de fundación',    type: 'text',     hint: 'Ej: 2008' },
      { key: 'stat_families',    label: 'Familias',            type: 'text',     hint: 'Ej: 500+' },
      { key: 'stat_generations', label: 'Generaciones',        type: 'text',     hint: 'Ej: 3' },
      { key: 'stat_ministries',  label: 'Ministerios',         type: 'text',     hint: 'Ej: 12+' },
      { key: 'mission',          label: 'Misión',              type: 'textarea' },
      { key: 'vision',           label: 'Visión',              type: 'textarea' },
    ],
  },
  contacto: {
    label: 'Contacto',
    fields: [
      { key: 'address',      label: 'Dirección',                  type: 'textarea' },
      { key: 'phone',        label: 'Teléfono',                   type: 'text' },
      { key: 'email',        label: 'Correo electrónico',         type: 'text' },
      { key: 'schedule_sun', label: 'Horario — Domingo',          type: 'text',  hint: 'Ej: 10:00 AM' },
      { key: 'schedule_wed', label: 'Horario — Miércoles',        type: 'text',  hint: 'Ej: 7:00 PM' },
      { key: 'schedule_fri', label: 'Horario — Viernes',          type: 'text',  hint: 'Ej: 7:00 PM' },
      { key: 'maps_url',     label: 'URL de Google Maps',         type: 'url' },
    ],
  },
}

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  const meta = pagesMeta[page]
  if (!meta) notFound()

  const supabase = await createClient()
  const { data } = await supabase
    .from('page_content')
    .select('content')
    .eq('page', page)
    .single()

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5" style={{ borderColor: '#1F1F1F' }}>
        <a href="/admin/paginas" className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#4D4D4D' }}>
          ← Páginas
        </a>
        <h1 className="font-bold text-lg text-white mt-2">{meta.label}</h1>
      </div>

      <div className="px-4 md:px-8 py-6">
        <PageEditor page={page} fields={meta.fields} initialContent={(data?.content ?? {}) as Record<string, string>} />
      </div>
    </div>
  )
}
