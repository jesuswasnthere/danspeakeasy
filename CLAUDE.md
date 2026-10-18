@AGENTS.md

# LingoAula — knowledge del proyecto

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
| `src/components/practice/` | Práctica de habilidades: `StrokePractice` (hanzi trazo a trazo con nombre de cada trazo), `ReadingPractice` (lectura con audio, modo sombra), `PronunciationPractice` (micrófono + puntuación) |
| `src/data/zh/strokes.ts` | Tipos de trazo (横, 竖, 撇…) y orden revisado de los caracteres del temario |
| `src/data/practice.ts` | Contenido de práctica derivado de las lecciones (caracteres, lecturas, ítems de pronunciación) |
| `src/lib/strokes.ts` | Carga de datos de trazos (CDN hanzi-writer-data) + clasificador geométrico para caracteres no anotados |
| `src/lib/pronunciation.ts` | Comparación objetivo ↔ reconocimiento de voz (LCS + Dice), normalización de números/contracciones |
| `src/hooks/` | `useSpeech` (TTS, secuencias con resaltado), `useVoiceRecorder` (SpeechRecognition + MediaRecorder) |
| `src/app/` | Rutas: `/` (progreso), `/libro`, `/practica`, `/repaso`, `/aula` |

## Decisiones clave (y por qué)

- **Hidratación manual** (`skipHydration` + `rehydrate()` en `AppShell`): el estado está en
  localStorage, así que las páginas se renderizan solo en cliente tras hidratar. Por eso cada
  `page.tsx` exporta `instant = false` (si no, Next 16 avisa en dev de "dropped segment").
- **Nivel por idioma** (`levelByLanguage`): cambiar de idioma recuerda el último nivel de cada uno.
- **Errores**: un fallo en el libro crea/actualiza un `MistakeEntry`; solo se marca resuelto al
  acertarlo desde **Repaso** (`source: "review"`), no al reintentar justo después de ver la solución.
- **Misiones semanales**: rotan por semana ISO (`isoWeek % sets.length`). Gramática se completa
  sola (`MissionWatcher`); participación al publicar vinculado a la misión.
- **Pinyin carácter a carácter**: en `zh()` las sílabas se separan con `-` (`měi-tiān`) para poder
  usar `<ruby>` por hanzi y colorear tonos.
- **TTS**: Web Speech API (`zh-CN` / `en-US`), gratis. Sustituible por TTS neuronal en Fase 2.
- **Escritura de hanzi**: `hanzi-writer` (MIT) con datos de Make Me a Hanzi desde jsDelivr. Los
  nombres de trazo salen de `CHARACTER_STROKES` (revisados y contrastados con la geometría real);
  si un carácter no está anotado o el número de trazos no cuadra, se estiman con
  `classifyStroke` (~96 % de acierto sobre los anotados) y la UI lo marca «nombres aproximados».
  **Al añadir caracteres nuevos al temario, añade su anotación** en `src/data/zh/strokes.ts`.
- **Pronunciación**: SpeechRecognition solo existe en Chrome/Edge y necesita internet. Mide
  inteligibilidad (qué caracteres/palabras se reconocieron), no la precisión tonal: para tonos
  reales hará falta una API de evaluación de pronunciación en la Fase 2. Siempre se graba la voz
  (MediaRecorder) para que el alumno se compare con el modelo.

## Cómo añadir contenido

Ver `docs/CONTENT_GUIDE.md`. Resumen: crea/edita la unidad en `src/data/<idioma>/`, regístrala
en `mockSyllabus.ts` y, si hay misiones del nivel, en `src/data/classroom.ts`.

## Despliegue

GitHub → Vercel (plan gratuito) → dominio en Cloudflare. Pasos exactos en `docs/DEPLOYMENT.md`.

## Entorno local (Windows)

En la shell Bash de este entorno, `mv`/`sed -i`/escrituras de Python sobre archivos del repo
pueden fallar por permisos; usa las herramientas de edición o PowerShell para renombrar/modificar.
