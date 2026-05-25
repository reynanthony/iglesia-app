import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import NuevoContenidoForm from '@/components/NuevoContenidoForm'

export default async function NuevoContenidoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: ministry } = await supabase
    .from('ministries')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (!ministry) notFound()

  return <NuevoContenidoForm ministry={ministry} />
}