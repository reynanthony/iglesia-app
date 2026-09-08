import type { LucideIcon } from 'lucide-react'

export function GoldArt({
  uid, light, dark, icon: Icon, iconSize = 30,
}: {
  uid: string
  light: string
  dark: string
  icon: LucideIcon
  iconSize?: number
}) {
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`ga-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={light} />
            <stop offset="1" stopColor={dark} />
          </linearGradient>
          <filter id={`gs-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <circle cx="26" cy="70" r="25" fill={dark} opacity="0.5" />
        <circle cx="80" cy="24" r="14" fill={light} opacity="0.35" />
        <rect x="19" y="13" width="60" height="60" rx="19" fill={`url(#ga-${uid})`} filter={`url(#gs-${uid})`} />
      </svg>
      <Icon
        size={iconSize}
        strokeWidth={2.3}
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 text-white"
        style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))' }}
      />
    </div>
  )
}
