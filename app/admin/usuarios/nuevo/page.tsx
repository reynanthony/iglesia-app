import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CreateUserForm from '@/components/admin/CreateUserForm'

export default function NuevoUsuarioPage() {
  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: '#1F1F1F' }}>
        <Link href="/admin/usuarios" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1A1A1A' }}>
          <ArrowLeft size={14} style={{ color: '#8A8A8A' }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Crear usuario</h1>
          <p className="text-[13px]" style={{ color: '#5A5A5A' }}>Crea una cuenta sin necesidad de confirmación por correo</p>
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 max-w-xl">
        <CreateUserForm />
      </div>
    </div>
  )
}
