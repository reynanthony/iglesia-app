'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deletePublicacion } from '@/app/actions/publicaciones'

export default function DeletePublicacionButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return
    startTransition(async () => { await deletePublicacion(id) })
  }

  return (
    <button onClick={handleDelete} disabled={pending}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition disabled:opacity-50"
      style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171' }}
      title="Eliminar">
      <Trash2 size={13} />
    </button>
  )
}
