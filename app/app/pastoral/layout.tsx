import { getSiteSettings } from '@/lib/site-settings'

export async function generateMetadata() {
  const { siteName } = await getSiteSettings()
  return { title: `Pastoral Room — ${siteName}` }
}

export default function PastoralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
