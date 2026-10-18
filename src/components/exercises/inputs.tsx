"use client";

import { useState } from "react";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { displayPinyin } from "@/lib/richText";
import type { ExerciseAnswer } from "@/lib/exercises/evaluate";
import { useLearningStore } from "@/store/useLearningStore";
import type {
  FillBlankExercise,
  LanguageCode,
  MultipleChoiceExercise,
  SentenceBuilderExercise,
  TextToken,
  TonePracticeExercise,
} from "@/types/learning";
import { RichTextView } from "@/components/text/RichTextView";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { Button } from "@/components/ui/primitives";

export interface InputProps<E> {
  exercise: E;
  language: LanguageCode;
  locked: boolean;
  onSubmit: (answer: ExerciseAnswer) => void;
}

const CHECK_LABEL = "Comprobar";

// ─── Constructor de oraciones ─────────────────────────────────────────────────

function BlockChip({
  block,
  isZh,
  showPinyin,
  locked,
  onClick,
}: {
  block: TextToken;
  isZh: boolean;
  showPinyin: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center rounded-xl border border-line bg-surface px-3 py-1.5 shadow-[0_2px_0_var(--line)] transition hover:-translate-y-0.5 hover:border-accent disabled:hover:translate-y-0",
        isZh && "min-w-12",
      )}
    >
      {isZh && showPinyin && block.pinyin && <span className="text-[11px] text-muted">{displayPinyin(block.pinyin)}</span>}
      <span className={cn(isZh ? "font-cjk text-2xl" : "text-base font-medium")}>{block.text}</span>
    </button>
  );
}

export function SentenceBuilderInput({ exercise, language, locked, onSubmit }: InputProps<SentenceBuilderExercise>) {
  const showPinyin = useLearningStore((s) => s.preferences.showPinyin);
  const [order, setOrder] = useState<number[]>([]);
  const isZh = language === "zh";
  const chip = { isZh, showPinyin, locked };

  return (
    <div>
      <p className="mb-3 text-lg font-medium">«{exercise.prompt}»</p>
      <div className="flex min-h-20 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-line bg-surface-2/60 p-3">
        {order.length === 0 && <span className="text-sm text-muted">Toca los bloques para construir la oración…</span>}
        {order.map((idx, pos) => (
          <BlockChip
            key={`${idx}-${pos}`}
            {...chip}
            block={exercise.blocks[idx]}
            onClick={() => setOrder((o) => o.filter((_, p) => p !== pos))}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {exercise.blocks.map((_, idx) =>
          order.includes(idx) ? (
            <span key={idx} className="rounded-xl border border-dashed border-line px-3 py-1.5 opacity-40">
              <span className={cn("invisible", isZh ? "font-cjk text-2xl" : "")}>{exercise.blocks[idx].text}</span>
            </span>
          ) : (
            <BlockChip key={idx} {...chip} block={exercise.blocks[idx]} onClick={() => setOrder((o) => [...o, idx])} />
          ),
        )}
      </div>
      <div className="mt-5 flex gap-2">
        <Button onClick={() => onSubmit({ type: "sentence-builder", order })} disabled={locked || order.length === 0}>
          {CHECK_LABEL}
        </Button>
        <Button variant="ghost" onClick={() => setOrder([])} disabled={locked || order.length === 0}>
          <Undo2 size={15} /> Limpiar
        </Button>
      </div>
    </div>
  );
}

// ─── Completar el hueco ───────────────────────────────────────────────────────

export function FillBlankInput({ exercise, language, locked, onSubmit }: InputProps<FillBlankExercise>) {
  const showTranslation = useLearningStore((s) => s.preferences.showTranslation);
  const [value, setValue] = useState("");
  const isZh = language === "zh";

  return (
    <div>
      <div className={cn("flex flex-wrap items-end gap-x-2 gap-y-1", isZh ? "" : "text-xl")}>
        <RichTextView text={exercise.before} size="lg" />
        <span
          className={cn(
            "inline-flex min-w-20 items-center justify-center border-b-2 px-2 pb-0.5 text-center",
            value ? "border-accent text-accent" : "border-muted text-muted",
            isZh ? "font-cjk text-2xl" : "text-xl font-semibold",
          )}
        >
          {value || "＿＿"}
        </span>
        <RichTextView text={exercise.after} size="lg" />
      </div>
      {showTranslation && <p className="mt-2 text-sm text-muted">{exercise.translation}</p>}

      {exercise.options ? (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {exercise.options.map((o) => (
            <button
              key={o.value}
              type="button"
              disabled={locked}
              onClick={() => setValue(o.value)}
              className={cn(
                "flex items-baseline gap-2 rounded-xl border-2 px-4 py-2.5 text-left transition",
                value === o.value ? "border-accent bg-accent-soft" : "border-line hover:border-ink/20",
              )}
            >
              <span className={cn(isZh ? "font-cjk text-xl" : "font-medium")}>{o.value}</span>
              {o.pinyin && <span className="text-sm text-muted">{o.pinyin}</span>}
            </button>
          ))}
        </div>
      ) : (
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) onSubmit({ type: "fill-blank", value });
          }}
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={locked}
            autoComplete="off"
            spellCheck={false}
            placeholder="Escribe tu respuesta…"
            className="w-full max-w-sm rounded-xl border border-line bg-surface px-3 py-2.5 text-lg outline-none focus:border-accent"
          />
          {exercise.hint && <p className="mt-2 text-xs text-muted">Pista: {exercise.hint}</p>}
        </form>
      )}

      <div className="mt-5">
        <Button onClick={() => onSubmit({ type: "fill-blank", value })} disabled={locked || !value.trim()}>
          {CHECK_LABEL}
        </Button>
      </div>
    </div>
  );
}

// ─── Opción múltiple ──────────────────────────────────────────────────────────

export function MultipleChoiceInput({ exercise, language, locked, onSubmit }: InputProps<MultipleChoiceExercise>) {
  const showPinyin = useLearningStore((s) => s.preferences.showPinyin);
  const [choice, setChoice] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center gap-3">
        {exercise.audioText && <SpeakButton text={exercise.audioText} language={language} size="lg" />}
        <p className="text-lg font-medium">{exercise.question}</p>
      </div>
      <div className="mt-5 grid gap-2">
        {exercise.options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            disabled={locked}
            onClick={() => setChoice(o.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition",
              choice === o.id ? "border-accent bg-accent-soft" : "border-line hover:border-ink/20",
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line text-xs font-semibold text-muted">
              {String.fromCharCode(65 + i)}
            </span>
            <span>
              <span className={cn(/[㐀-鿿]/.test(o.text) ? "font-cjk text-xl" : "font-medium")}>{o.text}</span>
              {o.pinyin && showPinyin && <span className="block text-sm text-muted">{o.pinyin}</span>}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5">
        <Button onClick={() => choice && onSubmit({ type: "multiple-choice", optionId: choice })} disabled={locked || !choice}>
          {CHECK_LABEL}
        </Button>
      </div>
    </div>
  );
}

// ─── Práctica de tonos ────────────────────────────────────────────────────────

const TONE_BUTTONS = [
  { tone: 1, mark: "ˉ", label: "1.º" },
  { tone: 2, mark: "ˊ", label: "2.º" },
  { tone: 3, mark: "ˇ", label: "3.º" },
  { tone: 4, mark: "ˋ", label: "4.º" },
  { tone: 5, mark: "·", label: "neutro" },
];

export function TonePracticeInput({ exercise, locked, onSubmit }: InputProps<TonePracticeExercise>) {
  const [tones, setTones] = useState<(number | null)[]>(() => exercise.syllables.map(() => null));
  const chars = Array.from(exercise.word);
  const ready = tones.every((t) => t !== null);

  return (
    <div>
      <div className="flex items-center gap-4">
        <span lang="zh-CN" className="font-cjk text-6xl">
          {exercise.word}
        </span>
        <div className="flex flex-col gap-1.5">
          <SpeakButton text={exercise.word} language="zh" size="lg" />
          <SpeakButton text={exercise.word} language="zh" size="sm" slow label="Lento" />
        </div>
      </div>
      <p className="mt-1 text-sm text-muted">«{exercise.meaning}» — el pinyin está oculto: ¡usa el oído!</p>

      <div className="mt-6 grid gap-4">
        {exercise.syllables.map((syl, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3">
            <span className="flex w-24 items-baseline gap-2">
              <span className="font-cjk text-2xl">{chars[i]}</span>
              <span className="font-mono text-sm text-muted">{syl.base}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TONE_BUTTONS.map((b) => (
                <button
                  key={b.tone}
                  type="button"
                  disabled={locked}
                  onClick={() => setTones((t) => t.map((v, j) => (j === i ? b.tone : v)))}
                  className={cn(
                    "flex h-11 min-w-14 flex-col items-center justify-center rounded-xl border-2 px-2 text-xs transition",
                    tones[i] === b.tone ? "border-accent bg-accent-soft text-accent" : "border-line hover:border-ink/20",
                  )}
                >
                  <span className="text-lg leading-none">{b.mark}</span>
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={() => onSubmit({ type: "tone-practice", tones: tones as number[] })} disabled={locked || !ready}>
          {CHECK_LABEL}
        </Button>
      </div>
    </div>
  );
}
