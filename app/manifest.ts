import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/site-settings'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { siteName } = await getSiteSettings()

  return {
    name: siteName,
    short_name: siteName,
    description: `Comunidad de fe — ${siteName}`,
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#101217',
    theme_color: '#101217',
    lang: 'es',
    categories: ['lifestyle', 'social'],
    icons: [
      { src: '/api/pwa-icon?size=192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/api/pwa-icon?size=512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/api/pwa-icon?size=512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: 'Feed',
        short_name: 'Feed',
        description: 'Ver publicaciones de la comunidad',
        url: '/app/feed',
        icons: [{ src: '/api/pwa-icon?size=96', sizes: '96x96' }],
      },
      {
        name: 'Nuevo post',
        short_name: 'Publicar',
        description: 'Compartir con la comunidad',
        url: '/app/nuevo-post',
        icons: [{ src: '/api/pwa-icon?size=96', sizes: '96x96' }],
      },
    ],
  }
}
