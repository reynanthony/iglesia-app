# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> El Manantial Church App — Última actualización: 2026-06-05

@AGENTS.md

---

## Inicio rápido

```bash
npm run dev       # http://localhost:3000
npm run build     # build de producción (verificar antes de deploy)
npm run lint      # ESLint
npx tsc --noEmit  # type-check (debe ser limpio)

# Deploy
vercel --prod     # producción (sin --prod crea preview solamente)

# Capacitor nativo
npm run cap:sync     # sincronizar web → nativo (después de cambios)
npm run cap:ios      # abrir en Xcode
npm run cap:android  # abrir en Android Studio

# Supabase
npx supabase db query --linked --file supabase/<migración>.sql
npx supabase functions deploy send-push --linked
```

**Producción:** `https://iglesia-app-sigma.vercel.app`  
**Supabase:** `https://gjftpjaxbguzsifvbxhn.supabase.co`  
**Admin:** `reynaldoanthonyrodriguez@gmail.com` — role `admin`

---

## Reglas críticas — leer primero

| Regla | Por qué |
|-------|---------|
| **NUNCA crear `middleware.ts`** | El proyecto usa `proxy.ts` para auth en el edge. Ambos coexistiendo producen un build fatal en Next.js 16 |
| **`supabase/functions/` excluido del tsconfig** | Código Deno — no es TypeScript. Ya excluido en `"exclude": ["node_modules", "supabase/functions"]` |
| **Siempre `vercel --prod`** para producción | `vercel` sin flag crea preview, no toca producción |
| **Usar herramienta `Edit`** para modificar archivos | `Set-Content` de PowerShell corrompe UTF-8 |
| **`count: 'exact', head: true`** → destructurar `{ count }`, no `{ data }` | Con `head:true` Supabase retorna `null` en `data` |
| **Icono `ScrollText`** en lugar de `Bible` | `Bible` no existe en lucide-react |

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Auth + DB | Supabase (Postgres, Realtime, Storage, Edge Functions) |
| CMS contenido público | Directus (Railway) — `https://directus-production-7860.up.railway.app` |
| Audio WebRTC | LiveKit — `wss://iglesia-app-nwtiwcs8.livekit.cloud` |
| Nativo | Capacitor (`com.elmanantial.app`) — carga `iglesia-app-sigma.vercel.app` en WebView |
| Estilos | Tailwind CSS v4 + inline `style={}` para la paleta (NO clases de color Tailwind) |
| Iconos | Lucide React |
| Deploy | Vercel |

### Variables de entorno requeridas (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

---

## Paleta de diseño (universal — no cambiar)

```
#061E30  fondo principal (body, páginas)
#0B2D47  cards y paneles
#0D3352  bordes
#1A4A6E  bordes activos / hover
#76ABAE  acento teal (CTAs secundarios, iconos activos)
#F6F3EB  texto principal (cream)
#869B7E  sage (texto secundario)
```

**Regla:** El header nav y heroes de páginas públicas usan `#051828` (más oscuro). Cards siempre `#0B2D47`.

---

## Arquitectura de rutas y guards

| Segmento | Guard | Propósito |
|----------|-------|-----------|
| `/` y `/(public)/*` | ninguno | Sitio público de la iglesia |
| `/login`, `/registro` | ninguno | Auth |
| `/app/*` | sesión activa → redirige a `/login` | App comunidad autenticada |
| `/admin/*` | `role IN ('admin','pastor','moderador')` → redirige a `/app/comunidad` | Panel admin |
| `/educacion/*` | ninguno (público) | LMS público |

### Supabase client split
- **Server Components y Server Actions** → `lib/supabase/server.ts`
- **Client Components (`'use client'`)** → `lib/supabase/client.ts`
- Nunca mezclar. El server client usa cookies de Next.js.

### Caché de usuario
`lib/supabase/cached-user.ts` exporta `getUser()` y `getProfile(userId)` con `React.cache()` — deduplicación dentro del mismo render tree.

---

## Roles de usuario

`profiles.role`: `admin` · `pastor` · `moderador` · `lider` · _(sin rol = miembro)_

- **admin, pastor, moderador** → acceso a `/admin/*`
- **admin, pastor, lider** → acceso a contenido privilegiado del LMS (emitir certificados, asignar mentores, ver reportes)
- **admin, pastor** → eliminar certificados, eliminar peticiones de oración
- **admin, pastor, moderador, lider** → publicar en páginas de ministerios

---

## Server Actions

Todas en `app/actions/`. Patrón estándar:
```ts
'use server'
async function requireAuth() { /* → { supabase, userId } o redirect('/login') */ }
async function requireLeader() { /* → supabase o redirect si no es lider+ */ }
```
Siempre terminar con `revalidatePath()` para invalidar caché de Next.js.

Archivos de acciones:
| Archivo | Dominio |
|---------|---------|
| `app/actions/auth.ts` | login, logout, registro |
| `app/actions/posts.ts` | posts, reacciones, comentarios |
| `app/actions/groups.ts` | grupos, miembros |
| `app/actions/prayer.ts` | peticiones oración, participación, testimonio |
| `app/actions/discipleship.ts` | etapas de discipulado (user_discipleship) |
| `app/actions/discipleship-lms.ts` | LMS completo (programas, cursos, lecciones, reflexiones, mentoría, certificados) |
| `app/actions/native.ts` | tokens de dispositivo, envío de push notifications |

---

## Esquema de base de datos

### Tablas base (v1 — migración inicial)
| Tabla | Uso |
|-------|-----|
| `profiles` | id=auth.uid, full_name, username, avatar_url, bio, role, is_active |
| `posts` | user_id, content, image_url, category, group_id |
| `reactions` | post_id, user_id, type (orando/amen/edifico/gracias) |
| `comments` | post_id, user_id, content, parent_id |
| `comment_likes` | comment_id, user_id |
| `notifications` | user_id, actor_id, type, post_id |
| `reports` | post_id, reporter_id, reason |
| `messages` | user_id, content (chat global) |
| `rooms` | nombre, descripción, LiveKit rooms (salas de oración) |
| `prayer_requests` | user_id, title, body, is_anonymous, status, testimony_post_id |
| `prayer_participants` | request_id, user_id |
| `groups` | name, type, is_private, program_id (FK discipleship_programs) |
| `group_members` | group_id, user_id, role |
| `ministries` | name, slug, color, icon, parent_id |
| `ministry_content` | ministry_id, user_id, title, body, type, video_url |
| `contact_messages` | nombre, email, asunto, mensaje, read |
| `activity_log` | user_id, action, metadata |
| `church_leaders` | nombre, cargo, foto, orden |

### LMS Discipulado (v3 — `supabase/v3_discipleship_lms.sql`)
| Tabla | Uso |
|-------|-----|
| `discipleship_stages` | 7 etapas (id, name, order_index, color) |
| `user_discipleship` | user_id, stage_id, notes, assigned_by |
| `discipleship_programs` | id, title, slug, required_stage_id, order_index, is_active |
| `discipleship_courses` | program_id, title, slug, level, duration_minutes, order_index |
| `discipleship_lessons` | course_id, title, body, video_url, pdf_url, order_index, is_active |
| `lesson_bible_verses` | lesson_id, reference, verse_text, order_index |
| `lesson_challenges` | lesson_id, description, week_number, order_index |
| `user_course_enrollments` | user_id, course_id, progress_pct, completed_at |
| `user_lesson_completions` | user_id, lesson_id, completed_at |
| `user_reflections` | user_id, lesson_id, what_learned, god_spoke, must_change, must_apply, is_shared_with_mentor |
| `discipleship_mentors` | mentor_id, student_id, status (active/paused), assigned_at |
| `mentor_observations` | mentor_id, student_id, content, created_at |

### Certificados (v5 — `supabase/v5_certificates.sql`)
| Tabla | Uso |
|-------|-----|
| `discipleship_certificates` | user_id, program_id, issued_at, issued_by — UNIQUE(user_id, program_id) |

### Push Notifications (v6 — `supabase/v6_push_notifications.sql`)
| Tabla | Uso |
|-------|-----|
| `device_tokens` | user_id, token, platform (android/ios/web) — UNIQUE(user_id, token) |
| `push_notifications_log` | sent_by, title, body, target, success, failed |

---

## Pendiente

### Alta prioridad
- [ ] **Directus admin** — recuperar acceso (Railway Variables: `ADMIN_EMAIL` + `ADMIN_PASSWORD` → redesplegar)
- [ ] Poblar colecciones Directus: `homepage`, `nosotros`, `contacto`, `ministerios`, `predicas`, `eventos`
- [ ] FCM push: crear Firebase project, obtener server key, `npx supabase functions deploy send-push --linked`

### Features pendientes
- [ ] **Olvidé mi contraseña** — flujo en `/login` (Supabase `resetPasswordForEmail`)
- [ ] Fase 3 oración — testimonios ya implementados; falta: ciclo de intercesión grupal sincrónica (opcional)
- [ ] Migrar admin CRUD de Eventos/Predicaciones/Ministerios → Directus (cuando CMS esté activo)
- [ ] Quizzes en lecciones LMS (fuera de scope actual)
- [ ] Certificados PDF descargables (fuera de scope actual)

---

## Archivos y componentes clave

| Archivo | Propósito |
|---------|-----------|
| `proxy.ts` | Edge auth — NUNCA crear middleware.ts junto a esto |
| `lib/supabase/server.ts` | Supabase server client (SSR) |
| `lib/supabase/client.ts` | Supabase browser client |
| `lib/supabase/cached-user.ts` | `getUser()` / `getProfile()` con React.cache() |
| `lib/daily-verse.ts` | 52 versículos, rotación determinista por fecha |
| `lib/directus.ts` | Helper CMS: `cmsSingleton()`, `cmsGet()`, `cmsImageUrl()` |
| `lib/offline-cache.ts` | Caché offline de lecciones via @capacitor/preferences |
| `capacitor.config.ts` | Config nativo (appId, server.url, plugins) |
| `components/app/CapacitorBridge.tsx` | Init nativo: back button + push registration |
| `components/app/AppNav.tsx` | Nav lateral (desktop) + bottom nav (mobile) para `/app/*` |
| `components/admin/AdminNav.tsx` | Nav lateral admin |
| `components/PostCard.tsx` | Card de post con reacciones, comentarios, menú |
| `components/lms/ReflectionForm.tsx` | Formulario de reflexión de lección (client, useTransition) |
| `components/lms/ObservationForm.tsx` | Formulario de observación del mentor |
| `components/app/DiscipleshipProgress.tsx` | Barra de progreso de etapas en perfil |

---

## Comandos Supabase útiles

```bash
# Listar usuarios con rol
npx supabase db query --linked "SELECT full_name, role FROM profiles WHERE role IS NOT NULL"

# Reset contraseña (o usar SQL Editor en Supabase Dashboard)
UPDATE auth.users SET encrypted_password = crypt('nueva-clave', gen_salt('bf')) WHERE email = 'x@x.com';
```
