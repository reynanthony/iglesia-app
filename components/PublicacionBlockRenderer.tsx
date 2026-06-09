import type { Block } from '@/lib/blocks'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { detectSocialEmbed } from '@/lib/social-embed'

/* Colors */
const FG       = '#F6F3EB'
const FG55     = 'rgba(246,243,235,0.55)'
const FG35     = 'rgba(246,243,235,0.35)'
const FG06     = 'rgba(246,243,235,0.06)'
const ACCENT   = '#76ABAE'
const CARD_BG  = '#0B2D47'
const CARD_BR  = '1px solid rgba(246,243,235,0.07)'

/* ── helpers ──────────────────────────────────────────────────── */
const px  = 'max-w-4xl mx-auto px-6'
const py  = 'py-10'

function Eyebrow({ text }: { text: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-5"
      style={{ color: FG35 }}>
      — {text}
    </p>
  )
}

/* ── blocks ───────────────────────────────────────────────────── */

function HeadingBlock({ p }: { p: Record<string, any> }) {
  const Tag = (p.level || 'h2') as 'h1' | 'h2' | 'h3' | 'h4'
  const sizeMap: Record<string, string> = {
    h1: 'clamp(2.4rem,7vw,6rem)',
    h2: 'clamp(1.8rem,4.5vw,3.5rem)',
    h3: 'clamp(1.3rem,3vw,2.2rem)',
    h4: 'clamp(1.1rem,2vw,1.5rem)',
  }
  const isDisplay = p.style === 'display'
  const alignCls = p.align === 'center' ? 'text-center' : p.align === 'right' ? 'text-right' : 'text-left'
  return (
    <div className={`${px} py-8 ${alignCls}`}>
      {p.eyebrow && <Eyebrow text={p.eyebrow} />}
      <Tag
        className={isDisplay ? 'font-display font-black tracking-tighter' : 'font-bold'}
        style={{ fontSize: sizeMap[p.level || 'h2'], lineHeight: isDisplay ? 0.9 : 1.2, color: FG }}>
        {p.text}
      </Tag>
    </div>
  )
}

function TextBlock({ p }: { p: Record<string, any> }) {
  const sizeMap: Record<string, string> = { sm: '0.8rem', base: '1rem', lg: '1.15rem', xl: '1.3rem' }
  const cols = p.columns === 2 ? 'md:columns-2' : ''
  const alignCls = p.align === 'center' ? 'text-center' : p.align === 'right' ? 'text-right' : 'text-left'
  return (
    <div className={`${px} py-6 ${alignCls} ${cols}`}>
      {(p.content || '').split('\n').map((line: string, i: number) =>
        line.trim() === '' ? <br key={i} /> : (
          <p key={i} className="leading-relaxed mb-3 last:mb-0"
            style={{ fontSize: sizeMap[p.size || 'base'], color: FG55 }}>
            {line}
          </p>
        )
      )}
    </div>
  )
}

function ImageBlock({ p }: { p: Record<string, any> }) {
  if (!p.url) return null
  const aspectMap: Record<string, string> = { video: '56.25%', square: '100%', portrait: '133%', auto: 'auto' }
  const padding = aspectMap[p.aspect || 'video']
  return (
    <div className={p.fullWidth ? 'w-full' : `${px} py-6`}>
      {padding === 'auto' ? (
        <img src={p.url} alt={p.alt || ''} className={`w-full ${p.rounded !== false ? 'rounded-2xl' : ''}`} />
      ) : (
        <div className={`relative w-full overflow-hidden ${p.rounded !== false ? 'rounded-2xl' : ''}`}
          style={{ paddingBottom: padding }}>
          <img src={p.url} alt={p.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}
      {p.caption && <p className="text-center text-xs mt-3" style={{ color: FG35 }}>{p.caption}</p>}
    </div>
  )
}

function VideoBlock({ p }: { p: Record<string, any> }) {
  if (!p.url) return null
  const embed = detectSocialEmbed(p.url)
  return (
    <div className={`${px} py-8`}>
      {p.title && <h3 className="font-black text-xl mb-4" style={{ color: FG }}>{p.title}</h3>}
      {embed ? (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: embed.aspectPadding, height: 0, background: '#000' }}>
          <iframe src={embed.embedUrl} className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" style={{ border: 'none' }} />
        </div>
      ) : (
        <video src={p.url} controls className="w-full rounded-2xl" style={{ background: '#000' }} />
      )}
      {p.caption && <p className="text-center text-xs mt-3" style={{ color: FG35 }}>{p.caption}</p>}
    </div>
  )
}

function AnnouncementBlock({ p }: { p: Record<string, any> }) {
  return (
    <div className={`${px} py-6`}>
      <div className="rounded-2xl p-7 md:p-9" style={{ background: CARD_BG, border: CARD_BR }}>
        {p.eyebrow && <Eyebrow text={p.eyebrow} />}
        <h3 className="font-black text-2xl md:text-3xl tracking-tight mb-3" style={{ color: FG }}>
          {p.title}
        </h3>
        {p.body && <p className="text-sm leading-relaxed mb-6" style={{ color: FG55 }}>{p.body}</p>}
        {p.ctaLabel && p.ctaHref && (
          <Link href={p.ctaHref}
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition"
            style={{ background: FG, color: '#061E30' }}>
            {p.ctaLabel} <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  )
}

function StatsBlock({ p }: { p: Record<string, any> }) {
  const items: any[] = p.items || []
  return (
    <div className={`${px} ${py}`}>
      {p.heading && <Eyebrow text={p.heading} />}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)` }}>
        {items.map((item: any, i: number) => (
          <div key={i} className="px-6 first:pl-0 last:pr-0 py-4"
            style={{ borderRight: i < items.length - 1 ? `1px solid ${FG06}` : 'none' }}>
            <p className="font-black tracking-tighter" style={{ fontSize: 'clamp(2.2rem,5vw,4.5rem)', lineHeight: 1, color: FG }}>
              {item.value}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mt-2" style={{ color: FG35 }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardsBlock({ p }: { p: Record<string, any> }) {
  const items: any[] = p.items || []
  const cols = p.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  return (
    <div className={`${px} ${py}`}>
      {(p.eyebrow || p.heading) && (
        <div className="mb-8">
          {p.eyebrow && <Eyebrow text={p.eyebrow} />}
          {p.heading && (
            <h2 className="font-display font-black tracking-tighter" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 0.95, color: FG }}>
              {p.heading}
            </h2>
          )}
        </div>
      )}
      <div className={`grid grid-cols-1 ${cols} gap-5`}>
        {items.map((item: any, i: number) => (
          <div key={i} className="rounded-2xl overflow-hidden flex flex-col" style={{ background: CARD_BG, border: CARD_BR }}>
            {item.image && (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <img src={item.image} alt={item.title || ''} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-black text-base mb-2" style={{ color: FG }}>{item.title}</h3>
              {item.body && <p className="text-sm leading-relaxed flex-1" style={{ color: FG55 }}>{item.body}</p>}
              {item.link && (
                <Link href={item.link}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] mt-4"
                  style={{ color: ACCENT }}>
                  Ver más <ArrowRight size={11} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CtaBlock({ p }: { p: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #061E30 0%, #0B3A5A 60%, rgba(118,171,174,0.15) 100%)' }}>
      <div className={`${px} py-16 md:py-20`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div>
            {p.eyebrow && <Eyebrow text={p.eyebrow} />}
            <h2 className="font-display font-black tracking-tighter"
              style={{ fontSize: 'clamp(2rem,7vw,5rem)', lineHeight: 0.88, color: FG }}>
              {p.heading}
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {p.body && <p className="text-base leading-relaxed" style={{ color: FG55 }}>{p.body}</p>}
            <div className="flex flex-col gap-3 mt-2">
              {p.btn1Label && (
                <Link href={p.btn1Href || '#'}
                  className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                  style={{ background: FG, color: '#061E30' }}>
                  {p.btn1Label}
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {p.btn2Label && (
                <Link href={p.btn2Href || '#'}
                  className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                  style={{ border: `1px solid rgba(246,243,235,0.20)`, color: FG55 }}>
                  {p.btn2Label}
                  <ArrowRight size={13} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VerseBlock({ p }: { p: Record<string, any> }) {
  const sizeMap: Record<string, string> = {
    sm: 'clamp(1.1rem,3vw,1.8rem)',
    md: 'clamp(1.4rem,4vw,2.8rem)',
    lg: 'clamp(1.8rem,5vw,4rem)',
    xl: 'clamp(2.2rem,6vw,5rem)',
  }
  return (
    <section style={{ borderTop: `1px solid ${FG06}`, borderBottom: `1px solid ${FG06}` }}>
      <div className={`${px} py-14 md:py-20`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          <div className="md:col-span-1">
            {p.reference && (
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] hidden md:block"
                style={{ color: FG35, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {p.reference}
              </p>
            )}
          </div>
          <div className="md:col-span-11">
            <p className="font-display font-black tracking-tighter" style={{ fontSize: sizeMap[p.size || 'lg'], lineHeight: 0.9, color: FG }}>
              "{p.text}"
            </p>
            {p.reference && (
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mt-5 md:hidden" style={{ color: FG35 }}>
                — {p.reference}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function SpacerBlock({ p }: { p: Record<string, any> }) {
  const h: Record<string, string> = { xs: '1.5rem', sm: '3rem', md: '5rem', lg: '8rem', xl: '12rem' }
  return <div style={{ height: h[p.size || 'md'] || '5rem' }} />
}

function SeparadorBlock({ p }: { p: Record<string, any> }) {
  return (
    <div className={`${px} py-5`}>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: FG06 }} />
        {p.label && (
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: FG35 }}>
            {p.label}
          </span>
        )}
        {p.label && <div className="flex-1 h-px" style={{ background: FG06 }} />}
      </div>
    </div>
  )
}

/* ── event-specific blocks ────────────────────────────────────── */

function DetalleBlock({ p }: { p: Record<string, any> }) {
  const items: any[] = p.items || []
  return (
    <div className={`${px} ${py}`}>
      {p.heading && <Eyebrow text={p.heading} />}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl"
        style={{ background: FG06 }}>
        {items.map((item: any, i: number) => (
          <div key={i} className="px-5 py-6" style={{ background: CARD_BG }}>
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: FG35 }}>{item.label}</p>
            <p className="text-sm font-bold leading-snug" style={{ color: FG }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgendaBlock({ p }: { p: Record<string, any> }) {
  const items: any[] = p.items || []
  return (
    <div className={`${px} ${py}`}>
      {p.heading && <Eyebrow text={p.heading} />}
      <div>
        {items.map((item: any, i: number) => (
          <div key={i} className="flex gap-5 items-start py-5"
            style={{ borderBottom: i < items.length - 1 ? `1px solid ${FG06}` : 'none' }}>
            <div className="min-w-[76px] text-right flex-shrink-0">
              <span className="text-[11px] font-black font-mono" style={{ color: ACCENT }}>{item.time}</span>
            </div>
            <div className="w-px self-stretch flex-shrink-0" style={{ background: 'rgba(118,171,174,0.18)' }} />
            <div className="flex-1">
              <p className="text-sm font-bold leading-snug" style={{ color: FG }}>{item.title}</p>
              {item.speaker && (
                <p className="text-[11px] mt-1" style={{ color: FG35 }}>{item.speaker}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GaleriaBlock({ p }: { p: Record<string, any> }) {
  const images: string[] = (p.images || []).filter(Boolean)
  if (!images.length) return null
  const cols = p.columns === 2
    ? 'grid-cols-2'
    : p.columns === 4
    ? 'grid-cols-2 md:grid-cols-4'
    : 'grid-cols-2 md:grid-cols-3'
  return (
    <div className={`${px} ${py}`}>
      <div className={`grid ${cols} gap-2`}>
        {images.map((url: string, i: number) => (
          <div key={i} className="relative overflow-hidden rounded-xl" style={{ paddingBottom: '100%' }}>
            <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  )
}

function PonenteBlock({ p }: { p: Record<string, any> }) {
  const items: any[] = p.items || []
  const cols = items.length > 2 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
  return (
    <div className={`${px} ${py}`}>
      {p.heading && <Eyebrow text={p.heading} />}
      <div className={`grid ${cols} gap-5`}>
        {items.map((item: any, i: number) => (
          <div key={i} className="flex gap-4 p-5 rounded-2xl" style={{ background: CARD_BG, border: CARD_BR }}>
            {item.photo ? (
              <img src={item.photo} alt={item.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-black"
                style={{ background: 'rgba(118,171,174,0.12)', color: ACCENT }}>
                {(item.name || '?')[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black" style={{ color: FG }}>{item.name}</p>
              {item.title && <p className="text-[11px] mt-0.5 font-medium" style={{ color: ACCENT }}>{item.title}</p>}
              {item.bio && (
                <p className="text-[12px] mt-2 leading-relaxed" style={{ color: FG55 }}>{item.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FaqBlock({ p }: { p: Record<string, any> }) {
  const items: any[] = p.items || []
  return (
    <div className={`${px} ${py}`}>
      {p.heading && <Eyebrow text={p.heading} />}
      <div>
        {items.map((item: any, i: number) => (
          <div key={i} className="py-5" style={{ borderBottom: `1px solid ${FG06}` }}>
            <p className="text-sm font-black mb-2" style={{ color: FG }}>{item.question}</p>
            <p className="text-sm leading-relaxed" style={{ color: FG55 }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── main renderer ──────────────────────────────────────────────── */

export default function PublicacionBlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map(block => {
        const p = block.props || {}
        switch (block.type) {
          case 'heading':      return <HeadingBlock     key={block.id} p={p} />
          case 'text':         return <TextBlock        key={block.id} p={p} />
          case 'image':        return <ImageBlock       key={block.id} p={p} />
          case 'video':        return <VideoBlock       key={block.id} p={p} />
          case 'announcement': return <AnnouncementBlock key={block.id} p={p} />
          case 'stats':        return <StatsBlock       key={block.id} p={p} />
          case 'cards':        return <CardsBlock       key={block.id} p={p} />
          case 'cta':          return <CtaBlock         key={block.id} p={p} />
          case 'verse':        return <VerseBlock       key={block.id} p={p} />
          case 'spacer':       return <SpacerBlock      key={block.id} p={p} />
          case 'separador':    return <SeparadorBlock   key={block.id} p={p} />
          case 'detalle':      return <DetalleBlock     key={block.id} p={p} />
          case 'agenda':       return <AgendaBlock      key={block.id} p={p} />
          case 'galeria':      return <GaleriaBlock     key={block.id} p={p} />
          case 'ponentes':     return <PonenteBlock     key={block.id} p={p} />
          case 'faq':          return <FaqBlock         key={block.id} p={p} />
          default:             return null
        }
      })}
    </>
  )
}
