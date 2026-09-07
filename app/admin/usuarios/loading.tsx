import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-9 w-40 mb-1.5" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-3.5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-2.5 w-24" />
              </div>
              <Skeleton className="h-7 w-24 rounded-lg flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
