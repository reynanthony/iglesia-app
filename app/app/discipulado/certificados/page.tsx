import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Award } from 'lucide-react'

export default async function CertificadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: certs } = await supabase
    .from('discipleship_certificates')
    .select(`
      id,
      issued_at,
      discipleship_programs(id, title, slug, description),
      profiles!discipleship_certificates_issued_by_fkey(full_name)
    `)
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(6,30,48,0.97)', borderBottom: '1px solid #0D3352', backdropFilter: 'blur(12px)' }}>
        <Link href="/app/discipulado" className="p-2 rounded-xl flex-shrink-0"
          style={{ background: '#0D3352', color: '#76ABAE' }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="font-black text-sm" style={{ color: '#F6F3EB' }}>Mis certificados</p>
          <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
            {certs?.length ?? 0} logro{certs?.length !== 1 ? 's' : ''} desbloqueado{certs?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {!certs || certs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <Award size={28} style={{ color: 'rgba(118,171,174,0.30)' }} />
            </div>
            <p className="font-black text-lg" style={{ color: '#F6F3EB' }}>Sin certificados aún</p>
            <p className="text-sm mt-2 max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Completa todos los cursos de un programa para obtener tu certificado digital
            </p>
            <Link href="/app/discipulado"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-black"
              style={{ background: '#0B2D47', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.25)' }}>
              Ver mis programas
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {certs.map((cert: any) => {
              const program   = cert.discipleship_programs
              const issuedBy  = (cert.profiles as any)?.full_name ?? null
              const issuedDate = new Date(cert.issued_at).toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric',
              })
              return (
                <div key={cert.id}
                  className="relative overflow-hidden rounded-2xl p-6"
                  style={{
                    background: 'linear-gradient(135deg, #0B2D47 0%, #0D3352 100%)',
                    border: '1px solid rgba(118,171,174,0.30)',
                  }}>
                  {/* Watermark */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Award size={90} style={{ color: 'rgba(118,171,174,0.05)' }} />
                  </div>

                  <div className="relative">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(118,171,174,0.15)', border: '1px solid rgba(118,171,174,0.30)' }}>
                        <Award size={22} style={{ color: '#76ABAE' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1"
                          style={{ color: 'rgba(118,171,174,0.55)' }}>
                          Certificado de finalización
                        </p>
                        <p className="font-black text-lg leading-tight" style={{ color: '#F6F3EB' }}>
                          {program?.title}
                        </p>
                        {program?.description && (
                          <p className="text-xs mt-1.5 leading-relaxed line-clamp-2"
                            style={{ color: 'rgba(246,243,235,0.72)' }}>
                            {program.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-5 pt-4"
                      style={{ borderTop: '1px solid rgba(118,171,174,0.12)' }}>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider"
                          style={{ color: 'rgba(246,243,235,0.55)' }}>
                          Emitido el
                        </p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: 'rgba(246,243,235,0.60)' }}>
                          {issuedDate}
                        </p>
                      </div>
                      {issuedBy && (
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-wider"
                            style={{ color: 'rgba(246,243,235,0.55)' }}>
                            Firmado por
                          </p>
                          <p className="text-xs font-bold mt-0.5" style={{ color: 'rgba(246,243,235,0.60)' }}>
                            {issuedBy}
                          </p>
                        </div>
                      )}
                      <div className="ml-auto">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(118,171,174,0.15)', color: '#76ABAE' }}>
                          Verificado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
