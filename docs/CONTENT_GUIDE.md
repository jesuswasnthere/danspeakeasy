# Guía de contenido

## Escribir chino con pinyin: `zh()`

```ts
import { zh } from "@/lib/richText";

zh("我:wǒ 每天:měi-tiān 七:qī 点:diǎn 起床:qǐ-chuáng 。");
```

- Tokens separados por espacios. Formato `hanzi:pinyin`.
- **Una sílaba por carácter, separadas con `-`** (`měi-tiān`). Así se pinta `<ruby>` sobre cada
  hanzi y se colorea su tono. Si el número de sílabas no coincide con el de caracteres, el pinyin
  se muestra sobre la palabra completa (sin colores).
- Puntuación y números sin `:` → se muestran sin pinyin.
- Usa siempre marcas tonales (`ā á ǎ à`), nunca números. El tono neutro va sin marca (`ne`, `xi`).
- Aplica los cambios tonales reales cuando corresponda (`一起 yì-qǐ`, `一件 yí-jiàn`, `不是 bú-shì`).

## Estructura de una lección (`Lesson`)

1. `theory`: bloques `paragraph`, `grammar` (patrón + explicación + ejemplos), `table`, `note`
   (`culture` · `grammar` · `tip` · `warning`).
2. `vocabulary`: `term`, `pinyin` + `tones` (chino) o `ipa` (inglés), `meaning`, `partOfSpeech`,
   `example`, `note` opcional.
3. `dialogues`: hablantes + líneas (`RichText` + traducción).
4. `characters` (solo chino): radical, componentes, trazos, mnemotecnia.
5. `exercises` (5–7 recomendados), mezclando tipos:
   - `sentence-builder`: `blocks` + `solutions` (índices; admite varias soluciones válidas y
     distractores).
   - `fill-blank`: `before` / `after` + `options` (con `feedback` por opción) o respuesta libre
     con `accepted`.
   - `multiple-choice`: opciones con `feedback` individual; `audioText` opcional para escucha.
   - `tone-practice` (chino): sílabas con `base`, `marked`, `tone` (5 = neutro).
   - Todos requieren `skill` (agrupa los errores en el dashboard) y `explanation` (el «¿por qué?»).

## Registrar contenido nuevo

1. Crea o edita la unidad en `src/data/zh/` o `src/data/en/`.
2. Añádela a `UNITS_BY_LEVEL` en `src/data/mockSyllabus.ts`.
3. Los ids deben ser únicos y estables (`zh-hsk2-u1-l1-e3`): el progreso del alumno se guarda por id.
   Cambiar un id = perder el progreso de ese elemento.
4. Misiones semanales del nivel: añade un `MissionSet` en `MISSION_SETS` (`src/data/classroom.ts`).
   Rotan automáticamente por semana ISO.
5. Ejecuta `pnpm typecheck` — los tipos validan la forma del contenido.
