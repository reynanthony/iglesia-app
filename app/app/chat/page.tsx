import { createClient } from '@/lib/supabase/server'
import ChatBox from '@/components/ChatBox'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', user!.id)
    .single()

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] md:h-screen">
      <div className="border-b border-slate-800 px-5 py-4 flex-shrink-0 flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
          <span className="text-lg">💬</span>
        </div>
        <div>
          <h1 className="font-bold text-sm">Chat de la comunidad</h1>
          <p className="text-slate-500 text-xs">Mensajes en tiempo real</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatBox
          currentUserId={user!.id}
          currentProfile={profile ?? { full_name: 'Usuario', username: '', avatar_url: null }}
        />
      </div>
    </div>
  )
}