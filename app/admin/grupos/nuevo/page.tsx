import { createGroup } from '@/app/actions/groups'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

const INPUT = {
  style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, color: INK },
  className: 'w-full px-4 py-3 text-sm bg-transparent focus:outline-none',
}

const TYPES = [
  { value: 'jovenes',     label: 'Jóvenes' },
  { value: 'caballeros',  label: 'Caballeros' },
  { value: 'damas',       label: 'Damas' },
  { value: 'matrimonios', label: 'Matrimonios' },
  { value: 'evangelismo', label: 'Evangelismo' },
  { value: 'intercesion', label: 'Intercesión' },
  { value: 'alabanza',    label: 'Alabanza' },
  { value: 'general',     label: 'General' },
]

const LABEL_CLS = 'block text-xs font-bold uppercase tracking-wider mb-2'
const LABEL_STYLE = { color: MUTED }

export default function NuevoGrupoPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/grupos" className="p-2 rounded-xl" style={{ background: BORDER, color: GOLD }}>
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl font-bold">Nuevo grupo</h1>
        </div>

        <form action={createGroup} className="space-y-5">
          <div>
            <label className={LABEL_CLS} style={LABEL_STYLE}>Nombre *</label>
            <input name="name" required placeholder="Ej: Jóvenes El Manantial"
              {...INPUT} />
          </div>

          <div>
            <label className={LABEL_CLS} style={LABEL_STYLE}>Descripción</label>
            <textarea name="description" rows={3} placeholder="¿De qué trata este grupo?"
              className="w-full px-4 py-3 text-sm bg-transparent focus:outline-none resize-none"
              style={INPUT.style} />
          </div>

          <div>
            <label className={LABEL_CLS} style={LABEL_STYLE}>Tipo</label>
            <select name="type" className="w-full px-4 py-3 text-sm focus:outline-none"
              style={INPUT.style}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_private" className="w-4 h-4 rounded" />
            <span className="text-sm" style={{ color: MUTED }}>
              Grupo privado (solo por invitación)
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <Link href="/admin/grupos"
              className="flex-1 py-3 rounded-xl text-sm font-bold text-center"
              style={{ background: CARD, color: MUTED, border: `1px solid ${BORDER}` }}>
              Cancelar
            </Link>
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: GOLD, color: GOLD_INK }}>
              Crear grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
