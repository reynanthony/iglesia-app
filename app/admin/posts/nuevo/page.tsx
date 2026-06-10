import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PostForm from '@/components/admin/PostForm'

export default function NuevoPostAdminPage() {
  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#0D3352' }}>
        <Link href="/admin/posts" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0B2D47' }}>
          <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.68)' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Nueva publicación</h1>
          <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>Se publicará en el feed de la comunidad</p>
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 max-w-xl">
        <PostForm backHref="/admin/posts" submitLabel="Publicar" />
      </div>
    </div>
  )
}
