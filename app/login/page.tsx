import { getSiteSettings } from '@/lib/site-settings'
import LoginPageClient from './LoginPageClient'

export default async function LoginPage() {
  const { siteName } = await getSiteSettings()
  return <LoginPageClient siteName={siteName} />
}
