'use client'

import { useRef, useEffect, type ReactNode } from 'react'

export function ComunidadScrollContainer({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY  = useRef(0)
  const touchStartX  = useRef(0)
  const startIdx     = useRef(0)
  const isSwiping    = useRef(false)
  const lastWheel    = useRef(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const cardHeight = () => el.clientHeight || 1
    const currentIdx = () => Math.round(el.scrollTop / cardHeight())
    const cards      = () => el.querySelectorAll<HTMLElement>('[data-snap-card]')

    const goTo = (idx: number) => {
      const list = cards()
      const target = list[Math.max(0, Math.min(idx, list.length - 1))]
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    /* ── Touch (capture so iframes don't consume the event) ── */
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
      startIdx.current    = currentIdx()
      isSwiping.current   = false
    }

    const onTouchMove = (e: TouchEvent) => {
      const dy = Math.abs(touchStartY.current - e.touches[0].clientY)
      const dx = Math.abs(touchStartX.current - e.touches[0].clientX)
      if (dy > 8 && dy > dx) isSwiping.current = true
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!isSwiping.current) return
      const dy = touchStartY.current - e.changedTouches[0].clientY
      const dx = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < 40) return
      goTo(dy > 0 ? startIdx.current + 1 : startIdx.current - 1)
    }

    /* ── Wheel (desktop) ── */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheel.current < 600) return
      lastWheel.current = now
      goTo(e.deltaY > 0 ? currentIdx() + 1 : currentIdx() - 1)
    }

    el.addEventListener('touchstart', onTouchStart, { capture: true, passive: true })
    el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: true })
    el.addEventListener('touchend',   onTouchEnd,   { capture: true, passive: true })
    el.addEventListener('wheel',      onWheel,      { capture: true, passive: false })

    return () => {
      el.removeEventListener('touchstart', onTouchStart, { capture: true })
      el.removeEventListener('touchmove',  onTouchMove,  { capture: true })
      el.removeEventListener('touchend',   onTouchEnd,   { capture: true })
      el.removeEventListener('wheel',      onWheel,      { capture: true })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="shorts-scroll flex-1 w-full relative"
      style={{
        overflowY: 'scroll',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch' as any,
        minHeight: 0,
        scrollBehavior: 'auto',
      }}
    >
      {children}
    </div>
  )
}
