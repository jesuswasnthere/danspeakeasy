"use client";

import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { displayPinyin, getTone, isRichTokens, syllables, TONE_CLASSES } from "@/lib/richText";
import { useLearningStore } from "@/store/useLearningStore";
import type { RichText, TextToken } from "@/types/learning";

const SIZES = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-4xl",
  "2xl": "text-6xl",
} as const;

/**
 * Renderiza texto en chino con `<ruby>` (pinyin sobre cada hanzi) y colores de tono,
 * respetando las preferencias globales. Para texto plano (inglés) solo envuelve.
 */
export function RichTextView({
  text,
  size = "md",
  pinyin,
  toneColors,
  className,
}: {
  text: RichText;
  size?: keyof typeof SIZES;
  /** Fuerza mostrar/ocultar pinyin (por defecto: preferencia global). */
  pinyin?: boolean;
  toneColors?: boolean;
  className?: string;
}) {
  const prefs = useLearningStore((s) => s.preferences);
  const showPinyin = pinyin ?? prefs.showPinyin;
  const colored = toneColors ?? prefs.toneColors;

  if (!isRichTokens(text)) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      lang="zh-CN"
      className={cn(
        "font-cjk",
        SIZES[size],
        showPinyin ? "leading-ruby" : "leading-relaxed",
        colored && "tone-colored",
        className,
      )}
    >
      {text.map((token, i) => (
        <TokenView key={i} token={token} showPinyin={showPinyin} colored={colored} />
      ))}
    </span>
  );
}

function TokenView({ token, showPinyin, colored }: { token: TextToken; showPinyin: boolean; colored: boolean }) {
  if (!token.pinyin) return <span className="text-ink">{token.text}</span>;

  const chars = Array.from(token.text);
  const syls = syllables(token.pinyin);

  // Si no cuadran carácter ↔ sílaba, mostramos el pinyin sobre la palabra completa.
  if (chars.length !== syls.length) {
    return showPinyin ? (
      <ruby className="mx-[0.04em]">
        {token.text}
        <rt>{displayPinyin(token.pinyin)}</rt>
      </ruby>
    ) : (
      <span>{token.text}</span>
    );
  }

  return (
    <span className="mx-[0.04em] inline-block">
      {chars.map((ch, i) => {
        const tone = getTone(syls[i]);
        const color = colored ? TONE_CLASSES[tone] : "text-ink";
        return (
          <Fragment key={i}>
            {showPinyin ? (
              <ruby className={color}>
                {ch}
                <rt>{syls[i]}</rt>
              </ruby>
            ) : (
              <span className={color}>{ch}</span>
            )}
          </Fragment>
        );
      })}
    </span>
  );
}

/** Hanzi coloreado por tonos a partir de un array de tonos (vocabulario). */
export function ToneColoredTerm({ term, tones, className }: { term: string; tones?: number[]; className?: string }) {
  const colored = useLearningStore((s) => s.preferences.toneColors);
  const chars = Array.from(term);
  return (
    <span lang="zh-CN" className={cn("font-cjk", className)}>
      {chars.map((ch, i) => (
        <span
          key={i}
          className={colored && tones?.[i] ? TONE_CLASSES[tones[i] as 1 | 2 | 3 | 4 | 5] : undefined}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
