import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import PostForm from '@/components/admin/PostForm'

export default async function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#0D3352' }}>
        <Link href="/admin/posts" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0B2D47' }}>
          <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Editar publicación</h1>
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 max-w-xl">
        <PostForm
          postId={id}
          initialValues={{ content: post.content ?? '', pinned: post.pinned ?? false, image_url: post.image_url ?? '' }}
          backHref="/admin/posts"
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}
