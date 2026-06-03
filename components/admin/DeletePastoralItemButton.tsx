'use client'

import { Trash2 } from 'lucide-react'
import { deletePastoralMessage, deletePastoralReflection, deletePastoralEncounter } from '@/app/actions/pastoral-admin'

const TABLE_ACTIONS = {
  pastoral_messages:    deletePastoralMessage,
  pastoral_reflections: deletePastoralReflection,
  pastoral_encounters:  deletePastoralEncounter,
}

export default function DeletePastoralItemButton({
  id, table,
}: {
  id: string
  table: 'pastoral_messages' | 'pastoral_reflections' | 'pastoral_encounters'
}) {
  const action = TABLE_ACTIONS[table]
  return (
    <form action={() => action(id)}>
      <button
        type="submit"
        onClick={e => { if (!confirm('¿Eliminar este elemento?')) e.preventDefault() }}
        className="w-8 h-8 flex items-center justify-center rounded-lg transition hover:bg-red-500/10"
        style={{ color: 'rgba(248,113,113,0.50)' }}
        aria-label="Eliminar"
      >
        <Trash2 size={13} />
      </button>
    </form>
  )
}
