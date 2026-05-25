import { Calendar, Clock, MapPin } from 'lucide-react'

export default function EventosPage() {
  const eventos = [
    { titulo: 'Servicio Dominical', fecha: 'Cada domingo', hora: '10:00 AM', lugar: 'Templo principal', tipo: 'Regular' },
    { titulo: 'Estudio Biblico', fecha: 'Cada miercoles', hora: '7:00 PM', lugar: 'Salon de estudios', tipo: 'Regular' },
    { titulo: 'Noche de Oracion', fecha: 'Cada viernes', hora: '7:00 PM', lugar: 'Templo principal', tipo: 'Regular' },
    { titulo: 'Retiro de Jovenes', fecha: 'Proximo mes', hora: 'Por confirmar', lugar: 'Por confirmar', tipo: 'Especial' },
    { titulo: 'Conferencia de Matrimonios', fecha: 'Proximo mes', hora: 'Por confirmar', lugar: 'Templo principal', tipo: 'Especial' },
  ]

  return (
    <div>
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">Eventos</span>
          <h1 className="text-5xl font-bold mt-2">Lo que se viene</h1>
          <p className="text-slate-400 mt-4">Mantente al dia con nuestras actividades y eventos especiales.</p>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          {eventos.map(({ titulo, fecha, hora, lugar, tipo }) => (
            <div key={titulo} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition flex items-start gap-5">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar size={24} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 text-lg">{titulo}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    tipo === 'Especial'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tipo}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar size={14} />{fecha}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} />{hora}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} />{lugar}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}