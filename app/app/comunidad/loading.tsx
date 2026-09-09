import { Skeleton } from '@/components/ui/skeleton'
import { BG } from '@/lib/gold-theme'

export default function Loading() {
  return (
    <div style={{ background: BG, minHeight: '100%' }}>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-8 w-1/2 mb-5" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-[62px] h-[62px] rounded-full flex-shrink-0" />
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
