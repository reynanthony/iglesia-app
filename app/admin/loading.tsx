import { Skeleton } from '@/components/ui/skeleton'
import { CARD, BORDER } from '@/lib/gold-theme'

export default function Loading() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-9 w-40 mb-1.5" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4 mb-5 md:mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl md:rounded-2xl p-3 md:p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl mb-3" />
              <Skeleton className="h-6 w-16 mb-1.5" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
          <Skeleton className="h-64 rounded-xl md:rounded-2xl" />
          <Skeleton className="h-64 rounded-xl md:rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
