'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { saveDeviceToken } from '@/app/actions/native'

export function usePushNotifications() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    async function register() {
      const { PushNotifications } = await import('@capacitor/push-notifications')

      const status = await PushNotifications.requestPermissions()
      if (status.receive !== 'granted') return

      await PushNotifications.register()

      PushNotifications.addListener('registration', async ({ value: token }) => {
        const platform = Capacitor.getPlatform() as 'android' | 'ios'
        await saveDeviceToken(token, platform)
      })

      PushNotifications.addListener('registrationError', (err) => {
        console.error('[Push] Registration error:', err)
      })

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        // Notification received while app is in foreground
        console.log('[Push] Received:', notification)
      })

      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        // User tapped the notification
        const url: string | undefined = action.notification.data?.url
        if (url) window.location.href = url
      })
    }

    register()
  }, [])
}
