import type { RichText, TextToken } from "@/types/learning";

/**
 * Construye tokens de chino a partir de una cadena compacta:
 *
 *   zh("你:nǐ 每天:měi-tiān 几:jǐ 点:diǎn 起床:qǐ-chuáng ？")
 *
 * - Los tokens se separan por espacios.
 * - `hanzi:pinyin`, con las sílabas del pinyin separadas por `-` (una por carácter),
 *   lo que permite renderizar `<ruby>` carácter a carácter y colorear tonos.
 * - Los tokens sin `:` (puntuación, números) se renderizan sin pinyin.
 */
export function zh(source: string): TextToken[] {
  return source
    .trim()
    .split(/\s+/)
    .map((raw) => {
      const idx = raw.indexOf(":");
      if (idx === -1) return { text: raw };
      return { text: raw.slice(0, idx), pinyin: raw.slice(idx + 1) };
    });
}

/** Bloques para ejercicios de inglés: "I | have | been" → tokens. */
export function en(...words: string[]): TextToken[] {
  return words.map((text) => ({ text }));
}

const TONE_MARKS: Record<string, 1 | 2 | 3 | 4> = {
  ā: 1, ē: 1, ī: 1, ō: 1, ū: 1, ǖ: 1,
  á: 2, é: 2, í: 2, ó: 2, ú: 2, ǘ: 2,
  ǎ: 3, ě: 3, ǐ: 3, ǒ: 3, ǔ: 3, ǚ: 3,
  à: 4, è: 4, ì: 4, ò: 4, ù: 4, ǜ: 4,
};

export type Tone = 1 | 2 | 3 | 4 | 5;

/** Devuelve el tono (1-4) de una sílaba con marca tonal, o 5 si es neutro. */
export function getTone(syllable: string): Tone {
  for (const ch of syllable.toLowerCase()) {
    const t = TONE_MARKS[ch];
    if (t) return t;
  }
  return 5;
}

/** Sílabas de un token (`měi-tiān` → ["měi", "tiān"]). */
export function syllables(pinyin: string): string[] {
  return pinyin.split("-").filter(Boolean);
}

/** Pinyin para mostrar (sin guiones internos). */
export function displayPinyin(pinyin: string): string {
  return pinyin.replace(/-/g, "");
}

export function isRichTokens(text: RichText): text is TextToken[] {
  return Array.isArray(text);
}

/** Texto plano (hanzi o inglés) de un RichText — útil para TTS. */
export function plainText(text: RichText): string {
  if (!isRichTokens(text)) return text;
  return text.map((t) => t.text).join("");
}

/** Pinyin de la oración completa, con la puntuación pegada. */
export function pinyinLine(text: RichText): string {
  if (!isRichTokens(text)) return "";
  return text
    .map((t) => (t.pinyin ? ` ${displayPinyin(t.pinyin)}` : t.text))
    .join("")
    .trim();
}

export const TONE_LABELS: Record<Tone, string> = {
  1: "1.º tono · alto y plano (ˉ)",
  2: "2.º tono · ascendente (ˊ)",
  3: "3.º tono · bajo, baja y sube (ˇ)",
  4: "4.º tono · descendente (ˋ)",
  5: "Tono neutro · corto y ligero",
};

/** Clases de color por tono (convención habitual en apps de chino). */
export const TONE_CLASSES: Record<Tone, string> = {
  1: "text-tone-1",
  2: "text-tone-2",
  3: "text-tone-3",
  4: "text-tone-4",
  5: "text-tone-5",
};
