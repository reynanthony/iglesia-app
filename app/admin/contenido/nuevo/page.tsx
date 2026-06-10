import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ContentForm from '@/components/admin/ContentForm'

export default async function NuevoContenidoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ministry?: string; type?: string }>
}) {
  const { ministry, type } = await searchParams
  const supabase = await createClient()
  const { data: ministries } = await supabase.from('ministries').select('id, name').order('name')

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#0D3352' }}>
        <Link href="/admin/contenido" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0B2D47' }}>
          <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.68)' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Nuevo contenido</h1>
          <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>Artículo, anuncio o video para un ministerio</p>
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 max-w-xl">
        <ContentForm
          ministries={ministries ?? []}
          defaultMinistryId={ministry}
          defaultType={type}
          backHref="/admin/contenido"
          submitLabel="Publicar contenido"
        />
      </div>
    </div>
  )
}
