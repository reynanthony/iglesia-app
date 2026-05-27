'use client'

import { useState, useTransition, useRef, useEffect, useCallback } from 'react'
import React from 'react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical, X, ChevronUp, ChevronDown, Plus, Save,
  CheckCircle2, AlertCircle, Eye, Layers, Trash2,
  Type, AlignLeft, Image, Megaphone, BarChart2, LayoutGrid,
  MousePointerClick, Quote, Clock, Play, Columns2, Space,
} from 'lucide-react'
import type { Block, BlockType } from '@/lib/blocks'
import { BLOCK_META, BLOCK_GROUPS, createBlock } from '@/lib/blocks'
import { savePageBlocks, uploadPageImage, fixPagesBucketLimit, getCloudinarySignature } from '@/app/actions/admin'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

/* ── block icon map ─────────────────────────────────────────── */
const ICONS: Record<BlockType, React.ComponentType<any>> = {
  hero: Layers, heading: Type, text: AlignLeft, image: Image,
  announcement: Megaphone, stats: BarChart2, cards: LayoutGrid,
  cta: MousePointerClick, verse: Quote, services: Clock,
  video: Play, columns: Columns2, spacer: Space,
}

/* ── background color helper ────────────────────────────────── */
function blockBg(type: BlockType, props: any): string {
  if (type === 'cta' && props.style === 'dark') return '#111'
  if (type === 'hero' && props.style === 'dark') return '#000'
  if (type === 'hero' && (props.bgImage || props.bgVideo)) return '#333'
  return '#fff'
}

/* ── WYSIWYG block preview ──────────────────────────────────── */
function BlockPreview({ block, interactive }: { block: Block; interactive?: boolean }) {
  const p = block.props
  const bg = blockBg(block.type, p)
  const dark = bg !== '#fff'
  const ink = dark ? '#F5F5F5' : '#111111'
  const muted = dark ? 'rgba(245,245,245,0.45)' : 'rgba(17,17,17,0.4)'

  switch (block.type) {
    case 'hero': {
      const hasBg = !!(p.bgImage || p.bgVideo)
      return (
        <div style={{ minHeight: 320, position: 'relative', overflow: 'hidden', background: hasBg ? '#000' : bg }}>
          {p.bgVideo && (
            <video autoPlay muted loop playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
              src={p.bgVideo} />
          )}
          {p.bgImage && !p.bgVideo && (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${p.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
          )}
          {hasBg && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1 }} />}
          <div style={{ position: 'relative', zIndex: 2, padding: '48px 40px' }}>
            {p.tagline && <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: muted, marginBottom: 24 }}>{p.tagline}</p>}
            <div style={{ fontFamily: 'var(--font-display,serif)', fontWeight: 900, color: ink, lineHeight: 0.88, marginBottom: 28 }}>
              <div style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>{p.headline1}</div>
              <div style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>{p.headline2}</div>
              <em style={{ fontSize: 'clamp(3rem,8vw,7rem)', display: 'block' }}>{p.headline3}</em>
            </div>
            {p.subtitle && <p style={{ fontSize: 14, color: muted, maxWidth: 400, lineHeight: 1.6 }}>{p.subtitle}</p>}
            {p.cta1Label && (
              <span style={{ display: 'inline-block', marginTop: 24, background: dark ? '#fff' : '#000', color: dark ? '#000' : '#fff', padding: '12px 24px', borderRadius: 12, fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {p.cta1Label}
              </span>
            )}
          </div>
        </div>
      )
    }

    case 'heading':
      return (
        <div style={{ padding: '40px', textAlign: p.align || 'left' }}>
          {p.eyebrow && <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.4)', marginBottom: 16 }}>— {p.eyebrow}</p>}
          <div style={{ fontFamily: p.style === 'display' ? 'var(--font-display,serif)' : 'inherit', fontWeight: 900, color: '#111', fontSize: p.level === 'h1' ? 72 : p.level === 'h3' ? 32 : 48, lineHeight: p.style === 'display' ? 0.9 : 1.2, letterSpacing: p.style === 'display' ? '-0.03em' : 'normal' }}>
            {p.text}
          </div>
        </div>
      )

    case 'text':
      return (
        <div style={{ padding: '24px 40px', textAlign: p.align || 'left' }}>
          {(p.content || '').split('\n').slice(0, 5).map((line: string, i: number) =>
            <p key={i} style={{ color: '#555', fontSize: p.size === 'lg' ? 18 : p.size === 'xl' ? 22 : 15, lineHeight: 1.65, marginBottom: 8 }}>{line || ' '}</p>
          )}
        </div>
      )

    case 'image':
      return (
        <div style={{ padding: p.fullWidth ? 0 : '16px 40px' }}>
          {p.url
            ? <img src={p.url} alt={p.alt || ''} style={{ width: '100%', display: 'block', borderRadius: p.rounded && !p.fullWidth ? 16 : 0, maxHeight: 320, objectFit: 'cover' }} />
            : <div style={{ height: 180, background: '#F0F0F0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>Sin imagen</div>
          }
          {p.caption && <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 8 }}>{p.caption}</p>}
        </div>
      )

    case 'announcement':
      return (
        <div style={{ padding: '16px 40px' }}>
          <div style={{ background: p.style === 'dark' ? '#111' : '#F4F4F4', border: `1px solid ${p.style === 'dark' ? '#2A2A2A' : '#E8E8E8'}`, borderRadius: 16, padding: '32px 36px' }}>
            {p.eyebrow && <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: p.style === 'dark' ? 'rgba(245,245,245,0.4)' : 'rgba(17,17,17,0.4)', marginBottom: 12 }}>{p.eyebrow}</p>}
            <p style={{ fontSize: 24, fontWeight: 900, color: p.style === 'dark' ? '#F5F5F5' : '#111', marginBottom: 8 }}>{p.title}</p>
            <p style={{ fontSize: 14, color: p.style === 'dark' ? 'rgba(245,245,245,0.55)' : 'rgba(17,17,17,0.55)', lineHeight: 1.6 }}>{p.body}</p>
          </div>
        </div>
      )

    case 'stats':
      return (
        <div style={{ padding: '48px 40px', borderBottom: '1px solid #E8E8E8' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min((p.items||[]).length, 4)}, 1fr)`, borderLeft: '1px solid #E8E8E8' }}>
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: '0 32px 0 32px', borderRight: '1px solid #E8E8E8' }}>
                <div style={{ fontFamily: 'var(--font-display,serif)', fontWeight: 900, fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#111', lineHeight: 1 }}>{item.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#888', marginTop: 8 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'cards':
      return (
        <div style={{ padding: '40px' }}>
          {p.heading && <p style={{ fontFamily: 'var(--font-display,serif)', fontWeight: 900, fontSize: 40, color: '#111', marginBottom: 32 }}>{p.heading}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.columns || 3}, 1fr)`, gap: 16 }}>
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E8E8E8', borderRadius: 16, overflow: 'hidden' }}>
                {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} /> : <div style={{ height: 80, background: '#F4F4F4' }} />}
                <div style={{ padding: 20 }}>
                  <p style={{ fontWeight: 900, fontSize: 16, color: '#111' }}>{item.title}</p>
                  <p style={{ fontSize: 13, color: '#666', marginTop: 4, lineHeight: 1.5 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'cta':
      return (
        <div style={{ background: p.style === 'dark' ? 'linear-gradient(135deg,#000,#222 50%,#3A6A8F)' : '#F4F4F4', padding: '80px 40px' }}>
          <p style={{ fontFamily: 'var(--font-display,serif)', fontWeight: 900, fontSize: 'clamp(2.5rem,6vw,5rem)', color: p.style === 'dark' ? '#fff' : '#111', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: 24 }}>{p.heading}</p>
          {p.body && <p style={{ color: p.style === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(17,17,17,0.55)', marginBottom: 24, fontSize: 15, maxWidth: 360 }}>{p.body}</p>}
          {p.btn1Label && <span style={{ display: 'inline-block', background: p.style === 'dark' ? '#fff' : '#000', color: p.style === 'dark' ? '#000' : '#fff', padding: '16px 28px', borderRadius: 12, fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{p.btn1Label}</span>}
        </div>
      )

    case 'verse':
      return (
        <div style={{ borderTop: '1px solid #E8E8E8', borderBottom: '1px solid #E8E8E8', padding: '64px 40px', background: '#FAFAFA' }}>
          <p style={{ fontFamily: 'var(--font-display,serif)', fontWeight: 900, color: '#111', fontSize: p.size === 'xl' ? 56 : p.size === 'lg' ? 44 : p.size === 'md' ? 32 : 22, lineHeight: 0.9, letterSpacing: '-0.03em' }}>"{p.text}"</p>
          {p.reference && <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#888', marginTop: 20 }}>— {p.reference}</p>}
        </div>
      )

    case 'services':
      return (
        <div style={{ borderBottom: '1px solid #E8E8E8', padding: '48px 40px' }}>
          {p.heading && <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(17,17,17,0.4)', marginBottom: 32 }}>— {p.heading}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min((p.items||[]).length, 4)}, 1fr)`, borderLeft: '1px solid #E8E8E8' }}>
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: '0 32px', borderRight: '1px solid #E8E8E8' }}>
                <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(17,17,17,0.5)', display: 'block', marginBottom: 16 }}>{String(i+1).padStart(2,'0')}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: '#111', lineHeight: 1 }}>{item.time}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#888' }}>{item.unit}</span>
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{item.label}</p>
                <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#888' }}>{item.day}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'video': {
      const u = (p.url || '').trim()
      const ytId = u.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)?.[1] ?? null
      const vimId = u.match(/vimeo\.com\/(\d+)/)?.[1] ?? null
      const isDirect = u && !ytId && !vimId
      const embedUrl = ytId
        ? `https://www.youtube.com/embed/${ytId}`
        : vimId ? `https://player.vimeo.com/video/${vimId}` : null
      // In the editor canvas (non-interactive) show a static thumbnail — pointer-events:none prevents player init.
      // In preview mode (interactive=true) show the live iframe so the video can actually be tested.
      const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null

      return (
        <div style={{ padding: '24px 40px' }}>
          {p.title && <p style={{ fontWeight: 900, color: '#111', marginBottom: 12 }}>{p.title}</p>}
          {u ? (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', background: '#111' }}>
              {interactive && embedUrl ? (
                <iframe src={embedUrl}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen />
              ) : interactive && isDirect ? (
                <video src={u} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  {thumb && (
                    <img src={thumb} alt={p.title || 'video'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                  )}
                  {isDirect && (
                    <video src={u} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  {(ytId || vimId) && (
                    <div style={{ position: 'absolute', bottom: 8, left: 12, fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      {ytId ? 'YouTube' : 'Vimeo'} · miniatura del editor
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div style={{ background: '#F4F4F4', borderRadius: 12, aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#BBB" strokeWidth="1.5"><path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.889L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>
              <p style={{ fontSize: 12, color: '#AAA' }}>Pega un enlace de YouTube o Vimeo</p>
            </div>
          )}
          {p.caption && <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 8 }}>{p.caption}</p>}
        </div>
      )
    }

    case 'columns':
      return (
        <div style={{ padding: '32px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: p.split === '1/3' ? '1fr 2fr' : p.split === '2/3' ? '2fr 1fr' : '1fr 1fr', gap: 32 }}>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.65 }}>{p.left}</p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.65 }}>{p.right}</p>
          </div>
        </div>
      )

    case 'spacer': {
      const h: Record<string, number> = { xs: 32, sm: 64, md: 96, lg: 160, xl: 256 }
      return (
        <div style={{ height: h[p.size || 'md'] || 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ borderTop: '1px dashed #E0E0E0', width: '100%' }} />
        </div>
      )
    }

    default:
      return <div style={{ padding: 32, color: '#aaa', textAlign: 'center' }}>Bloque desconocido</div>
  }
}

/* ── sortable visual block with editing overlay ─────────────── */
function VisualBlock({
  block, selected, onSelect, onDelete, onMoveUp, onMoveDown,
}: {
  block: Block; selected: boolean
  onSelect: () => void; onDelete: () => void
  onMoveUp: () => void; onMoveDown: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }
  const meta = BLOCK_META[block.type]
  const hasBg = !!block.props._bgImage

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* clickable area — stopPropagation prevents canvas from deselecting immediately */}
      <div
        className="cursor-pointer"
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        style={{ userSelect: 'none', position: 'relative' }}
      >
        {/* universal block background image */}
        {hasBg && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `url(${block.props._bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none' }} />
        )}
        {hasBg && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `rgba(0,0,0,${block.props._bgOverlay ?? 0.4})`, pointerEvents: 'none' }} />
        )}
        <div style={{ pointerEvents: 'none', position: 'relative', zIndex: hasBg ? 2 : 'auto' as any }}>
          <BlockPreview block={block} />
        </div>
      </div>

      {/* selection ring */}
      {selected && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ outline: '2px solid #4D9EFF', outlineOffset: '-2px', zIndex: 10 }} />
      )}

      {/* hover / selected controls */}
      <div
        className={`absolute top-3 right-3 z-20 flex items-center gap-1 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        onClick={e => e.stopPropagation()}
      >
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg mr-1"
          style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', backdropFilter: 'blur(4px)' }}>
          {meta.label}
        </span>
        <button {...attributes} {...listeners}
          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ background: 'rgba(0,0,0,0.8)', touchAction: 'none' }} title="Arrastrar">
          <GripVertical size={13} style={{ color: '#fff' }} />
        </button>
        <button onClick={onMoveUp} className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)' }} title="Subir">
          <ChevronUp size={13} style={{ color: '#fff' }} />
        </button>
        <button onClick={onMoveDown} className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)' }} title="Bajar">
          <ChevronDown size={13} style={{ color: '#fff' }} />
        </button>
        <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(220,38,38,0.9)' }} title="Eliminar bloque">
          <X size={13} style={{ color: '#fff' }} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: '#4D9EFF' }} />
    </div>
  )
}

/* ── form helpers ───────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: '#8A8A8A' }}>{label}</label>
      {children}
    </div>
  )
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#F5F5F5' }} />
  )
}
function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows}
      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#F5F5F5' }} />
  )
}
function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#F5F5F5' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
function Tog({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-xs" style={{ color: '#8A8A8A' }}>{label}</span>
      <button type="button" onClick={() => onChange(!value)}
        className="w-10 h-5 rounded-full relative transition-colors"
        style={{ background: value ? '#F5F5F5' : '#2A2A2A' }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
          style={{ background: value ? '#0A0A0A' : '#4D4D4D', transform: `translateX(${value ? '22px' : '2px'})` }} />
      </button>
    </label>
  )
}
function ImgField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [up, setUp] = useState(false)
  const ref = React.useRef<HTMLInputElement>(null)
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setUp(true)
    const fd = new FormData(); fd.append('file', f)
    const res = await uploadPageImage(fd)
    setUp(false)
    if (res.url) onChange(res.url)
  }
  return (
    <div className="space-y-2">
      <Input value={value} onChange={onChange} placeholder="https://... o sube" />
      {value && <img src={value} alt="" className="w-full rounded-lg object-cover" style={{ maxHeight: 80 }} />}
      <button type="button" onClick={() => ref.current?.click()} disabled={up}
        className="w-full text-xs py-1.5 rounded-lg border"
        style={{ borderColor: '#2A2A2A', color: '#8A8A8A', background: '#1A1A1A' }}>
        {up ? 'Subiendo…' : `Subir ${label}`}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  )
}

function VideoField({ value, onChange }: { value: string; onChange: (v: string) => void; label: string }) {
  const [up, setUp] = useState(false)
  const [progress, setProgress] = useState(0)
  const [err, setErr] = useState('')
  const ref = React.useRef<HTMLInputElement>(null)

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setErr('')
    setProgress(0)
    setUp(true)

    // Try Cloudinary first (no file size limit, returns direct CDN URL for <video src>)
    const sig = await getCloudinarySignature('iglesia/videos')

    if (sig.error !== 'missing_config' && sig.signature && sig.apiKey && sig.cloudName && sig.timestamp != null) {
      const fd = new FormData()
      fd.append('file', f)
      fd.append('api_key', sig.apiKey)
      fd.append('timestamp', String(sig.timestamp))
      fd.append('signature', sig.signature)
      fd.append('folder', 'iglesia/videos')

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`)

      xhr.upload.addEventListener('progress', ev => {
        if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100))
      })
      xhr.addEventListener('load', () => {
        setUp(false)
        if (xhr.status >= 200 && xhr.status < 300) {
          try { onChange(JSON.parse(xhr.responseText).secure_url) }
          catch { setErr('Respuesta inesperada de Cloudinary') }
        } else {
          try { setErr(JSON.parse(xhr.responseText).error?.message ?? 'Error al subir video') }
          catch { setErr('Error al subir video') }
        }
      })
      xhr.addEventListener('error', () => { setUp(false); setErr('Error de conexión') })
      xhr.send(fd)
      return
    }

    // Fallback: Supabase (50 MB free-tier limit)
    const MB50 = 50 * 1024 * 1024
    if (f.size > MB50) {
      setErr(`El archivo pesa ${(f.size / 1024 / 1024).toFixed(0)} MB. El límite es 50 MB. Configura Cloudinary o sube el video a YouTube/Vimeo.`)
      setUp(false)
      return
    }

    const supabase = createBrowserClient()
    const ext = f.name.split('.').pop() ?? 'mp4'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('paginas').upload(path, f, { contentType: f.type })
    if (error) { setErr(error.message); setUp(false); return }
    const { data: { publicUrl } } = supabase.storage.from('paginas').getPublicUrl(path)
    onChange(publicUrl)
    setUp(false)
  }

  const isFile = value && !value.includes('youtube') && !value.includes('youtu.be') && !value.includes('vimeo')
  return (
    <div className="space-y-2">
      <Input value={value} onChange={onChange} placeholder="https://youtu.be/... o sube MP4/MOV" />
      {value && isFile && (
        <video src={value} controls className="w-full rounded-lg" style={{ maxHeight: 100 }} />
      )}
      <button type="button" onClick={() => ref.current?.click()} disabled={up}
        className="w-full text-xs py-1.5 rounded-lg border transition"
        style={{ borderColor: '#2A2A2A', color: up ? '#4D9EFF' : '#8A8A8A', background: '#1A1A1A' }}>
        {up
          ? <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 animate-spin"
                style={{ borderColor: '#4D9EFF', borderTopColor: 'transparent' }} />
              {progress > 0 ? `Subiendo… ${progress}%` : 'Preparando…'}
            </span>
          : 'Subir video'}
      </button>
      {up && progress > 0 && (
        <div className="w-full rounded-full overflow-hidden" style={{ background: '#1A1A1A', height: 4 }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: '#4D9EFF' }} />
        </div>
      )}
      {err && <p className="text-[11px] leading-relaxed" style={{ color: '#F87171' }}>{err}</p>}
      <p className="text-[10px]" style={{ color: '#3A3A3A' }}>
        Para prédicas completas usa YouTube o Vimeo y pega el enlace arriba.
      </p>
      <input ref={ref} type="file" accept="video/*" className="hidden" onChange={handle} />
    </div>
  )
}

/* ── universal background section (all blocks) ──────────────── */
function BgSection({ p, set }: { p: Record<string, any>; set: (k: string, v: any) => void }) {
  return (
    <div className="space-y-3 pt-4 mt-2" style={{ borderTop: '1px solid #1F1F1F' }}>
      <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: '#3A3A3A' }}>— Fondo del bloque</p>
      <Field label="Imagen de fondo">
        <ImgField value={p._bgImage || ''} onChange={v => set('_bgImage', v)} label="fondo" />
      </Field>
      {!!p._bgImage && (
        <Field label="Oscurecer fondo">
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="0.95" step="0.05"
              value={p._bgOverlay ?? 0.4}
              onChange={e => set('_bgOverlay', parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: '#F5F5F5' }} />
            <span className="text-xs" style={{ color: '#8A8A8A', minWidth: 32 }}>
              {Math.round((p._bgOverlay ?? 0.4) * 100)}%
            </span>
          </div>
        </Field>
      )}
    </div>
  )
}

/* ── props panel per block type ─────────────────────────────── */
function PropsPanel({ block, onChange }: { block: Block; onChange: (p: Record<string, any>) => void }) {
  const p = block.props
  const set = (k: string, v: any) => onChange({ ...p, [k]: v })
  const setItem = (arr: any[], i: number, k: string, v: any) => arr.map((it, idx) => idx === i ? { ...it, [k]: v } : it)

  switch (block.type) {
    case 'hero': return (
      <div className="space-y-4">
        <Field label="Estilo de texto"><Sel value={p.style} onChange={v => set('style', v)} options={[{ value: 'light', label: 'Texto claro (fondo oscuro)' }, { value: 'dark', label: 'Texto oscuro (fondo blanco)' }]} /></Field>
        <Field label="Imagen de fondo"><ImgField value={p.bgImage || ''} onChange={v => set('bgImage', v)} label="imagen" /></Field>
        <Field label="Video de fondo"><VideoField value={p.bgVideo || ''} onChange={v => set('bgVideo', v)} label="video" /></Field>
        <Field label="Tagline"><Input value={p.tagline} onChange={v => set('tagline', v)} /></Field>
        <Field label="Titular — línea 1"><Input value={p.headline1} onChange={v => set('headline1', v)} /></Field>
        <Field label="Titular — línea 2"><Input value={p.headline2} onChange={v => set('headline2', v)} /></Field>
        <Field label="Titular — línea 3 (cursiva)"><Input value={p.headline3} onChange={v => set('headline3', v)} /></Field>
        <Field label="Subtítulo"><Textarea value={p.subtitle} onChange={v => set('subtitle', v)} rows={2} /></Field>
        <Field label="CTA 1 — texto"><Input value={p.cta1Label} onChange={v => set('cta1Label', v)} /></Field>
        <Field label="CTA 1 — enlace"><Input value={p.cta1Href} onChange={v => set('cta1Href', v)} /></Field>
        <Field label="CTA 2 — texto"><Input value={p.cta2Label} onChange={v => set('cta2Label', v)} /></Field>
        <Field label="CTA 2 — enlace"><Input value={p.cta2Href} onChange={v => set('cta2Href', v)} /></Field>
      </div>
    )
    case 'heading': return (
      <div className="space-y-4">
        <Field label="Eyebrow"><Input value={p.eyebrow} onChange={v => set('eyebrow', v)} /></Field>
        <Field label="Texto"><Input value={p.text} onChange={v => set('text', v)} /></Field>
        <Field label="Nivel"><Sel value={p.level} onChange={v => set('level', v)} options={[{ value: 'h1', label: 'H1 — Principal' }, { value: 'h2', label: 'H2' }, { value: 'h3', label: 'H3' }, { value: 'h4', label: 'H4' }]} /></Field>
        <Field label="Alineación"><Sel value={p.align} onChange={v => set('align', v)} options={[{ value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' }]} /></Field>
        <Field label="Estilo"><Sel value={p.style} onChange={v => set('style', v)} options={[{ value: 'display', label: 'Display (grande)' }, { value: 'plain', label: 'Normal' }]} /></Field>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'text': return (
      <div className="space-y-4">
        <Field label="Contenido"><Textarea value={p.content} onChange={v => set('content', v)} rows={6} /></Field>
        <Field label="Tamaño"><Sel value={p.size} onChange={v => set('size', v)} options={[{ value: 'sm', label: 'Pequeño' }, { value: 'base', label: 'Normal' }, { value: 'lg', label: 'Grande' }, { value: 'xl', label: 'Extra grande' }]} /></Field>
        <Field label="Alineación"><Sel value={p.align} onChange={v => set('align', v)} options={[{ value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' }]} /></Field>
        <Field label="Columnas"><Sel value={String(p.columns || 1)} onChange={v => set('columns', Number(v))} options={[{ value: '1', label: 'Una' }, { value: '2', label: 'Dos' }]} /></Field>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'image': return (
      <div className="space-y-4">
        <Field label="Imagen"><ImgField value={p.url || ''} onChange={v => set('url', v)} label="imagen" /></Field>
        <Field label="Alt (texto alternativo)"><Input value={p.alt} onChange={v => set('alt', v)} /></Field>
        <Field label="Pie de foto"><Input value={p.caption} onChange={v => set('caption', v)} /></Field>
        <Field label="Proporción"><Sel value={p.aspect} onChange={v => set('aspect', v)} options={[{ value: 'video', label: '16/9' }, { value: 'square', label: '1/1' }, { value: 'portrait', label: '3/4' }, { value: 'auto', label: 'Auto' }]} /></Field>
        <Tog label="Ancho completo" value={!!p.fullWidth} onChange={v => set('fullWidth', v)} />
        <Tog label="Bordes redondeados" value={!!p.rounded} onChange={v => set('rounded', v)} />
      </div>
    )
    case 'announcement': return (
      <div className="space-y-4">
        <Field label="Estilo"><Sel value={p.style} onChange={v => set('style', v)} options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }]} /></Field>
        <Field label="Eyebrow"><Input value={p.eyebrow} onChange={v => set('eyebrow', v)} /></Field>
        <Field label="Título"><Input value={p.title} onChange={v => set('title', v)} /></Field>
        <Field label="Descripción"><Textarea value={p.body} onChange={v => set('body', v)} /></Field>
        <Field label="Botón — texto"><Input value={p.ctaLabel} onChange={v => set('ctaLabel', v)} /></Field>
        <Field label="Botón — enlace"><Input value={p.ctaHref} onChange={v => set('ctaHref', v)} /></Field>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'stats': return (
      <div className="space-y-4">
        <Field label="Título"><Input value={p.heading} onChange={v => set('heading', v)} /></Field>
        {(p.items || []).map((it: any, i: number) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1"><Field label={`Valor ${i+1}`}><Input value={it.value} onChange={v => set('items', setItem(p.items, i, 'value', v))} /></Field></div>
            <div className="flex-1"><Field label="Etiqueta"><Input value={it.label} onChange={v => set('items', setItem(p.items, i, 'label', v))} /></Field></div>
            <button onClick={() => set('items', (p.items||[]).filter((_: any, idx: number) => idx !== i))} className="mb-0.5" style={{ color: '#F87171' }}><X size={13} /></button>
          </div>
        ))}
        <button onClick={() => set('items', [...(p.items||[]), { value: '0', label: 'Nuevo' }])}
          className="w-full py-1.5 rounded-lg text-xs border" style={{ borderColor: '#2A2A2A', color: '#8A8A8A' }}>+ Añadir</button>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'cards': return (
      <div className="space-y-4">
        <Field label="Eyebrow"><Input value={p.eyebrow} onChange={v => set('eyebrow', v)} /></Field>
        <Field label="Título"><Input value={p.heading} onChange={v => set('heading', v)} /></Field>
        <Field label="Columnas"><Sel value={String(p.columns||3)} onChange={v => set('columns', Number(v))} options={[{ value: '2', label: '2 columnas' }, { value: '3', label: '3 columnas' }]} /></Field>
        {(p.items||[]).map((it: any, i: number) => (
          <div key={i} className="space-y-2 p-3 rounded-lg" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4D4D4D' }}>Tarjeta {i+1}</span>
              <button onClick={() => set('items', (p.items||[]).filter((_: any, idx: number) => idx !== i))} style={{ color: '#F87171' }}><X size={13} /></button>
            </div>
            <Field label="Imagen"><ImgField value={it.image || ''} onChange={v => set('items', setItem(p.items, i, 'image', v))} label="imagen" /></Field>
            <Field label="Título"><Input value={it.title} onChange={v => set('items', setItem(p.items, i, 'title', v))} /></Field>
            <Field label="Descripción"><Textarea value={it.body} onChange={v => set('items', setItem(p.items, i, 'body', v))} rows={2} /></Field>
            <Field label="Enlace"><Input value={it.link} onChange={v => set('items', setItem(p.items, i, 'link', v))} /></Field>
          </div>
        ))}
        <button onClick={() => set('items', [...(p.items||[]), { image: '', title: 'Tarjeta', body: '', link: '' }])}
          className="w-full py-1.5 rounded-lg text-xs border" style={{ borderColor: '#2A2A2A', color: '#8A8A8A' }}>+ Añadir tarjeta</button>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'cta': return (
      <div className="space-y-4">
        <Field label="Estilo"><Sel value={p.style} onChange={v => set('style', v)} options={[{ value: 'dark', label: 'Oscuro' }, { value: 'light', label: 'Claro' }]} /></Field>
        <Field label="Eyebrow"><Input value={p.eyebrow} onChange={v => set('eyebrow', v)} /></Field>
        <Field label="Titular"><Textarea value={p.heading} onChange={v => set('heading', v)} rows={2} /></Field>
        <Field label="Descripción"><Textarea value={p.body} onChange={v => set('body', v)} /></Field>
        <Field label="Botón 1 — texto"><Input value={p.btn1Label} onChange={v => set('btn1Label', v)} /></Field>
        <Field label="Botón 1 — enlace"><Input value={p.btn1Href} onChange={v => set('btn1Href', v)} /></Field>
        <Field label="Botón 2 — texto"><Input value={p.btn2Label} onChange={v => set('btn2Label', v)} /></Field>
        <Field label="Botón 2 — enlace"><Input value={p.btn2Href} onChange={v => set('btn2Href', v)} /></Field>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'verse': return (
      <div className="space-y-4">
        <Field label="Versículo"><Textarea value={p.text} onChange={v => set('text', v)} rows={3} /></Field>
        <Field label="Referencia"><Input value={p.reference} onChange={v => set('reference', v)} placeholder="Ej: Mateo 11:28" /></Field>
        <Field label="Tamaño"><Sel value={p.size} onChange={v => set('size', v)} options={[{ value: 'sm', label: 'Pequeño' }, { value: 'md', label: 'Mediano' }, { value: 'lg', label: 'Grande' }, { value: 'xl', label: 'Extra grande' }]} /></Field>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'services': return (
      <div className="space-y-4">
        <Field label="Título"><Input value={p.heading} onChange={v => set('heading', v)} /></Field>
        {(p.items||[]).map((it: any, i: number) => (
          <div key={i} className="space-y-2 p-3 rounded-lg" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <div className="flex justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4D4D4D' }}>Horario {i+1}</span>
              <button onClick={() => set('items', (p.items||[]).filter((_: any, idx: number) => idx !== i))} style={{ color: '#F87171' }}><X size={13} /></button>
            </div>
            <Field label="Día"><Input value={it.day} onChange={v => set('items', setItem(p.items, i, 'day', v))} /></Field>
            <div className="flex gap-2">
              <div className="flex-1"><Field label="Hora"><Input value={it.time} onChange={v => set('items', setItem(p.items, i, 'time', v))} /></Field></div>
              <div className="w-20"><Field label="AM/PM"><Sel value={it.unit} onChange={v => set('items', setItem(p.items, i, 'unit', v))} options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]} /></Field></div>
            </div>
            <Field label="Descripción"><Input value={it.label} onChange={v => set('items', setItem(p.items, i, 'label', v))} /></Field>
          </div>
        ))}
        <button onClick={() => set('items', [...(p.items||[]), { day: 'Domingo', time: '10:00', unit: 'AM', label: 'Servicio' }])}
          className="w-full py-1.5 rounded-lg text-xs border" style={{ borderColor: '#2A2A2A', color: '#8A8A8A' }}>+ Añadir horario</button>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'video': return (
      <div className="space-y-4">
        <Field label="Video (YouTube, Vimeo o MP4)"><VideoField value={p.url || ''} onChange={v => set('url', v)} label="video" /></Field>
        <Field label="Título"><Input value={p.title} onChange={v => set('title', v)} /></Field>
        <Field label="Pie de video"><Input value={p.caption} onChange={v => set('caption', v)} /></Field>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'columns': return (
      <div className="space-y-4">
        <Field label="Proporción"><Sel value={p.split} onChange={v => set('split', v)} options={[{ value: '1/2', label: '50% / 50%' }, { value: '1/3', label: '33% / 66%' }, { value: '2/3', label: '66% / 33%' }]} /></Field>
        <Field label="Columna izquierda"><Textarea value={p.left} onChange={v => set('left', v)} rows={4} /></Field>
        <Field label="Columna derecha"><Textarea value={p.right} onChange={v => set('right', v)} rows={4} /></Field>
        <BgSection p={p} set={set} />
      </div>
    )
    case 'spacer': return (
      <div className="space-y-4">
        <Field label="Altura"><Sel value={p.size} onChange={v => set('size', v)} options={[{ value: 'xs', label: 'XS' }, { value: 'sm', label: 'S' }, { value: 'md', label: 'M (defecto)' }, { value: 'lg', label: 'L' }, { value: 'xl', label: 'XL' }]} /></Field>
      </div>
    )
    default: return <p className="text-xs" style={{ color: '#4D4D4D' }}>Sin propiedades.</p>
  }
}

/* ── block picker modal ─────────────────────────────────────── */
function BlockPicker({ onAdd, onClose }: { onAdd: (t: BlockType) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full sm:w-auto sm:max-w-lg rounded-t-3xl sm:rounded-2xl p-6 overflow-y-auto"
        style={{ background: '#111111', border: '1px solid #2A2A2A', maxHeight: '85vh' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: '#8A8A8A' }}>Añadir bloque</p>
          <button onClick={onClose} style={{ color: '#4D4D4D' }}><X size={18} /></button>
        </div>
        {BLOCK_GROUPS.map(group => (
          <div key={group.name} className="mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2 px-1" style={{ color: '#3A3A3A' }}>{group.name}</p>
            <div className="grid grid-cols-3 gap-2">
              {group.types.map(type => {
                const Icon = ICONS[type]
                const meta = BLOCK_META[type]
                return (
                  <button key={type} onClick={() => { onAdd(type); onClose() }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition hover:bg-[#1A1A1A] text-center">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1A1A1A' }}>
                      <Icon size={16} style={{ color: '#8A8A8A' }} />
                    </div>
                    <span className="text-[11px] font-bold leading-tight" style={{ color: '#8A8A8A' }}>{meta.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── section type map per page (for click-to-edit in iframe) ── */
const PAGE_SECTION_TYPES: Record<string, BlockType[]> = {
  home:        ['hero', 'services', 'verse', 'announcement', 'cta'],
  nosotros:    ['hero', 'stats', 'text', 'verse', 'cards', 'cta'],
  contacto:    ['hero', 'cards', 'cta'],
  // Hybrid pages: CTA is hardcoded in the data zone, don't duplicate it here
  eventos:     ['hero', 'announcement'],
  predicas:    ['hero', 'video'],
  ministerios: ['hero', 'announcement'],
  'app-feed':  ['announcement', 'hero'],
}

// Hybrid pages have a fixed data zone below the editorial blocks (sermon list, events, ministries grid)
const HYBRID_PAGES = new Set(['predicas', 'eventos', 'ministerios'])

const HYBRID_DATA_LABEL: Record<string, string> = {
  predicas:    'Lista de prédicas — generada automáticamente',
  eventos:     'Horarios y eventos — generados automáticamente',
  ministerios: 'Grilla de ministerios — generada automáticamente',
}

const SECTION_LABELS: Record<BlockType, string> = {
  hero: 'Hero', heading: 'Título', text: 'Texto', image: 'Imagen',
  announcement: 'Anuncio', stats: 'Estadísticas', cards: 'Tarjetas',
  cta: 'CTA', verse: 'Versículo', services: 'Horarios',
  video: 'Video', columns: 'Columnas', spacer: 'Espaciado',
}

/* ── main component ─────────────────────────────────────────── */
export default function PageBuilder({
  page, pageLabel, initialBlocks = [], previewPath,
}: {
  page: string; pageLabel: string; initialBlocks?: Block[]; previewPath?: string
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()
  const [splitView, setSplitView] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Refs for iframe interaction
  const editIframeRef = useRef<HTMLIFrameElement>(null)
  const splitIframeRef = useRef<HTMLIFrameElement>(null)
  // Keep latest addBlock in a ref to avoid stale closures in iframe event listeners
  const addBlockRef = useRef<(t: BlockType) => void>(() => {})

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const selectedBlock = blocks.find(b => b.id === selectedId) ?? null

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oi = blocks.findIndex(b => b.id === active.id)
      const ni = blocks.findIndex(b => b.id === over.id)
      setBlocks(arrayMove(blocks, oi, ni))
    }
  }

  function addBlock(type: BlockType) {
    const nb = createBlock(type)
    setBlocks(prev => [...prev, nb])
    setSelectedId(nb.id)
  }

  // When clicking from the iframe (first interaction), scaffold ALL page sections at once
  // so publishing doesn't wipe the rest of the page — user edits individual blocks from there
  function addAllSectionsFromIframe(clickedType: BlockType) {
    const sectionTypes = PAGE_SECTION_TYPES[page] ?? [clickedType]
    const newBlocks = sectionTypes.map(t => createBlock(t))
    setBlocks(newBlocks)
    // Select the block matching what the user clicked
    const target = newBlocks.find(b => b.type === clickedType) ?? newBlocks[0]
    setSelectedId(target.id)
  }

  // Keep ref current
  useEffect(() => { addBlockRef.current = addAllSectionsFromIframe })

  function updateBlock(id: string, props: Record<string, any>) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, props } : b))
  }

  function deleteBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function moveBlock(id: string, dir: 'up' | 'down') {
    const i = blocks.findIndex(b => b.id === id)
    if (dir === 'up' && i > 0) setBlocks(arrayMove(blocks, i, i - 1))
    if (dir === 'down' && i < blocks.length - 1) setBlocks(arrayMove(blocks, i, i + 1))
  }

  function handleSave() {
    setStatus('idle')
    startTransition(async () => {
      const res = await savePageBlocks(page, blocks)
      setStatus(res.ok ? 'ok' : 'error')
    })
  }

  function clearAll() {
    if (!window.confirm('¿Eliminar todos los bloques? La página volverá a su diseño original.')) return
    setBlocks([])
    setSelectedId(null)
  }

  // Prevent link navigation inside any iframe (so scroll works without navigating away)
  function preventLinks(doc: Document) {
    doc.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation() })
    })
    // Also block form submissions
    doc.querySelectorAll('form').forEach(f => {
      f.addEventListener('submit', e => e.preventDefault())
    })
  }

  // Inject click-to-edit overlays on sections in the edit iframe
  function injectEditOverlays() {
    const iframe = editIframeRef.current
    if (!iframe?.contentDocument) return
    const doc = iframe.contentDocument
    preventLinks(doc)

    const sectionTypes = PAGE_SECTION_TYPES[page] ?? []
    const sections = Array.from(doc.querySelectorAll('section'))

    sections.forEach((section, i) => {
      const type: BlockType = sectionTypes[i] ?? 'text'
      const label = SECTION_LABELS[type] ?? 'Sección';

      // Style the section as clickable
      (section as HTMLElement).style.cursor = 'pointer';
      (section as HTMLElement).style.transition = 'outline 0.1s'

      // Create hover badge
      const badge = doc.createElement('div')
      badge.innerHTML = `<span style="font-size:10px;margin-right:4px">✎</span> ${label}`
      badge.style.cssText = [
        'position:absolute', 'top:14px', 'left:14px', 'z-index:9999',
        'background:rgba(77,158,255,0.95)', 'color:#fff',
        'font-size:11px', 'font-weight:900', 'letter-spacing:0.12em',
        'padding:5px 12px', 'border-radius:8px', 'pointer-events:none',
        'opacity:0', 'transition:opacity 0.15s',
        'text-transform:uppercase', 'font-family:system-ui,sans-serif',
        'box-shadow:0 2px 8px rgba(0,0,0,0.3)',
      ].join(';')

      // Ensure section is positioned so badge is relative to it
      const pos = window.getComputedStyle(section).position
      if (pos === 'static') (section as HTMLElement).style.position = 'relative'
      section.appendChild(badge)

      section.addEventListener('mouseenter', () => {
        (section as HTMLElement).style.outline = '2.5px solid rgba(77,158,255,0.7)'
        badge.style.opacity = '1'
      })
      section.addEventListener('mouseleave', () => {
        (section as HTMLElement).style.outline = ''
        badge.style.opacity = '0'
      })
      section.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        // Use ref so we always call the latest addBlock (no stale closure)
        addBlockRef.current(type)
      })
    })
  }

  // Inject scroll-only fix for split view iframe (links disabled, no section click)
  function injectScrollFix() {
    const iframe = splitIframeRef.current
    if (!iframe?.contentDocument) return
    preventLinks(iframe.contentDocument)
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh', background: '#0A0A0A' }}>

      {/* TOP BAR */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: '#1F1F1F', background: '#0A0A0A', minHeight: 52 }}>
        <div className="flex items-center gap-3">
          <a href="/admin/paginas" className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#4D4D4D' }}>← Páginas</a>
          <span style={{ color: '#2A2A2A' }}>/</span>
          <span className="text-sm font-bold text-white">{pageLabel}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#1A1A1A', color: '#4D4D4D' }}>
            {blocks.length} bloque{blocks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {blocks.length > 0 && (
            <button onClick={clearAll}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition"
              style={{ background: '#1A1A1A', color: '#F87171', border: '1px solid #2A2A2A' }}>
              <Trash2 size={12} /> Vaciar
            </button>
          )}
          <button onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition"
            style={{ background: '#1A1A1A', color: '#F5F5F5', border: '1px solid #2A2A2A' }}>
            <Plus size={12} /> Añadir bloque
          </button>
          {blocks.length > 0 && (
            <button onClick={() => { setPreviewMode(v => !v); setSelectedId(null) }}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition"
              style={{ background: previewMode ? '#4D9EFF' : '#1A1A1A', color: previewMode ? '#fff' : '#8A8A8A', border: '1px solid #2A2A2A' }}>
              <Eye size={12} /> {previewMode ? 'Editar' : 'Vista previa'}
            </button>
          )}
          {previewPath && blocks.length > 0 && !previewMode && (
            <button onClick={() => setSplitView(v => !v)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition"
              style={{ background: splitView ? '#F5F5F5' : '#1A1A1A', color: splitView ? '#0A0A0A' : '#8A8A8A', border: '1px solid #2A2A2A' }}>
              <Eye size={12} /> {splitView ? 'Cerrar referencia' : 'Ver publicado'}
            </button>
          )}
          {previewPath && (
            <a href={previewPath} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition"
              style={{ color: '#4D4D4D', border: '1px solid #1F1F1F', background: '#0D0D0D' }}
              title="Abrir en nueva pestaña">
              <Eye size={12} />
            </a>
          )}
          <button onClick={handleSave} disabled={isPending}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-lg transition disabled:opacity-40"
            style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
            <Save size={12} /> {isPending ? 'Guardando…' : 'Publicar'}
          </button>
          {status === 'ok' && <span className="flex items-center gap-1 text-xs" style={{ color: '#6BCB6B' }}><CheckCircle2 size={13} /> Publicado</span>}
          {status === 'error' && <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle size={13} /> Error</span>}
        </div>
      </div>

      {/* CANVAS + PANEL */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* split reference drawer (only when blocks exist) */}
        {splitView && previewPath && blocks.length > 0 && (
          <div className="flex-shrink-0 border-b flex flex-col" style={{ height: 380, borderColor: '#1F1F1F' }}>
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2"
              style={{ background: '#0A0A0A', borderBottom: '1px solid #1F1F1F' }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: '#4D4D4D' }}>
                Página publicada — referencia (scroll activo)
              </span>
              <button onClick={() => setSplitView(false)} style={{ color: '#4D4D4D' }}><X size={13} /></button>
            </div>
            <iframe
              ref={splitIframeRef}
              src={previewPath}
              title="Referencia"
              onLoad={injectScrollFix}
              className="flex-1 border-0"
              style={{ background: '#fff' }}
            />
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">

          {/* CLEAN PREVIEW MODE */}
          {previewMode && (
            <div className="flex-1 overflow-y-auto" style={{ background: '#FFFFFF' }}>
              <div className="flex items-center gap-3 px-5 py-2.5 sticky top-0 z-10"
                style={{ background: '#111111', borderBottom: '1px solid #222' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#4D9EFF' }} />
                <p className="text-[11px] flex-1" style={{ color: '#8A8A8A' }}>
                  <strong style={{ color: '#F5F5F5' }}>Vista previa</strong> — así se verá la página al publicar
                </p>
                <button onClick={() => setPreviewMode(false)}
                  className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl"
                  style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
                  ← Editar
                </button>
              </div>
              {blocks.map(block => {
                const hasBg = !!block.props._bgImage
                return (
                  <div key={block.id} style={{ position: 'relative' }}>
                    {hasBg && <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `url(${block.props._bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                    {hasBg && <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `rgba(0,0,0,${block.props._bgOverlay ?? 0.4})` }} />}
                    <div style={{ position: 'relative', zIndex: hasBg ? 2 : 'auto' as any }}>
                      <BlockPreview block={block} interactive />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <main className={`flex-1 overflow-y-auto ${previewMode ? 'hidden' : ''}`} style={{ background: '#FFFFFF' }}
            onClick={() => setSelectedId(null)}>
            {blocks.length === 0 ? (
              previewPath ? (
                /* No blocks: show the live page in interactive iframe */
                <div className="flex flex-col" style={{ height: '100%' }}>
                  <div className="flex-shrink-0 flex items-center justify-between px-5 py-3"
                    style={{ background: '#111111', borderBottom: '1px solid #222' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#4D9EFF' }} />
                      <p className="text-[11px] truncate" style={{ color: '#8A8A8A' }}>
                        <strong style={{ color: '#F5F5F5' }}>Haz clic en una sección</strong> para cargar todas en el editor y editarla
                      </p>
                    </div>
                    <button onClick={() => setShowPicker(true)}
                      className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl ml-4"
                      style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
                      <Plus size={11} /> Bloque nuevo
                    </button>
                  </div>
                  <iframe
                    ref={editIframeRef}
                    src={previewPath}
                    title={pageLabel}
                    onLoad={injectEditOverlays}
                    className="flex-1 border-0"
                    style={{ background: '#fff', minHeight: 0 }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-6"
                  style={{ background: '#F4F4F4' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#E8E8E8' }}>
                    <Layers size={24} style={{ color: '#AAAAAA' }} />
                  </div>
                  <div>
                    <p className="font-black text-lg text-[#111111]">Página en blanco</p>
                    <p className="text-sm mt-1 text-[#888888]">Añade bloques para construir la página</p>
                  </div>
                  <button onClick={() => setShowPicker(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition"
                    style={{ background: '#111111', color: '#FFFFFF' }}>
                    <Plus size={14} /> Añadir primer bloque
                  </button>
                </div>
              )
            ) : (
              <>
                {/* Editorial zone banner for hybrid pages */}
                {HYBRID_PAGES.has(page) && (
                  <div className="flex items-center gap-2 px-5 py-2.5" style={{ background: '#0D1F2D', borderBottom: '1px solid #1A3A55' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#4D9EFF' }} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#4D9EFF' }}>
                      Zona editorial — aparece encima del contenido dinámico de la página
                    </p>
                  </div>
                )}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    {blocks.map((block) => (
                      <VisualBlock
                        key={block.id}
                        block={block}
                        selected={selectedId === block.id}
                        onSelect={() => setSelectedId(prev => prev === block.id ? null : block.id)}
                        onDelete={() => deleteBlock(block.id)}
                        onMoveUp={() => moveBlock(block.id, 'up')}
                        onMoveDown={() => moveBlock(block.id, 'down')}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                {/* Data zone indicator for hybrid pages */}
                {HYBRID_PAGES.has(page) && (
                  <div className="flex items-center gap-3 px-5 py-5" style={{ background: '#F8F8F8', borderTop: '2px dashed #D0D0D0' }}>
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#E8E8E8' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#AAAAAA' }}>
                      {HYBRID_DATA_LABEL[page] ?? 'Contenido dinámico — generado automáticamente'}
                    </p>
                  </div>
                )}
              </>
            )}
            {blocks.length > 0 && (
              <div className="py-8 flex justify-center" style={{ borderTop: '1px dashed #E0E0E0' }}
                onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowPicker(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition"
                  style={{ background: '#F4F4F4', color: '#888888', border: '1px dashed #D0D0D0' }}>
                  <Plus size={14} /> Añadir bloque
                </button>
              </div>
            )}
          </main>

          {/* RIGHT PANEL — hidden in preview mode */}
          <aside className={`flex-shrink-0 border-l overflow-y-auto ${previewMode ? 'hidden' : ''}`}
            style={{ width: 300, borderColor: '#1F1F1F', background: '#0D0D0D' }}>
            {selectedBlock ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    {React.createElement(ICONS[selectedBlock.type], { size: 14, style: { color: '#8A8A8A' } })}
                    <span className="text-[11px] font-black uppercase tracking-wider text-white">
                      {BLOCK_META[selectedBlock.type].label}
                    </span>
                  </div>
                  <button onClick={() => setSelectedId(null)} style={{ color: '#4D4D4D' }}><X size={14} /></button>
                </div>
                <PropsPanel block={selectedBlock} onChange={props => updateBlock(selectedBlock.id, props)} />
              </div>
            ) : blocks.length === 0 && previewPath ? (
              /* Guidance panel when viewing the iframe */
              <div className="p-4 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#3A3A3A' }}>— Cómo editar</p>
                <div className="space-y-3">
                  {(PAGE_SECTION_TYPES[page] ?? []).map((type, i) => {
                    const Icon = ICONS[type]
                    return (
                      <button key={i} onClick={() => addBlockRef.current(type)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition hover:bg-[#1A1A1A]"
                        style={{ border: '1px solid #1F1F1F' }}
                        title="Añade todas las secciones de la página y selecciona esta">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: '#1A1A1A' }}>
                          <Icon size={13} style={{ color: '#6BCB6B' }} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-white">{SECTION_LABELS[type]}</p>
                          <p className="text-[10px]" style={{ color: '#4D4D4D' }}>Sección {i + 1}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <p className="text-[10px] leading-relaxed pt-2" style={{ color: '#3A3A3A', borderTop: '1px solid #1F1F1F' }}>
                  Al seleccionar una sección se agregan todas las secciones de la página al editor para que puedas editarlas sin perder el resto del diseño.
                </p>
                {HYBRID_PAGES.has(page) && (
                  <div className="mt-3 p-3 rounded-xl" style={{ background: '#0D1F2D', border: '1px solid #1A3A55' }}>
                    <p className="text-[10px] leading-relaxed" style={{ color: '#4D9EFF' }}>
                      Esta página tiene <strong style={{ color: '#7DBEFF' }}>contenido dinámico</strong> (
                      {HYBRID_DATA_LABEL[page]?.toLowerCase() ?? 'datos automáticos'}
                      ) que siempre aparece debajo, sin importar los bloques que añadas aquí.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#141414', border: '1px solid #1F1F1F' }}>
                  <MousePointerClick size={16} style={{ color: '#3A3A3A' }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#4D4D4D' }}>
                  Haz clic sobre cualquier bloque para editarlo
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {showPicker && <BlockPicker onAdd={addBlock} onClose={() => setShowPicker(false)} />}
    </div>
  )
}
