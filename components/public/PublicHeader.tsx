import Link from 'next/link'
import { Cross } from 'lucide-react'
import MobileMenu from '@/components/public/MobileMenu'
import PublicNav from '@/components/public/PublicNav'
import { PublicAuthNav } from '@/components/public/PublicAuthNav'
import { BORDER, INK } from '@/lib/gold-theme'

export function PublicHeader({ siteName }: { siteName: string }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'transparent', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ background: BORDER }}
          >
            <Cross size={17} strokeWidth={2.5} style={{ color: INK }} />
          </div>
          <span className="font-black text-[19px] tracking-tight leading-none" style={{ color: INK }}>
            {siteName}
          </span>
        </Link>

        <PublicNav />

        <div className="flex items-center gap-2 flex-shrink-0">
          <PublicAuthNav />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
