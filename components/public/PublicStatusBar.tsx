'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

export function PublicStatusBar() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
      StatusBar.setStyle({ style: Style.Light })
      StatusBar.setBackgroundColor({ color: '#F6F3EB' })
    })
    return () => {
      import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
        StatusBar.setStyle({ style: Style.Dark })
        StatusBar.setBackgroundColor({ color: '#093C5D' })
      })
    }
  }, [])
  return null
}
