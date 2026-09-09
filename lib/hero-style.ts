// Shared hero style helpers — used by public page heroes
import { BG, CARD, MUTED, GOLD } from '@/lib/gold-theme'

export type HeroTextColor = 'light' | 'dark'
export type HeroTitleSize = 'sm' | 'md' | 'lg' | 'xl'

const TITLE_SIZES: Record<HeroTitleSize, string> = {
  sm: 'clamp(2.5rem, 7vw,  6rem)',
  md: 'clamp(3rem,   9vw,  8rem)',
  lg: 'clamp(3.5rem, 11vw, 10rem)',
  xl: 'clamp(3.5rem, 12vw, 11rem)',
}

export function heroStyle(opts: {
  textColor?: string | null
  bgColor?: string | null
  titleSize?: string | null
  defaultBg?: string
  defaultTitleSize?: HeroTitleSize
  titleColorHex?: string | null
  accentColorHex?: string | null
  subtitleColorHex?: string | null
  eyebrowColorHex?: string | null
}) {
  const isLight = (opts.textColor ?? 'light') !== 'dark'
  const bg = opts.bgColor || opts.defaultBg || BG
  const sizeKey = (opts.titleSize as HeroTitleSize) ?? opts.defaultTitleSize ?? 'lg'
  const titleFontSize = TITLE_SIZES[sizeKey] ?? TITLE_SIZES.lg

  return {
    bg,
    titleFontSize,
    isLight,
    titleColor:    opts.titleColorHex    || (isLight ? '#FFFFFF'                    : CARD),
    accentColor:   opts.accentColorHex   || (isLight ? GOLD                    : CARD),
    subtitleColor: opts.subtitleColorHex || (isLight ? MUTED     : 'rgba(16,18,23,0.62)'),
    eyebrowColor:  opts.eyebrowColorHex  || (isLight ? MUTED     : 'rgba(16,18,23,0.55)'),
    eyebrowLine:   opts.eyebrowColorHex  || (isLight ? MUTED                    : CARD),
    gridColor:     isLight ? MUTED : CARD,
  }
}
