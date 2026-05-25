import { Heart, Target, Eye } from 'lucide-react'

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">Quienes somos</span>
          <h1 className="text-5xl font-bold mt-2">Nuestra historia</h1>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            Iglesia El Manantial nacio de un grupo de creyentes con el sueno de ver una comunidad donde el amor de Dios fluyera libremente, como agua viva que transforma vidas.
          </p>
          <p className="text-slate-600 leading-relaxed mb-8">
            A lo largo de los anos hemos crecido como familia, viendo milagros, restauraciones y cientos de vidas transformadas por el poder del evangelio. Hoy somos una iglesia vibrante, con ministerios para todas las edades y un corazon apasionado por servir a nuestra comunidad.
          </p>
        </div>

        {/* Vision, Mision, Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: Eye,
              title: 'Vision',
              desc: 'Ser una iglesia que impacte nuestra ciudad y nacion con el amor transformador de Jesucristo.',
              color: 'text-blue-500 bg-blue-500/10',
            },
            {
              icon: Target,
              title: 'Mision',
              desc: 'Hacer discipulos de todas las naciones, ensenando a guardar todo lo que Cristo mando.',
              color: 'text-amber-500 bg-amber-500/10',
            },
            {
              icon: Heart,
              title: 'Valores',
              desc: 'Fe, amor, integridad, servicio y comunidad son los pilares que guian todo lo que hacemos.',
              color: 'text-red-500 bg-red-500/10',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}