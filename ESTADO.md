# Estado del Proyecto — Iglesia El Manantial
> Actualizado: 30 de mayo de 2026

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Auth + DB comunidad | Supabase (Postgres, Realtime, Storage) |
| CMS contenido público | Directus (Railway) |
| Audio WebRTC | LiveKit |
| Estilos | Tailwind CSS v4 |
| Estado cliente | Zustand |
| Iconos | Lucide React |
| Deploy | Vercel (producción: `iglesia-app-sigma.vercel.app`) |

---

## Servicios externos

### Supabase
- URL: `https://gjftpjaxbguzsifvbxhn.supabase.co`
- Anon key: en `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Directus CMS (Railway)
- Panel admin: `https://directus-production-7860.up.railway.app/admin`
- API URL: `https://directus-production-7860.up.railway.app`
- Token: en `.env.local` → `STRAPI_API_TOKEN`
- **Credenciales admin: RECUPERAR** — resetear desde Railway Variables con `ADMIN_EMAIL` + `ADMIN_PASSWORD` y redesplegar
- Helper en código: `lib/directus.ts` → `cmsSingleton()`, `cmsGet()`, `cmsById()`, `cmsImageUrl()`

### LiveKit
- URL: `wss://iglesia-app-nwtiwcs8.livekit.cloud`
- Keys en `.env.local`

---

## Arquitectura de rutas

| Segmento | Auth | Propósito |
|----------|------|-----------|
| `/` y `/(public)/*` | Ninguna | Sitio web público de la iglesia |
| `/login`, `/registro` | Ninguna | Autenticación |
| `/app/*` | Sesión activa (redirige a `/login`) | App de comunidad autenticada |
| `/admin/*` | `profiles.role === 'admin'` | Panel de administración |

---

## Tokens de diseño (paleta universal)

```
DARK  = '#051828'  → Heroes de todas las páginas, header nav
NAVY  = '#093C5D'  → Cards, secciones secundarias oscuras
TEAL  = '#76ABAE'  → Acento principal, CTAs secundarios
CREAM = '#F6F3EB'  → Secciones claras, texto sobre oscuro
SAGE  = '#869B7E'  → Texto secundario, metadatos
```

**Regla crítica:** El header nav y TODOS los heroes de páginas públicas usan `#051828` (DARK). No usar `NAVY` en heroes.

---

## Páginas públicas — estado actual

| Ruta | Datos | Estado |
|------|-------|--------|
| `/` (Home) | Directus `homepage` + `predicas` | ✅ Completo — Directus + versículo diario |
| `/nosotros` | Directus `nosotros` + Supabase `church_leaders` | ✅ |
| `/ministerios` | Directus `ministerios` | ✅ |
| `/ministerios/[slug]` | Directus `ministerios` + `ministerio_contenido` | ✅ |
| `/predicas` | Supabase `ministry_content` (tipo articulo/anuncio) | ✅ |
| `/predicas/[id]` | Supabase `ministry_content` (todos los tipos) | ✅ |
| `/eventos` | Directus `eventos` | ✅ |
| `/contacto` | Directus `contacto` + formulario | ✅ |
| `/en-vivo` | Supabase `ministry_content` tipo video | ✅ |
| `/educacion` | Estático | ✅ |
| `/educacion/discipulado` | Estático | ✅ |
| `/educacion/estudio-biblico` | Estático | ✅ |
| `/biblia` | Bible API (`BIBLE_API_KEY`) | ✅ |
| `/donaciones` | Estático | ✅ |

### Colecciones Directus requeridas
- `homepage` (singleton) — campos en `lib/directus.ts → DHomepage`
- `nosotros` (singleton) — campos en `lib/directus.ts → DNosotros`
- `contacto` (singleton) — campos en `lib/directus.ts → DContacto`
- `ministerios` (collection) — campos en `lib/directus.ts → DMinisterio`
- `ministerio_contenido` (collection) — campos en `lib/directus.ts → DMinisterioContenido`
- `predicas` (collection) — campos en `lib/directus.ts → DPredica`
- `eventos` (collection) — campos en `lib/directus.ts → DEvento`

---

## Versículo del día

- Archivo: `lib/daily-verse.ts`
- 52 versículos RVR1960 curados, sin API externa
- Rotación determinista: `Math.floor(Date.now() / 86_400_000) % 52`
- Exports: `getDailyVerse()` → `{ text, reference }` · `getDailyVerseDate()` → string fecha
- Usado en: sección 5 del Home (`app/(public)/page.tsx`)

---

## App de comunidad `/app/*`

| Ruta | Estado |
|------|--------|
| `/app/comunidad` (antes `/feed`) | ✅ Feed de posts |
| `/app/chat` | ✅ Chat global (Supabase Realtime) |
| `/app/oracion` | ✅ Lista peticiones |
| `/app/oracion/[id]` | ✅ Detalle petición |
| `/app/oracion/nueva` | ✅ Crear petición |
| `/app/oracion/salas` | ✅ Salas LiveKit |
| `/app/grupos` | ✅ Lista grupos |
| `/app/grupos/[id]` | ✅ Feed grupo |
| `/app/ministerios/[slug]` | ✅ |
| `/app/predicas/[id]` | ✅ |
| `/app/buscar` | ✅ |
| `/app/discipulado` | ✅ |
| `/app/perfil/[username]` | ✅ |

---

## Panel Admin `/admin/*`

| Ruta | Estado |
|------|--------|
| `/admin` | ✅ Dashboard métricas |
| `/admin/usuarios` | ✅ |
| `/admin/posts` | ✅ |
| `/admin/mensajes` | ✅ Inbox contacto |
| `/admin/moderacion` (reportes) | ✅ |
| `/admin/seguridad` | ✅ |
| `/admin/oracion` | ✅ |
| `/admin/grupos` | ✅ |
| `/admin/discipulado` | ✅ |
| `/admin/eventos` | ✅ CRUD → debería migrar a Directus |
| `/admin/predicas` | ✅ CRUD → debería migrar a Directus |
| `/admin/ministerios` | ✅ CRUD → debería migrar a Directus |
| `/admin/en-vivo` | ✅ |

---

## Schema Supabase (tablas principales)

| Tabla | Uso |
|-------|-----|
| `profiles` | id=auth.uid, full_name, username, avatar_url, bio, role, is_active |
| `posts` | user_id, content, image_url, category, group_id |
| `reactions` | post_id, user_id, type (orando/amen/edifico/gracias) |
| `comments` | post_id, user_id, content, parent_id |
| `notifications` | user_id, actor_id, type, post_id |
| `reports` | post_id, reporter_id, reason |
| `messages` | user_id, content (chat global) |
| `rooms` | name, description, created_by, is_active (salas LiveKit) |
| `ministries` | name, slug, description, icon, color, parent_id |
| `ministry_content` | ministry_id, user_id, title, body, type, video_url, image_url |
| `prayer_requests` | user_id, title, body, is_anonymous, status, testimony_post_id |
| `prayer_participants` | request_id, user_id |
| `groups` | name, description, type, is_active, is_private, created_by |
| `group_members` | group_id, user_id, role (member/leader) |
| `contact_messages` | nombre, email, asunto, mensaje, read, read_by, read_at |
| `activity_log` | user_id, action, metadata |
| `discipleship_stages` | name, order_index, color, icon (7 etapas) |
| `user_discipleship` | user_id, stage_id, notes, assigned_by |

### Roles de usuario
`admin` · `pastor` · `moderador` · `lider` · _(sin rol = miembro)_

Roles con permiso de publicar en ministerios: `admin | pastor | moderador | lider`

---

## Componentes clave

| Componente | Propósito |
|-----------|-----------|
| `components/public/PublicNav.tsx` | Nav desktop público |
| `components/public/MobileMenu.tsx` | Menú hamburguesa (solo ícono cruz, sin texto) |
| `components/public/PublicStatusBar.tsx` | Barra superior de estado |
| `components/public/ContactForm.tsx` | Formulario de contacto |
| `components/public/HeroVideo.tsx` | Video de fondo en heroes |
| `components/app/AppNav.tsx` | Nav inferior app autenticada |
| `components/ChatBox.tsx` | Chat realtime |
| `components/AudioRoom.tsx` | Sala de audio LiveKit |
| `components/PostCard.tsx` | Card de post en comunidad |
| `components/NotificationBell.tsx` | Campana de notificaciones |
| `components/admin/AdminNav.tsx` | Nav lateral admin |

---

## Convenciones importantes

- **Supabase server** (`lib/supabase/server.ts`) → solo en Server Components y Server Actions
- **Supabase client** (`lib/supabase/client.ts`) → solo en Client Components (`'use client'`)
- **Server Actions** en `app/actions/*.ts` — siempre `'use server'`, verificar auth, llamar `revalidatePath()`
- **Nunca** usar `Set-Content` de PowerShell para editar archivos UTF-8 (corrompe caracteres)
- Siempre usar la herramienta `Edit` para cambios en archivos existentes

---

## Pendiente prioritario (Plan Maestro)

### Inmediato
- [ ] Recuperar acceso a Directus admin (resetear desde Railway Variables)
- [ ] Poblar colecciones Directus: `homepage`, `nosotros`, `contacto`, `ministerios`, `predicas`, `eventos`

### Fase 2 — Comunidad
- [x] Reacciones espirituales — `toggleReaction` action + `ReactionBar` (inline en PostCard, vertical en ShortsCard)
- [x] Filtros por categoría en `/app/comunidad`

### Fase 3 — Oración
- [ ] UI ciclo completo: orando → respondida → testimonio

### Fase 4 — LMS Discipulado v2 (sesión actual)

**Decisiones tomadas:**
- Nombre: mantener "Discipulado" (costumbre de la iglesia)
- Contenido en Supabase (no Directus), admin propio en `/admin/discipulado`
- Videos: solo embeds YouTube/Vimeo (ya existe SocialEmbedCard), no upload nativo
- Diario de reflexión: opt-in para compartir con mentor (is_shared_with_mentor = false por defecto)
- Fuera del scope v2: certificaciones PDF, audio nativo, quizzes, formación grupal sincrónica

**Schema — `supabase/v3_discipleship_lms.sql`:**
- [x] S1 — Migración SQL lista (10 tablas nuevas + RLS + seed)
- [ ] S1 — Ejecutar migración en Supabase Dashboard
- [ ] S2 — Admin de contenido: CRUD programas, cursos, lecciones
- [ ] S3 — Panel del estudiante rediseñado + páginas programa/curso/lección + progreso
- [ ] S4 — Diario de Reflexión (componente crítico, auto-save)
- [ ] S5 — Módulo de Mentoría (panel mentor + admin asignación)
- [ ] S6 — Dashboard pastoral de métricas y alertas
- [ ] S7 — Integraciones (comunidad, oración, grupos, eventos)
- [ ] S8 — Capacitor: push notifications + deep links + offline

**Tablas nuevas:**
`discipleship_programs` · `discipleship_courses` · `discipleship_lessons`
`lesson_bible_verses` · `lesson_challenges`
`user_course_enrollments` · `user_lesson_completions` · `user_reflections`
`discipleship_mentors` · `mentor_observations`
`groups.program_id` (columna agregada)

**Seed incluido:** programa "Fundamentos de la Fe" → cursos "Salvación" (5 lecciones) + "La Biblia" (3 lecciones) con versículos y desafíos

### Fase 7 — Capacitor (cuando fases 0-4 estén en prod)
- [ ] `capacitor.config.ts` con `server.url` apuntando a Vercel
- [ ] Safe-area-inset en layout autenticado
- [ ] Paleta AudioRoom: `#141414` → `#061E30`
- [ ] Push notifications Discipulado (post-lección 24h, inactividad 7d, celebración)

---

## Comandos útiles

```bash
npm run dev       # http://localhost:3000
npm run build     # build de producción
vercel --prod     # deploy a producción
```
