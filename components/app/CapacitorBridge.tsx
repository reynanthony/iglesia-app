'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { saveDeviceToken } from '@/app/actions/native'

export function CapacitorBridge() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    document.documentElement.classList.add('is-native-app')

    let cleanup: (() => void) | undefined

    // Native back button
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

      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const url: string | undefined = action.notification.data?.url
        if (url) window.location.href = url
      })
    })

    // When app returns from background, force a page reload to recover
    // any stale real-time subscriptions and clear accumulated DOM weight
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Give the WebView 300ms to stabilize before checking
        setTimeout(() => {
          // Only reload if the page has been hidden for a while
          // (stored in sessionStorage to survive background/foreground)
          const hiddenAt = Number(sessionStorage.getItem('_hiddenAt') ?? 0)
          const elapsed = Date.now() - hiddenAt
          // If hidden for more than 10 minutes, reload to clear state
          if (hiddenAt && elapsed > 10 * 60 * 1000) {
            window.location.reload()
          }
          sessionStorage.removeItem('_hiddenAt')
        }, 300)
      } else {
        sessionStorage.setItem('_hiddenAt', String(Date.now()))
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cleanup?.()
      document.documentElement.classList.remove('is-native-app')
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null
}
