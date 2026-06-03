'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Capacitor } from '@capacitor/core'

// Marketing pages that native app users shouldn't see.
// Content/education pages remain accessible from within the app.
const MARKETING_PATHS = ['/', '/nosotros', '/ministerios', '/contacto', '/donaciones']

export function NativeAppRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    if (!MARKETING_PATHS.includes(pathname)) return

    // Native users land on the app, not the marketing site
    router.replace('/login')
  }, [pathname, router])

  return null
}
