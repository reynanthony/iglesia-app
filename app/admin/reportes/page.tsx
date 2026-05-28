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
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-[#000000]/10 rounded-xl flex items-center justify-center">
          <AlertTriangle size={18} className="text-[#000000]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-[rgba(246,243,235,0.40)] text-sm">{reports?.length ?? 0} reportes recibidos</p>
        </div>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="text-center py-20 text-[rgba(246,243,235,0.40)]">
          <p className="text-3xl mb-3">✅</p>
          <p className="text-sm">Sin reportes pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report: any) => (
            <div key={report.id} className="bg-[#0B2D47] border border-[#0D3352] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-[#000000]/10 text-[#000000] px-2 py-0.5 rounded-full">
                      Reportado por @{report.reporter?.username}
                    </span>
                    <span className="text-xs text-[rgba(246,243,235,0.30)]">
                      {new Date(report.created_at).toLocaleDateString('es-DO')}
                    </span>
                  </div>
                  <p className="text-xs text-[rgba(246,243,235,0.40)] mb-1">
                    Post de <span className="text-[rgba(246,243,235,0.70)]">@{report.post?.profiles?.username}</span>
                  </p>
                  <p className="text-sm text-[rgba(246,243,235,0.70)] line-clamp-2 bg-[#0D3352] rounded-xl p-3">
                    {report.post?.content}
                  </p>
                </div>
                {report.post && <DeletePostButton postId={report.post.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}