import Link from 'next/link'

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
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid #0D3352' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-black uppercase tracking-[0.25em]"
          style={{ color: 'rgba(118,171,174,0.60)' }}>
          Camino de discipulado
        </p>
        {isOwner && (
          <Link href="/app/discipulado"
            className="text-[11px] font-bold"
            style={{ color: '#76ABAE' }}>
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
                                :             '#0D3352',
                      border: isCurrent ? `2px solid ${stage.color}`
                            : isDone    ? `1px solid ${stage.color}50`
                            :             '1px solid #1A4A6E',
                      color: isCurrent ? '#061E30'
                           : isDone    ? stage.color
                           :             'rgba(246,243,235,0.20)',
                    }}
                  >
                    {stage.order_index}
                  </div>
                  {!isLast && (
                    <div className="h-px flex-1 mx-0.5"
                      style={{ background: isDone ? `${stage.color}40` : '#0D3352' }} />
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
            <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.55)' }}>
              Etapa {currentStage.order_index} de {sorted.length}
            </span>
          </div>
        </>
      ) : (
        <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
          Sin etapa asignada — un líder puede asignarte una desde el panel.
        </p>
      )}
    </div>
  )
}
