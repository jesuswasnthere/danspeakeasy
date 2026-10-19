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

## Fonética (chino HSK 1–2)

Los módulos viven en `src/data/zh/phonetics.ts` y se registran en `PHONETICS_BY_LEVEL`. Un
`PhoneticsModule` tiene `blocks` (cualquier `TheoryBlock` más los bloques propios: `tones`,
`sounds`, `tone-changes`, `minimal-pairs`, `tone-grid`) y `exercises` del motor normal.

- Cada ejemplo (`SoundExample`) se escucha generando el audio a partir de su `hanzi`: usa
  caracteres o palabras reales, preferiblemente del vocabulario HSK 1–2.
- Pinyin siempre con marcas tonales. En `tone-changes`, `written` es el pinyin del diccionario y
  `spoken` lo que se oye (3.º + 3.º, 不, 一, 儿化…).
- AFI aproximada y sin corchetes en `ipa` (la UI los añade).
- Los `id` de ejercicio deben ser únicos (`zh-phon-hsk1-m3-e2`): los fallos se guardan por id.

## Radicales (chino)

Viven en `src/data/zh/radicals.ts` (`RADICALS`, agrupados por `RADICAL_CATEGORIES`) y se leen con
`content.getRadicals()`. Un `Radical` lleva su forma independiente (`glyph`), las variantes que adopta
dentro de otros caracteres (`variants`, p. ej. 氵 de 水), el apodo coloquial (`nickname`, 三点水), cómo
reconocerlo (`recognize`), su uso diario (`usage`) y `examples` reales.

- Los ejemplos deben ser vocabulario común. Si un ejemplo contiene a la vista otros radicales del
  catálogo, anótalos en `RADICAL_VISIBLE_COMPONENTS` (hanzi → ids): el quiz los usa para no ofrecer
  como distractor un radical visible en el carácter (`includes` no sirve: cada hanzi es un solo punto Unicode).
- `core: true` marca los imprescindibles (filtro «Solo los imprescindibles»).
- `PHONETIC_FAMILIES` muestra un mismo componente de sonido con radicales distintos (青 → 清 请 晴 情).
- Si dos radicales se escriben igual (阝, 月), el quiz no pregunta su significado en abstracto: solo los pregunta con un carácter de ejemplo.

## Práctica de escritura: nombres de los trazos

La sección **Práctica → Escritura** toma automáticamente los caracteres de las lecciones del
nivel. Para que cada trazo muestre su nombre oficial, anota el carácter en
`src/data/zh/strokes.ts` → `CHARACTER_STROKES`:

```ts
冷: ["dian", "ti", "pie", "na", "dian", "hengpie", "dian"],
```

- Usa el orden de trazos estándar de China continental (el de los datos de Make Me a Hanzi).
- El número de entradas debe coincidir con el número de trazos de los datos; si no, la app ignora
  la anotación y usa el clasificador automático («nombres aproximados»).
- Tipos disponibles: ver `STROKE_TYPES` (横 heng, 竖 shu, 撇 pie, 捺 na, 点 dian, 提 ti, 横折,
  横撇, 横折钩, 横折弯钩, 横钩, 竖钩, 竖弯钩, 竖提, 竖折, 竖弯, 撇点, 撇折, 弯钩, 斜钩, 卧钩).

Las lecturas con audio y la pronunciación se generan solas a partir de los diálogos, el
vocabulario y las lecturas de las misiones semanales.
