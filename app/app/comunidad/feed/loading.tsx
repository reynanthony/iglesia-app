import { Skeleton } from '@/components/ui/skeleton'
import { BG } from '@/lib/gold-theme'

export default function Loading() {
  return (
    <div className="app-content-height flex flex-col items-center justify-center gap-4 px-6" style={{ background: BG }}>
      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}
