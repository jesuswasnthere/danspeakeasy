# Arquitectura

## Del problema a la característica

| Dolor del estudiante (grupos informales) | Solución en el producto | Dónde vive |
| --- | --- | --- |
| Mezcla de niveles | Onboarding obligatorio + nivel activo (HSK 1–6 / A1–C2). Todo se filtra por `language` + `level` | `Onboarding`, `useLearningStore.level`, `ContentRepository` |
| Falta de estructura | Libro de Clase: Unidades → Lecciones secuenciales con teoría, vocabulario, diálogos, hanzi y práctica | `src/data/*`, `InteractiveTextbook` |
| Poca interactividad | Motor de ejercicios con corrección inmediata y explicación del porqué | `ExerciseRunner`, `lib/exercises/evaluate.ts` |
| Estancamiento sin seguimiento | Dashboard: avance, racha, XP semanal, vocabulario dominado (Leitner), errores y puntos débiles | `ProgressDashboard`, `selectors.ts` |
| Sin dinamismo ni pares | Aula por nivel exacto + misiones semanales (lectura, escucha, gramática, participación) | `LevelClassroom`, `data/classroom.ts` |

## Rutas

| Ruta | Render | Indexable | Notas |
| --- | --- | --- | --- |
| `/` | Estático (Server Component) | Sí | Landing pública. No usa `AppShell` ni localStorage. Metadata, OG y JSON-LD propios. |
| `/app`, `/app/libro`, `/app/practica`, `/app/repaso`, `/app/aula` | Solo cliente tras hidratar | No (`noindex`, `Disallow: /app/`) | `src/app/app/layout.tsx` monta `AppShell` (hidratación + onboarding) y exporta `instant = false`. |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/icon`, `/apple-icon`, `/opengraph-image` | Estático | — | Archivos de metadata de Next (`src/app/*.ts(x)`). |
| `/api/tts` | Dinámico | No | Proxy de TTS (ver CLAUDE.md). |

Las rutas antiguas sin prefijo (`/libro`, `/practica`, `/repaso`, `/aula`) redirigen con 308 a
`/app/*` desde `next.config.ts`.

## Capas

```
UI (src/components, src/app)
  │  lee estado  ─────────────►  Zustand store (src/store)  ──► localStorage   [Fase 2: API/BD]
  │  lee contenido ───────────►  ContentRepository (src/lib/content)
  │                                   └─ mockContentRepository → src/data      [Fase 2: BD/CMS]
  └─ evalúa ejercicios ───────►  evaluateExercise (puro)  + FeedbackProvider   [Fase 2: LLM]
```

Reglas:

1. **La UI no importa `src/data` directamente** (excepto `levels.ts`, que son constantes del
   dominio; los textos de la landing viven en `src/config/landing.ts`). Todo el contenido pasa por `content` (`src/lib/content/index.ts`).
2. **La evaluación de ejercicios es pura y determinista.** El feedback enriquecido por IA se
   añade encima vía `FeedbackProvider.enrich()`, sin cambiar los componentes.
3. **El store solo guarda datos del alumno**, nunca contenido. Referencia el contenido por id.

## Estado del alumno (`LearningData`)

- `language`, `level`, `levelByLanguage` — segmentación.
- `preferences` — pinyin, traducción, colores de tono, velocidad de audio.
- `completedLessons`, `attempts` — progreso del libro.
- `mistakes` — bandeja de errores (por ejercicio, con contador y estado resuelto).
- `vocabBank` — tarjetas Leitner (cajas 1–5; ≥4 = dominada; intervalos 0/1/3/7/14 días).
- `activity` — agregados diarios (XP, ejercicios, aciertos…) → racha y métricas semanales.
- `weekly` — por semana ISO: misiones completadas, reproducciones de audio, aciertos por nivel.
- `posts`, `repliesByPost`, `likedPosts` — participación en el aula.

El store está versionado (`version: 1`) para poder migrar el formato con `migrate` en el futuro.

## Plan de Fase 2 (sugerido)

1. **Auth + BD**: Supabase (Postgres + Auth, plan gratuito) o Neon + Auth.js.
   - Tablas: `users`, `enrollments(user, language, level)`, `lesson_progress`, `exercise_attempts`,
     `mistakes`, `vocab_cards`, `daily_activity`, `weekly_missions`, `posts`, `replies`, `likes`.
   - Migración: al iniciar sesión por primera vez, subir el estado de localStorage.
2. **Contenido en BD/CMS**: implementar `ContentRepository` remoto (async) y consumirlo con
   Server Components + `use cache` (Cache Components ya está activado) o SWR en cliente.
3. **Aula real**: posts/replies en BD con RLS por nivel; tiempo real con Supabase Realtime.
4. **IA**:
   - `FeedbackProvider` con LLM para explicar el error concreto del alumno.
   - Corrección automática de las publicaciones de participación (sugerencias tipo par).
   - Generación de ejercicios de refuerzo a partir de `mistakes` y puntos débiles.
   - Llamadas siempre desde Route Handlers / Server Functions (la API key nunca en el cliente).
5. **Audio**: TTS neuronal y evaluación de pronunciación/tonos (reconocimiento de voz).
