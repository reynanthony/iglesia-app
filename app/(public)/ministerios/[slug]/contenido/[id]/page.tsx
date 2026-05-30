import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Play, Megaphone, FileText, Video } from 'lucide-react'
import { detectSocialEmbed } from '@/lib/social-embed'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}

const TYPE_LABEL: Record<string, string> = {
  articulo: 'Artículo',
  anuncio:  'Anuncio',
  video:    'Video',
}
const TYPE_ICON: Record<string, React.ReactNode> = {
  articulo: <FileText size={11} />,
  anuncio:  <Megaphone size={11} />,
  video:    <Video size={11} />,
}

export default async function MinistryContentPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const supabase = await createClient()

  const [{ data: ministry }, { data: item }] = await Promise.all([
    supabase.from('ministries').select('id, name, slug').eq('slug', slug).single(),
    supabase.from('ministry_content')
      .select('*, profiles(full_name, username, avatar_url), ministries(name, slug)')
      .eq('id', id)
      .single(),
  ])

  if (!ministry || !item) notFound()
  if ((item.ministries as any)?.slug !== slug) notFound()

  const embed = item.video_url ? detectSocialEmbed(item.video_url) : null

  return (
    <div>

      {/* NAV BAR */}
      <div style={{ background: '#051828', borderBottom: '1px solid rgba(118,171,174,0.10)' }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link
            href={`/ministerios/${slug}`}
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition"
            style={{ color: `${TEAL}70` }}
          >
            <ArrowLeft size={11} /> {ministry.name}
          </Link>
          <span style={{ color: 'rgba(118,171,174,0.25)' }}>/</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(246,243,235,0.35)' }}>
            {TYPE_LABEL[item.type] ?? item.type}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-14">

          {/* Type badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-8 text-[9px] font-black uppercase tracking-[0.25em]"
            style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}>
            {TYPE_ICON[item.type]}
            {TYPE_LABEL[item.type] ?? item.type}
          </div>

          <h1 className="font-display font-black tracking-tighter text-white mb-8"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 0.9 }}>
            {item.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 pt-5" style={{ borderTop: `1px solid rgba(118,171,174,0.15)` }}>
            {item.profiles && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}30` }}>
                  {(item.profiles as any).avatar_url
                    ? <img src={(item.profiles as any).avatar_url} alt="" className="w-full h-full object-cover" />
                    : <span className="text-[10px] font-black" style={{ color: TEAL }}>
                        {(item.profiles as any).full_name?.[0]?.toUpperCase() ?? 'A'}
                      </span>
                  }
                </div>
                <span className="text-[11px] font-bold" style={{ color: 'rgba(246,243,235,0.65)' }}>
                  {(item.profiles as any).full_name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Calendar size={11} />
              <span className="text-[11px]">{fmtDate(item.created_at)}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <User size={11} />
              <span className="text-[11px]">{ministry.name}</span>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE (article/announcement) */}
      {item.image_url && item.type !== 'video' && (
        <div style={{ background: '#000' }}>
          <div className="max-w-4xl mx-auto">
            <img src={item.image_url} alt={item.title}
              className="w-full object-cover"
              style={{ maxHeight: '480px' }} />
          </div>
        </div>
      )}

      {/* VIDEO PLAYER */}
      {item.type === 'video' && (
        <section style={{ background: '#000', borderBottom: '1px solid #111' }}>
          <div className="max-w-4xl mx-auto px-6 py-10">
            {embed ? (
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={embed.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : item.image_url ? (
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.40)' }}>
                  <a href={item.video_url ?? '#'} target="_blank" rel="noopener noreferrer"
                    className="w-20 h-20 rounded-full flex items-center justify-center transition"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.40)' }}>
                    <Play size={28} className="text-white ml-1.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-16 flex flex-col items-center gap-4 text-center"
                style={{ background: '#0A0A0A', border: '1px solid #222' }}>
                <Play size={40} style={{ color: TEAL }} />
                {item.video_url && (
                  <a href={item.video_url} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl"
                    style={{ background: TEAL, color: NAVY }}>
                    Abrir video
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* BODY CONTENT */}
      {item.body && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
            <div className="prose prose-lg max-w-none"
              style={{ color: NAVY }}>
              {item.body.split('\n\n').map((paragraph: string, i: number) => (
                paragraph.trim() ? (
                  <p key={i} className="mb-6 leading-relaxed text-base" style={{ color: `${NAVY}85` }}>
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BACK + SHARE */}
      <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href={`/ministerios/${slug}`}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition"
            style={{ color: SAGE }}>
            <ArrowLeft size={12} /> Volver a {ministry.name}
          </Link>
          <Link href="/registro"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition"
            style={{ background: NAVY, color: CREAM }}>
            Participar en este ministerio
          </Link>
        </div>
      </section>

    </div>
  )
}
