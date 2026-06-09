'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUp, ArrowDown, Trash2, Plus, Check, Loader2, X, ChevronRight } from 'lucide-react'
import type { Block, BlockType } from '@/lib/blocks'
import { createBlock, BLOCK_META, BLOCK_GROUPS } from '@/lib/blocks'
import { savePublicacionBlocks } from '@/app/actions/publicaciones'

/* ── style constants ──────────────────────────────────────────── */
const field  = 'w-full px-3 py-2 text-sm focus:outline-none rounded-xl'
const fStyle = { background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' } as const
const lbl    = 'block text-[10px] font-black uppercase tracking-[0.2em] mb-1'
const lStyle = { color: 'rgba(246,243,235,0.45)' } as const

const ICONS: Record<string, string> = {
  hero: '🎯', heading: 'T', text: '¶', image: '🖼', video: '▶',
  announcement: '📢', stats: '📊', cards: '🃏', cta: '⚡',
  verse: '📖', services: '🕐', columns: '⫿', spacer: '↕',
  detalle: '📋', agenda: '📅', galeria: '🖼', ponentes: '👤', faq: '❓', separador: '─',
}

/* ── helper: add-item button ──────────────────────────────────── */
function AddRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
      style={{ background: 'rgba(118,171,174,0.08)', color: '#76ABAE', border: '1px dashed rgba(118,171,174,0.25)' }}>
      <Plus size={12} /> {label}
    </button>
  )
}

/* ── helper: list item wrapper ────────────────────────────────── */
function ItemWrap({ index, label, onRemove, children }: {
  index: number; label: string; onRemove: () => void; children: React.ReactNode
}) {
  return (
    <div className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(13,51,82,0.5)', border: '1px solid #0D3352' }}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold" style={{ color: 'rgba(246,243,235,0.30)' }}>{label} {index + 1}</span>
        <button type="button" onClick={onRemove} className="p-1 rounded" style={{ color: 'rgba(246,243,235,0.35)' }}>
          <Trash2 size={12} />
        </button>
      </div>
      {children}
    </div>
  )
}

/* ── prop editors per block type ──────────────────────────────── */
function PropEditor({ block, onChange }: { block: Block; onChange: (p: Record<string, any>) => void }) {
  const p = block.props
  const set = (key: string, val: any) => onChange({ ...p, [key]: val })
  const setItem = (key: string, i: number, patch: Record<string, any>) => {
    const items = [...(p[key] || [])]
    items[i] = { ...items[i], ...patch }
    set(key, items)
  }
  const removeItem = (key: string, i: number) => set(key, (p[key] || []).filter((_: any, j: number) => j !== i))

  switch (block.type) {

    case 'detalle':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Título de sección</label>
            <input value={p.heading || ''} onChange={e => set('heading', e.target.value)} className={field} style={fStyle} /></div>
          <label className={lbl} style={lStyle}>Detalles</label>
          {(p.items || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={item.icon} placeholder="📌" onChange={e => setItem('items', i, { icon: e.target.value })}
                className="w-12 px-2 py-2 text-center text-sm focus:outline-none rounded-xl flex-shrink-0" style={fStyle} />
              <input value={item.label} placeholder="Etiqueta" onChange={e => setItem('items', i, { label: e.target.value })}
                className={`${field} flex-1`} style={fStyle} />
              <input value={item.value} placeholder="Valor" onChange={e => setItem('items', i, { value: e.target.value })}
                className={`${field} flex-1`} style={fStyle} />
              <button type="button" onClick={() => removeItem('items', i)}
                className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'rgba(246,243,235,0.35)', background: '#0B2D47' }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <AddRow label="Añadir detalle" onClick={() => set('items', [...(p.items || []), { icon: '📌', label: '', value: '' }])} />
        </div>
      )

    case 'agenda':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Título de sección</label>
            <input value={p.heading || ''} onChange={e => set('heading', e.target.value)} className={field} style={fStyle} /></div>
          <label className={lbl} style={lStyle}>Actividades</label>
          {(p.items || []).map((item: any, i: number) => (
            <ItemWrap key={i} index={i} label="Actividad" onRemove={() => removeItem('items', i)}>
              <div className="grid grid-cols-2 gap-2">
                <input value={item.time} placeholder="7:00 PM" onChange={e => setItem('items', i, { time: e.target.value })}
                  className={`${field} text-xs`} style={fStyle} />
                <input value={item.speaker} placeholder="Ponente (opcional)" onChange={e => setItem('items', i, { speaker: e.target.value })}
                  className={`${field} text-xs`} style={fStyle} />
              </div>
              <input value={item.title} placeholder="Actividad" onChange={e => setItem('items', i, { title: e.target.value })}
                className={`${field} text-xs`} style={fStyle} />
            </ItemWrap>
          ))}
          <AddRow label="Añadir actividad" onClick={() => set('items', [...(p.items || []), { time: '', title: '', speaker: '' }])} />
        </div>
      )

    case 'galeria':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Columnas</label>
            <select value={String(p.columns || 3)} onChange={e => set('columns', Number(e.target.value))} className={field} style={fStyle}>
              <option value="2">2</option><option value="3">3</option><option value="4">4</option>
            </select></div>
          <label className={lbl} style={lStyle}>URLs de imágenes</label>
          {(p.images || []).map((url: string, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={url} placeholder="https://..." onChange={e => { const imgs = [...(p.images || [])]; imgs[i] = e.target.value; set('images', imgs) }}
                className={`${field} flex-1`} style={fStyle} />
              <button type="button" onClick={() => set('images', (p.images || []).filter((_: any, j: number) => j !== i))}
                className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'rgba(246,243,235,0.35)', background: '#0B2D47' }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <AddRow label="Añadir imagen" onClick={() => set('images', [...(p.images || []), ''])} />
        </div>
      )

    case 'ponentes':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Título de sección</label>
            <input value={p.heading || ''} onChange={e => set('heading', e.target.value)} className={field} style={fStyle} /></div>
          {(p.items || []).map((item: any, i: number) => (
            <ItemWrap key={i} index={i} label="Ponente" onRemove={() => removeItem('items', i)}>
              <div className="grid grid-cols-2 gap-2">
                <input value={item.name} placeholder="Nombre" onChange={e => setItem('items', i, { name: e.target.value })} className={`${field} text-xs`} style={fStyle} />
                <input value={item.title} placeholder="Cargo/Título" onChange={e => setItem('items', i, { title: e.target.value })} className={`${field} text-xs`} style={fStyle} />
              </div>
              <input value={item.photo} placeholder="URL foto (opcional)" onChange={e => setItem('items', i, { photo: e.target.value })} className={`${field} text-xs`} style={fStyle} />
              <textarea rows={2} value={item.bio} placeholder="Bio breve" onChange={e => setItem('items', i, { bio: e.target.value })} className={`${field} resize-none text-xs`} style={fStyle} />
            </ItemWrap>
          ))}
          <AddRow label="Añadir ponente" onClick={() => set('items', [...(p.items || []), { photo: '', name: '', title: '', bio: '' }])} />
        </div>
      )

    case 'faq':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Título de sección</label>
            <input value={p.heading || ''} onChange={e => set('heading', e.target.value)} className={field} style={fStyle} /></div>
          {(p.items || []).map((item: any, i: number) => (
            <ItemWrap key={i} index={i} label="Pregunta" onRemove={() => removeItem('items', i)}>
              <input value={item.question} placeholder="Pregunta" onChange={e => setItem('items', i, { question: e.target.value })} className={`${field} text-xs`} style={fStyle} />
              <textarea rows={2} value={item.answer} placeholder="Respuesta" onChange={e => setItem('items', i, { answer: e.target.value })} className={`${field} resize-none text-xs`} style={fStyle} />
            </ItemWrap>
          ))}
          <AddRow label="Añadir pregunta" onClick={() => set('items', [...(p.items || []), { question: '', answer: '' }])} />
        </div>
      )

    case 'separador':
      return (
        <div><label className={lbl} style={lStyle}>Etiqueta (opcional)</label>
          <input value={p.label || ''} onChange={e => set('label', e.target.value)} className={field} style={fStyle} placeholder="o" /></div>
      )

    case 'heading':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Eyebrow</label>
            <input value={p.eyebrow || ''} onChange={e => set('eyebrow', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Texto *</label>
            <input value={p.text || ''} onChange={e => set('text', e.target.value)} className={field} style={fStyle} /></div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className={lbl} style={lStyle}>Nivel</label>
              <select value={p.level || 'h2'} onChange={e => set('level', e.target.value)} className={field} style={fStyle}>
                <option>h1</option><option>h2</option><option>h3</option><option>h4</option>
              </select></div>
            <div><label className={lbl} style={lStyle}>Alineación</label>
              <select value={p.align || 'left'} onChange={e => set('align', e.target.value)} className={field} style={fStyle}>
                <option value="left">Izq.</option><option value="center">Centro</option><option value="right">Der.</option>
              </select></div>
            <div><label className={lbl} style={lStyle}>Estilo</label>
              <select value={p.style || 'display'} onChange={e => set('style', e.target.value)} className={field} style={fStyle}>
                <option value="display">Display</option><option value="normal">Normal</option>
              </select></div>
          </div>
        </div>
      )

    case 'text':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Contenido</label>
            <textarea rows={6} value={p.content || ''} onChange={e => set('content', e.target.value)} className={`${field} resize-y`} style={fStyle} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl} style={lStyle}>Tamaño</label>
              <select value={p.size || 'base'} onChange={e => set('size', e.target.value)} className={field} style={fStyle}>
                <option value="sm">Pequeño</option><option value="base">Normal</option><option value="lg">Grande</option><option value="xl">Extra grande</option>
              </select></div>
            <div><label className={lbl} style={lStyle}>Columnas</label>
              <select value={String(p.columns || 1)} onChange={e => set('columns', Number(e.target.value))} className={field} style={fStyle}>
                <option value="1">1</option><option value="2">2</option>
              </select></div>
          </div>
        </div>
      )

    case 'image':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>URL de imagen</label>
            <input value={p.url || ''} onChange={e => set('url', e.target.value)} className={field} style={fStyle} placeholder="https://..." /></div>
          <div><label className={lbl} style={lStyle}>Alt text</label>
            <input value={p.alt || ''} onChange={e => set('alt', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Caption</label>
            <input value={p.caption || ''} onChange={e => set('caption', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Proporción</label>
            <select value={p.aspect || 'video'} onChange={e => set('aspect', e.target.value)} className={field} style={fStyle}>
              <option value="video">16:9</option><option value="square">Cuadrado</option><option value="portrait">Retrato</option><option value="auto">Auto</option>
            </select></div>
        </div>
      )

    case 'video':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>URL YouTube / Vimeo</label>
            <input value={p.url || ''} onChange={e => set('url', e.target.value)} className={field} style={fStyle} placeholder="https://youtu.be/..." /></div>
          <div><label className={lbl} style={lStyle}>Título</label>
            <input value={p.title || ''} onChange={e => set('title', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Caption</label>
            <input value={p.caption || ''} onChange={e => set('caption', e.target.value)} className={field} style={fStyle} /></div>
        </div>
      )

    case 'verse':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Versículo</label>
            <textarea rows={3} value={p.text || ''} onChange={e => set('text', e.target.value)} className={`${field} resize-none`} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Referencia</label>
            <input value={p.reference || ''} onChange={e => set('reference', e.target.value)} className={field} style={fStyle} placeholder="Juan 3:16" /></div>
          <div><label className={lbl} style={lStyle}>Tamaño</label>
            <select value={p.size || 'lg'} onChange={e => set('size', e.target.value)} className={field} style={fStyle}>
              <option value="sm">Pequeño</option><option value="md">Mediano</option><option value="lg">Grande</option><option value="xl">Extra grande</option>
            </select></div>
        </div>
      )

    case 'spacer':
      return (
        <div><label className={lbl} style={lStyle}>Tamaño</label>
          <select value={p.size || 'md'} onChange={e => set('size', e.target.value)} className={field} style={fStyle}>
            <option value="xs">Muy pequeño</option><option value="sm">Pequeño</option><option value="md">Mediano</option><option value="lg">Grande</option><option value="xl">Extra grande</option>
          </select></div>
      )

    case 'cta':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Eyebrow</label>
            <input value={p.eyebrow || ''} onChange={e => set('eyebrow', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Título</label>
            <input value={p.heading || ''} onChange={e => set('heading', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Descripción</label>
            <textarea rows={2} value={p.body || ''} onChange={e => set('body', e.target.value)} className={`${field} resize-none`} style={fStyle} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl} style={lStyle}>Botón 1 texto</label>
              <input value={p.btn1Label || ''} onChange={e => set('btn1Label', e.target.value)} className={field} style={fStyle} /></div>
            <div><label className={lbl} style={lStyle}>Botón 1 URL</label>
              <input value={p.btn1Href || ''} onChange={e => set('btn1Href', e.target.value)} className={field} style={fStyle} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl} style={lStyle}>Botón 2 texto</label>
              <input value={p.btn2Label || ''} onChange={e => set('btn2Label', e.target.value)} className={field} style={fStyle} /></div>
            <div><label className={lbl} style={lStyle}>Botón 2 URL</label>
              <input value={p.btn2Href || ''} onChange={e => set('btn2Href', e.target.value)} className={field} style={fStyle} /></div>
          </div>
        </div>
      )

    case 'stats':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Título (opcional)</label>
            <input value={p.heading || ''} onChange={e => set('heading', e.target.value)} className={field} style={fStyle} /></div>
          <label className={lbl} style={lStyle}>Estadísticas</label>
          {(p.items || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={item.value} placeholder="Valor" onChange={e => setItem('items', i, { value: e.target.value })} className={`${field} flex-1`} style={fStyle} />
              <input value={item.label} placeholder="Etiqueta" onChange={e => setItem('items', i, { label: e.target.value })} className={`${field} flex-1`} style={fStyle} />
              <button type="button" onClick={() => removeItem('items', i)} className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'rgba(246,243,235,0.35)', background: '#0B2D47' }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <AddRow label="Añadir estadística" onClick={() => set('items', [...(p.items || []), { value: '', label: '' }])} />
        </div>
      )

    case 'cards':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl} style={lStyle}>Eyebrow</label>
              <input value={p.eyebrow || ''} onChange={e => set('eyebrow', e.target.value)} className={field} style={fStyle} /></div>
            <div><label className={lbl} style={lStyle}>Columnas</label>
              <select value={String(p.columns || 3)} onChange={e => set('columns', Number(e.target.value))} className={field} style={fStyle}>
                <option value="2">2</option><option value="3">3</option>
              </select></div>
          </div>
          <div><label className={lbl} style={lStyle}>Título</label>
            <input value={p.heading || ''} onChange={e => set('heading', e.target.value)} className={field} style={fStyle} /></div>
          <label className={lbl} style={lStyle}>Tarjetas</label>
          {(p.items || []).map((item: any, i: number) => (
            <ItemWrap key={i} index={i} label="Tarjeta" onRemove={() => removeItem('items', i)}>
              <input value={item.title} placeholder="Título" onChange={e => setItem('items', i, { title: e.target.value })} className={`${field} text-xs`} style={fStyle} />
              <input value={item.body} placeholder="Descripción" onChange={e => setItem('items', i, { body: e.target.value })} className={`${field} text-xs`} style={fStyle} />
              <input value={item.link} placeholder="URL (opcional)" onChange={e => setItem('items', i, { link: e.target.value })} className={`${field} text-xs`} style={fStyle} />
            </ItemWrap>
          ))}
          <AddRow label="Añadir tarjeta" onClick={() => set('items', [...(p.items || []), { image: '', title: '', body: '', link: '' }])} />
        </div>
      )

    case 'announcement':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Eyebrow</label>
            <input value={p.eyebrow || ''} onChange={e => set('eyebrow', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Título</label>
            <input value={p.title || ''} onChange={e => set('title', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Cuerpo</label>
            <textarea rows={3} value={p.body || ''} onChange={e => set('body', e.target.value)} className={`${field} resize-none`} style={fStyle} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl} style={lStyle}>Texto CTA</label>
              <input value={p.ctaLabel || ''} onChange={e => set('ctaLabel', e.target.value)} className={field} style={fStyle} /></div>
            <div><label className={lbl} style={lStyle}>URL CTA</label>
              <input value={p.ctaHref || ''} onChange={e => set('ctaHref', e.target.value)} className={field} style={fStyle} /></div>
          </div>
        </div>
      )

    case 'hero':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Tagline</label>
            <input value={p.tagline || ''} onChange={e => set('tagline', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Título línea 1</label>
            <input value={p.headline1 || ''} onChange={e => set('headline1', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Título línea 2</label>
            <input value={p.headline2 || ''} onChange={e => set('headline2', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Título línea 3 (cursiva)</label>
            <input value={p.headline3 || ''} onChange={e => set('headline3', e.target.value)} className={field} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Subtítulo</label>
            <textarea rows={2} value={p.subtitle || ''} onChange={e => set('subtitle', e.target.value)} className={`${field} resize-none`} style={fStyle} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl} style={lStyle}>CTA 1 texto</label>
              <input value={p.cta1Label || ''} onChange={e => set('cta1Label', e.target.value)} className={field} style={fStyle} /></div>
            <div><label className={lbl} style={lStyle}>CTA 1 URL</label>
              <input value={p.cta1Href || ''} onChange={e => set('cta1Href', e.target.value)} className={field} style={fStyle} /></div>
          </div>
          <div><label className={lbl} style={lStyle}>Imagen de fondo</label>
            <input value={p.bgImage || ''} onChange={e => set('bgImage', e.target.value)} className={field} style={fStyle} placeholder="https://..." /></div>
          <div><label className={lbl} style={lStyle}>Estilo</label>
            <select value={p.style || 'light'} onChange={e => set('style', e.target.value)} className={field} style={fStyle}>
              <option value="light">Claro</option><option value="dark">Oscuro</option>
            </select></div>
        </div>
      )

    case 'columns':
      return (
        <div className="space-y-3">
          <div><label className={lbl} style={lStyle}>Distribución</label>
            <select value={p.split || '1/2'} onChange={e => set('split', e.target.value)} className={field} style={fStyle}>
              <option value="1/2">Mitad / Mitad</option><option value="1/3">1/3 · 2/3</option><option value="2/3">2/3 · 1/3</option>
            </select></div>
          <div><label className={lbl} style={lStyle}>Columna izquierda</label>
            <textarea rows={4} value={p.left || ''} onChange={e => set('left', e.target.value)} className={`${field} resize-y`} style={fStyle} /></div>
          <div><label className={lbl} style={lStyle}>Columna derecha</label>
            <textarea rows={4} value={p.right || ''} onChange={e => set('right', e.target.value)} className={`${field} resize-y`} style={fStyle} /></div>
        </div>
      )

    default:
      return <p className="text-xs py-4 text-center" style={{ color: 'rgba(246,243,235,0.30)' }}>Editor no disponible.</p>
  }
}

/* ── main component ───────────────────────────────────────────── */

export default function PublicacionBlockEditor({
  publicacionId,
  publicacionTitle,
  publicacionSlug,
  initialBlocks,
}: {
  publicacionId: string
  publicacionTitle: string
  publicacionSlug: string
  initialBlocks: Block[]
}) {
  const [blocks, setBlocks]         = useState<Block[]>(initialBlocks)
  const [selectedId, setSelectedId] = useState<string | null>(blocks[0]?.id ?? null)
  const [adding, setAdding]         = useState(false)
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  const selected = blocks.find(b => b.id === selectedId) ?? null

  function moveUp(i: number) {
    if (i === 0) return
    const next = [...blocks]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; setBlocks(next)
  }
  function moveDown(i: number) {
    if (i === blocks.length - 1) return
    const next = [...blocks]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; setBlocks(next)
  }
  function removeBlock(id: string) {
    const next = blocks.filter(b => b.id !== id)
    setBlocks(next)
    if (selectedId === id) setSelectedId(next[0]?.id ?? null)
  }
  function addBlock(type: BlockType) {
    const block = createBlock(type)
    setBlocks(prev => [...prev, block])
    setSelectedId(block.id)
    setAdding(false)
  }
  function updateProps(id: string, props: Record<string, any>) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, props } : b))
  }

  async function handleSave() {
    setSaving(true)
    await savePublicacionBlocks(publicacionId, blocks)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', background: '#051828', color: '#F6F3EB' }}>

      {/* ── top bar ── */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(246,243,235,0.07)', background: '#061E30' }}>
        <Link href="/admin/publicaciones"
          className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: '#0B2D47', border: '1px solid #0D3352', color: 'rgba(246,243,235,0.55)' }}>
          <ArrowLeft size={15} />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(246,243,235,0.35)' }}>
            Editor de bloques
          </p>
          <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{publicacionTitle}</p>
        </div>
        <Link href={`/publicaciones/${publicacionSlug}`} target="_blank"
          className="px-3 py-1.5 rounded-xl text-xs font-bold hidden md:flex items-center gap-1.5"
          style={{ background: 'rgba(118,171,174,0.10)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.20)' }}>
          Vista previa ↗
        </Link>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition flex-shrink-0"
          style={{ background: saved ? 'rgba(74,222,128,0.15)' : '#F6F3EB', color: saved ? '#4ADE80' : '#061E30' }}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
          {saving ? 'Guardando…' : saved ? 'Guardado' : 'Guardar'}
        </button>
      </div>

      {/* ── body ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>

        {/* left: block list */}
        <div className="w-60 flex-shrink-0 flex flex-col overflow-hidden"
          style={{ borderRight: '1px solid rgba(246,243,235,0.07)', background: '#061E30' }}>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {blocks.length === 0 && (
              <p className="text-[11px] text-center py-10" style={{ color: 'rgba(246,243,235,0.25)' }}>
                Sin bloques.
              </p>
            )}
            {blocks.map((block, i) => {
              const isSelected = selectedId === block.id
              return (
                <div key={block.id}
                  onClick={() => { setSelectedId(block.id); setAdding(false) }}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition group"
                  style={{
                    background: isSelected ? 'rgba(118,171,174,0.12)' : 'transparent',
                    border: isSelected ? '1px solid rgba(118,171,174,0.25)' : '1px solid transparent',
                  }}>
                  <span className="text-sm w-5 text-center flex-shrink-0" style={{ opacity: 0.7 }}>
                    {ICONS[block.type] ?? '□'}
                  </span>
                  <span className="text-xs flex-1 truncate"
                    style={{ color: isSelected ? '#F6F3EB' : 'rgba(246,243,235,0.55)' }}>
                    {BLOCK_META[block.type]?.label ?? block.type}
                  </span>
                  {/* move + delete (appear on hover) */}
                  <div className="flex gap-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={e => e.stopPropagation()}>
                    <button onClick={() => moveUp(i)} disabled={i === 0}
                      className="p-0.5 rounded disabled:opacity-20" style={{ color: 'rgba(246,243,235,0.45)' }}>
                      <ArrowUp size={11} />
                    </button>
                    <button onClick={() => moveDown(i)} disabled={i === blocks.length - 1}
                      className="p-0.5 rounded disabled:opacity-20" style={{ color: 'rgba(246,243,235,0.45)' }}>
                      <ArrowDown size={11} />
                    </button>
                    <button onClick={() => removeBlock(block.id)}
                      className="p-0.5 rounded" style={{ color: 'rgba(246,243,235,0.45)' }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* add block button */}
          <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(246,243,235,0.07)' }}>
            <button
              onClick={() => { setAdding(true); setSelectedId(null) }}
              className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              style={{
                background: adding ? 'rgba(118,171,174,0.15)' : 'rgba(118,171,174,0.08)',
                color: '#76ABAE',
                border: '1px dashed rgba(118,171,174,0.35)',
              }}>
              <Plus size={13} /> Añadir bloque
            </button>
          </div>
        </div>

        {/* right: editor / palette */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* block palette */}
          {adding && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Tipo de bloque</p>
                <button onClick={() => setAdding(false)} style={{ color: 'rgba(246,243,235,0.40)' }}>
                  <X size={16} />
                </button>
              </div>
              {BLOCK_GROUPS.map(group => (
                <div key={group.name} className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
                    style={{ color: 'rgba(246,243,235,0.35)' }}>
                    {group.name}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {group.types.map(type => (
                      <button key={type} onClick={() => addBlock(type)}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center transition hover:scale-[1.03] active:scale-95"
                        style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                        <span className="text-xl leading-none">{ICONS[type]}</span>
                        <span className="text-[11px] font-bold leading-tight" style={{ color: '#F6F3EB' }}>
                          {BLOCK_META[type]?.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* block prop editor */}
          {!adding && selected && (
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-5"
                style={{ borderBottom: '1px solid rgba(246,243,235,0.07)' }}>
                <span className="text-xl leading-none">{ICONS[selected.type]}</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>
                    {BLOCK_META[selected.type]?.label ?? selected.type}
                  </p>
                  <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.35)' }}>
                    {BLOCK_META[selected.type]?.description}
                  </p>
                </div>
              </div>
              <PropEditor
                block={selected}
                onChange={props => updateProps(selected.id, props)}
              />
            </div>
          )}

          {/* empty states */}
          {!adding && !selected && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <ChevronRight size={20} style={{ color: 'rgba(246,243,235,0.15)' }} className="rotate-180" />
              <p className="text-sm mt-3" style={{ color: 'rgba(246,243,235,0.25)' }}>
                {blocks.length > 0 ? 'Selecciona un bloque' : 'Añade el primer bloque'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
