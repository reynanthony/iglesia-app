import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <div className="text-center space-y-6 px-4">
        <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-3xl">✝</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">Bienvenido</h1>
        <p className="text-slate-400 text-lg">Tu comunidad de fe, en un solo lugar.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-semibold transition">
            Iniciar sesión
          </Link>
          <Link href="/registro" className="px-6 py-3 border border-slate-600 hover:border-slate-400 rounded-xl font-semibold transition">
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  )
}
