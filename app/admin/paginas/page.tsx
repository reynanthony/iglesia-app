import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Globe, ChevronRight, Home, Users, Mail } from 'lucide-react'

const pagesMeta = [
  {
    key: 'home',
    label: 'Página de inicio',
    desc: 'Hero, horarios de servicios, versículo destacado, evento principal',
    Icon: Home,
  },
  {
    key: 'nosotros',
    label: 'Quiénes somos',
    desc: 'Historia, estadísticas, misión y visión',
    Icon: Users,
  },
  {
    key: 'contacto',
    label: 'Contacto',
    desc: 'Dirección, teléfono, correo, horarios de atención',
    Icon: Mail,
  },
]

export default async function AdminPaginasPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('page_content')
    .select('page, updated_at')

  const updatedMap = Object.fromEntries((pages ?? []).map(p => [p.page, p.updated_at]))

  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5" style={{ borderColor: '#1F1F1F' }}>
        <div className="flex items-center gap-3 mb-1">
          <Globe size={16} style={{ color: '#8A8A8A' }} />
          <h1 className="font-bold text-lg text-white">Páginas del sitio web</h1>
        </div>
        <p className="text-[13px]" style={{ color: '#5A5A5A' }}>
          Edita el contenido estático de cada página pública
        </p>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-3">
        {pagesMeta.map(({ key, label, desc, Icon }) => (
          <Link
            key={key}
            href={`/admin/paginas/${key}`}
            className="flex items-center gap-4 rounded-2xl border p-5 transition group"
            style={{ borderColor: '#1F1F1F', background: '#111111' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#1A1A1A' }}>
              <Icon size={20} style={{ color: '#5A5A5A' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">{label}</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#5A5A5A' }}>{desc}</p>
              {updatedMap[key] && (
                <p className="text-[11px] mt-1" style={{ color: '#3A3A3A' }}>
                  Actualizado: {new Date(updatedMap[key]).toLocaleDateString('es-DO', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>
            <ChevronRight size={16} style={{ color: '#3A3A3A' }} className="group-hover:text-white transition flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
