import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PublicacionBlockEditor from '@/components/admin/PublicacionBlockEditor'

export default async function EditorPublicacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: item } = await supabase
    .from('publicaciones')
    .select('id, title, slug, blocks')
    .eq('id', id)
    .single()
  if (!item) notFound()

  return (
    <PublicacionBlockEditor
      publicacionId={item.id}
      publicacionTitle={item.title}
      publicacionSlug={item.slug}
      initialBlocks={item.blocks ?? []}
    />
  )
}
