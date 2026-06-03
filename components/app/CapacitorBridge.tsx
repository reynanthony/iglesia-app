'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { saveDeviceToken } from '@/app/actions/native'

export function CapacitorBridge() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    // Mark document for native-specific CSS (tap targets, text selection, etc.)
    document.documentElement.classList.add('is-native-app')

    let cleanup: (() => void) | undefined

    // Native back button handler
    import('@capacitor/app').then(({ App }) => {
      const listenerPromise = App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) window.history.back()
        else App.exitApp()
      })
      cleanup = () => { listenerPromise.then(l => l.remove()) }
    })

    // Push notifications
    import('@capacitor/push-notifications').then(({ PushNotifications }) => {
      PushNotifications.requestPermissions().then(({ receive }) => {
        if (receive !== 'granted') return
        PushNotifications.register()
      })

      PushNotifications.addListener('registration', ({ value: token }) => {
        const platform = Capacitor.getPlatform() as 'android' | 'ios'
        saveDeviceToken(token, platform)
      })

      // Deep-link from notification tap
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const url: string | undefined = action.notification.data?.url
        if (url) window.location.href = url
      })
    })

    // Disable pull-to-refresh on native (causes accidental reloads)
    const preventPull = (e: TouchEvent) => {
      if (window.scrollY === 0 && e.touches[0].clientY > 0) {
        e.preventDefault()
      }
    }
    document.addEventListener('touchmove', preventPull, { passive: false })

    return () => {
      cleanup?.()
      document.documentElement.classList.remove('is-native-app')
      document.removeEventListener('touchmove', preventPull)
    }
  }, [])

  return null
}
