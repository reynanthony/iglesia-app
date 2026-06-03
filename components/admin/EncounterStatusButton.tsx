'use client'

import { updateEncounterStatus } from '@/app/actions/pastoral-admin'

const TRANSITIONS: Record<string, { next: string; label: string; color: string }> = {
  scheduled: { next: 'live',      label: 'Iniciar',   color: '#F87171' },
  live:      { next: 'finished',  label: 'Finalizar', color: '#76ABAE' },
  finished:  { next: 'finished',  label: 'Finalizado', color: 'rgba(246,243,235,0.25)' },
}

export default function EncounterStatusButton({ id, status }: { id: string; status: string }) {
  const t = TRANSITIONS[status] ?? TRANSITIONS.finished
  if (status === 'finished') return null
  return (
    <form action={() => updateEncounterStatus(id, t.next)}>
      <button
        type="submit"
        className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition"
        style={{ background: 'rgba(255,255,255,0.06)', color: t.color, border: `1px solid ${t.color}40` }}
      >
        {t.label}
      </button>
    </form>
  )
}
