'use client'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'

export type TitleAnimation = 'none' | 'fade-up' | 'reveal' | 'split' | 'gradient'

const KEYFRAMES = `
@keyframes _hFU{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes _hRV{from{clip-path:inset(0 0 100% 0);transform:translateY(6px)}to{clip-path:inset(0 0 0% 0);transform:translateY(0)}}
@keyframes _hSL{from{opacity:0;transform:translateX(-22px)}to{opacity:1;transform:translateX(0)}}
@keyframes _hGR{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
`

interface HeroTitleProps {
  children: ReactNode
  animation?: TitleAnimation | null
  color?: string
  accentColor?: string
  style?: CSSProperties
  className?: string
}

export function HeroTitle({ children, animation, color, accentColor, style, className }: HeroTitleProps) {
  const [active, setActive] = useState(false)
  const anim = (animation ?? 'none') as TitleAnimation

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 80)
    return () => clearTimeout(t)
  }, [])

  let finalStyle: CSSProperties

  if (anim === 'gradient') {
    const c1 = color ?? '#FFFFFF'
    const c2 = accentColor ?? '#76ABAE'
    finalStyle = {
      ...style,
      backgroundImage: `linear-gradient(90deg, ${c1} 0%, ${c2} 35%, ${c1} 60%, ${c2} 100%)`,
      backgroundSize: '200% auto',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: '_hGR 5s linear infinite',
    }
  } else if (!active && anim !== 'none') {
    finalStyle = { ...style, color, opacity: 0 }
  } else if (active && anim === 'fade-up') {
    finalStyle = { ...style, color, animation: '_hFU 0.75s cubic-bezier(.22,1,.36,1) both' }
  } else if (active && anim === 'reveal') {
    finalStyle = { ...style, color, animation: '_hRV 0.85s cubic-bezier(.22,1,.36,1) both' }
  } else if (active && anim === 'split') {
    finalStyle = { ...style, color, animation: '_hSL 0.75s cubic-bezier(.22,1,.36,1) both' }
  } else {
    finalStyle = { ...style, color }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <h1 className={className} style={finalStyle}>
        {children}
      </h1>
    </>
  )
}
