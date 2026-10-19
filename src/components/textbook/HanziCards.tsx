"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers3, PenLine } from "lucide-react";
import { cn } from "@/lib/cn";
import { getTone, TONE_CLASSES, TONE_LABELS } from "@/lib/richText";
import { useLearningStore } from "@/store/useLearningStore";
import type { CharacterBreakdown } from "@/types/learning";
import { SpeakButton } from "@/components/audio/SpeakButton";

/** Tarjetas de hanzi con desglose de radical/componentes y mnemotecnia. */
export function HanziCards({ characters }: { characters: CharacterBreakdown[] }) {
  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        Toca una tarjeta para ver su desglose. Reconocer el radical te ayuda a adivinar el significado de caracteres nuevos.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {characters.map((c) => (
          <HanziCard key={c.char} c={c} />
        ))}
      </div>
    </div>
  );
}

function HanziCard({ c }: { c: CharacterBreakdown }) {
  const { showPinyin, showTranslation, toneColors } = useLearningStore((s) => s.preferences);
  const [open, setOpen] = useState(false);
  const tone = getTone(c.pinyin);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen((o) => !o)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((o) => !o)}
      className={cn(
        "cursor-pointer rounded-2xl border bg-surface p-5 text-left transition",
        open ? "border-accent" : "border-line hover:border-ink/20",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span lang="zh-CN" className={cn("font-cjk text-7xl leading-none", toneColors && TONE_CLASSES[tone])}>
            {c.char}
          </span>
          {showPinyin && <p className="mt-2 text-lg font-medium">{c.pinyin}</p>}
          {showTranslation && <p className="text-sm text-muted">{c.meaning}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <SpeakButton text={c.char} language="zh" />
          <span className="text-xs text-muted">{c.strokes} trazos</span>
        </div>
      </div>

      {open ? (
        <div className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft font-cjk text-3xl text-accent">
              {c.radical.char}
            </span>
            <div>
              <p className="font-medium">Radical · {c.radical.meaning}</p>
              <p className="text-xs text-muted">{c.radical.name}</p>
            </div>
          </div>
          {c.components.map((comp) => (
            <div key={comp.char} className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 font-cjk text-3xl">{comp.char}</span>
              <p>
                <span className="font-medium">Componente</span> · {comp.meaning}
              </p>
            </div>
          ))}
          <p className="rounded-xl bg-warning-soft p-3">🧠 {c.mnemonic}</p>
          <p className="text-xs text-muted">
            {TONE_LABELS[tone]} · Aparece en: <span className="font-cjk">{c.usedIn.join("、")}</span>
          </p>
          <Link
            href={`/app/practica?tab=escritura&char=${encodeURIComponent(c.char)}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            <PenLine size={14} /> Practicar escritura trazo a trazo
          </Link>
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
          <Layers3 size={13} /> Ver radical y componentes
        </p>
      )}
    </div>
  );
}
