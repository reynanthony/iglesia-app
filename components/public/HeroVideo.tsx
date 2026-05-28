import { detectSocialEmbed } from '@/lib/social-embed'

/**
 * Renders hero background video for any URL type:
 * - YouTube / Vimeo  → iframe embed (autoplay, muted, loop, no controls)
 * - Direct file URL  → <video> tag (mp4, webm, etc.)
 */
export function HeroVideo({ url, opacity = 0.60 }: { url: string; opacity?: number }) {
  const embed = detectSocialEmbed(url)

  if (embed?.platform === 'youtube') {
    const ytId = embed.embedUrl.replace('https://www.youtube.com/embed/', '').split('?')[0]
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1`}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '300%', height: '300%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
          }}
          allow="autoplay; encrypted-media"
        />
      </div>
    )
  }

  if (embed?.platform === 'vimeo') {
    const vimeoId = embed.embedUrl.replace('https://player.vimeo.com/video/', '')
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          allow="autoplay; encrypted-media"
        />
      </div>
    )
  }

  // Direct file URL (mp4, webm, etc.)
  return (
    <video autoPlay muted loop playsInline
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity }}>
      <source src={url} type="video/mp4" />
      <source src={url} type="video/webm" />
    </video>
  )
}
