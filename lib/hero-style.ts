// Shared hero style helpers — used by public page heroes

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
  const bg = opts.bgColor || opts.defaultBg || '#051828'
  const sizeKey = (opts.titleSize as HeroTitleSize) ?? opts.defaultTitleSize ?? 'lg'
  const titleFontSize = TITLE_SIZES[sizeKey] ?? TITLE_SIZES.lg

  return {
    bg,
    titleFontSize,
    isLight,
    titleColor:    opts.titleColorHex    || (isLight ? '#FFFFFF'                    : '#093C5D'),
    accentColor:   opts.accentColorHex   || (isLight ? '#76ABAE'                    : '#0D4A72'),
    subtitleColor: opts.subtitleColorHex || (isLight ? 'rgba(246,243,235,0.58)'     : 'rgba(9,60,93,0.62)'),
    eyebrowColor:  opts.eyebrowColorHex  || (isLight ? 'rgba(118,171,174,0.75)'     : 'rgba(9,60,93,0.55)'),
    eyebrowLine:   opts.eyebrowColorHex  || (isLight ? '#76ABAE'                    : '#093C5D'),
    gridColor:     isLight ? '#76ABAE' : '#093C5D',
  }
}
