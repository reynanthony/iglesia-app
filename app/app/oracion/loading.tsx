import { Skeleton } from '@/components/ui/skeleton'
import { BG, CARD, BORDER } from '@/lib/gold-theme'

export default function Loading() {
  return (
    <div style={{ background: BG, minHeight: '100%' }}>
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-8">
        <Skeleton className="w-10 h-10 rounded-xl mb-4" />
        <Skeleton className="h-9 w-52 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
