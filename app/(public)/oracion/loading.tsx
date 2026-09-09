import { Skeleton } from '@/components/ui/skeleton'
import { BG } from '@/lib/gold-theme'

export default function Loading() {
  return (
    <div>
      <div style={{ background: BG, minHeight: '70svh' }} />
      <section className="bg-card border-b border-edge">
        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16 md:py-24 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 border border-edge">
              <Skeleton className="h-3 w-28 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
