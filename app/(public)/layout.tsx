import Link from 'next/link'
import MobileMenu from '@/components/public/MobileMenu'

const navLinks = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/predicas', label: 'Predicas' },
  { href: '/contacto', label: 'Contacto' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      <header className="bg-slate-950 text-white sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-base font-bold">✝</div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm leading-tight tracking-tight">Iglesia El Manantial</p>
              <p className="text-slate-500 text-[11px]">Donde fluye la vida</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition font-medium rounded-lg hover:bg-white/5"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-full text-sm transition"
            >
              Entrar
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center font-bold">✝</div>
                <div>
                  <p className="font-bold text-sm">Iglesia El Manantial</p>
                  <p className="text-slate-500 text-xs">Donde fluye la vida</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Una comunidad de fe comprometida con el crecimiento espiritual y el servicio a nuestra ciudad.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Navegacion</p>
              <div className="space-y-2.5">
                {[{ href: '/', label: 'Inicio' }, ...navLinks].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-slate-400 hover:text-white transition">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Servicios</p>
              <div className="space-y-2.5 text-sm text-slate-400">
                <p>Domingo — 10:00 AM</p>
                <p>Miércoles — 7:00 PM</p>
                <p>Viernes — 7:00 PM</p>
              </div>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="inline-flex bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-full text-sm transition"
                >
                  Unirte a la comunidad
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-xs">{new Date().getFullYear()} Iglesia El Manantial. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-600 hover:text-white text-xs transition">Comunidad</Link>
              <Link href="/contacto" className="text-slate-600 hover:text-white text-xs transition">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
