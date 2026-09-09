'use client'

import { useState } from 'react'
import PageFieldsEditor from '@/components/admin/PageFieldsEditor'
import PageBuilder from '@/components/admin/PageBuilder'
import type { Block } from '@/lib/blocks'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

interface Props {
  page: string
  pageLabel: string
  initialBlocks: Block[]
  initialValues: Record<string, unknown>
  previewPath: string
}

export default function PageEditorTabs({ page, pageLabel, initialBlocks, initialValues, previewPath }: Props) {
  const [tab, setTab] = useState<'fields' | 'blocks'>('fields')

  const tabs: { key: 'fields' | 'blocks'; label: string }[] = [
    { key: 'fields', label: 'Contenido' },
    { key: 'blocks', label: 'Editor avanzado' },
  ]

  return (
    <div className="min-h-screen" style={{ background: BG, color: INK }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-0 pb-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-2" style={{ color: `${GOLD}99` }}>
              Editar página
            </p>
            <h1 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: INK }}>
              {pageLabel}
            </h1>
          </div>
          <a
            href={previewPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2.5 rounded-xl transition self-start sm:mb-2"
            style={{ border: `1px solid ${BORDER}`, color: MUTED }}
          >
            Vista previa ↗
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 md:px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition rounded-t-xl"
              style={{
                background: tab === t.key ? CARD : 'transparent',
                color: tab === t.key ? INK : MUTED,
                borderBottom: tab === t.key ? `2px solid ${GOLD}` : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {tab === 'fields' ? (
          <PageFieldsEditor page={page} initialValues={initialValues} hasBlocks={initialBlocks.length > 0} />
        ) : (
          <PageBuilder
            page={page}
            pageLabel={pageLabel}
            initialBlocks={initialBlocks}
            previewPath={previewPath}
          />
        )}
      </div>
    </div>
  )
}
