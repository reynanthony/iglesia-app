// Panel de marca compartido entre /login y /registro — mismo lenguaje visual
// (numeral fantasma, cruz, Playfair Display, cita bíblica) para que ambos
// pasos del mismo flujo se sientan como un solo producto.

export default function AuthBrandPanel({
  quote,
  cite,
  eyebrow = 'Comunidad de fe',
  watermark = 'FE',
}: {
  quote: string
  cite: string
  eyebrow?: string
  watermark?: string
}) {
  return (
    <div
      className="relative flex-[2] lg:flex-none lg:w-1/2 flex flex-col items-center justify-center px-8 py-3 lg:px-10 lg:py-16 overflow-hidden"
      style={{ background: '#101217' }}
    >
      {/* Grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #8B92A2 0px, #8B92A2 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #8B92A2 0px, #8B92A2 1px, transparent 1px, transparent 80px)',
        }}
      />
      {/* Número decorativo */}
      <div
        className="pointer-events-none absolute select-none font-black leading-none tracking-tighter"
        style={{
          fontSize: 'clamp(10rem, 22vw, 20rem)',
          color: '#8B92A2',
          opacity: 0.06,
          bottom: '-4rem',
          left: '-2rem',
          lineHeight: 1,
          fontFamily: 'Georgia, serif',
        }}
        aria-hidden
      >
        {watermark}
      </div>

      {/* Contenido central */}
      <div className="relative flex flex-col items-center text-center z-10 max-w-xs">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <line
              key={i}
              x1="24"
              y1="24"
              x2={24 + 18 * Math.cos((deg * Math.PI) / 180)}
              y2={24 + 18 * Math.sin((deg * Math.PI) / 180)}
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />
          ))}
          <rect x="21.5" y="9" width="5" height="30" rx="2" fill="#FFFFFF" />
          <rect x="9" y="18" width="30" height="5" rx="2" fill="#FFFFFF" />
        </svg>

        <h2
          className="font-black tracking-tighter mt-2 mb-1 lg:mt-6 lg:mb-2"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: '#FFFFFF' }}
        >
          El Manantial
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3 lg:mb-8" style={{ color: '#8B92A2' }}>
          {eyebrow}
        </p>

        <div className="w-8 h-px mb-3 lg:mb-8" style={{ background: 'rgba(139,146,162,0.4)' }} />

        <blockquote className="text-sm leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.40)' }}>
          "{quote}"
        </blockquote>
        <cite className="text-[10px] font-bold uppercase tracking-widest mt-3 block not-italic" style={{ color: '#8B92A2', opacity: 0.9 }}>
          {cite}
        </cite>
      </div>
    </div>
  )
}
