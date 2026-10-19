import { pinyin } from "pinyin-pro";
import type { LanguageCode } from "@/types/learning";

/**
 * Comparación entre lo que el alumno debía decir y lo que el reconocimiento de
 * voz entendió. En chino se compara carácter a carácter; en inglés, palabra a palabra.
 *
 * Limitación de la Fase 1: el reconocimiento devuelve hanzi, no tonos, así que la
 * puntuación mide inteligibilidad (¿te entendió?) y no la precisión tonal fina.
 * La Fase 2 puede usar una API de evaluación de pronunciación (tonos y fonemas).
 */

const DIGITS = "零一二三四五六七八九";

/** 0–99 en cifras → hanzi (7 → 七, 11 → 十一, 30 → 三十). */
function numberToHanzi(n: number): string {
  if (n < 10) return DIGITS[n];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const unit = n % 10;
    return `${tens === 1 ? "" : DIGITS[tens]}十${unit ? DIGITS[unit] : ""}`;
  }
  return String(n)
    .split("")
    .map((d) => DIGITS[Number(d)])
    .join("");
}

export function unitsZh(text: string): string[] {
  return Array.from(
    text
      .replace(/\d+/g, (m) => numberToHanzi(Number(m)))
      .replace(/两/g, "二") // 两 / 二: el reconocedor los alterna según el contexto
      .replace(/[^㐀-鿿]/g, ""),
  );
}

const CONTRACTIONS: [RegExp, string][] = [
  [/\bwon't\b/g, "will not"],
  [/\bcan't\b/g, "can not"],
  [/\bcannot\b/g, "can not"],
  [/n't\b/g, " not"],
  [/'ve\b/g, " have"],
  [/'re\b/g, " are"],
  [/'m\b/g, " am"],
  [/'ll\b/g, " will"],
  [/'d\b/g, " would"],
];

export function unitsEn(text: string): string[] {
  let t = text.toLowerCase().replace(/[’`´]/g, "'");
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  return t
    .replace(/[^a-z0-9'\s-]/g, " ")
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export const unitsFor = (language: LanguageCode, text: string) => (language === "zh" ? unitsZh(text) : unitsEn(text));

export interface PronunciationResult {
  score: number;
  /** Unidades del objetivo (caracteres o palabras) con su estado. */
  target: { unit: string; matched: boolean }[];
  heard: string;
}

/** Subsecuencia común más larga → qué unidades del objetivo se reconocieron. */
function lcsMatches<A, B>(a: A[], b: B[], eq: (x: A, y: B) => boolean): boolean[] {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = eq(a[i], b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const matched = new Array<boolean>(a.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (eq(a[i], b[j])) {
      matched[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return matched;
}

/**
 * En chino se compara por SONIDO: un carácter cuenta como acertado si es el
 * mismo o si alguna de sus lecturas coincide con la sílaba esperada (sin tono).
 * Así no penalizamos homófonos (你/拟) ni caracteres tradicionales (車/车) que
 * el reconocedor a veces escribe.
 */
function zhMatches(expectedChars: string[], heardChars: string[]): boolean[] {
  const expectedSyl = pinyin(expectedChars.join(""), { toneType: "none", type: "array" });
  const heardReadings = heardChars.map(
    (c) => new Set([...pinyin(c, { toneType: "none", type: "array", multiple: true }), c]),
  );
  const a = expectedChars.map((c, i) => ({ c, syl: expectedSyl[i] }));
  return lcsMatches(a, heardReadings, (x, readings) => readings.has(x.c) || readings.has(x.syl));
}

export function scorePronunciation(language: LanguageCode, expected: string, heard: string): PronunciationResult {
  const a = unitsFor(language, expected);
  const b = unitsFor(language, heard);
  const matched = language === "zh" ? zhMatches(a, b) : lcsMatches(a, b, (x, y) => x === y);
  const hits = matched.filter(Boolean).length;
  // Coeficiente de Dice: penaliza tanto lo que falta como lo que sobra.
  const score = a.length + b.length ? Math.round((200 * hits) / (a.length + b.length)) : 0;
  return { score, heard, target: a.map((unit, i) => ({ unit, matched: matched[i] })) };
}

/** Elige, entre las alternativas del reconocedor, la que mejor puntúa. */
export function bestAlternative(language: LanguageCode, expected: string, alternatives: string[]): PronunciationResult {
  return alternatives
    .map((alt) => scorePronunciation(language, expected, alt))
    .reduce((best, r) => (r.score > best.score ? r : best), scorePronunciation(language, expected, ""));
}

export function feedbackFor(score: number): { title: string; body: string; tone: "success" | "warning" | "danger" } {
  if (score >= 90) return { title: "¡Excelente!", body: "Se te entiende perfectamente.", tone: "success" };
  if (score >= 70)
    return { title: "¡Bien!", body: "Casi todo se entendió. Repite las partes en rojo.", tone: "success" };
  if (score >= 40)
    return {
      title: "Vas por buen camino",
      body: "Escucha el modelo en lento y repite frase a frase, cuidando los tonos.",
      tone: "warning",
    };
  return {
    title: "Inténtalo otra vez",
    body: "Habla cerca del micrófono, a un ritmo tranquilo, y escucha antes el modelo.",
    tone: "danger",
  };
}
