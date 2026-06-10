import { createClient } from '@/lib/supabase/server'
import { AlertTriangle } from 'lucide-react'
import DeletePostButton from '@/components/admin/DeletePostButton'

export default async function AdminReportesPage() {
  const supabase = await createClient()

  const { data: reports } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:reporter_id(full_name, username),
      post:post_id(id, content, profiles(full_name, username))
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(248,113,113,0.12)' }}>
            <AlertTriangle size={15} style={{ color: '#F87171' }} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Reportes</h1>
            <p className="text-xs md:text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>
              {reports?.length ?? 0} reportes recibidos
            </p>
          </div>
        </div>

        {!reports || reports.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(246,243,235,0.68)' }}>
            <p className="text-2xl mb-2">✅</p>
            <p className="text-sm">Sin reportes pendientes</p>
          </div>
        ) : (
          <div className="space-y-2.5 md:space-y-3">
            {reports.map((report: any) => (
              <div key={report.id}
                className="rounded-xl md:rounded-2xl p-3.5 md:p-5"
                style={{ background: '#0B2D47', border: '1px solid rgba(248,113,113,0.20)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(248,113,113,0.12)', color: '#F87171' }}>
                        @{report.reporter?.username}
                      </span>
                      <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.55)' }}>
                        {new Date(report.created_at).toLocaleDateString('es-DO')}
                      </span>
                    </div>
                    <p className="text-xs mb-1.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
                      Post de <span style={{ color: 'rgba(246,243,235,0.70)' }}>@{report.post?.profiles?.username}</span>
                    </p>
                    <p className="text-sm leading-relaxed line-clamp-2 px-3 py-2 rounded-lg"
                      style={{ background: '#0D3352', color: 'rgba(246,243,235,0.70)' }}>
                      {report.post?.content}
                    </p>
                  </div>
                  {report.post && (
                    <div className="flex-shrink-0">
                      <DeletePostButton postId={report.post.id} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
