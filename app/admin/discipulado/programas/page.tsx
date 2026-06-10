import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, BookOpen, ChevronRight } from 'lucide-react'

export default async function ProgramasAdminPage() {
  const supabase = await createClient()

  const [{ data: programs }, { data: stages }] = await Promise.all([
    supabase
      .from('discipleship_programs')
      .select('*, discipleship_stages(name, color), discipleship_courses(id)')
      .order('order_index'),
    supabase.from('discipleship_stages').select('id, name, color').order('order_index'),
  ])

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: 'rgba(246,243,235,0.62)' }}>
              <Link href="/admin/discipulado" className="hover:underline">Discipulado</Link>
              <span>/</span>
              <span>Programas</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#F6F3EB' }}>Programas</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              {programs?.length ?? 0} programa{programs?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/admin/discipulado/programas/nuevo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition"
            style={{ background: '#F6F3EB', color: '#061E30' }}
          >
            <Plus size={15} />
            Nuevo programa
          </Link>
        </div>

        {/* Lista */}
        {!programs || programs.length === 0 ? (
          <div className="rounded-2xl py-16 text-center" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <BookOpen size={32} style={{ color: 'rgba(118,171,174,0.40)', margin: '0 auto 12px' }} />
            <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>Sin programas todavía</p>
            <p className="text-xs mt-1 mb-4" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Crea el primer programa de formación
            </p>
            <Link
              href="/admin/discipulado/programas/nuevo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}
            >
              <Plus size={14} /> Crear programa
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {programs.map((p: any) => {
              const stage = p.discipleship_stages
              const courseCount = p.discipleship_courses?.length ?? 0
              return (
                <Link
                  key={p.id}
                  href={`/admin/discipulado/programas/${p.id}`}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl transition hover:brightness-110"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(118,171,174,0.12)', border: '1px solid rgba(118,171,174,0.20)' }}
                  >
                    <BookOpen size={18} style={{ color: '#76ABAE' }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate" style={{ color: '#F6F3EB' }}>{p.title}</p>
                      {!p.is_active && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(248,113,113,0.12)', color: '#F87171' }}>
                          Inactivo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs" style={{ color: 'rgba(246,243,235,0.68)' }}>
                        {courseCount} curso{courseCount !== 1 ? 's' : ''}
                      </span>
                      {stage && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${stage.color}18`, color: stage.color }}>
                          Desde: {stage.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={16} style={{ color: 'rgba(246,243,235,0.25)', flexShrink: 0 }} />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
