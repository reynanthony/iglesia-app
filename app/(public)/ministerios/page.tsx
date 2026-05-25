export default function MinisteriosPage() {
  const ministerios = [
    { nombre: 'Jovenes', desc: 'Un espacio vibrante para que los jovenes descubran su identidad en Cristo y desarrollen su proposito. Nos reunimos cada viernes con adoracion, Palabra y comunidad.', color: 'bg-blue-500', lider: 'Lider de Jovenes' },
    { nombre: 'Ninos', desc: 'Ensenamos la Palabra de Dios de forma creativa y divertida para los mas pequenos. Cada domingo tenemos clases especiales adaptadas por edades.', color: 'bg-green-500', lider: 'Lider de Ninos' },
    { nombre: 'Matrimonios', desc: 'Fortalecemos los hogares con principios biblicos, consejeria y retiros especiales para parejas que desean crecer juntos en Dios.', color: 'bg-purple-500', lider: 'Lider de Matrimonios' },
    { nombre: 'Adoracion', desc: 'Nuestro equipo de adoracion sirve con excelencia para guiar a la congregacion a la presencia de Dios en cada servicio.', color: 'bg-amber-500', lider: 'Lider de Adoracion' },
    { nombre: 'Oracion', desc: 'Creemos en el poder de la oracion. Nos reunimos semanalmente para interceder por nuestra iglesia, ciudad y naciones.', color: 'bg-red-500', lider: 'Lider de Oracion' },
    { nombre: 'Evangelismo', desc: 'Llevamos el mensaje de salvacion a las calles, barrios y comunidades de nuestra ciudad con amor y poder.', color: 'bg-teal-500', lider: 'Lider de Evangelismo' },
  ]

  return (
    <div>
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">Ministerios</span>
          <h1 className="text-5xl font-bold mt-2">Un lugar para todos</h1>
          <p className="text-slate-400 mt-4 max-w-xl">Cada ministerio es una oportunidad de servir, crecer y conectar con otros creyentes.</p>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministerios.map(({ nombre, desc, color, lider }) => (
            <div key={nombre} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition">
              <div className={`w-12 h-12 ${color} rounded-2xl mb-5`} />
              <h3 className="font-bold text-slate-900 text-xl mb-3">{nombre}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{desc}</p>
              <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">{lider}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}