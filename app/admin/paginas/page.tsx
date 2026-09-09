import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Globe, ChevronRight, Home, Users, Mail, Calendar, Mic, Church, Smartphone, Layers, HandHeart, Radio, GraduationCap, Newspaper, Quote } from 'lucide-react'
import ResetPageButton from './ResetPageButton'
import { CARD, BORDER, MUTED, GOLD } from '@/lib/gold-theme'

const pagesMeta = [
  {
    key: 'home',
    label: 'Página de inicio',
    desc: 'Hero, horarios, versículo, evento principal, CTA',
    Icon: Home,
    group: 'Sitio web público',
  },
  {
    key: 'nosotros',
    label: 'Quiénes somos',
    desc: 'Historia, estadísticas, misión y visión',
    Icon: Users,
    group: 'Sitio web público',
  },
  {
    key: 'ministerios',
    label: 'Ministerios',
    desc: 'Página principal de ministerios',
    Icon: Church,
    group: 'Sitio web público',
  },
  {
    key: 'eventos',
    label: 'Eventos',
    desc: 'Cabecera y contenido editorial de la sección de eventos',
    Icon: Calendar,
    group: 'Sitio web público',
  },
  {
    key: 'predicas',
    label: 'Prédicas',
    desc: 'Cabecera y contenido editorial de la sección de mensajes',
    Icon: Mic,
    group: 'Sitio web público',
  },
  {
    key: 'contacto',
    label: 'Contacto',
    desc: 'Dirección, teléfono, correo, horarios de atención',
    Icon: Mail,
    group: 'Sitio web público',
  },
  {
    key: 'donaciones',
    label: 'Donaciones',
    desc: 'Cabecera, cuentas bancarias, Zelle y horarios',
    Icon: HandHeart,
    group: 'Sitio web público',
  },
  {
    key: 'oracion',
    label: 'Oración',
    desc: 'Cabecera y CTA del muro de oración público',
    Icon: HandHeart,
    group: 'Sitio web público',
  },
  {
    key: 'en-vivo',
    label: 'En Vivo',
    desc: 'Mensaje sin transmisión, horario y CTA',
    Icon: Radio,
    group: 'Sitio web público',
  },
  {
    key: 'educacion',
    label: 'Educación',
    desc: 'Cabecera, rutas de formación y CTA',
    Icon: GraduationCap,
    group: 'Sitio web público',
  },
  {
    key: 'publicaciones',
    label: 'Publicaciones',
    desc: 'Cabecera de la sección de publicaciones',
    Icon: Newspaper,
    group: 'Sitio web público',
  },
  {
    key: 'devocionales',
    label: 'Devocionales',
    desc: 'Cabecera de la sección de devocionales',
    Icon: Quote,
    group: 'Sitio web público',
  },
  {
    key: 'app-feed',
    label: 'App — Banner del feed',
    desc: 'Anuncio o banner anclado en la parte superior del feed comunitario',
    Icon: Smartphone,
    group: 'Aplicación',
  },
]

const groups = [...new Set(pagesMeta.map(p => p.group))]

export default async function AdminPaginasPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('page_content')
    .select('page, updated_at, content')

  const updatedMap = Object.fromEntries((pages ?? []).map(p => [p.page, p.updated_at]))
  const blocksMap = Object.fromEntries((pages ?? []).map(p => {
    const content = p as any
    return [p.page, Array.isArray(content?.content?.blocks) ? content.content.blocks.length : null]
  }))

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-5">
        <div className="flex items-center gap-3 mb-1">
          <Layers size={16} style={{ color: MUTED }} />
          <h1 className="font-bold text-lg text-white">Editor de páginas</h1>
        </div>
        <p className="text-[13px]" style={{ color: MUTED }}>
          Diseña cada página con bloques drag-and-drop
        </p>
      </div>

      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {groups.map(group => (
          <div key={group}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: MUTED }}>
              {group}
            </p>
            <div className="space-y-2">
              {pagesMeta.filter(p => p.group === group).map(({ key, label, desc, Icon }) => {
                const blockCount = blocksMap[key]
                return (
                  <Link
                    key={key}
                    href={`/admin/paginas/${key}`}
                    className="flex items-center gap-4 rounded-2xl border p-4 transition group"
                    style={{ borderColor: BORDER, background: CARD }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: CARD }}>
                      <Icon size={18} style={{ color: MUTED }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-white text-sm">{label}</p>
                        {blockCount !== null && blockCount > 0 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                            style={{ background: `${GOLD}26`, color: GOLD }}>
                            {blockCount} bloque{blockCount !== 1 ? 's' : ''}
                          </span>
                        )}
                        {blockCount !== null && blockCount > 0 && (
                          <ResetPageButton pageKey={key} />
                        )}
                      </div>
                      <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>{desc}</p>
                      {updatedMap[key] && (
                        <p className="text-[10px] mt-1" style={{ color: MUTED }}>
                          Actualizado: {new Date(updatedMap[key]).toLocaleDateString('es-DO', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={16} style={{ color: MUTED }} className="group-hover:text-white transition flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
