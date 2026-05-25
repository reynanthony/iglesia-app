import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import MobileMenu from '@/components/public/MobileMenu'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Header */}
      <header className="bg-slate-950 text-white sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl font-bold">
              ✝
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Iglesia El Manantial</p>
              <p className="text-slate-400 text-xs">Donde fluye la vida</p>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/nosotros', label: 'Nosotros' },
              { href: '/ministerios', label: 'Ministerios' },
              { href: '/eventos', label: 'Eventos' },
              { href: '/predicas', label: 'Predicas' },
              { href: '/contacto', label: 'Contacto' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA + Menu movil */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition"
            >
              Entrar a la comunidad
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Contenido */}
      {children}

      {/* Footer */}
      <footer className="bg-slate-950 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">✝</div>
                <div>
                  <p className="font-bold text-sm">Iglesia El Manantial</p>
                  <p className="text-slate-400 text-xs">Donde fluye la vida</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Una comunidad de fe comprometida con el crecimiento espiritual y el servicio.
              </p>
            </div>

            <div>
              <p className="font-semibold text-sm mb-4">Enlaces</p>
              <div className="space-y-2">
                {['Nosotros', 'Ministerios', 'Eventos', 'Predicas', 'Contacto'].map(item => (
                  <Link
                    key={item}
                    href={'/' + item.toLowerCase()}
                    className="block text-slate-400 hover:text-white text-sm transition"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-sm mb-4">Horarios</p>
              <div className="space-y-2 text-sm text-slate-400">
                <p>Domingo — 10:00 AM</p>
                <p>Miercoles — 7:00 PM</p>
                <p>Viernes — 7:00 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 text-center text-slate-600 text-xs">
            {new Date().getFullYear()} Iglesia El Manantial. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}