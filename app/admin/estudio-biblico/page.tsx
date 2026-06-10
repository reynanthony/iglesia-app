import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, BookOpen, ChevronRight } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = { active: 'En curso', upcoming: 'Próximamente', archived: 'Completada' }
const STATUS_COLOR: Record<string, string> = { active: '#76ABAE', upcoming: '#869B7E', archived: '#94A3B8' }

export default async function EstudioBiblicoAdminPage() {
  const supabase = await createClient()
  const { data: series } = await supabase
    .from('bible_study_series')
    .select('id, title, slug, book, theme, cover_color, status, order_index, is_active, bible_study_sessions(count)')
    .order('order_index')

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#F6F3EB' }}>Estudio Bíblico</h1>
            <p className="text-xs md:text-sm mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              {series?.length ?? 0} series
            </p>
          </div>
          <Link href="/admin/estudio-biblico/nueva"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition flex-shrink-0"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={13} /><span className="hidden sm:inline">Nueva serie</span><span className="sm:hidden">Nueva</span>
          </Link>
        </div>

        {!series || series.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <BookOpen size={28} style={{ color: 'rgba(246,243,235,0.20)', margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'rgba(246,243,235,0.68)' }}>No hay series todavía.</p>
            <Link href="/admin/estudio-biblico/nueva"
              className="inline-flex items-center gap-1 mt-3 text-sm font-bold"
              style={{ color: '#76ABAE' }}>
              <Plus size={13} /> Crear primera serie
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            {series.map((s: any) => {
              const sessionCount = (s.bible_study_sessions as any)?.[0]?.count ?? 0
              const color = s.cover_color || '#76ABAE'
              return (
                <Link key={s.id} href={`/admin/estudio-biblico/${s.id}`}
                  className="flex items-center gap-3 md:gap-4 px-3.5 md:px-5 py-3.5 md:py-4 border-b transition hover:bg-[#0D3352]"
                  style={{ borderColor: '#0D3352', textDecoration: 'none' }}>
                  <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm truncate" style={{ color: '#F6F3EB' }}>{s.title}</p>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${STATUS_COLOR[s.status]}20`, color: STATUS_COLOR[s.status] }}>
                        {STATUS_LABEL[s.status] ?? s.status}
                      </span>
                      {!s.is_active && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>
                          Oculta
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(246,243,235,0.68)' }}>
                      {s.book} · {sessionCount} sesiones
                    </p>
                  </div>
                  <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.25)', flexShrink: 0 }} />
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
