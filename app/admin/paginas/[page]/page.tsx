import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Block } from '@/lib/blocks'
import PageEditorTabs from './PageEditorTabs'

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

  const content = (data?.content ?? {}) as Record<string, unknown>
  const blocks: Block[] = Array.isArray(content.blocks) ? content.blocks : []

  // Build slug-based URL defaults for ministry cards (home page only)
  let ministryDefaults: Record<string, string> = {}
  if (page === 'home') {
    const { data: mins } = await supabase
      .from('ministries')
      .select('slug, name')
      .is('parent_id', null)
      .order('name')
      .limit(8)
    if (mins && mins.length > 0) {
      if (mins[0]) { ministryDefaults.mini1_url = `/ministerios/${mins[0].slug}`; ministryDefaults.ministry1_url = `/ministerios/${mins[0].slug}` }
      if (mins[1]) { ministryDefaults.mini2_url = `/ministerios/${mins[1].slug}`; ministryDefaults.ministry2_url = `/ministerios/${mins[1].slug}` }
      if (mins[2])   ministryDefaults.mini3_url = `/ministerios/${mins[2].slug}`
      if (mins[3])   ministryDefaults.mini4_url = `/ministerios/${mins[3].slug}`
    }
  }

  // DB values take priority over defaults
  const initialValues: Record<string, unknown> = { ...ministryDefaults, ...content }

  return (
    <PageEditorTabs
      page={page}
      pageLabel={meta.label}
      initialBlocks={blocks}
      initialValues={initialValues}
      previewPath={meta.previewPath}
    />
  )
}
