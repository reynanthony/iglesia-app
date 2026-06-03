'use client'

import { Trash2 } from 'lucide-react'
import { deleteLider } from '@/app/actions/lideres-admin'
import { useTransition } from 'react'

export default function DeleteLiderButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition()

  function handleClick() {
    if (!confirm(`¿Eliminar a ${name}?`)) return
    start(async () => { await deleteLider(id) })
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40"
      style={{ background: '#061E30' }}
    >
      <Trash2 size={13} style={{ color: '#6B3333' }} />
    </button>
  )
}
