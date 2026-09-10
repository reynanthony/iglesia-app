import type { Viewport } from 'next'
import Link from 'next/link'
import { Cross } from 'lucide-react'
import MobileMenu from '@/components/public/MobileMenu'
import PublicNav from '@/components/public/PublicNav'
import { PublicStatusBar } from '@/components/public/PublicStatusBar'
import { PublicAuthNav } from '@/components/public/PublicAuthNav'
import { NativeAppRedirect } from '@/components/public/NativeAppRedirect'
import PublicAnnouncementGate from '@/components/public/PublicAnnouncementGate'
import { getSiteSettings } from '@/lib/site-settings'
import { BG, CARD, BORDER, GOLD, INK } from '@/lib/gold-theme'

const navLinks = [
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/educacion',   label: 'Educación' },
  { href: '/predicas',    label: 'Prédicas' },
  { href: '/eventos',     label: 'Eventos' },
  { href: '/en-vivo',     label: 'En Vivo' },
  { href: '/biblia',      label: 'Biblia' },
  { href: '/oracion',     label: 'Oración' },
  { href: '/donaciones',  label: 'Donaciones' },
  { href: '/contacto',    label: 'Contacto' },
]

export const viewport: Viewport = {
  themeColor: BG,
}

// Auth state is detected client-side by PublicAuthNav and MobileMenu.
// getSiteSettings() usa un cliente sin cookies para no forzar renderizado
// dinámico en las rutas públicas solo por leer el nombre de marca.
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { siteName } = await getSiteSettings()
  return (
    <div className="min-h-screen flex flex-col">

      <PublicStatusBar />
      <NativeAppRedirect />
      <PublicAnnouncementGate />

      {/* ── HEADER ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          background: BG,
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ background: BORDER }}
            >
              <Cross size={17} strokeWidth={2.5} style={{ color: INK }} />
            </div>
            <span className="font-black text-[19px] tracking-tight leading-none" style={{ color: INK }}>
              {siteName}
            </span>
          </Link>

          <PublicNav />

          <div className="flex items-center gap-2 flex-shrink-0">
            <PublicAuthNav />
            <MobileMenu />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="text-[#FFFFFF] border-t" style={{ background: BG, borderColor: `${GOLD}1F` }}>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

            {/* Brand */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: BORDER }}>
                  <Cross size={13} strokeWidth={2.5} style={{ color: INK }} />
                </div>
                <span className="font-black text-base tracking-tight">{siteName}</span>
              </div>
              <p className="text-[#FFFFFF]/68 text-sm leading-relaxed max-w-xs mb-8">
                Una comunidad de fe comprometida con el crecimiento espiritual y el servicio a nuestra ciudad.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center font-black text-[11px] uppercase tracking-[0.2em] px-6 py-3 rounded-lg transition"
                style={{ background: INK, color: CARD }}
              >
                Unirse a la comunidad
              </Link>
            </div>

            {/* Links col 1 */}
            <div className="md:col-span-2 md:col-start-7 xl:col-start-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFFFFF]/48 mb-6">Iglesia</p>
              <div className="space-y-3">
                {[
                  { href: '/', label: 'Inicio' },
                  { href: '/nosotros', label: 'Nosotros' },
                  { href: '/ministerios', label: 'Ministerios' },
                  { href: '/educacion', label: 'Educación' },
                  { href: '/contacto', label: 'Contacto' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-[#FFFFFF]/65 hover:text-[#FFFFFF] transition">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links col 2 */}
            <div className="md:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFFFFF]/48 mb-6">Contenido</p>
              <div className="space-y-3">
                {[
                  { href: '/predicas', label: 'Prédicas' },
                  { href: '/eventos', label: 'Eventos' },
                  { href: '/en-vivo', label: 'En Vivo' },
                  { href: '/oracion', label: 'Oración' },
                  { href: '/biblia', label: 'Biblia' },
                  { href: '/donaciones', label: 'Donaciones' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-[#FFFFFF]/65 hover:text-[#FFFFFF] transition">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="md:col-span-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFFFFF]/48 mb-6">Cultos</p>
              <div className="space-y-3.5 text-sm text-[#FFFFFF]/65">
                <div>
                  <p className="text-[#FFFFFF]/85 font-bold text-xs">Domingo</p>
                  <p className="text-xs">10:00 AM</p>
                </div>
                <div>
                  <p className="text-[#FFFFFF]/85 font-bold text-xs">Miércoles</p>
                  <p className="text-xs">7:00 PM</p>
                </div>
                <div>
                  <p className="text-[#FFFFFF]/85 font-bold text-xs">Viernes</p>
                  <p className="text-xs">7:00 PM</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#FFFFFF]/[0.06] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[11px] text-[#FFFFFF]/40" suppressHydrationWarning>© {new Date().getFullYear()} {siteName}. Todos los derechos reservados.</p>
            <p className="text-[11px] text-[#FFFFFF]/30 uppercase tracking-widest">Hecho con fe</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
