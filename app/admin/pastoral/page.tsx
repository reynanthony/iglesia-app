import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageSquare, BookOpen, Video, HelpCircle, ChevronRight } from 'lucide-react'

const SECTIONS = [
  {
    href: '/admin/pastoral/mensajes',
    icon: MessageSquare,
    label: 'Canal del Pastor',
    desc: 'Mensajes exclusivos para la comunidad',
    table: 'pastoral_messages',
  },
  {
    href: '/admin/pastoral/reflexiones',
    icon: BookOpen,
    label: 'Reflexiones',
    desc: 'Contenido corto: texto, audio, video',
    table: 'pastoral_reflections',
  },
  {
    href: '/admin/pastoral/encuentros',
    icon: Video,
    label: 'Encuentros en Vivo',
    desc: 'Clases, mentorías y conversatorios',
    table: 'pastoral_encounters',
  },
  {
    href: '/admin/pastoral/preguntas',
    icon: HelpCircle,
    label: 'Preguntas al Pastor',
    desc: 'Responder preguntas de la comunidad',
    table: 'pastoral_questions',
  },
]

export default async function AdminPastoralPage() {
  const supabase = await createClient()
  const counts = await Promise.all(
    SECTIONS.map(s =>
      supabase.from(s.table as 'pastoral_messages').select('*', { count: 'exact', head: true })
        .then(({ count }) => count ?? 0)
    )
  )

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5">
          <h1 className="font-bold text-lg text-white">Pastoral Room</h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
            Panel de gestión del espacio pastoral
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SECTIONS.map(({ href, icon: Icon, label, desc }, i) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 p-5 rounded-2xl border transition hover:border-[#76ABAE]/40"
              style={{ background: '#0B2D47', borderColor: '#0D3352' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#061E30' }}>
                <Icon size={18} style={{ color: '#76ABAE' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white">{label}</p>
                <p className="text-[12px] mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>{desc}</p>
                <p className="text-[11px] mt-1 font-bold" style={{ color: 'rgba(118,171,174,0.60)' }}>
                  {counts[i]} {counts[i] === 1 ? 'elemento' : 'elementos'}
                </p>
              </div>
              <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.25)', flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
