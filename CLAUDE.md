# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint (eslint-config-next)
```

There is no test suite.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

## Architecture

**Stack:** Next.js 16.2.6 (App Router) · Supabase (auth, Postgres, realtime, storage) · LiveKit (WebRTC audio) · Tailwind CSS v4 · Zustand · Lucide React

### Route segments and auth

| Segment | Guard | Purpose |
|---------|-------|---------|
| `/` and `/(public)/*` | none | Public church website (landing, nosotros, ministerios, eventos, predicas, contacto) |
| `/login`, `/registro` | none | Auth pages |
| `/app/*` | `app/app/layout.tsx` — redirects to `/login` if no session | Authenticated community app |
| `/admin/*` | `app/admin/layout.tsx` — requires `profiles.role === 'admin'` | Admin panel |

### Supabase client split

- **Server components and Server Actions** → `lib/supabase/server.ts` (`createServerClient` from `@supabase/ssr`, reads/writes cookies)
- **Client components** → `lib/supabase/client.ts` (`createBrowserClient` from `@supabase/ssr`)

Never import the server client inside a `'use client'` file or vice versa.

### Server Actions

All mutations live in `app/actions/`. Each file has `'use server'` at the top. Pattern:

1. Call `createClient()` from the server Supabase helper
2. Verify auth via `supabase.auth.getUser()`
3. Optionally check `profiles.role` for privileged operations
4. Mutate, then call `revalidatePath()` to bust the Next.js cache

### Database schema (inferred)

| Table | Key columns |
|-------|-------------|
| `profiles` | `id` (= auth.uid), `full_name`, `username`, `avatar_url`, `bio`, `role` |
| `posts` | `user_id`, `content`, `image_url` |
| `likes` | `post_id`, `user_id` |
| `comments` | `post_id`, `user_id`, `content`, `parent_id` (nullable, for replies) |
| `comment_likes` | `comment_id`, `user_id` |
| `notifications` | `user_id`, `actor_id`, `type` (`like`/`comment`/`report`), `post_id` |
| `reports` | `post_id`, `reporter_id`, `reason` |
| `messages` | `user_id`, `content` (global chat) |
| `rooms` | `name`, `description`, `created_by`, `is_active`, `max_participants` (prayer audio rooms) |
| `ministries` | `name`, `slug`, `description`, `icon`, `color`, `parent_id` (nullable, supports one level of nesting) |
| `ministry_content` | `ministry_id`, `user_id`, `title`, `body`, `type`, `video_url`, `image_url` |

### Role system

`profiles.role` values: `admin`, `pastor`, `moderador`, `lider`, and the default member role. Roles `admin | pastor | moderador | lider` can publish to ministry content pages.

### Real-time features

- **Community chat** (`/app/chat`) — `ChatBox.tsx` uses the Supabase Realtime **broadcast** channel `chat-room`. Messages are inserted to the DB and also broadcast directly so the sender sees them instantly without a round-trip.
- **Prayer audio rooms** (`/app/oracion/[id]`) — `AudioRoom.tsx` uses `@livekit/components-react`. The client fetches a short-lived JWT from `GET /api/livekit/token?room=<roomId>` (server-side, auth-gated).

### Storage

Supabase Storage bucket **`posts`** holds user-uploaded images for both posts and ministry content. Path format: `{userId}/{timestamp}.{ext}`.

### Component conventions

Pages are async server components by default. Components that need browser APIs, state, or event handlers are marked `'use client'` and live in `components/`. Interactive sub-components within a page are kept in the same `components/` directory, not co-located with the page file.
