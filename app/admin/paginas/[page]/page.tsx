import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PageBuilder from '@/components/admin/PageBuilder'
import type { Block } from '@/lib/blocks'

const pagesMeta: Record<string, { label: string; previewPath: string }> = {
  home:        { label: 'Página de inicio',       previewPath: '/'           },
  nosotros:    { label: 'Quiénes somos',           previewPath: '/nosotros'   },
  contacto:    { label: 'Contacto',                previewPath: '/contacto'   },
  eventos:     { label: 'Eventos',                 previewPath: '/eventos'    },
  predicas:    { label: 'Prédicas',                previewPath: '/predicas'   },
  ministerios: { label: 'Ministerios',             previewPath: '/ministerios'},
  'app-feed':  { label: 'App — Banner del feed',   previewPath: '/app/feed'   },
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

  const content = (data?.content ?? {}) as Record<string, any>
  const blocks: Block[] = Array.isArray(content.blocks) ? content.blocks : []

  return (
    <PageBuilder
      page={page}
      pageLabel={meta.label}
      initialBlocks={blocks}
      previewPath={meta.previewPath}
    />
  )
}
