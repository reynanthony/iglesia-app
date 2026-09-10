'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Cross } from 'lucide-react'
import MobileMenu from '@/components/public/MobileMenu'
import PublicNav from '@/components/public/PublicNav'
import { PublicAuthNav } from '@/components/public/PublicAuthNav'
import { BORDER, INK } from '@/lib/gold-theme'

export function PublicHeader({ siteName }: { siteName: string }) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    function onScroll() {
      const y = window.scrollY
      const diff = y - lastY.current

      if (y < 80) {
        setHidden(false)
      } else if (diff > 6) {
        setHidden(true)
      } else if (diff < -6) {
        setHidden(false)
      }
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
      style={{
        background: 'transparent',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        transform: hidden ? 'translateY(-130%)' : 'translateY(0)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ background: BORDER }}
          >
            <Cross size={17} strokeWidth={2.5} style={{ color: INK }} />
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
