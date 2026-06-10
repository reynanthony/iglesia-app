'use client'

import { useMemo } from 'react'

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
function dayKey(d: Date) { return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()}` }

export default function AdminChart({
  title,
  data,
  color,
}: {
  title: string
  data: { created_at: string }[]
  color: string
}) {
  const chartData = useMemo(() => {
    const days: Record<string, number> = {}
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
      days[dayKey(d)] = 0
    }

    data.forEach(item => {
      const key = dayKey(new Date(item.created_at))
      if (key in days) days[key]++
    })

    return Object.entries(days).map(([label, value]) => ({ label, value }))
  }, [data])

  const max = Math.max(...chartData.map(d => d.value), 1)
  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-xl md:rounded-2xl p-3 md:p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-xs md:text-sm" style={{ color: 'rgba(246,243,235,0.70)' }}>{title}</h2>
        <span className="text-xl md:text-2xl font-bold" style={{ color: '#F6F3EB' }}>{total}</span>
      </div>
      <p className="text-[10px] md:text-xs mb-3 md:mb-5" style={{ color: 'rgba(246,243,235,0.55)' }}>últimos 7 días</p>

      {/* Barras */}
      <div className="flex items-end gap-1 md:gap-1.5 h-24 md:h-32">
        {chartData.map(({ label, value }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.68)' }}>{value > 0 ? value : ''}</span>
            <div className="w-full rounded-t-md transition-all" style={{
              height: `${Math.max((value / max) * 100, value > 0 ? 8 : 2)}%`,
              backgroundColor: value > 0 ? color : '#0D3352',
              minHeight: '4px',
            }} />
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex gap-1.5 mt-2">
        {chartData.map(({ label }) => (
          <div key={label} className="flex-1 text-center text-[9px] truncate" style={{ color: 'rgba(246,243,235,0.55)' }}>
            {label.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
  )
}
