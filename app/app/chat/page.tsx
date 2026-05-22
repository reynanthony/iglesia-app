import { createClient } from '@/lib/supabase/server'
import ChatBox from '@/components/ChatBox'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username')
    .eq('id', user!.id)
    .single()

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-slate-800 px-6 py-4 flex-shrink-0">
        <h1 className="text-lg font-bold">Chat de la comunidad</h1>
        <p className="text-slate-500 text-xs mt-0.5">Mensajes en tiempo real</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatBox 
          currentUserId={user!.id} 
          currentProfile={profile ?? { full_name: 'Usuario', username: '' }}
        />
      </div>
    </div>
  )
}