import { forwardRef } from 'react'

// Primitiva compartida — hasta ahora cada pantalla reimplementaba este mismo
// botón a mano (25+ archivos con la misma clase copiada). Nuevas pantallas
// deberían usar este componente en vez de repetir el patrón.
type Variant = 'primary' | 'accent' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const VARIANT_STYLE: Record<Variant, React.CSSProperties> = {
  primary: { background: '#093C5D', color: '#F6F3EB' },
  accent:  { background: '#76ABAE', color: '#093C5D' },
  ghost:   { background: 'transparent', color: 'rgba(246,243,235,0.70)', border: '1px solid rgba(118,171,174,0.25)' },
  danger:  { background: '#EF4444', color: '#FFFFFF' },
}

const SIZE_CLASS: Record<Size, string> = {
  sm: 'px-4 py-2 text-[10px] gap-1.5',
  md: 'px-6 py-3 text-[11px] gap-2',
}

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}>(function Button({ variant = 'primary', size = 'md', className = '', style, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/60 ${SIZE_CLASS[size]} ${className}`}
      style={{ ...VARIANT_STYLE[variant], ...style }}
      {...props}
    />
  )
})
