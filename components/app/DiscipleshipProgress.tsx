import { BG, BORDER, MUTED, GOLD } from '@/lib/gold-theme'
﻿import Link from 'next/link'

interface Stage {
  id: string
  name: string
  order_index: number
  color: string
}

interface Props {
  stages: Stage[]
  currentStage: Stage | null
  isOwner: boolean
}

export default function DiscipleshipProgress({ stages, currentStage, isOwner }: Props) {
  if (!currentStage && !isOwner) return null

  const sorted = [...stages].sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-black uppercase tracking-[0.25em]"
          style={{ color: `${GOLD}99` }}>
          Camino de discipulado
        </p>
        {isOwner && (
          <Link href="/app/discipulado"
            className="text-[11px] font-bold"
            style={{ color: GOLD }}>
            Ver detalles →
          </Link>
        )}
      </div>

      {currentStage ? (
        <>
          {/* Progress bar with nodes */}
          <div className="flex items-center mb-3">
            {sorted.map((stage, i) => {
              const isCurrent = stage.id === currentStage.id
              const isDone    = stage.order_index < currentStage.order_index
              const isLast    = i === sorted.length - 1
              return (
                <div key={stage.id} className="flex items-center" style={{ flex: isLast ? 'none' : 1 }}>
                  <div
                    title={stage.name}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0"
                    style={{
                      background: isCurrent ? stage.color
                                : isDone    ? `${stage.color}50`
                                :             BORDER,
                      border: isCurrent ? `2px solid ${stage.color}`
                            : isDone    ? `1px solid ${stage.color}50`
                            :             `1px solid ${BORDER}`,
                      color: isCurrent ? BG
                           : isDone    ? stage.color
                           :             MUTED,
                    }}
                  >
                    {stage.order_index}
                  </div>
                  {!isLast && (
                    <div className="h-px flex-1 mx-0.5"
                      style={{ background: isDone ? `${stage.color}40` : BORDER }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Current stage label */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: currentStage.color }} />
            <p className="text-sm font-bold" style={{ color: currentStage.color }}>
              {currentStage.name}
            </p>
            <span className="text-[11px]" style={{ color: MUTED }}>
              Etapa {currentStage.order_index} de {sorted.length}
            </span>
          </div>
        </>
      ) : (
        <p className="text-[12px]" style={{ color: MUTED }}>
          Sin etapa asignada — un líder puede asignarte una desde el panel.
        </p>
      )}
    </div>
  )
}
