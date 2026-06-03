'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

const cycle = { system: 'light', light: 'dark', dark: 'system' } as const

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  const next = cycle[theme as keyof typeof cycle] ?? 'system'
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <button
      onClick={() => setTheme(next)}
      className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      aria-label="Cambiar tema"
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  )
}
