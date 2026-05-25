import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import ContactForm from '@/components/public/ContactForm'

const infoItems = [
  { icon: MapPin,  label: 'Dirección', value: 'Tu dirección aquí, Ciudad, País' },
  { icon: Phone,   label: 'Teléfono',  value: '+1 (809) 000-0000' },
  { icon: Mail,    label: 'Email',     value: 'info@elmanantial.org' },
  { icon: Clock,   label: 'Servicios', value: 'Dom 10AM · Mié 7PM · Vie 7PM' },
]

export default function ContactoPage() {
  return (
    <div>

      {/* ═══════════════════════════════════════
          HERO — conversacional, íntimo
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EBEBEB 0%, #F4F4F4 50%, #FFFFFF 100%)' }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 30% 60%, rgba(0,0,0,0.06), transparent 70%)' }} />

        {/* "HOLA" decorativo derecha */}
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black text-[#111111] tracking-tighter leading-none block"
            style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', opacity: 0.04 }}>
            HOLA
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32">
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px bg-[#000000]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#111111]/40">
              Contacto · Estamos aquí para ti
            </p>
          </div>
          <h1 className="font-display font-black tracking-tighter text-[#111111] mb-8"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
            Visítanos.
          </h1>
          <p className="text-base text-[#111111]/50 leading-relaxed max-w-md">
            No importa quién eres ni qué estás viviendo. Eres bienvenido en El Manantial.
          </p>
        </div>
        <div className="h-px w-full bg-[#111111]/[0.08]" />
      </section>

      {/* ═══════════════════════════════════════
          INFO + FORMULARIO
      ═══════════════════════════════════════ */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Info lateral */}
            <div className="lg:col-span-4 space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">— Información</p>

              <div className="space-y-3">
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 p-5 rounded-xl border border-edge hover:bg-muted transition">
                    <div className="w-9 h-9 rounded-xl border border-edge flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-ink-3" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-3 mb-1">{label}</p>
                      <p className="text-sm font-bold text-ink">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Primera visita */}
              <div className="mt-6 p-6 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.12)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#222222] dark:text-[#222222] mb-2">¿Primera visita?</p>
                <p className="text-sm font-black text-ink mb-2">No necesitas saber nada.</p>
                <p className="text-sm text-ink-2 leading-relaxed">
                  Solo ven como eres. Nuestro equipo te recibirá con los brazos abiertos.
                </p>
              </div>
            </div>

            {/* Formulario funcional */}
            <div className="lg:col-span-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-10">— Escríbenos</p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
