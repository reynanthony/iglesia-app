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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-sm text-slate-300">{title}</h2>
        <span className="text-2xl font-bold text-white">{total}</span>
      </div>
      <p className="text-slate-600 text-xs mb-5">ultimos 7 dias</p>

      {/* Barras */}
      <div className="flex items-end gap-1.5 h-32">
        {chartData.map(({ label, value }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-600">{value > 0 ? value : ''}</span>
            <div className="w-full rounded-t-md transition-all" style={{
              height: `${Math.max((value / max) * 100, value > 0 ? 8 : 2)}%`,
              backgroundColor: value > 0 ? color : '#1e293b',
              minHeight: '4px',
            }} />
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex gap-1.5 mt-2">
        {chartData.map(({ label }) => (
          <div key={label} className="flex-1 text-center text-[9px] text-slate-600 truncate">
            {label.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
  )
}