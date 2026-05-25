import { ArrowRight } from 'lucide-react'

const info = [
  { label: 'Dirección', value: 'Tu dirección aquí, Ciudad, País' },
  { label: 'Teléfono', value: '+1 (809) 000-0000' },
  { label: 'Email', value: 'info@elmanantial.org' },
  { label: 'Servicios', value: 'Dom 10AM · Mié 7PM · Vie 7PM' },
]

export default function ContactoPage() {
  return (
    <div>

      {/* HERO */}
      <section className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-0.5 h-12 bg-amber-500 flex-shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
              Contacto<br />Encuéntranos
            </p>
          </div>
          <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[9rem] font-black leading-[0.88] tracking-tighter text-white mb-10 max-w-3xl">
            Visítanos.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            Estamos aquí para recibirte. No importa quién eres, eres bienvenido en El Manantial.
          </p>
        </div>
      </section>

      {/* INFO + FORMULARIO */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Info */}
            <div className="lg:col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-10">— Información</p>

              <div className="space-y-px bg-zinc-100">
                {info.map(({ label, value }) => (
                  <div key={label} className="bg-white hover:bg-zinc-50 transition p-5 flex flex-col gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">{label}</p>
                    <p className="text-sm font-bold text-zinc-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-l-2 border-amber-500 pl-5 py-1">
                <p className="text-xs font-black text-zinc-900 mb-2">¿Primera visita?</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  No necesitas saber nada ni traer nada especial. Solo ven como eres. Nuestro equipo te recibirá.
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-10">— Escríbenos</p>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-2">Nombre</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full border border-zinc-200 focus:border-zinc-900 px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-2">Apellido</label>
                    <input
                      type="text"
                      placeholder="Tu apellido"
                      className="w-full border border-zinc-200 focus:border-zinc-900 px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full border border-zinc-200 focus:border-zinc-900 px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-2">Asunto</label>
                  <select className="w-full border border-zinc-200 focus:border-zinc-900 px-4 py-3.5 text-sm text-zinc-900 focus:outline-none transition bg-white">
                    <option value="">Selecciona un asunto</option>
                    <option>Primera visita</option>
                    <option>Oración</option>
                    <option>Ministerios</option>
                    <option>Información general</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-2">Mensaje</label>
                  <textarea
                    rows={5}
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full border border-zinc-200 focus:border-zinc-900 px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition"
                >
                  Enviar mensaje <ArrowRight size={13} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
