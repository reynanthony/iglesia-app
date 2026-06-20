export type SocialPlatform = 'youtube' | 'vimeo' | 'facebook'

export interface SocialEmbed {
  platform: SocialPlatform
  originalUrl: string
  embedUrl: string
  /** aspect-ratio padding-bottom percentage for the iframe wrapper */
  aspectPadding: string
}

const YT_RE =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:\S*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i

const VIMEO_RE =
  /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/[^/]+\/)?(\d+)/i

const FB_RE =
  /https?:\/\/(?:www\.)?(?:facebook\.com\/(?:[^/\s]+\/videos\/\d+\/?|watch\/?\?(?:v|video)=\d+)|fb\.watch\/[A-Za-z0-9_-]+)/i

export function detectSocialEmbed(text: string): SocialEmbed | null {
  if (!text) return null

  const yt = text.match(YT_RE)
  if (yt) {
    return {
      platform: 'youtube',
      originalUrl: yt[0],
      embedUrl: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&enablejsapi=1`,
      aspectPadding: '56.25%',
    }
  }

  const vimeo = text.match(VIMEO_RE)
  if (vimeo) {
    return {
      platform: 'vimeo',
      originalUrl: vimeo[0],
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
      aspectPadding: '56.25%',
    }
  }

  const fb = text.match(FB_RE)
  if (fb) {
    const href = encodeURIComponent(fb[0])
    return {
      platform: 'facebook',
      originalUrl: fb[0],
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${href}&width=560&show_text=false&height=315&appId`,
      aspectPadding: '56.25%',
    }
  }

  return null
}

export const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  facebook: 'Facebook',
}

/** Retorna la URL de embed con parámetros de autoplay activados */
export function getAutoplayUrl(embed: SocialEmbed): string {
  switch (embed.platform) {
    case 'youtube':
      return `${embed.embedUrl}&autoplay=1&mute=1&playsinline=1`
    case 'vimeo':
      return `${embed.embedUrl}?autoplay=1&muted=1&loop=1&background=1`
    case 'facebook':
      return `${embed.embedUrl}&autoplay=true&muted=true`
    default:
      return embed.embedUrl
  }
}
