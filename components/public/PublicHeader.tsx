import Link from 'next/link'
import MobileMenu from '@/components/public/MobileMenu'
import PublicNav from '@/components/public/PublicNav'
import { PublicAuthNav } from '@/components/public/PublicAuthNav'
import { INK } from '@/lib/gold-theme'

export function PublicHeader({ siteName }: { siteName: string }) {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-50"
      style={{ background: 'transparent', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ background: '#FFFFFF' }}
          >
            <img src="/logo-icon.png" alt="" width={48} height={48} className="w-12 h-12 object-contain" />
          </div>
          <span className="font-logo text-[26px] leading-none" style={{ color: INK }}>
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
