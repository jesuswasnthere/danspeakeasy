/**
 * Contenido de práctica derivado del temario: caracteres para escribir,
 * textos para leer con audio y frases/palabras para pronunciar.
 * No duplica datos: todo sale de las lecciones y misiones del nivel.
 */
import { isRichTokens, plainText, syllables } from "@/lib/richText";
import type {
  LanguageCode,
  LevelCode,
  PracticeCharacter,
  PronunciationItem,
  ReadingPassage,
  ReadingSentence,
  RichText,
  TextToken,
} from "@/types/learning";
import { SYLLABUS, lessonsOf } from "./mockSyllabus";
import { missionSetsFor } from "./classroom";

const HANZI = /[㐀-鿿]/;

/** Todos los textos con tokens de una lista de lecciones (para deducir el pinyin de cada hanzi). */
function collectTokens(level: LevelCode): TextToken[] {
  const out: TextToken[] = [];
  const add = (t?: RichText) => t && isRichTokens(t) && out.push(...t);
  for (const lesson of lessonsOf(SYLLABUS[level])) {
    add(lesson.nativeTitle);
    lesson.vocabulary.forEach((v) => add(v.example?.text));
    lesson.dialogues.forEach((d) => d.lines.forEach((l) => add(l.text)));
    lesson.theory.forEach((b) => b.kind === "grammar" && b.examples.forEach((e) => add(e.text)));
  }
  return out;
}

export function practiceCharactersFor(level: LevelCode): PracticeCharacter[] {
  if (SYLLABUS[level].language !== "zh") return [];
  const pinyinOf = new Map<string, string>();
  for (const tok of collectTokens(level)) {
    if (!tok.pinyin) continue;
    const chars = Array.from(tok.text);
    const syls = syllables(tok.pinyin);
    if (chars.length !== syls.length) continue;
    chars.forEach((c, i) => !pinyinOf.has(c) && pinyinOf.set(c, syls[i]));
  }

  const result = new Map<string, PracticeCharacter>();
  for (const lesson of lessonsOf(SYLLABUS[level])) {
    // Primero los caracteres con desglose (los "protagonistas" de la lección).
    for (const b of lesson.characters ?? []) {
      result.set(b.char, {
        char: b.char,
        pinyin: b.pinyin,
        meaning: b.meaning,
        breakdown: b,
        words: [...b.usedIn],
        lessonId: lesson.id,
      });
    }
    for (const v of lesson.vocabulary) {
      for (const c of Array.from(v.term)) {
        if (!HANZI.test(c)) continue;
        const entry = result.get(c);
        if (entry) {
          if (!entry.words.includes(v.term)) entry.words.push(v.term);
          continue;
        }
        result.set(c, {
          char: c,
          pinyin: pinyinOf.get(c),
          meaning: v.term.length === 1 ? v.meaning : `en ${v.term}: ${v.meaning}`,
          words: [v.term],
          lessonId: lesson.id,
        });
      }
    }
  }
  return [...result.values()];
}

// ─── Lectura ─────────────────────────────────────────────────────────────────

/** Divide un texto en oraciones (tokens en chino, regex en inglés). */
function splitSentences(text: RichText): RichText[] {
  if (!isRichTokens(text)) return text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const out: TextToken[][] = [[]];
  for (const t of text) {
    out[out.length - 1].push(t);
    if (/^[。！？]$/.test(t.text)) out.push([]);
  }
  return out.filter((s) => s.length);
}

export function readingPassagesFor(language: LanguageCode, level: LevelCode): ReadingPassage[] {
  const passages: ReadingPassage[] = [];
  for (const unit of SYLLABUS[level].units) {
    for (const lesson of unit.lessons) {
      for (const d of lesson.dialogues) {
        passages.push({
          id: `read-${d.id}`,
          title: d.title,
          source: `U${unit.order} · L${lesson.order} · ${lesson.title}`,
          kind: "diálogo",
          sentences: d.lines.map(
            (l): ReadingSentence => ({ text: l.text, translation: l.translation, speaker: l.speaker }),
          ),
        });
      }
    }
  }
  for (const set of missionSetsFor(language, level)) {
    for (const m of set.missions) {
      if (m.kind !== "reading") continue;
      passages.push({
        id: `read-${m.id}`,
        title: m.passage.title,
        source: `Misión semanal · ${set.theme}`,
        kind: "lectura",
        sentences: splitSentences(m.passage.text).map((text) => ({ text })),
        translation: m.passage.translation,
      });
    }
  }
  return passages;
}

// ─── Pronunciación ───────────────────────────────────────────────────────────

const clean = (s: string) => s.replace(/\s*\(.*?\)/g, "").trim();

export function pronunciationItemsFor(level: LevelCode): PronunciationItem[] {
  const items: PronunciationItem[] = [];
  for (const unit of SYLLABUS[level].units) {
    for (const lesson of unit.lessons) {
      const source = `L${lesson.order} · ${lesson.title}`;
      for (const v of lesson.vocabulary) {
        const term = clean(v.term);
        items.push({
          id: `pron-${v.id}`,
          kind: "palabra",
          text: term,
          plain: term,
          translation: v.meaning,
          source,
          pinyin: v.pinyin,
          tones: v.tones,
          ipa: v.ipa,
        });
      }
      for (const v of lesson.vocabulary) {
        if (!v.example) continue;
        items.push({
          id: `pron-${v.id}-ex`,
          kind: "frase",
          text: v.example.text,
          plain: plainText(v.example.text),
          translation: v.example.translation,
          source,
        });
      }
      for (const d of lesson.dialogues) {
        d.lines.forEach((l, i) =>
          items.push({
            id: `pron-${d.id}-${i}`,
            kind: "frase",
            text: l.text,
            plain: plainText(l.text),
            translation: l.translation,
            source: `${source} · diálogo`,
          }),
        );
      }
    }
  }
  return items;
}
