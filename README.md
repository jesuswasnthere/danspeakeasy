# DanSpeakeasy

Plataforma para aprender **Chino Mandarín (HSK 1–6)** e **Inglés (MCER A1–C2)** con estructura,
interactividad real, seguimiento pedagógico y comunidad **segmentada por nivel exacto**.

> Fase 1 · MVP sin backend: todo el progreso se guarda en el navegador (localStorage).
> La arquitectura está preparada para conectar base de datos y LLMs en la Fase 2.

## Funcionalidades

- **Onboarding por nivel** — idioma + nivel; todo el contenido y el aula se filtran por él.
- **Libro de Clase Digital** — unidades y lecciones secuenciales: teoría, tablas, notas
  culturales, vocabulario con audio, diálogos con pinyin `<ruby>` dinámico y tarjetas de hanzi
  con desglose de radicales.
- **Motor de ejercicios** — constructor de oraciones, completar huecos, opción múltiple y
  práctica de tonos, con corrección inmediata y explicación del porqué.
- **Dashboard de seguimiento** — avance del libro, racha, XP semanal, vocabulario dominado
  (Leitner), bandeja de errores y puntos débiles.
- **Práctica de habilidades** —
  - *Escritura de hanzi* trazo a trazo (animación, con guía y de memoria) mostrando el **nombre
    de cada trazo** (横 héng, 竖 shù, 撇 piě…) a medida que se escribe, con aviso de errores.
  - *Lectura con audio*: frase a frase con resaltado, palabras que se escuchan al tocarlas,
    modo «solo audio» y **modo sombra** (escucha y repite).
  - *Pronunciación*: lee en voz alta, el reconocimiento de voz puntúa qué partes se entendieron
    y puedes escuchar tu grabación junto al modelo.
- **Repaso** — tarjetas con repetición espaciada y re-práctica de errores.
- **Aula por nivel** — misiones semanales (lectura, escucha, gramática, participación) y tablón
  con compañeros del mismo nivel, incluidas correcciones entre pares.
- **Controles globales** — mostrar/ocultar pinyin, traducción, colores de tono y velocidad de audio
  (Web Speech API `zh-CN` / `en-US`).

Contenido completo: **HSK 2 · Unidad 1** (3 lecciones) e **Inglés B1 · Unidad 1** (3 lecciones).
HSK 1 y A2 tienen una lección base; el resto de niveles muestra unidades planificadas.

## Empezar

```bash
corepack enable
pnpm install
pnpm dev
```

Abre <http://localhost:3000> (landing) o <http://localhost:3000/app> (la app).

| Script | Uso |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo |
| `pnpm typecheck` | Comprobación de tipos |
| `pnpm lint` | ESLint |
| `pnpm build` / `pnpm start` | Build y servidor de producción |

## Estructura

```
src/
├── app/                      # Rutas (App Router)
│   ├── layout.tsx            # Layout raíz: fuentes (Geist + Noto Sans SC) y metadata/SEO
│   ├── page.tsx              # /              → landing pública (prerenderizada, indexable)
│   ├── robots.ts, sitemap.ts, manifest.ts, icon.tsx, apple-icon.tsx, opengraph-image.tsx
│   └── app/                  # App del alumno (noindex) con AppShell
│       ├── layout.tsx        # AppShell (hidratación + onboarding), instant = false, noindex
│       ├── page.tsx          # /app          → ProgressDashboard
│       ├── libro/page.tsx    # /app/libro    → InteractiveTextbook
│       ├── fonetica/page.tsx # /app/fonetica → PhoneticsCenter (chino HSK 1–2)
│       ├── radicales/page.tsx # /app/radicales → RadicalsCenter (chino)
│       ├── practica/page.tsx # /app/practica → PracticeHub
│       ├── repaso/page.tsx   # /app/repaso   → ReviewCenter
│       └── aula/page.tsx     # /app/aula     → LevelClassroom
├── components/
│   ├── layout/               # AppShell (hidratación + onboarding), Sidebar
│   ├── onboarding/           # Selección de idioma, nivel y perfil
│   ├── textbook/             # Libro: teoría, vocabulario, diálogos, hanzi, práctica
│   ├── exercises/            # ExerciseRunner + inputs por tipo
│   ├── dashboard/            # ProgressDashboard
│   ├── review/               # Tarjetas Leitner + errores
│   ├── classroom/            # Aula, misiones, tablón
│   ├── text/                 # RichTextView (<ruby> + colores de tono)
│   ├── audio/                # SpeakButton (TTS)
│   └── ui/                   # Primitivas (Card, Button, Switch…)
├── config/site.ts            # Nombre y navegación
├── data/                     # Contenido mock (niveles, unidades, aula)
├── hooks/useSpeech.ts        # Web Speech API
├── lib/
│   ├── content/              # ContentRepository (punto de enganche de la BD)
│   ├── exercises/evaluate.ts # Evaluación + FeedbackProvider (punto de enganche del LLM)
│   ├── richText.ts           # zh()/en(), tonos, utilidades CJK
│   └── dates.ts              # Días, semanas ISO, tiempo relativo
├── store/
│   ├── useLearningStore.ts   # Zustand + persist
│   └── selectors.ts          # Métricas derivadas
└── types/learning.ts         # Modelos de dominio
```

## Documentación

- [Arquitectura y plan de Fase 2](docs/ARCHITECTURE.md)
- [Guía para crear contenido](docs/CONTENT_GUIDE.md)
- [Despliegue: GitHub + Vercel + Cloudflare](docs/DEPLOYMENT.md)
