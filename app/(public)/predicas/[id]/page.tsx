import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, User, BookOpen } from 'lucide-react'

export const revalidate = 300

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}

export default async function MensajeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('ministry_content')
    .select('*, profiles(full_name, username, avatar_url), ministries(name, slug)')
    .eq('id', id)
    .in('type', ['articulo', 'anuncio'])
    .single()

  if (!item) notFound()

  // Related articles from same ministry
  const { data: related } = await supabase
    .from('ministry_content')
    .select('id, title, body, image_url, created_at, ministries(name, slug)')
    .eq('ministry_id', item.ministry_id)
    .in('type', ['articulo', 'anuncio'])
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(3)

  const ministry = item.ministries as any
  const profile  = item.profiles as any

  return (
    <div>

      {/* NAV BAR */}
      <div style={{ background: '#051828', borderBottom: '1px solid rgba(118,171,174,0.10)' }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link href="/predicas"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition"
            style={{ color: `${TEAL}70` }}>
            <ArrowLeft size={11} /> Mensajes
          </Link>
          {ministry && (
            <>
              <span style={{ color: 'rgba(118,171,174,0.25)' }}>/</span>
              <Link href={`/ministerios/${ministry.slug}`}
                className="text-[10px] font-bold uppercase tracking-[0.3em] transition"
                style={{ color: 'rgba(246,243,235,0.35)' }}>
                {ministry.name}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-8 text-[9px] font-black uppercase tracking-[0.25em]"
            style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}>
            <BookOpen size={10} />
            {ministry?.name ?? 'Mensaje'}
          </div>

          <h1 className="font-display font-black tracking-tighter text-white mb-8"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', lineHeight: 0.88 }}>
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 pt-5" style={{ borderTop: `1px solid rgba(118,171,174,0.15)` }}>
            {profile && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}30` }}>
                  {profile.avatar_url
                    ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    : <span className="text-[10px] font-black" style={{ color: TEAL }}>{profile.full_name?.[0]?.toUpperCase() ?? 'A'}</span>
                  }
                </div>
                <span className="text-[11px] font-bold" style={{ color: 'rgba(246,243,235,0.65)' }}>{profile.full_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Calendar size={11} />
              <span className="text-[11px]">{fmtDate(item.created_at)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE */}
      {item.image_url && (
        <div style={{ background: '#000' }}>
          <div className="max-w-4xl mx-auto">
            <img src={item.image_url} alt={item.title}
              className="w-full object-cover" style={{ maxHeight: '520px' }} />
          </div>
        </div>
      )}

      {/* BODY */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
          {item.body ? (
            <div>
              {item.body.split('\n\n').map((paragraph: string, i: number) =>
                paragraph.trim() ? (
                  <p key={i} className="mb-6 text-base leading-relaxed" style={{ color: `${NAVY}85` }}>
                    {paragraph}
                  </p>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-base italic" style={{ color: `${NAVY}50` }}>
              Sin contenido adicional.
            </p>
          )}
        </div>
      </section>

      {/* RELATED */}
      {(related ?? []).length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-8" style={{ color: SAGE }}>— Más del mismo ministerio</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(related ?? []).map((r: any) => (
                <Link key={r.id} href={`/predicas/${r.id}`}
                  className="group p-5 rounded-2xl transition"
                  style={{ background: CREAM, border: '1px solid #D2CDB8' }}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: TEAL }}>
                    {(r.ministries as any)?.name ?? 'Mensaje'}
                  </p>
                  <h3 className="font-black text-sm tracking-tight leading-tight mb-2 group-hover:opacity-70 transition" style={{ color: NAVY }}>
                    {r.title}
                  </h3>
                  <p className="text-[10px]" style={{ color: SAGE }}>{fmtDate(r.created_at)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BACK + CTA */}
      <section style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/predicas"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition"
            style={{ color: 'rgba(246,243,235,0.45)' }}>
            <ArrowLeft size={12} /> Todos los mensajes
          </Link>
          <Link href="/registro"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition"
            style={{ background: TEAL, color: NAVY }}>
            Unirme a la comunidad <ArrowRight size={12} />
          </Link>
        </div>
      </section>

    </div>
  )
}
