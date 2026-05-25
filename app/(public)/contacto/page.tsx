import { MapPin, Clock, Phone, Mail } from 'lucide-react'

export default function ContactoPage() {
  return (
    <div>
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">Contacto</span>
          <h1 className="text-5xl font-bold mt-2">Visitanos</h1>
          <p className="text-slate-400 mt-4">Estamos aqui para recibirte. No importa quien eres, eres bienvenido.</p>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Informacion de contacto</h2>

            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Direccion', info: 'Tu direccion aqui, Ciudad, Pais' },
                { icon: Phone, title: 'Telefono', info: '+1 (809) 000-0000' },
                { icon: Mail, title: 'Email', info: 'info@elmanantial.org' },
                { icon: Clock, title: 'Horarios de servicios', info: 'Dom 10AM · Mie 7PM · Vie 7PM' },
              ].map(({ icon: Icon, title, info }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{title}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Envianos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="text-slate-700 text-sm font-medium block mb-1.5">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition bg-white"
                />
              </div>
              <div>
                <label className="text-slate-700 text-sm font-medium block mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition bg-white"
                />
              </div>
              <div>
                <label className="text-slate-700 text-sm font-medium block mb-1.5">Mensaje</label>
                <textarea
                  rows={4}
                  placeholder="Como podemos ayudarte?"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition bg-white resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition text-sm"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}