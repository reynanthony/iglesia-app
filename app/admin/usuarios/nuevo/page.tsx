import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CreateUserForm from '@/components/admin/CreateUserForm'
import { CARD, BORDER, MUTED } from '@/lib/gold-theme'

export default function NuevoUsuarioPage() {
  return (
    <div>
      <div className="border-b px-4 md:px-8 py-5 flex items-center gap-4" style={{ borderColor: BORDER }}>
        <Link href="/admin/usuarios" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: CARD }}>
          <ArrowLeft size={14} style={{ color: MUTED }} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-white">Crear usuario</h1>
          <p className="text-[13px]" style={{ color: MUTED }}>Crea una cuenta sin necesidad de confirmación por correo</p>
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 max-w-xl">
        <CreateUserForm />
      </div>
    </div>
  )
}
