"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, Mic, PenTool } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { LEVELS } from "@/data/levels";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { useLearningStore } from "@/store/useLearningStore";
import { Card, EmptyState } from "@/components/ui/primitives";
import { StrokePractice } from "./StrokePractice";
import { ReadingPractice } from "./ReadingPractice";
import { PronunciationPractice } from "./PronunciationPractice";

type Tab = "escritura" | "lectura" | "pronunciacion";

function initialParams(): { tab: Tab | null; char: string | null } {
  if (typeof window === "undefined") return { tab: null, char: null };
  const p = new URLSearchParams(window.location.search);
  const tab = p.get("tab");
  return {
    tab: tab === "escritura" || tab === "lectura" || tab === "pronunciacion" ? tab : null,
    char: p.get("char"),
  };
}

/** Centro de práctica de habilidades: escritura de hanzi, lectura con audio y pronunciación. */
export function PracticeHub() {
  const { language, level } = useLearningStore(useShallow((s) => ({ language: s.language, level: s.level })));
  const [params] = useState(initialParams);
  const isZh = language === "zh";
  const [tabChoice, setTab] = useState<Tab>(params.tab ?? (isZh ? "escritura" : "lectura"));
  // La escritura de caracteres solo existe para chino.
  const tab: Tab = !isZh && tabChoice === "escritura" ? "lectura" : tabChoice;

  const tabs = [
    ...(isZh ? [{ id: "escritura" as const, label: "Escritura", icon: PenTool }] : []),
    { id: "lectura" as const, label: "Lectura con audio", icon: BookOpenCheck },
    { id: "pronunciacion" as const, label: "Pronunciación", icon: Mic },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Práctica · {LEVELS[level].label}</h1>
      <p className="mt-1 text-muted">
        {isZh ? "Escribe los caracteres trazo a trazo, lee con audio y entrena tu pronunciación." : "Lee con audio y entrena tu pronunciación."}
      </p>

      <div className="mt-6 inline-flex flex-wrap rounded-xl bg-surface-2 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
              tab === t.id ? "bg-surface shadow-sm" : "text-muted hover:text-ink",
            )}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "escritura" && <WritingTab key={level} initialChar={params.char} />}
        {tab === "lectura" && <ReadingPractice key={level} />}
        {tab === "pronunciacion" && <PronunciationPractice key={level} />}
      </div>
    </div>
  );
}

function WritingTab({ initialChar }: { initialChar: string | null }) {
  const level = useLearningStore((s) => s.level);
  const strokes = useLearningStore((s) => s.practice.strokes);
  const chars = useMemo(() => content.getPracticeCharacters(level), [level]);
  const [index, setIndex] = useState(() => Math.max(0, chars.findIndex((c) => c.char === initialChar)));
  const item = chars[index];

  if (!item) {
    return (
      <Card>
        <EmptyState icon={<PenTool size={22} />} title="Aún no hay caracteres" body="Este nivel todavía no tiene lecciones disponibles." />
      </Card>
    );
  }

  const written = chars.filter((c) => strokes[c.char]).length;

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">Caracteres del nivel</span>
          <span className="text-muted">
            {written}/{chars.length} escritos
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chars.map((c, i) => {
            const s = strokes[c.char];
            return (
              <button
                key={c.char}
                type="button"
                onClick={() => setIndex(i)}
                title={[c.pinyin, c.meaning].filter(Boolean).join(" · ")}
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-xl border font-cjk text-xl transition",
                  i === index ? "border-accent bg-accent-soft text-accent" : s ? "border-success/40 bg-success-soft" : "border-line hover:border-ink/30",
                  c.breakdown && "font-semibold",
                )}
              >
                {c.char}
                {s?.bestMistakes === 0 && <span className="absolute -right-1 -top-1 text-[10px]">⭐</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted">En negrita, los caracteres con desglose completo en la lección. ⭐ = escrito sin fallos.</p>
      </Card>

      <Card className="p-5 sm:p-7">
        <StrokePractice
          key={item.char}
          item={item}
          onNext={index < chars.length - 1 ? () => setIndex((i) => i + 1) : undefined}
        />
      </Card>
    </div>
  );
}
