'use client'

import { useState } from 'react'
import { FileText, MessageCircle, Plus } from 'lucide-react'
import Link from 'next/link'
import { UsersRound } from 'lucide-react'
import PostCard from '@/components/PostCard'
import GroupChat from '@/components/app/GroupChat'

const TEAL = '#76ABAE'

interface Props {
  posts: any[]
  groupId: string
  userId: string
  userProfile: { full_name: string; username: string; avatar_url: string | null }
  currentUserRole: string
}

export default function GrupoTabs({ posts, groupId, userId, userProfile, currentUserRole }: Props) {
  const [tab, setTab] = useState<'posts' | 'chat'>('posts')

  function tabStyle(active: boolean): React.CSSProperties {
    return {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingBottom: 10,
      paddingTop: 12,
      color: active ? TEAL : 'rgba(246,243,235,0.35)',
      fontWeight: active ? 700 : 500,
      fontSize: 13,
      background: 'none',
      border: 'none',
      borderBottom: `2px solid ${active ? TEAL : 'transparent'}`,
      cursor: 'pointer',
      transition: 'color 0.2s, border-color 0.2s',
    }
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex" style={{ borderBottom: '1px solid #0D3352' }}>
        <button style={tabStyle(tab === 'posts')} onClick={() => setTab('posts')}>
          <FileText size={14} aria-hidden />
          Publicaciones
        </button>
        <button style={tabStyle(tab === 'chat')} onClick={() => setTab('chat')}>
          <MessageCircle size={14} aria-hidden />
          Chat
        </button>
      </div>

      {/* Publicaciones */}
      {tab === 'posts' && (
        <div className="max-w-2xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24 px-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                <UsersRound size={24} style={{ color: 'rgba(118,171,174,0.40)' }} />
              </div>
              <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>
                Sin publicaciones aún
              </p>
              <Link href={`/app/nuevo-post?group=${groupId}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black mt-4"
                style={{ background: '#F6F3EB', color: '#061E30' }}>
                <Plus size={14} /> Primera publicación
              </Link>
            </div>
          ) : (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} currentUserId={userId} currentUserRole={currentUserRole} />
            ))
          )}
        </div>
      )}

      {/* Chat */}
      {tab === 'chat' && (
        <div style={{ height: '68svh' }}>
          <GroupChat
            groupId={groupId}
            currentUserId={userId}
            currentProfile={userProfile}
          />
        </div>
      )}
    </>
  )
}
