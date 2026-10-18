"use client";

import { useState } from "react";
import { BookmarkCheck, BookmarkPlus, Eye } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/cn";
import { plainText } from "@/lib/richText";
import { useLearningStore } from "@/store/useLearningStore";
import type { LanguageCode, VocabularyItem } from "@/types/learning";
import { RichTextView, ToneColoredTerm } from "@/components/text/RichTextView";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { Badge, Button } from "@/components/ui/primitives";

export function VocabularyTable({ items, language }: { items: VocabularyItem[]; language: LanguageCode }) {
  const { prefs, bank, addToBank, removeFromBank } = useLearningStore(
    useShallow((s) => ({ prefs: s.preferences, bank: s.vocabBank, addToBank: s.addToBank, removeFromBank: s.removeFromBank })),
  );
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const isZh = language === "zh";
  const missing = items.filter((i) => !bank[i.id]).map((i) => i.id);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {items.length} palabras · {prefs.showTranslation ? "toca el altavoz para escuchar" : "traducción oculta: toca una palabra para comprobar si la recuerdas"}
        </p>
        <Button variant="secondary" size="sm" disabled={!missing.length} onClick={() => addToBank(missing)}>
          <BookmarkPlus size={15} /> {missing.length ? `Añadir ${missing.length} al repaso` : "Todas en tu banco"}
        </Button>
      </div>

      <div className="grid gap-3">
        {items.map((item) => {
          const inBank = !!bank[item.id];
          const showMeaning = prefs.showTranslation || revealed.has(item.id);
          return (
            <div key={item.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start gap-4">
                <SpeakButton text={item.term.replace(/\s*\(.*\)/, "")} language={language} />
                <div className="min-w-28">
                  {isZh ? (
                    <ToneColoredTerm term={item.term} tones={item.tones} className="text-3xl" />
                  ) : (
                    <p className="text-lg font-semibold">{item.term}</p>
                  )}
                  {isZh && prefs.showPinyin && <p className="text-sm font-medium text-muted">{item.pinyin}</p>}
                  {!isZh && item.ipa && <p className="font-mono text-xs text-muted">{item.ipa}</p>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {showMeaning ? (
                      <p className="font-medium">{item.meaning}</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRevealed((r) => new Set(r).add(item.id))}
                        className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1 text-sm text-muted hover:text-ink"
                      >
                        <Eye size={14} /> Mostrar significado
                      </button>
                    )}
                    <Badge>{item.partOfSpeech}</Badge>
                  </div>
                  {item.example && (
                    <div className="mt-2 flex items-start gap-2">
                      <SpeakButton text={plainText(item.example.text)} language={language} size="sm" className="mt-0.5" />
                      <div>
                        <RichTextView text={item.example.text} size="sm" className={cn(!isZh && "text-sm")} />
                        {showMeaning && <p className="text-xs text-muted">{item.example.translation}</p>}
                      </div>
                    </div>
                  )}
                  {item.note && <p className="mt-2 text-xs text-warning">💡 {item.note}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => (inBank ? removeFromBank(item.id) : addToBank([item.id]))}
                  title={inBank ? "Quitar del banco de repaso" : "Añadir al banco de repaso"}
                  className={cn("rounded-lg p-2 transition", inBank ? "text-success" : "text-muted hover:text-accent")}
                >
                  {inBank ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
