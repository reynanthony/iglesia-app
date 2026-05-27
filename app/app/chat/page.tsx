import { createClient } from '@/lib/supabase/server'
import ChatBox from '@/components/ChatBox'
import { MessageSquare } from 'lucide-react'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', user!.id)
    .single()

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 56px)', background: '#0A0A0A' }}>

      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid #1A1A1A', background: '#0A0A0A' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#161614', border: '1px solid #1A1A1A' }}
        >
          <MessageSquare size={16} style={{ color: '#8A8A8A' }} />
        </div>
        <div>
          <p className="font-black text-sm tracking-tight" style={{ color: '#F5F5F5' }}>
            Chat de la comunidad
          </p>
          <p className="text-[11px]" style={{ color: '#4D4D4D' }}>
            Tiempo real · Solo miembros
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatBox
          currentUserId={user!.id}
          currentProfile={profile ?? { full_name: 'Usuario', username: '', avatar_url: null }}
        />
      </div>
    </div>
  )
}
