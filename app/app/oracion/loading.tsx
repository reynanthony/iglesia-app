import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-8">
        <Skeleton className="w-10 h-10 rounded-xl mb-4" />
        <Skeleton className="h-9 w-52 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
