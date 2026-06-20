import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, FileText, Megaphone, Play, Video } from 'lucide-react'
import { cmsGet, cmsById, cmsImageUrl, type DMinisterio, type DMinisterioContenido } from '@/lib/directus'
import { detectSocialEmbed } from '@/lib/social-embed'

export const revalidate = 60

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}

const TYPE_META: Record<string, { label: string; Icon: typeof FileText }> = {
  articulo:  { label: 'Artículo',   Icon: FileText  },
  video:     { label: 'Video',      Icon: Video     },
  devocional:{ label: 'Devocional', Icon: FileText  },
  anuncio:   { label: 'Anuncio',    Icon: Megaphone },
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params

  const [ministries, item] = await Promise.all([
    cmsGet<DMinisterio>('ministerios', {
      'filter[slug][_eq]': slug,
      'filter[status][_eq]': 'published',
      'limit': '1',
    }),
    cmsById<DMinisterioContenido>('ministerio_contenido', id),
  ])

  const ministry = ministries[0]
  if (!ministry || !item || item.status !== 'published') notFound()
  if (item.ministerio !== ministry.id) notFound()

  const displayDate = fmtDate(item.date_published ?? item.date_created)
  const imgUrl      = cmsImageUrl(item.image)
  const meta        = TYPE_META[item.type] ?? TYPE_META.articulo
  const embed       = item.video_url ? detectSocialEmbed(item.video_url) : null

  const related = await cmsGet<DMinisterioContenido>('ministerio_contenido', {
    'filter[ministerio][_eq]': String(ministry.id),
    'filter[status][_eq]': 'published',
    'filter[id][_neq]': String(item.id),
    'sort': '-pinned,-date_published,-date_created',
    'limit': '3',
  })

  return (
    <div>

      {/* NAV */}
      <div style={{ background: '#051828', borderBottom: '1px solid rgba(118,171,174,0.10)' }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link href={`/ministerios/${slug}`}
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition"
            style={{ color: `${TEAL}70` }}>
            <ArrowLeft size={11} /> {ministry.name}
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-8 text-[9px] font-black uppercase tracking-[0.25em]"
            style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}>
            <meta.Icon size={10} /> {meta.label}
          </div>

          <h1 className="font-display font-black tracking-tighter text-white mb-8"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', lineHeight: 0.88 }}>
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 pt-5"
            style={{ borderTop: `1px solid rgba(118,171,174,0.15)` }}>
            {item.author && (
              <p className="text-[11px] font-bold" style={{ color: 'rgba(246,243,235,0.86)' }}>{item.author}</p>
            )}
            <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.84)' }}>
              <Calendar size={11} />
              <span className="text-[11px]">{displayDate}</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: `${TEAL}80` }}>
              {ministry.name}
            </span>
          </div>
        </div>
      </section>

      {/* IMAGE (only when no embed) */}
      {imgUrl && !embed && (
        <div style={{ background: '#000' }}>
          <div className="max-w-4xl mx-auto">
            <img src={imgUrl} alt={item.title} className="w-full object-cover" style={{ maxHeight: '520px' }} />
          </div>
        </div>
      )}

      {/* VIDEO EMBED */}
      {embed && (
        <section style={{ background: '#000' }}>
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full" style={{ paddingTop: embed.aspectPadding, height: 0 }}>
              <iframe src={embed.embedUrl} className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen style={{ border: 'none' }} />
            </div>
          </div>
        </section>
      )}

      {/* VIDEO EXTERNAL LINK (when URL can't be embedded) */}
      {item.video_url && !embed && (
        <section style={{ background: NAVY }}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <a href={item.video_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl"
              style={{ background: TEAL, color: NAVY }}>
              <Play size={13} /> Ver video
            </a>
          </div>
        </section>
      )}

      {/* BODY */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
          {item.body ? (
            item.body.split('\n\n').map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="mb-6 text-base leading-relaxed" style={{ color: `${NAVY}85` }}>
                  {paragraph}
                </p>
              ) : null
            )
          ) : (
            <p className="text-base italic" style={{ color: `${NAVY}A0` }}>Sin contenido adicional.</p>
          )}
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-8" style={{ color: SAGE }}>
              — Más de {ministry.name}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/ministerios/${slug}/contenido/${r.id}`}
                  className="group p-5 rounded-2xl transition"
                  style={{ background: CREAM, border: '1px solid #D2CDB8' }}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: TEAL }}>
                    {TYPE_META[r.type]?.label ?? 'Contenido'}
                  </p>
                  <h3 className="font-black text-sm tracking-tight leading-tight mb-2 group-hover:opacity-70 transition" style={{ color: NAVY }}>
                    {r.title}
                  </h3>
                  <p className="text-[10px]" style={{ color: SAGE }}>{r.author ?? ministry.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BACK + CTA */}
      <section style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href={`/ministerios/${slug}`}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'rgba(246,243,235,0.88)' }}>
            <ArrowLeft size={12} /> Volver al ministerio
          </Link>
          <Link href="/registro"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl"
            style={{ background: TEAL, color: NAVY }}>
            Unirme a la comunidad <ArrowRight size={12} />
          </Link>
        </div>
      </section>

    </div>
  )
}
