import { Play, BookOpen } from 'lucide-react'

export default function PredicasPage() {
  const predicas = [
    { titulo: 'El poder de la oracion', pastor: 'Pastor Principal', fecha: 'Semana pasada', serie: 'Vida de oracion' },
    { titulo: 'Fe que mueve montanas', pastor: 'Pastor Principal', fecha: 'Hace 2 semanas', serie: 'Fe viva' },
    { titulo: 'Identidad en Cristo', pastor: 'Pastor Principal', fecha: 'Hace 3 semanas', serie: 'Quienes somos' },
    { titulo: 'El llamado de Dios', pastor: 'Pastor Principal', fecha: 'Hace 1 mes', serie: 'Proposito divino' },
    { titulo: 'Gracia y perdon', pastor: 'Pastor Principal', fecha: 'Hace 1 mes', serie: 'El corazon de Dios' },
    { titulo: 'Viviendo en victoria', pastor: 'Pastor Principal', fecha: 'Hace 2 meses', serie: 'Vida abundante' },
  ]

  return (
    <div>
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">Predicas</span>
          <h1 className="text-5xl font-bold mt-2">Palabra de vida</h1>
          <p className="text-slate-400 mt-4">Escucha y crece con los mensajes de nuestra iglesia.</p>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predicas.map(({ titulo, pastor, fecha, serie }) => (
            <div key={titulo} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition group">
              <div className="bg-slate-900 h-40 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center group-hover:bg-amber-500/30 transition">
                  <Play size={28} className="text-amber-400 ml-1" />
                </div>
                <span className="absolute top-3 right-3 text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                  {serie}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition">{titulo}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <BookOpen size={12} />
                  <span>{pastor}</span>
                  <span>·</span>
                  <span>{fecha}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}