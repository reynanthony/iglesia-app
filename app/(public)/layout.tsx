import Link from 'next/link'
import { Cross } from 'lucide-react'
import MobileMenu from '@/components/public/MobileMenu'
import PublicNav from '@/components/public/PublicNav'
import { PublicStatusBar } from '@/components/public/PublicStatusBar'

const navLinks = [
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/educacion',   label: 'Educación' },
  { href: '/predicas',    label: 'Prédicas' },
  { href: '/eventos',     label: 'Eventos' },
  { href: '/en-vivo',     label: 'En Vivo' },
  { href: '/biblia',      label: 'Biblia' },
  { href: '/donaciones',  label: 'Donaciones' },
  { href: '/contacto',    label: 'Contacto' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">

      <PublicStatusBar />

      {/* ── HEADER ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          background: 'rgba(5,24,40,0.97)',
          borderBottom: '1px solid rgba(118,171,174,0.10)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: '#0D3352' }}>
              <Cross size={14} strokeWidth={2.5} style={{ color: '#F6F3EB' }} />
            </div>
            <span className="font-black text-base tracking-tight hidden sm:block" style={{ color: '#F6F3EB' }}>
              El Manantial
            </span>
          </Link>

          <PublicNav />

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center font-black text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition"
              style={{ background: '#F6F3EB', color: '#093C5D' }}
            >
              Entrar
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="text-[#F6F3EB] border-t" style={{ background: '#051828', borderColor: 'rgba(118,171,174,0.12)' }}>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

            {/* Brand */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: '#0D3352' }}>
                  <Cross size={13} strokeWidth={2.5} style={{ color: '#F6F3EB' }} />
                </div>
                <span className="font-black text-base tracking-tight">El Manantial</span>
              </div>
              <p className="text-[#FFFFFF]/40 text-sm leading-relaxed max-w-xs mb-8">
                Una comunidad de fe comprometida con el crecimiento espiritual y el servicio a nuestra ciudad.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center font-black text-[11px] uppercase tracking-[0.2em] px-6 py-3 rounded-lg transition"
                style={{ background: '#F6F3EB', color: '#093C5D' }}
              >
                Unirse a la comunidad
              </Link>
            </div>

            {/* Links col 1 */}
            <div className="md:col-span-2 md:col-start-7 xl:col-start-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFFFFF]/25 mb-6">Iglesia</p>
              <div className="space-y-3">
                {[
                  { href: '/', label: 'Inicio' },
                  { href: '/nosotros', label: 'Nosotros' },
                  { href: '/ministerios', label: 'Ministerios' },
                  { href: '/educacion', label: 'Educación' },
                  { href: '/contacto', label: 'Contacto' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-[#FFFFFF]/40 hover:text-[#FFFFFF] transition">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links col 2 */}
            <div className="md:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFFFFF]/25 mb-6">Contenido</p>
              <div className="space-y-3">
                {[
                  { href: '/predicas', label: 'Prédicas' },
                  { href: '/eventos', label: 'Eventos' },
                  { href: '/en-vivo', label: 'En Vivo' },
                  { href: '/biblia', label: 'Biblia' },
                  { href: '/donaciones', label: 'Donaciones' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-[#FFFFFF]/40 hover:text-[#FFFFFF] transition">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="md:col-span-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFFFFF]/25 mb-6">Cultos</p>
              <div className="space-y-3.5 text-sm text-[#FFFFFF]/40">
                <div>
                  <p className="text-[#FFFFFF]/70 font-bold text-xs">Domingo</p>
                  <p className="text-xs">10:00 AM</p>
                </div>
                <div>
                  <p className="text-[#FFFFFF]/70 font-bold text-xs">Miércoles</p>
                  <p className="text-xs">7:00 PM</p>
                </div>
                <div>
                  <p className="text-[#FFFFFF]/70 font-bold text-xs">Viernes</p>
                  <p className="text-xs">7:00 PM</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#FFFFFF]/[0.06] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[11px] text-[#FFFFFF]/20" suppressHydrationWarning>© {new Date().getFullYear()} Iglesia El Manantial. Todos los derechos reservados.</p>
            <p className="text-[11px] text-[#FFFFFF]/15 uppercase tracking-widest">Hecho con fe</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
