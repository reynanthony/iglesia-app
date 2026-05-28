'use client'

import { ExternalLink } from 'lucide-react'
import type { SocialEmbed } from '@/lib/social-embed'
import { PLATFORM_LABEL } from '@/lib/social-embed'

const PLATFORM_ICON: Record<string, string> = {
  youtube: '▶',
  facebook: 'f',
  instagram: '◎',
  tiktok: '♪',
}

export default function SocialEmbedCard({ embed }: { embed: SocialEmbed }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #0D3352', background: '#0B2D47' }}>
      {/* iframe player */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: embed.aspectPadding, height: 0 }}>
        <iframe
          src={embed.embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          style={{ border: 'none' }}
        />
      </div>

      {/* footer bar */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderTop: '1px solid #0D3352' }}>
        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
          style={{ background: '#0D3352', color: 'rgba(246,243,235,0.50)' }}>
          {PLATFORM_ICON[embed.platform]} {PLATFORM_LABEL[embed.platform]}
        </span>
        <a
          href={embed.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-[10px] font-bold transition"
          style={{ color: 'rgba(246,243,235,0.40)' }}
          title="Abrir en la plataforma"
        >
          <ExternalLink size={11} />
          <span className="hidden sm:inline">Abrir</span>
        </a>
      </div>
    </div>
  )
}
