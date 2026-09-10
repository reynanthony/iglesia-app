import { getSiteSettings } from '@/lib/site-settings'
import RegistroPageClient from './RegistroPageClient'

export default async function RegistroPage() {
  const { siteName } = await getSiteSettings()
  return <RegistroPageClient siteName={siteName} />
}
