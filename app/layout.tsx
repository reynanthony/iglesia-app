import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PWARegister } from '@/components/app/PWARegister'
import { getSiteSettings } from '@/lib/site-settings'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
})
// Tipografía de la app y el admin (member area) — el sitio público sigue con Geist.
const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings()
  return {
    title: `${siteName} — Comunidad de Fe`,
    description: `Una comunidad de fe viva donde encontrarás amor, propósito y familia.`,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: siteName,
    },
    icons: {
      apple: '/api/pwa-icon?size=180',
      icon: '/api/pwa-icon?size=32',
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#101217',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <ThemeProvider>{children}</ThemeProvider>
        <PWARegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
