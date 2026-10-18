"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { plainText } from "@/lib/richText";
import { useSpeech } from "@/hooks/useSpeech";
import { useLearningStore } from "@/store/useLearningStore";
import type { Dialogue, LanguageCode } from "@/types/learning";
import { RichTextView } from "@/components/text/RichTextView";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { Button } from "@/components/ui/primitives";

const BUBBLE = ["bg-accent-soft", "bg-surface-2"];

export function DialogueView({ dialogue, language }: { dialogue: Dialogue; language: LanguageCode }) {
  const showTranslation = useLearningStore((s) => s.preferences.showTranslation);
  const { speak, stop, speaking } = useSpeech();
  const speakerIdx = (name: string) => Math.max(0, dialogue.speakers.findIndex((s) => s.name === name));

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{dialogue.title}</h3>
          <p className="text-sm text-muted">{dialogue.context}</p>
          <p className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
            {dialogue.speakers.map((s) => (
              <span key={s.name}>
                <span className={cn("font-semibold text-ink", language === "zh" && "font-cjk")}>{s.name}</span> · {s.role}
              </span>
            ))}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => (speaking ? stop() : speak(dialogue.lines.map((l) => plainText(l.text)), language))}
        >
          <Play size={14} /> {speaking ? "Detener" : "Escuchar todo"}
        </Button>
      </div>

      <ol className="mt-5 flex flex-col gap-4">
        {dialogue.lines.map((line, i) => {
          const idx = speakerIdx(line.speaker);
          const right = idx % 2 === 1;
          return (
            <li key={i} className={cn("flex items-start gap-3", right && "flex-row-reverse")}>
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-sm font-semibold",
                  language === "zh" && "font-cjk",
                )}
              >
                {Array.from(line.speaker)[0]}
              </span>
              <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5", BUBBLE[idx % 2], right ? "rounded-tr-sm" : "rounded-tl-sm")}>
                <div className={cn("flex items-start gap-2", right && "flex-row-reverse")}>
                  <RichTextView text={line.text} size="lg" className={language === "en" ? "text-base font-medium" : ""} />
                  <SpeakButton text={plainText(line.text)} language={language} size="sm" className="mt-1" />
                </div>
                {showTranslation && <p className={cn("mt-1 text-sm text-muted", right && "text-right")}>{line.translation}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
