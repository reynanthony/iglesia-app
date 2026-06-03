import Link from 'next/link'
import { ArrowRight, ArrowLeft, Users, Heart, BookOpen, Droplets, HandHeart, UserCheck, Crown, GraduationCap, ChevronRight, Lock, BookMarked } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const STAGE_META = [
  { icon: Users,     color: '#94A3B8' },
  { icon: Heart,     color: '#86EFAC' },
  { icon: BookOpen,  color: '#6EE7B7' },
  { icon: Droplets,  color: '#60A5FA' },
  { icon: HandHeart, color: '#C084FC' },
  { icon: UserCheck, color: '#F59E0B' },
  { icon: Crown,     color: '#F87171' },
]

export default async function DiscipuladoPage() {
  const supabase = await createClient()

  const [{ data: dbStages }, { data: programs }] = await Promise.all([
    supabase.from('discipleship_stages').select('id, name, order_index, color, description').order('order_index'),
    supabase.from('discipleship_programs')
      .select('id, title, slug, description, required_stage_id, discipleship_courses(id, title, level, is_active)')
      .eq('is_active', true)
      .order('order_index'),
  ])

  const hasContent = (programs ?? []).length > 0

  const programsByStage = new Map<string, any[]>()
  for (const p of programs ?? []) {
    if (!p.required_stage_id) continue
    const arr = programsByStage.get(p.required_stage_id) ?? []
    arr.push(p)
    programsByStage.set(p.required_stage_id, arr)
  }

  const openPrograms = (programs ?? []).filter((p: any) => !p.required_stage_id)

  const stages = (dbStages ?? []).map((s: any, i: number) => ({
    ...s,
    icon: STAGE_META[i]?.icon ?? GraduationCap,
    color: s.color || STAGE_META[i]?.color || TEAL,
    programs: programsByStage.get(s.id) ?? [],
  }))

  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '80vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 55% 70% at 85% 40%, ${TEAL}12, transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter"
            style={{ fontSize: 'clamp(14rem, 30vw, 28rem)', opacity: 0.05, color: TEAL, lineHeight: 1 }}>
            VII
          </span>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 md:pt-40 md:pb-24 flex flex-col justify-end"
          style={{ minHeight: '80vh' }}>
          <Link href="/educacion"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 transition"
            style={{ color: `${TEAL}60` }}>
            <ArrowLeft size={11} /> Educación
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-px h-10" style={{ background: TEAL }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
                  Discipulado · 7 etapas de crecimiento
                </p>
              </div>
              <h1 className="font-display font-black tracking-tighter text-white mb-6"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
                Crecer<br />en<br /><em style={{ color: TEAL }}>Cristo.</em>
              </h1>
            </div>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: 'rgba(246,243,235,0.55)' }}>
                El discipulado no es un evento — es un proceso. Siete etapas diseñadas para llevar a cada persona desde el primer encuentro con Dios hasta el liderazgo pleno en su comunidad.
              </p>
              <Link href="/registro"
                className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition"
                style={{ background: TEAL, color: NAVY }}>
                Iniciar mi camino <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LAS 7 ETAPAS CON SUS PROGRAMAS */}
      <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— El camino completo</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Cada etapa,<br />su formación.
              </h2>
            </div>
            <p className="hidden md:block text-sm max-w-xs text-right leading-relaxed" style={{ color: `${NAVY}55` }}>
              Cada etapa del camino tiene programas y cursos específicos diseñados para ese momento de la vida espiritual.
            </p>
          </div>

          {!hasContent && (
            <div className="mb-8 p-4 rounded-xl flex items-start gap-3"
              style={{ background: `${NAVY}08`, border: `1px dashed ${NAVY}25` }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black"
                style={{ background: NAVY, color: CREAM }}>i</div>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: NAVY }}>Contenido en preparación</p>
                <p className="text-xs leading-relaxed" style={{ color: `${NAVY}60` }}>
                  Los programas de formación serán publicados próximamente. Podés{' '}
                  <Link href="/contacto" className="underline" style={{ color: NAVY }}>contactarnos</Link>
                  {' '}para más información.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stages.map((stage: any) => {
              const Icon = stage.icon
              const color = stage.color
              const stagePrograms = stage.programs

              return (
                <div key={stage.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: '#243D52',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderLeft: `4px solid ${color}`,
                  }}>

                  {/* Stage header */}
                  <div className="flex items-start gap-5 px-5 md:px-7 py-5 md:py-6">
                    <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <Icon size={20} style={{ color }} strokeWidth={1.8} />
                      </div>
                      <span className="text-[8px] font-black tracking-widest"
                        style={{ color: `${color}55` }}>
                        {String(stage.order_index).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3 className="font-black text-lg md:text-xl tracking-tight" style={{ color: CREAM }}>
                          {stage.name}
                        </h3>
                        {stage.order_index === 1 && (
                          <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: `${TEAL}25`, color: TEAL }}>
                            Punto de entrada
                          </span>
                        )}
                        {stage.order_index === 7 && (
                          <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: `${color}25`, color }}>
                            Meta
                          </span>
                        )}
                        {stagePrograms.length > 0 && (
                          <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: `${color}18`, color: `${color}CC` }}>
                            {stagePrograms.length} programa{stagePrograms.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.78)' }}>
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Programs */}
                  {stagePrograms.length > 0 && (
                    <div style={{ borderTop: `1px solid rgba(255,255,255,0.07)`, background: 'rgba(0,0,0,0.18)' }}>
                      <div className="px-5 md:px-7 pt-4 pb-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em]"
                          style={{ color: `${color}70` }}>
                          Programas recomendados
                        </p>
                      </div>
                      <div className="px-4 md:px-5 pb-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stagePrograms.map((p: any) => {
                          const activeCourses = (p.discipleship_courses ?? []).filter((c: any) => c.is_active)
                          return (
                            <Link key={p.id} href={`/educacion/discipulado/${p.slug}`}
                              className="group flex items-start gap-3 p-4 rounded-xl transition hover:brightness-125"
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                              }}>
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                                <BookMarked size={15} style={{ color }} strokeWidth={1.8} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-sm leading-tight mb-1" style={{ color: CREAM }}>
                                  {p.title}
                                </p>
                                {p.description && (
                                  <p className="text-[11px] leading-relaxed line-clamp-2 mb-2"
                                    style={{ color: 'rgba(246,243,235,0.62)' }}>
                                    {p.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: `${color}18`, color: `${color}CC` }}>
                                    {activeCourses.length} curso{activeCourses.length !== 1 ? 's' : ''}
                                  </span>
                                  {activeCourses.slice(0, 2).map((c: any) => (
                                    <span key={c.id} className="text-[10px] px-2 py-0.5 rounded-full"
                                      style={{ background: 'rgba(246,243,235,0.09)', color: 'rgba(246,243,235,0.55)' }}>
                                      {c.title}
                                    </span>
                                  ))}
                                  {activeCourses.length > 2 && (
                                    <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.30)' }}>
                                      +{activeCourses.length - 2}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight size={13}
                                className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                                style={{ color: 'rgba(246,243,235,0.25)' }} />
                            </Link>
                          )
                        })}
                      </div>
                      <div className="px-5 md:px-7 pb-4 flex items-center gap-2">
                        <Lock size={10} style={{ color: 'rgba(246,243,235,0.22)', flexShrink: 0 }} />
                        <p className="text-[10px]" style={{ color: 'rgba(246,243,235,0.28)' }}>
                          El contenido completo requiere una cuenta gratuita ·{' '}
                          <Link href={`/educacion/discipulado/${stagePrograms[0]?.slug}`}
                            className="underline hover:opacity-80"
                            style={{ color: `${color}80` }}>
                            ver programa
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}

                  {stagePrograms.length === 0 && (
                    <div className="px-5 md:px-7 pb-5 pt-0">
                      <p className="text-xs italic" style={{ color: 'rgba(246,243,235,0.22)' }}>
                        Próximamente.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PROGRAMAS LIBRES */}
      {openPrograms.length > 0 && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Para todos</p>
            <h2 className="font-display font-black tracking-tighter mb-8"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 0.95, color: NAVY }}>
              Programas disponibles para todos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {openPrograms.map((p: any) => {
                const activeCourses = (p.discipleship_courses ?? []).filter((c: any) => c.is_active)
                return (
                  <Link key={p.id} href={`/educacion/discipulado/${p.slug}`}
                    className="group flex items-start gap-4 p-5 rounded-2xl transition"
                    style={{ background: NAVY, border: `1px solid ${NAVY}`, borderLeft: `4px solid ${TEAL}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}35` }}>
                      <GraduationCap size={18} style={{ color: TEAL }} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm mb-1" style={{ color: CREAM }}>{p.title}</p>
                      {p.description && (
                        <p className="text-[11px] leading-relaxed line-clamp-2 mb-2"
                          style={{ color: 'rgba(246,243,235,0.45)' }}>
                          {p.description}
                        </p>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${TEAL}18`, color: `${TEAL}CC` }}>
                        {activeCourses.length} curso{activeCourses.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.25)', flexShrink: 0, marginTop: 4 }}
                      className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* MENTORÍA */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6" style={{ color: SAGE }}>— Mentoría personal</p>
              <h2 className="font-display font-black tracking-tighter mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Nadie crece<br />solo.
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: `${NAVY}70` }}>
                Cada etapa del discipulado incluye una relación de mentoría — un creyente más maduro que camina contigo, te hace preguntas difíciles, te celebra en los logros y te sostiene en los momentos difíciles.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: `${NAVY}70` }}>
                Cuando llegas a la etapa 6, ya no solo eres discípulo — también comienzas a discipular a otro. Así se multiplica el Reino.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/contacto"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition self-start"
                  style={{ background: NAVY, color: CREAM }}>
                  Quiero un mentor <ArrowRight size={12} />
                </Link>
                <Link href="/registro"
                  className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition self-start"
                  style={{ border: `1px solid ${NAVY}30`, color: `${NAVY}70` }}>
                  Unirme a la comunidad
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Relación 1a1', value: 'con tu mentor' },
                { label: 'Frecuencia',  value: 'Quincenal o mensual' },
                { label: 'Duración',    value: 'Sin límite de tiempo' },
                { label: 'Resultado',   value: 'Multiplicación' },
              ].map(({ label, value }) => (
                <div key={label} className="p-6 rounded-2xl" style={{ background: NAVY }}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: `${TEAL}80` }}>{label}</p>
                  <p className="font-black text-base leading-tight" style={{ color: CREAM }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: '#051828' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10"
            style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.20)' }}>
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: `${TEAL}70` }}>
                Comenzá hoy
              </p>
              <h3 className="font-black text-2xl text-white tracking-tight mb-3">
                Tu camino de discipulado te espera
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Creá una cuenta, conocé tu etapa actual y accedé a los programas y cursos diseñados para vos.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
              <Link href="/registro"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-wider transition"
                style={{ background: TEAL, color: NAVY }}>
                Crear cuenta gratis <ArrowRight size={13} />
              </Link>
              <Link href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.55)' }}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
