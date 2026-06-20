/**
 * Opens an external URL inside the app using @capacitor/browser (Chrome Custom Tab on Android,
 * SFSafariViewController on iOS). Falls back to _blank on web/PWA.
 */
export async function openExternal(url: string) {
  try {
    const { Browser } = await import('@capacitor/browser')
    await Browser.open({ url, presentationStyle: 'fullscreen' })
  } catch {
    window.open(url, '_blank')
  }
}
