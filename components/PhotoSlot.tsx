import { ImageIcon } from 'lucide-react'

interface PhotoSlotProps {
  src?: string | null
  alt?: string
  aspectRatio?: string
  hint?: string
  className?: string
  overlay?: boolean
}

/**
 * Contenedor de fotografía con tratamiento visual consistente.
 * - Con imagen: object-cover + hover scale + overlay suave
 * - Sin imagen: placeholder cálido arena con acento dorado
 */
export default function PhotoSlot({
  src,
  alt = '',
  aspectRatio = '4/3',
  hint,
  className = '',
  overlay = true,
}: PhotoSlotProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ aspectRatio, background: src ? '#1A1A1A' : '#EDE8DF' }}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
            draggable={false}
          />
          {overlay && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 40%)' }}
            />
          )}
          {/* Línea de acento en la base */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#1B7A5E' }} />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(27,122,94,0.12)', border: '1px solid rgba(27,122,94,0.25)' }}
          >
            <ImageIcon size={20} style={{ color: '#1B7A5E' }} strokeWidth={1.4} />
          </div>
          {hint && (
            <p className="text-xs leading-snug" style={{ color: '#A89878', maxWidth: 160 }}>
              {hint}
            </p>
          )}
          {/* Línea de acento en la base */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(27,122,94,0.35)' }} />
        </div>
      )}
    </div>
  )
}
