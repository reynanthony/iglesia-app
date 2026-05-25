import { MapPin, Clock, Phone, Mail, ArrowRight } from 'lucide-react'

const info = [
  { icon: MapPin, label: 'Dirección', value: 'Tu dirección aquí, Ciudad, País' },
  { icon: Phone, label: 'Teléfono', value: '+1 (809) 000-0000' },
  { icon: Mail, label: 'Email', value: 'info@elmanantial.org' },
  { icon: Clock, label: 'Horarios', value: 'Dom 10AM · Mié 7PM · Vie 7PM' },
]

export default function ContactoPage() {
  return (
    <div>

      {/* HERO */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-36 md:py-48">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-6">Contacto</p>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 max-w-2xl">
            Visítanos.
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Estamos aquí para recibirte. No importa quién eres, eres bienvenido en El Manantial.
          </p>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Info */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">Encuéntranos</p>
              <h2 className="text-4xl font-bold text-slate-900 mb-10">Información de contacto</h2>

              <div className="space-y-5">
                {info.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-5 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 hover:shadow-md transition duration-300">
                    <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                      <p className="text-slate-900 font-medium text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-slate-950 text-white rounded-2xl p-7">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-3">Primera vez</p>
                <h3 className="text-xl font-bold mb-3">¿Es tu primera visita?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  No necesitas saber nada ni traer nada especial. Solo ven como eres. Nuestro equipo de bienvenida estará listo para recibirte.
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 mb-4">Escríbenos</p>
              <h2 className="text-4xl font-bold text-slate-900 mb-10">Envíanos un mensaje</h2>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Nombre</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full border border-slate-200 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Apellido</label>
                    <input
                      type="text"
                      placeholder="Tu apellido"
                      className="w-full border border-slate-200 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full border border-slate-200 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Asunto</label>
                  <select className="w-full border border-slate-200 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none transition bg-white appearance-none">
                    <option value="">Selecciona un asunto</option>
                    <option>Primera visita</option>
                    <option>Oración</option>
                    <option>Ministerios</option>
                    <option>Información general</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Mensaje</label>
                  <textarea
                    rows={5}
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full border border-slate-200 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 rounded-full transition text-sm"
                >
                  Enviar mensaje <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
