import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { shareTestimony } from '@/app/actions/prayer'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

export default async function TestimonioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: req } = await supabase
    .from('prayer_requests')
    .select('id, title, status, user_id, testimony_post_id')
    .eq('id', id)
    .single()

  if (!req) notFound()
  // Only owner can write testimony; only for answered prayers without one yet
  if (req.user_id !== user.id || req.status !== 'respondida' || req.testimony_post_id) {
    redirect(`/app/oracion/${id}`)
  }

  const submitAction = shareTestimony.bind(null, id)

  return (
    <div style={{ background: BG, minHeight: '100%' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-4"
        style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
        <Link href={`/app/oracion/${id}`}
          className="p-2.5 hover:bg-[#292E3B] rounded-xl transition"
          style={{ color: GOLD }}>
          <ArrowLeft size={18} />
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: MUTED }}>
          Compartir testimonio
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Context card */}
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.20)' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
            style={{ color: 'rgba(74,222,128,0.60)' }}>
            Petición respondida
          </p>
          <p className="font-bold text-sm" style={{ color: INK }}>{req.title}</p>
        </div>

        {/* Intro */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${GOLD}1F`, border: `1px solid ${GOLD}33` }}>
            <Sparkles size={18} style={{ color: GOLD }} />
          </div>
          <div>
            <p className="font-black text-base" style={{ color: INK }}>
              Dios respondió tu oración
            </p>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: MUTED }}>
              Compartir tu testimonio anima a la comunidad y glorifica a Dios. Cuéntanos cómo respondió esta petición.
            </p>
          </div>
        </div>

        {/* Form */}
        <form action={submitAction} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
              style={{ color: MUTED }}>
              Tu testimonio *
            </label>
            <textarea
              name="body"
              required
              rows={7}
              placeholder="Cuéntanos cómo Dios respondió esta oración..."
              className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none resize-none"
              style={{ background: CARD, borderColor: BORDER, color: INK }}
            />
            <p className="text-[11px] mt-2" style={{ color: MUTED }}>
              Se publicará en la comunidad como publicación de testimonio
            </p>
          </div>

          <button type="submit"
            className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider"
            style={{ background: '#4ADE80', color: BG }}>
            Publicar testimonio
          </button>
        </form>

      </div>
    </div>
  )
}
