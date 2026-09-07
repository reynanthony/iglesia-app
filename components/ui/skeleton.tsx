// Bloque de carga reutilizable — reemplaza el "pantalla en blanco" que
// dejaban las rutas con fetch server-side pesado y sin loading.tsx.
export function Skeleton({
  className = '',
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: 'rgba(118,171,174,0.12)', ...style }}
      aria-hidden="true"
    />
  )
}
