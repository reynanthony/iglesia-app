import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Radio, CheckCircle } from 'lucide-react'

const P = {
  bg: '#060E07', surface: '#0D1A0E',
  sage: '#869B7E', teal: '#76ABAE',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.45)', border: 'rgba(134,155,126,0.15)',
}

const STATUS = {
  scheduled: { label: 'Programado', icon: Clock,        color: 'rgba(246,243,235,0.45)' },
  live:      { label: 'En Vivo',    icon: Radio,        color: '#F87171' },
  finished:  { label: 'Finalizado', icon: CheckCircle,  color: 'rgba(118,171,174,0.45)' },
}

const TYPE_LABELS: Record<string, string> = {
  clase: 'Clase', mentoria: 'Mentoría', conversatorio: 'Conversatorio', preguntas: 'Q&A',
}

export default async function PastoralEncuentrosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('pastoral_encounters')
    .select('id, title, description, type, status, scheduled_at, thumbnail_url')
    .order('status')
    .order('scheduled_at', { ascending: false })

  const live      = items?.filter(i => i.status === 'live')      ?? []
  const scheduled = items?.filter(i => i.status === 'scheduled') ?? []
  const finished  = items?.filter(i => i.status === 'finished')  ?? []

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${P.border}` }}>
        <Link href="/app/pastoral" className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: P.surface }}>
          <ArrowLeft size={15} style={{ color: P.muted }} />
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>Pastoral Room</p>
          <h1 className="font-black text-[17px] tracking-tight">Encuentros</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {live.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4"
              style={{ color: '#F87171' }}>— En vivo ahora</p>
            {live.map(item => <EncounterCard key={item.id} item={item} highlight />)}
          </section>
        )}

        {scheduled.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4"
              style={{ color: P.teal }}>— Próximos</p>
            <div className="space-y-3">
              {scheduled.map(item => <EncounterCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {finished.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4"
              style={{ color: 'rgba(246,243,235,0.25)' }}>— Archivados</p>
            <div className="space-y-3">
              {finished.map(item => <EncounterCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {(!items || items.length === 0) && (
          <div className="py-20 text-center">
            <Radio size={28} style={{ color: 'rgba(134,155,126,0.25)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: P.muted }}>No hay encuentros programados aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function EncounterCard({ item, highlight = false }: { item: any; highlight?: boolean }) {
  const st = STATUS[item.status as keyof typeof STATUS] ?? STATUS.scheduled
  const StIcon = st.icon
  const isLive = item.status === 'live'
  return (
    <Link href={`/app/pastoral/encuentros/${item.id}`}
      className="flex items-start gap-4 p-4 rounded-2xl transition"
      style={{
        background: isLive ? 'rgba(248,113,113,0.08)' : P.surface,
        border: `1px solid ${isLive ? 'rgba(248,113,113,0.25)' : P.border}`,
      }}>
      {item.thumbnail_url ? (
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
          <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: isLive ? 'rgba(248,113,113,0.15)' : 'rgba(118,171,174,0.08)' }}>
          <StIcon size={20} style={{ color: st.color }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(246,243,235,0.45)' }}>
            {TYPE_LABELS[item.type] ?? item.type}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: st.color }}>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
            {st.label}
          </span>
        </div>
        <p className="font-bold text-[14px] leading-tight" style={{ color: '#F6F3EB' }}>{item.title}</p>
        {item.description && (
          <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: P.muted }}>{item.description}</p>
        )}
        {item.scheduled_at && (
          <p className="text-[11px] mt-1" style={{ color: 'rgba(246,243,235,0.30)' }}>
            {new Date(item.scheduled_at).toLocaleDateString('es-DO', {
              weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        )}
      </div>
      <ArrowRight size={13} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0, marginTop: 4 }} />
    </Link>
  )
}
