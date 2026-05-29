'use client'

import { useState } from 'react'
import PageFieldsEditor from '@/components/admin/PageFieldsEditor'
import PageBuilder from '@/components/admin/PageBuilder'
import type { Block } from '@/lib/blocks'

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
    <div className="min-h-screen" style={{ background: '#061E30', color: '#F6F3EB' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #0D3352' }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-0 pb-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-2" style={{ color: 'rgba(118,171,174,0.6)' }}>
              Editar página
            </p>
            <h1 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: '#F6F3EB' }}>
              {pageLabel}
            </h1>
          </div>
          <a
            href={previewPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2.5 rounded-xl transition self-start sm:mb-2"
            style={{ border: '1px solid #0D3352', color: 'rgba(246,243,235,0.50)' }}
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
                background: tab === t.key ? '#0B2D47' : 'transparent',
                color: tab === t.key ? '#F6F3EB' : 'rgba(246,243,235,0.40)',
                borderBottom: tab === t.key ? '2px solid #76ABAE' : '2px solid transparent',
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
