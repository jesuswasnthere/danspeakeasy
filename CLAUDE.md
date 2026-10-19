@AGENTS.md

# DanSpeakeasy — knowledge del proyecto

Plataforma web para aprender **Chino Mandarín (HSK 1–6)** e **Inglés (MCER A1–C2)**, con
contenido y comunidad segmentados estrictamente por nivel. UI en **español**.

Estamos en **Fase 1 (MVP sin backend)**: todo el estado del alumno vive en `localStorage`
(Zustand `persist`). La **Fase 2** añadirá base de datos, autenticación y LLMs (tutor IA).
Ver `docs/ARCHITECTURE.md`.

## Reglas de trabajo (obligatorias)

- **Gestor de paquetes: SOLO `pnpm`.** Nunca menciones, sugieras ni uses otros gestores en
  comandos, scripts, comentarios ni documentación.
- Se trabaja **directamente en `main`** (sin ramas de feature salvo que se pida).
- Next.js 16 con **Cache Components** activado: antes de usar una API de Next, consulta
  `node_modules/next/dist/docs/` (ver AGENTS.md). No asumas APIs de versiones anteriores.
- TypeScript estricto. `pnpm lint`, `pnpm typecheck` y `pnpm build` deben pasar antes de commitear.
- Texto de UI, comentarios y docs en español. Contenido didáctico pedagógicamente correcto
  (pinyin con marcas tonales, IPA en inglés).

## Comandos

```bash
pnpm install      # dependencias
pnpm dev          # http://localhost:3000
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm build        # build de producción
```

## Mapa del código

| Ruta | Qué hay |
| --- | --- |
| `src/types/learning.ts` | Modelos de dominio (niveles, unidades, lecciones, ejercicios, aula, estado del alumno) |
| `src/data/` | Contenido mock: `levels.ts`, `zh/hsk2.ts` (unidad completa), `en/b1.ts` (unidad completa), `*/otherLevels.ts`, `classroom.ts` (misiones + tablón), `mockSyllabus.ts` (agregador + índices) |
| `src/lib/content/` | `ContentRepository`: **única puerta de acceso al contenido** desde la UI. Fase 2 = otra implementación |
| `src/lib/exercises/evaluate.ts` | Evaluación pura de ejercicios + interfaz `FeedbackProvider` (punto de enganche del LLM) |
| `src/lib/richText.ts` | `zh()` / `en()` para escribir tokens con pinyin, tonos, utilidades CJK |
| `src/store/useLearningStore.ts` | Store Zustand persistido: idioma/nivel, preferencias, progreso, errores, banco Leitner, actividad, aula |
| `src/store/selectors.ts` | Hooks derivados: progreso del libro, racha, actividad semanal, misiones, feed del aula, `useHydrated` |
| `src/components/textbook/` | Libro de Clase (`InteractiveTextbook`, teoría, vocabulario, diálogos, hanzi, práctica) |
| `src/components/exercises/` | Motor de ejercicios (`ExerciseRunner` + inputs) |
| `src/components/dashboard/` | `ProgressDashboard` |
| `src/components/classroom/` | `LevelClassroom`, misiones, tablón, `MissionWatcher` |
| `src/components/review/` | Repaso: tarjetas Leitner + re-práctica de errores |
| `src/components/phonetics/` | Fonética (chino HSK 1–2): `PhoneticsCenter` (lista de módulos + módulo con Explicación/Práctica), `PhoneticsBlocks` (tonos con contorno, tablas de iniciales/finales, cambios de tono, pares mínimos, tabla de combinaciones; todo suena al pulsar) |
| `src/data/zh/phonetics.ts` | Módulos de fonética (`PhoneticsModule`): 5 de HSK 1 y 5 de HSK 2 |
| `src/components/practice/` | Práctica de habilidades: `StrokePractice` (hanzi trazo a trazo con nombre de cada trazo), `ReadingPractice` (lectura con audio, modo sombra), `PronunciationPractice` (micrófono + puntuación) |
| `src/data/zh/strokes.ts` | Tipos de trazo (横, 竖, 撇…) y orden revisado de los caracteres del temario |
| `src/data/practice.ts` | Contenido de práctica derivado de las lecciones (caracteres, lecturas, ítems de pronunciación) |
| `src/lib/strokes.ts` | Carga de datos de trazos (CDN hanzi-writer-data) + clasificador geométrico para caracteres no anotados |
| `src/lib/pronunciation.ts` | Comparación objetivo ↔ reconocimiento de voz (LCS + Dice), normalización de números/contracciones |
| `src/hooks/` | `useSpeech` (TTS, secuencias con resaltado), `useVoiceRecorder` (micrófono, medidor, fin por silencio, transcripción local) |
| `src/lib/stt.ts` + `src/workers/whisper.worker.ts` | Reconocimiento de voz en el dispositivo con Whisper (transformers.js) |
| `src/app/page.tsx` | Landing pública `/` (Server Component prerenderizado, JSON-LD `WebSite` + `EducationalOrganization` + `FAQPage`) |
| `src/app/app/` | App del alumno: `/app` (progreso), `/app/libro`, `/app/fonetica` (solo chino HSK 1–2), `/app/practica`, `/app/repaso`, `/app/aula`. Su `layout.tsx` monta `AppShell` |
| `src/app/{robots,sitemap,manifest}.ts`, `icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx` | SEO técnico (archivos de metadata de Next) |
| `src/config/site.ts` | `SITE` (nombre, URL canónica desde `NEXT_PUBLIC_SITE_URL`, descripción), `APP_HOME`, `NAV` |
| `src/config/landing.ts` | FAQ de la landing (misma fuente para la sección visible y el JSON-LD) |

## Decisiones clave (y por qué)

- **Landing pública SSG + app en `/app` con noindex**: `/` es un Server Component estático sin
  `AppShell` ni localStorage (HTML con contenido real para rastreadores). La app vive en
  `src/app/app/`, cuyo `layout.tsx` monta `AppShell`, exporta `instant = false` y
  `robots: { index: false, follow: false }`. `robots.txt` bloquea `/app/` y `/api/`; el sitemap
  solo lista la landing. Las rutas antiguas (`/libro`, `/practica`, `/repaso`, `/aula`) redirigen
  con 308 a `/app/*` (`next.config.ts`). **Enlaces internos de la app: siempre con prefijo `/app`.**
- **Hidratación manual** (`skipHydration` + `rehydrate()` en `AppShell`): el estado está en
  localStorage, así que las páginas de `/app` se renderizan solo en cliente tras hidratar. Por eso
  el layout de `/app` y cada `page.tsx` exportan `instant = false` (si no, Next 16 avisa en dev
  de "dropped segment"). La landing NO lo lleva.
- **Nivel por idioma** (`levelByLanguage`): cambiar de idioma recuerda el último nivel de cada uno.
- **Errores**: un fallo en el libro crea/actualiza un `MistakeEntry`; solo se marca resuelto al
  acertarlo desde **Repaso** (`source: "review"`), no al reintentar justo después de ver la solución.
- **Misiones semanales**: rotan por semana ISO (`isoWeek % sets.length`). Gramática se completa
  sola (`MissionWatcher`); participación al publicar vinculado a la misión.
- **Pinyin carácter a carácter**: en `zh()` las sílabas se separan con `-` (`měi-tiān`) para poder
  usar `<ruby>` por hanzi y colorear tonos.
- **TTS** (`src/lib/tts.ts`, usado vía `useSpeech`): primero la voz del navegador (Web Speech
  API) si existe para el idioma; si no hay voz (Windows sin voz china, Firefox, el navegador
  integrado de Claude/Electron, que no expone ninguna voz) o falla, cae a MP3 desde
  `/api/tts` (Google Translate TTS no oficial, cacheado en CDN). Un solo audio suena a la vez.
  Fase 2: cambiar `/api/tts` a un proveedor oficial (Azure / Google Cloud) con API key.
- **Escritura de hanzi**: `hanzi-writer` (MIT) con datos de Make Me a Hanzi desde jsDelivr. Los
  nombres de trazo salen de `CHARACTER_STROKES` (revisados y contrastados con la geometría real);
  si un carácter no está anotado o el número de trazos no cuadra, se estiman con
  `classifyStroke` (~96 % de acierto sobre los anotados) y la UI lo marca «nombres aproximados».
  **Al añadir caracteres nuevos al temario, añade su anotación** en `src/data/zh/strokes.ts`.
- **Pronunciación** (`useVoiceRecorder` + `lib/stt.ts` + `workers/whisper.worker.ts`): se graba
  con el micrófono elegido (MediaRecorder, fin automático por silencio) y se transcribe **en el
  dispositivo** con Whisper base (transformers.js en un Web Worker). NO se usa la Web Speech API
  de reconocimiento: escucha solo el micrófono predeterminado y fallaba con micrófonos USB.
  Con WebGPU el encoder va en GPU (fp16) y el decoder en CPU (q8); sin WebGPU, todo en CPU.
  El modelo (~95 MB) se descarga una vez de Hugging Face y queda en caché. ~2 s por frase.
  En chino se compara por **pinyin sin tono** (`pinyin-pro`): homófonos y caracteres tradicionales
  cuentan como acierto. Mide inteligibilidad, no tonos reales (Fase 2: API de evaluación).
- **Cabeceras COOP/COEP** (`next.config.ts`, `credentialless`): dan `crossOriginIsolated` para que
  ONNX/WASM use varios hilos. Cualquier recurso externo nuevo debe admitir CORS o cargarse sin
  credenciales; si algo externo deja de cargar, revisa esto primero.

- **Fonética** (`/app/fonetica`, solo chino HSK 1–2): cada `PhoneticsModule` tiene bloques
  propios (además de los de teoría) y ejercicios del motor normal. Para la práctica se convierte
  en `Lesson` (`phoneticsLesson`) y se reutiliza `PracticeSection`: completar un módulo usa
  `completeLesson`, y sus fallos van a Repaso porque los módulos se indexan en `mockSyllabus`
  (sin formar parte del curso: no cuentan en el progreso del libro). El enlace del menú solo
  aparece en esos niveles (`NAV[].levels`). El audio sale del hanzi de cada ejemplo.

## Cómo añadir contenido

Ver `docs/CONTENT_GUIDE.md`. Resumen: crea/edita la unidad en `src/data/<idioma>/`, regístrala
en `mockSyllabus.ts` y, si hay misiones del nivel, en `src/data/classroom.ts`.

## Despliegue

GitHub → Vercel (plan gratuito) → dominio en Cloudflare. Pasos exactos en `docs/DEPLOYMENT.md`.

## Entorno local (Windows)

En la shell Bash de este entorno, `mv`/`sed -i`/escrituras de Python sobre archivos del repo
pueden fallar por permisos; usa las herramientas de edición o PowerShell para renombrar/modificar.
