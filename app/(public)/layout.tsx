import Link from 'next/link'
import MobileMenu from '@/components/public/MobileMenu'
import { Cross } from 'lucide-react'

const navLinks = [
  { href: '/nosotros',   label: 'Nosotros' },
  { href: '/ministerios',label: 'Ministerios' },
  { href: '/eventos',    label: 'Eventos' },
  { href: '/predicas',   label: 'Prédicas' },
  { href: '/contacto',   label: 'Contacto' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-7 h-7 bg-white flex items-center justify-center rounded-lg">
              <Cross size={14} strokeWidth={2.5} className="text-[#0A0A0A]" />
            </div>
            <span className="font-black text-sm tracking-tight hidden sm:block" style={{ color: '#F5F5F5' }}>
              El Manantial
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 hover:text-white/90 transition duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center font-black text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition"
              style={{ background: '#F5F5F5', color: '#0A0A0A' }}
            >
              Entrar
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="bg-[#111111] text-[#FFFFFF] border-t border-[#FFFFFF]/[0.05]">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

            {/* Brand */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-[#000000] flex items-center justify-center text-white rounded-lg"><Cross size={13} strokeWidth={2.5} /></div>
                <span className="font-black text-base tracking-tight">El Manantial</span>
              </div>
              <p className="text-[#FFFFFF]/40 text-sm leading-relaxed max-w-xs mb-8">
                Una comunidad de fe comprometida con el crecimiento espiritual y el servicio a nuestra ciudad.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center bg-[#000000] hover:bg-[#222222] text-white font-black text-[11px] uppercase tracking-[0.2em] px-6 py-3 rounded-lg transition"
              >
                Unirse a la comunidad
              </Link>
            </div>

            {/* Links */}
            <div className="md:col-span-3 md:col-start-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFFFFF]/25 mb-6">Páginas</p>
              <div className="space-y-3.5">
                {[{ href: '/', label: 'Inicio' }, ...navLinks].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-[#FFFFFF]/40 hover:text-[#FFFFFF] transition">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="md:col-span-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFFFFF]/25 mb-6">Servicios</p>
              <div className="space-y-3.5 text-sm text-[#FFFFFF]/40">
                <div>
                  <p className="text-[#FFFFFF]/70 font-bold">Domingo</p>
                  <p>10:00 AM</p>
                </div>
                <div>
                  <p className="text-[#FFFFFF]/70 font-bold">Miércoles</p>
                  <p>7:00 PM</p>
                </div>
                <div>
                  <p className="text-[#FFFFFF]/70 font-bold">Viernes</p>
                  <p>7:00 PM</p>
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
