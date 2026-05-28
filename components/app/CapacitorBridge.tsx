'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

export function CapacitorBridge() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    let cleanup: (() => void) | undefined
    import('@capacitor/app').then(({ App }) => {
      const listenerPromise = App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) window.history.back()
        else App.exitApp()
      })
      cleanup = () => { listenerPromise.then(l => l.remove()) }
    })
    return () => cleanup?.()
  }, [])
  return null
}
