import type { Block } from '@/lib/blocks'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { detectSocialEmbed } from '@/lib/social-embed'

/* ── helpers ────────────────────────────────────────────────── */
const align = (a?: string) =>
  a === 'center' ? 'text-center' : a === 'right' ? 'text-right' : 'text-left'

const spacerHeight: Record<string, string> = {
  xs: '2rem', sm: '4rem', md: '6rem', lg: '10rem', xl: '16rem',
}

/* ── individual blocks ──────────────────────────────────────── */

function HeroBlock({ p }: { p: Record<string, any> }) {
  const isDark = p.style === 'dark'
  const hasBgMedia = !!(p.bgVideo || p.bgImage)
  const bg = isDark
    ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
    : hasBgMedia
    ? '#111'
    : 'linear-gradient(160deg, #EBEBEB 0%, #F4F4F4 40%, #FFFFFF 100%)'

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: bg }}
    >
      {p.bgVideo && (
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          src={p.bgVideo} />
      )}
      {p.bgImage && !p.bgVideo && (
        <div className="absolute inset-0"
          style={{ backgroundImage: `url(${p.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
      )}
      {hasBgMedia && <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1 }} />}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg,#000 0px,#000 1px,transparent 1px,transparent 100px)', zIndex: 2 }} />

      <div className="relative flex-1 flex flex-col justify-end max-w-6xl mx-auto w-full px-6 pb-20 pt-32" style={{ zIndex: 3 }}>
        {p.tagline && (
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px" style={{ background: isDark || p.bgImage ? '#ffffff44' : '#00000066' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]"
              style={{ color: isDark || p.bgImage ? 'rgba(255,255,255,0.4)' : 'rgba(17,17,17,0.4)' }}>
              {p.tagline}
            </p>
          </div>
        )}
        <h1 className="font-display font-black tracking-tighter mb-14 max-w-5xl"
          style={{ fontSize: 'clamp(3.8rem,13vw,12rem)', lineHeight: 0.83, color: isDark || p.bgImage ? '#ffffff' : '#111111' }}>
          {p.headline1 && <span className="block">{p.headline1}</span>}
          {p.headline2 && <span className="block">{p.headline2}</span>}
          {p.headline3 && <em className="block" style={{ color: isDark || p.bgImage ? 'rgba(255,255,255,0.8)' : '#000000' }}>{p.headline3}</em>}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-2xl">
          {p.subtitle && (
            <p className="text-sm leading-relaxed"
              style={{ color: isDark || p.bgImage ? 'rgba(255,255,255,0.55)' : 'rgba(17,17,17,0.55)' }}>
              {p.subtitle}
            </p>
          )}
          <div className="flex flex-col gap-3">
            {p.cta1Label && (
              <Link href={p.cta1Href || '#'}
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                style={{ background: isDark || p.bgImage ? '#ffffff' : '#000000', color: isDark || p.bgImage ? '#000000' : '#ffffff' }}>
                {p.cta1Label}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {p.cta2Label && (
              <Link href={p.cta2Href || '#'}
                className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                style={{
                  border: `1px solid ${isDark || p.bgImage ? 'rgba(255,255,255,0.25)' : 'rgba(17,17,17,0.15)'}`,
                  color: isDark || p.bgImage ? 'rgba(255,255,255,0.7)' : 'rgba(17,17,17,0.5)',
                }}>
                {p.cta2Label}
                <ArrowRight size={13} className="opacity-50 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function HeadingBlock({ p }: { p: Record<string, any> }) {
  const Tag = (p.level || 'h2') as 'h1' | 'h2' | 'h3' | 'h4'
  const isDisplay = p.style === 'display'
  const sizeMap: Record<string, string> = {
    h1: 'clamp(3rem,8vw,7rem)',
    h2: 'clamp(2rem,5vw,4rem)',
    h3: 'clamp(1.4rem,3vw,2.5rem)',
    h4: 'clamp(1.1rem,2vw,1.6rem)',
  }
  return (
    <div className={`max-w-6xl mx-auto px-6 py-10 ${align(p.align)}`}>
      {p.eyebrow && (
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(17,17,17,0.4)' }}>
          — {p.eyebrow}
        </p>
      )}
      <Tag
        className={isDisplay ? 'font-display font-black tracking-tighter text-[#111111]' : 'font-bold text-[#111111]'}
        style={{ fontSize: sizeMap[p.level || 'h2'], lineHeight: isDisplay ? 0.9 : 1.2 }}>
        {p.text}
      </Tag>
    </div>
  )
}

function TextBlock({ p }: { p: Record<string, any> }) {
  const sizeMap: Record<string, string> = { sm: '0.8rem', base: '1rem', lg: '1.15rem', xl: '1.3rem' }
  const cols = p.columns === 2 ? 'md:columns-2' : ''
  return (
    <div className={`max-w-6xl mx-auto px-6 py-6 ${align(p.align)} ${cols}`}>
      {(p.content || '').split('\n').map((line: string, i: number) =>
        line.trim() === '' ? <br key={i} /> : (
          <p key={i} className="leading-relaxed mb-3 last:mb-0"
            style={{ fontSize: sizeMap[p.size || 'base'] || '1rem', color: '#444444' }}>
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
    <div className={p.fullWidth ? 'w-full' : 'max-w-6xl mx-auto px-6 py-6'}>
      {padding === 'auto' ? (
        <img src={p.url} alt={p.alt || ''} className={`w-full ${p.rounded ? 'rounded-2xl' : ''}`} />
      ) : (
        <div className={`relative w-full overflow-hidden ${p.rounded ? 'rounded-2xl' : ''}`}
          style={{ paddingBottom: padding }}>
          <img src={p.url} alt={p.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}
      {p.caption && (
        <p className="text-center text-xs mt-3" style={{ color: '#888888' }}>{p.caption}</p>
      )}
    </div>
  )
}

function AnnouncementBlock({ p }: { p: Record<string, any> }) {
  const isDark = p.style === 'dark'
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="rounded-2xl p-8 md:p-10"
        style={{
          background: isDark ? '#111111' : '#F4F4F4',
          border: `1px solid ${isDark ? '#2A2A2A' : '#E8E8E8'}`,
        }}>
        {p.eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3"
            style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(17,17,17,0.4)' }}>
            {p.eyebrow}
          </p>
        )}
        <h3 className="font-black text-2xl md:text-3xl tracking-tight mb-3"
          style={{ color: isDark ? '#F5F5F5' : '#111111' }}>
          {p.title}
        </h3>
        {p.body && (
          <p className="text-sm leading-relaxed mb-6"
            style={{ color: isDark ? 'rgba(245,245,245,0.6)' : 'rgba(17,17,17,0.55)' }}>
            {p.body}
          </p>
        )}
        {p.ctaLabel && p.ctaHref && (
          <Link href={p.ctaHref}
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition"
            style={{ background: isDark ? '#F5F5F5' : '#111111', color: isDark ? '#0A0A0A' : '#ffffff' }}>
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
    <div className="max-w-6xl mx-auto px-6 py-12">
      {p.heading && (
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10" style={{ color: 'rgba(17,17,17,0.4)' }}>
          — {p.heading}
        </p>
      )}
      <div className={`grid divide-x divide-[#E8E8E8]`}
        style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)` }}>
        {items.map((item: any, i: number) => (
          <div key={i} className="px-8 first:pl-0 last:pr-0 py-4">
            <p className="font-black text-[#111111] tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 1 }}>
              {item.value}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mt-2" style={{ color: '#888888' }}>
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
    <div className="max-w-6xl mx-auto px-6 py-12">
      {(p.eyebrow || p.heading) && (
        <div className="mb-10">
          {p.eyebrow && (
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(17,17,17,0.4)' }}>
              — {p.eyebrow}
            </p>
          )}
          {p.heading && (
            <h2 className="font-display font-black tracking-tighter text-[#111111]"
              style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 0.9 }}>
              {p.heading}
            </h2>
          )}
        </div>
      )}
      <div className={`grid grid-cols-1 ${cols} gap-6`}>
        {items.map((item: any, i: number) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-[#E8E8E8] bg-[#FAFAFA] flex flex-col">
            {item.image && (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <img src={item.image} alt={item.title || ''} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-black text-lg text-[#111111] mb-2">{item.title}</h3>
              {item.body && <p className="text-sm text-[#666666] leading-relaxed flex-1">{item.body}</p>}
              {item.link && (
                <Link href={item.link}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] mt-4 text-[#111111]">
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
  const isDark = p.style === 'dark'
  return (
    <section className="relative overflow-hidden"
      style={{ background: isDark ? 'linear-gradient(135deg,#000 0%,#222 50%,#3A6A8F 100%)' : '#F4F4F4' }}>
      {isDark && (
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 90% at 85% 50%,rgba(255,255,255,0.08),transparent 70%)' }} />
      )}
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            {p.eyebrow && (
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(17,17,17,0.4)' }}>
                {p.eyebrow}
              </p>
            )}
            <h2 className="font-display font-black tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem,8vw,7rem)', lineHeight: 0.85, color: isDark ? '#ffffff' : '#111111' }}>
              {p.heading}
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {p.body && (
              <p className="text-base leading-relaxed max-w-xs"
                style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(17,17,17,0.55)' }}>
                {p.body}
              </p>
            )}
            <div className="flex flex-col gap-3 mt-2">
              {p.btn1Label && (
                <Link href={p.btn1Href || '#'}
                  className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group"
                  style={{ background: isDark ? '#ffffff' : '#000000', color: isDark ? '#000000' : '#ffffff' }}>
                  {p.btn1Label}
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {p.btn2Label && (
                <Link href={p.btn2Href || '#'}
                  className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group"
                  style={{
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(17,17,17,0.2)'}`,
                    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(17,17,17,0.5)',
                  }}>
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
    sm: 'clamp(1.2rem,3vw,2rem)',
    md: 'clamp(1.5rem,4vw,3rem)',
    lg: 'clamp(2rem,5.5vw,4.5rem)',
    xl: 'clamp(2.5rem,7vw,6rem)',
  }
  return (
    <section className="border-y border-[#E8E8E8] bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-1">
            {p.reference && (
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#888888] hidden md:block"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {p.reference}
              </p>
            )}
          </div>
          <div className="md:col-span-11">
            <p className="font-display font-black text-[#111111] tracking-tighter"
              style={{ fontSize: sizeMap[p.size || 'lg'], lineHeight: 0.9 }}>
              "{p.text}"
            </p>
            {p.reference && (
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#888888] mt-6 md:hidden">
                — {p.reference}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicesBlock({ p }: { p: Record<string, any> }) {
  const items: any[] = p.items || []
  return (
    <section className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {p.heading && (
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8" style={{ color: 'rgba(17,17,17,0.4)' }}>
            — {p.heading}
          </p>
        )}
        <div className="grid divide-x divide-[#E8E8E8]"
          style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)` }}>
          {items.map((item: any, i: number) => (
            <div key={i} className="px-8 first:pl-0 last:pr-0 py-6">
              <span className="text-[9px] font-black text-[#000000]/70 tracking-[0.3em] uppercase block mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-baseline gap-1 mb-1">
                <p className="text-5xl font-black text-[#111111] leading-none tracking-tight">{item.time}</p>
                <p className="text-lg font-black text-[#888888]">{item.unit}</p>
              </div>
              <p className="text-[11px] font-bold text-[#111111]">{item.label}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#888888] mt-0.5">{item.day}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VideoBlock({ p }: { p: Record<string, any> }) {
  if (!p.url) return null
  const embed = detectSocialEmbed(p.url)
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {p.title && <h3 className="font-black text-xl text-[#111111] mb-4">{p.title}</h3>}
      {embed ? (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: embed.aspectPadding, height: 0, background: '#111' }}>
          <iframe src={embed.embedUrl} className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" style={{ border: 'none' }} />
        </div>
      ) : (
        <video src={p.url} controls className="w-full rounded-2xl" style={{ background: '#111' }} />
      )}
      {p.caption && <p className="text-center text-xs mt-3 text-[#888888]">{p.caption}</p>}
    </div>
  )
}

function ColumnsBlock({ p }: { p: Record<string, any> }) {
  const splitMap: Record<string, string> = {
    '1/2': '1fr 1fr',
    '1/3': '1fr 2fr',
    '2/3': '2fr 1fr',
  }
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:gap-12 gap-6"
        style={{ gridTemplateColumns: `var(--cols, ${splitMap[p.split || '1/2']})` }}>
        <div className="text-sm leading-relaxed text-[#444444]">{p.left}</div>
        <div className="text-sm leading-relaxed text-[#444444]">{p.right}</div>
      </div>
    </div>
  )
}

function SpacerBlock({ p }: { p: Record<string, any> }) {
  return <div style={{ height: spacerHeight[p.size || 'md'] || '6rem' }} />
}

/* ── main renderer ──────────────────────────────────────────── */

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map(block => {
        const p = block.props || {}
        switch (block.type) {
          case 'hero':         return <HeroBlock key={block.id} p={p} />
          case 'heading':      return <HeadingBlock key={block.id} p={p} />
          case 'text':         return <TextBlock key={block.id} p={p} />
          case 'image':        return <ImageBlock key={block.id} p={p} />
          case 'announcement': return <AnnouncementBlock key={block.id} p={p} />
          case 'stats':        return <StatsBlock key={block.id} p={p} />
          case 'cards':        return <CardsBlock key={block.id} p={p} />
          case 'cta':          return <CtaBlock key={block.id} p={p} />
          case 'verse':        return <VerseBlock key={block.id} p={p} />
          case 'services':     return <ServicesBlock key={block.id} p={p} />
          case 'video':        return <VideoBlock key={block.id} p={p} />
          case 'columns':      return <ColumnsBlock key={block.id} p={p} />
          case 'spacer':       return <SpacerBlock key={block.id} p={p} />
          default:             return null
        }
      })}
    </>
  )
}
