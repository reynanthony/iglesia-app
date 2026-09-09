import { Skeleton } from '@/components/ui/skeleton'
import { BG, GOLD, INK } from '@/lib/gold-theme'

export default function Loading() {
  return (
    <div style={{ background: INK, minHeight: '100vh' }}>
      <div className="sticky top-0 z-40" style={{ background: BG }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center">
          <Skeleton className="h-3 w-32" style={{ background: `${GOLD}2E` }} />
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 pb-36">
        <Skeleton className="h-14 w-24 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${85 - (i % 3) * 15}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
