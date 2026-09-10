'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cross } from 'lucide-react'
import MobileMenu from '@/components/public/MobileMenu'
import PublicNav from '@/components/public/PublicNav'
import { PublicAuthNav } from '@/components/public/PublicAuthNav'
import { BORDER, INK } from '@/lib/gold-theme'

export function PublicHeader({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'transparent', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div
        className="flex items-center h-16 transition-[max-width,padding] duration-300 ease-out"
        style={scrolled
          ? { maxWidth: '100%', padding: '0 20px' }
          : { maxWidth: '72rem', margin: '0 auto', padding: '0 24px' }}
      >
        <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
          <div
            className="flex items-center justify-center rounded-2xl flex-shrink-0 transition-all duration-300 group-hover:scale-105"
            style={{ background: BORDER, width: scrolled ? 46 : 40, height: scrolled ? 46 : 40 }}
          >
            <Cross size={scrolled ? 19 : 17} strokeWidth={2.5} style={{ color: INK, transition: 'all 0.3s ease' }} />
          </div>
          <span
            className="font-black tracking-tight leading-none transition-all duration-300"
            style={{ color: INK, fontSize: scrolled ? 22 : 19 }}
          >
            {siteName}
          </span>
        </Link>

        <div
          className="flex items-center flex-1 justify-between gap-8 transition-[opacity,transform] duration-300 ease-out"
          style={{
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? 'translateY(-6px)' : 'translateY(0)',
            pointerEvents: scrolled ? 'none' : 'auto',
          }}
        >
          <PublicNav />
          <div className="flex items-center gap-2 flex-shrink-0">
            <PublicAuthNav />
          </div>
        </div>

        <MobileMenu />
      </div>
    </header>
  )
}
