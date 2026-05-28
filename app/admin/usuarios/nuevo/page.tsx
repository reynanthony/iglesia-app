import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CreateUserForm from '@/components/admin/CreateUserForm'

export default function NuevoUsuarioPage() {
  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#0D3352' }}>
        <Link href="/admin/usuarios" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0B2D47' }}>
          <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Crear usuario</h1>
          <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.40)' }}>Crea una cuenta sin necesidad de confirmación por correo</p>
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 max-w-xl">
        <CreateUserForm />
      </div>
    </div>
  )
}
