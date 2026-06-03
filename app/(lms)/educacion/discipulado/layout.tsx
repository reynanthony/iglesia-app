export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#061E30', minHeight: '100dvh', color: '#F6F3EB' }}>
      {children}
    </div>
  )
}
