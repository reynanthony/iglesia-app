import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import ContentForm from '@/components/admin/ContentForm'

export default async function EditarContenidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: item }, { data: ministries }] = await Promise.all([
    supabase.from('ministry_content').select('*').eq('id', id).single(),
    supabase.from('ministries').select('id, name').order('name'),
  ])

  if (!item) notFound()

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#1F1F1F' }}>
        <Link href="/admin/contenido" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1A1A1A' }}>
          <ArrowLeft size={14} style={{ color: '#8A8A8A' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Editar contenido</h1>
          <p className="text-[13px]" style={{ color: '#5A5A5A' }}>{item.title}</p>
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 max-w-xl">
        <ContentForm
          contentId={id}
          ministries={ministries ?? []}
          defaultMinistryId={item.ministry_id ?? undefined}
          defaultType={item.type}
          initialValues={{
            title:     item.title,
            body:      item.body ?? '',
            video_url: item.video_url ?? '',
            pinned:    item.pinned ?? false,
            image_url: item.image_url ?? '',
          }}
          backHref="/admin/contenido"
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}
