'use client'

import { Trash2 } from 'lucide-react'
import { deleteAnnouncement } from '@/app/actions/announcements'

export default function DeleteCampanaButton({ id }: { id: string }) {
  const action = deleteAnnouncement.bind(null, id)
  return (
    <form action={action} className="mt-4">
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
        style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.20)' }}
        onClick={e => { if (!confirm('¿Eliminar esta campaña permanentemente?')) e.preventDefault() }}
      >
        <Trash2 size={13} /> Eliminar campaña
      </button>
    </form>
  )
}
