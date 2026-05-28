import Image from 'next/image'

export default function LogoIcon({ size = 28 }: { size?: number }) {
  const w = Math.round(size * 0.876)
  return (
    <Image
      src="/logo-cream.png"
      alt="El Manantial"
      width={w}
      height={size}
      style={{ objectFit: 'contain' }}
      priority
    />
  )
}
