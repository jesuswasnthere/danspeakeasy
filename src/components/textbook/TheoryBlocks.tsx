"use client";

import { AlertTriangle, Globe2, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { plainText } from "@/lib/richText";
import { useLearningStore } from "@/store/useLearningStore";
import type { LanguageCode, TheoryBlock } from "@/types/learning";
import { RichTextView } from "@/components/text/RichTextView";
import { SpeakButton } from "@/components/audio/SpeakButton";

const NOTE_STYLES = {
  culture: { icon: Globe2, label: "Nota cultural", cls: "border-accent/25 bg-accent-soft", ic: "text-accent" },
  grammar: { icon: Sparkles, label: "Gramática", cls: "border-accent/25 bg-accent-soft", ic: "text-accent" },
  tip: { icon: Lightbulb, label: "Consejo", cls: "border-success/25 bg-success-soft", ic: "text-success" },
  warning: { icon: AlertTriangle, label: "¡Cuidado!", cls: "border-warning/30 bg-warning-soft", ic: "text-warning" },
} as const;

export function TheoryBlocks({ blocks, language }: { blocks: TheoryBlock[]; language: LanguageCode }) {
  const showTranslation = useLearningStore((s) => s.preferences.showTranslation);

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "paragraph":
            return (
              <section key={i}>
                {block.title && <h3 className="mb-2 text-lg font-semibold">{block.title}</h3>}
                <p className="leading-relaxed text-ink/90">{block.body}</p>
              </section>
            );
          case "grammar":
            return (
              <section key={i} className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">Estructura gramatical</p>
                <h3 className="mt-1 text-lg font-semibold">{block.title}</h3>
                <div className="mt-3 overflow-x-auto rounded-xl bg-surface-2 px-4 py-3 font-mono text-sm">
                  <span className={cn(language === "zh" && "font-cjk")}>{block.pattern}</span>
                </div>
                <p className="mt-3 leading-relaxed text-ink/90">{block.explanation}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {block.examples.map((ex, j) => (
                    <li key={j} className="flex items-start gap-3 border-l-2 border-accent/40 pl-4">
                      <SpeakButton text={plainText(ex.text)} language={language} size="sm" className="mt-1" />
                      <div>
                        <RichTextView text={ex.text} size="lg" className={language === "en" ? "text-lg font-medium" : ""} />
                        {showTranslation && <p className="text-sm text-muted">{ex.translation}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          case "table":
            return (
              <section key={i}>
                <h3 className="mb-3 text-lg font-semibold">{block.title}</h3>
                <div className="overflow-x-auto rounded-2xl border border-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
                      <tr>
                        {block.headers.map((h) => (
                          <th key={h} className="px-4 py-2.5 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line bg-surface">
                      {block.rows.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={cn("px-4 py-2.5", /[㐀-鿿]/.test(cell) && "font-cjk text-base")}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && <p className="mt-2 text-sm text-muted">{block.caption}</p>}
              </section>
            );
          case "note": {
            const style = NOTE_STYLES[block.variant];
            const Icon = style.icon;
            return (
              <aside key={i} className={cn("rounded-2xl border p-4", style.cls)}>
                <p className={cn("flex items-center gap-2 text-sm font-semibold", style.ic)}>
                  <Icon size={16} /> {style.label} · <span className="text-ink">{block.title}</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed">{block.body}</p>
              </aside>
            );
          }
        }
      })}
    </div>
  );
}
