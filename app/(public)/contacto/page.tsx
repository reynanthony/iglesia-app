import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import ContactForm from '@/components/public/ContactForm'
import { createClient } from '@/lib/supabase/server'
import BlockRenderer from '@/components/BlockRenderer'

export default async function ContactoPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('page_content').select('content').eq('page', 'contacto').single()
  const content = (data?.content ?? {}) as Record<string, any>
  if (Array.isArray(content.blocks) && content.blocks.length > 0) {
    return <BlockRenderer blocks={content.blocks} />
  }
  const c = content as Record<string, string>

  const address  = c.address      || 'Tu dirección aquí, Ciudad, País'
  const phone    = c.phone        || '+1 (809) 000-0000'
  const email    = c.email        || 'info@elmanantial.org'
  const schedule = [c.schedule_sun, c.schedule_wed, c.schedule_fri].filter(Boolean).join(' · ') || 'Dom 10AM · Mié 7PM · Vie 7PM'

  const infoItems = [
    { icon: MapPin, label: 'Dirección', value: address  },
    { icon: Phone,  label: 'Teléfono',  value: phone    },
    { icon: Mail,   label: 'Email',     value: email    },
    { icon: Clock,  label: 'Servicios', value: schedule },
  ]
  return (
    <div>

      {/* ═══════════════════════════════════════
          HERO — conversacional, íntimo
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#F6F3EB' }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 30% 60%, rgba(118,171,174,0.08), transparent 70%)' }} />

        {/* "HOLA" decorativo derecha */}
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black tracking-tighter leading-none block"
            style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', opacity: 0.06, color: '#093C5D' }}>
            HOLA
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32">
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px" style={{ background: '#76ABAE' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: '#869B7E' }}>
              Contacto · Estamos aquí para ti
            </p>
          </div>
          <h1 className="font-display font-black tracking-tighter mb-8"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85, color: '#093C5D' }}>
            Visítanos.
          </h1>
          <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(9,60,93,0.55)' }}>
            No importa quién eres ni qué estás viviendo. Eres bienvenido en El Manantial.
          </p>
        </div>
        <div className="h-px w-full" style={{ background: '#D2CDB8' }} />
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
                style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.22)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: '#76ABAE' }}>¿Primera visita?</p>
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
