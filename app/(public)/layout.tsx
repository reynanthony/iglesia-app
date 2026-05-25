import Link from 'next/link'
import MobileMenu from '@/components/public/MobileMenu'

const navLinks = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/predicas', label: 'Prédicas' },
  { href: '/contacto', label: 'Contacto' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">

      <header className="bg-zinc-950 sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-8">

          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-6 h-6 bg-amber-500 flex items-center justify-center text-xs font-black text-black">✝</div>
            <span className="font-black text-white text-sm tracking-tight hidden sm:block">El Manantial</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 hover:text-white transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 transition"
            >
              Entrar
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-zinc-950 text-white border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-amber-500 flex items-center justify-center text-xs font-black text-black">✝</div>
                <span className="font-black text-sm tracking-tight">El Manantial</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mb-6">
                Una comunidad de fe comprometida con el crecimiento espiritual y el servicio a nuestra ciudad.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-[0.2em] px-5 py-3 transition"
              >
                Unirte
              </Link>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 mb-5">Páginas</p>
              <div className="space-y-3">
                {[{ href: '/', label: 'Inicio' }, ...navLinks].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-xs text-zinc-500 hover:text-white transition">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 mb-5">Servicios</p>
              <div className="space-y-3 text-xs text-zinc-500">
                <p>Dom — 10:00 AM</p>
                <p>Mié — 7:00 PM</p>
                <p>Vie — 7:00 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest">{new Date().getFullYear()} Iglesia El Manantial</p>
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Todos los derechos reservados</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
