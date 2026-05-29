import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'

const STAGE_CONTENT: Record<number, { next: string; description: string }> = {
  1: {
    description: 'Estás conociendo la comunidad y dando tus primeros pasos en la fe. ¡Bienvenido!',
    next: 'Asiste regularmente a los cultos y conéctate con alguien del equipo de bienvenida.',
  },
  2: {
    description: 'Has comenzado un camino de fe genuino. Esta es la etapa más emocionante.',
    next: 'Completa el curso de Fundamentos de Fe y únete a un grupo pequeño.',
  },
  3: {
    description: 'Estás aprendiendo las bases bíblicas que sostienen tu vida cristiana.',
    next: 'Termina el estudio de Fundamentos y habla con un pastor sobre el bautismo.',
  },
  4: {
    description: 'Has declarado públicamente tu fe a través del bautismo. ¡Qué momento tan especial!',
    next: 'Identifica tus dones espirituales y encuentra un área de servicio en la iglesia.',
  },
  5: {
    description: 'Estás sirviendo activamente y usando tus dones para edificar a la comunidad.',
    next: 'Comienza a acompañar a alguien más joven en la fe como mentor informal.',
  },
  6: {
    description: 'Estás acompañando a otros en su camino, multiplicando lo que has recibido.',
    next: 'Prepárate para asumir un rol de liderazgo formal dentro de la iglesia.',
  },
  7: {
    description: 'Eres un líder maduro que guía y equipa a otros con propósito y sabiduría.',
    next: 'Continúa formando nuevos líderes y multiplica el discipulado.',
  },
}

export default async function DiscipuladoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: discipleship }, { data: stages }] = await Promise.all([
    supabase
      .from('user_discipleship')
      .select('*, discipleship_stages(*)')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('discipleship_stages')
      .select('*')
      .order('order_index'),
  ])

  const currentStage = (discipleship?.discipleship_stages as any) ?? null
  const sorted       = (stages ?? []).sort((a: any, b: any) => a.order_index - b.order_index)
  const content      = currentStage ? STAGE_CONTENT[currentStage.order_index] : null

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: '#0D3352' }}>
            <BookOpen size={18} style={{ color: '#76ABAE' }} />
          </div>
          <h1 className="font-black tracking-tighter"
            style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
            Mi camino de<br /><span style={{ color: '#76ABAE' }}>Discipulado.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {currentStage ? (
          <>
            {/* Etapa actual */}
            <div className="p-6 rounded-2xl" style={{ background: '#0B2D47', border: `1px solid ${currentStage.color}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: `${currentStage.color}20`, color: currentStage.color, border: `2px solid ${currentStage.color}` }}>
                  {currentStage.order_index}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em]"
                    style={{ color: 'rgba(246,243,235,0.35)' }}>
                    Etapa actual
                  </p>
                  <p className="font-black text-xl tracking-tight" style={{ color: currentStage.color }}>
                    {currentStage.name}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.65)' }}>
                {content?.description}
              </p>
            </div>

            {/* Progreso */}
            <div className="p-5 rounded-2xl" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-4"
                style={{ color: 'rgba(118,171,174,0.60)' }}>
                Progreso
              </p>
              <div className="flex items-center mb-4">
                {sorted.map((stage: any, i: number) => {
                  const isCurrent = stage.id === currentStage.id
                  const isDone    = stage.order_index < currentStage.order_index
                  const isLast    = i === sorted.length - 1
                  return (
                    <div key={stage.id} className="flex items-center" style={{ flex: isLast ? 'none' : 1 }}>
                      <div title={stage.name}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
                        style={{
                          background: isCurrent ? stage.color : isDone ? `${stage.color}40` : '#0D3352',
                          border: isCurrent ? `2px solid ${stage.color}` : isDone ? `1px solid ${stage.color}40` : '1px solid #1A4A6E',
                          color: isCurrent ? '#061E30' : isDone ? stage.color : 'rgba(246,243,235,0.20)',
                        }}>
                        {stage.order_index}
                      </div>
                      {!isLast && (
                        <div className="h-0.5 flex-1 mx-1"
                          style={{ background: isDone ? `${stage.color}40` : '#0D3352' }} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {sorted.map((stage: any) => (
                  <div key={stage.id} className="flex items-center gap-2 py-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: stage.id === currentStage.id ? stage.color : stage.order_index < currentStage.order_index ? `${stage.color}60` : '#0D3352' }} />
                    <span className="text-[11px] truncate"
                      style={{ color: stage.id === currentStage.id ? stage.color : 'rgba(246,243,235,0.35)' }}>
                      {stage.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Siguiente paso */}
            {content?.next && currentStage.order_index < 7 && (
              <div className="p-5 rounded-2xl" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
                  style={{ color: 'rgba(118,171,174,0.60)' }}>
                  Siguiente paso
                </p>
                <div className="flex items-start gap-3">
                  <ChevronRight size={16} style={{ color: '#76ABAE', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.65)' }}>
                    {content.next}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <BookOpen size={28} style={{ color: 'rgba(118,171,174,0.40)' }} />
            </div>
            <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>
              Sin etapa asignada
            </p>
            <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(246,243,235,0.45)' }}>
              Un pastor o líder puede asignarte tu etapa de discipulado desde el panel de administración.
            </p>
          </div>
        )}

        {/* Sobre el programa */}
        <div className="p-5 rounded-2xl" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
            style={{ color: 'rgba(118,171,174,0.60)' }}>
            El programa
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.50)' }}>
            El camino de discipulado de El Manantial tiene 7 etapas de crecimiento espiritual, desde el primer contacto con la iglesia hasta el liderazgo maduro. Tu progreso es guiado por pastores y líderes.
          </p>
        </div>

      </div>
    </div>
  )
}
