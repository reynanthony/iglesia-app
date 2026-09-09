import { Skeleton } from '@/components/ui/skeleton'
import { BG, GOLD } from '@/lib/gold-theme'

export default function Loading() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <div className="max-w-xl mx-auto px-6 py-12 md:py-16">
        <Skeleton className="h-3 w-24 mb-6" style={{ background: `${GOLD}2E` }} />
        <Skeleton className="h-3 w-32 mb-3" style={{ background: `${GOLD}2E` }} />
        <Skeleton className="h-10 w-48 mb-8" />
        <p className="text-[11px] mb-6" style={{ color: `${GOLD}99` }}>Generando cuestionario del capítulo…</p>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
