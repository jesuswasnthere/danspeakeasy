"use client";

import { useMemo, useRef, useState } from "react";
import { BookOpenCheck, CheckCircle2, EyeOff, Mic, Play, Square, Users } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { isRichTokens, plainText } from "@/lib/richText";
import { useSpeech } from "@/hooks/useSpeech";
import { useLearningStore, XP } from "@/store/useLearningStore";
import type { LanguageCode, ReadingPassage, RichText } from "@/types/learning";
import { RichTextView } from "@/components/text/RichTextView";
import { Badge, Button, Card, EmptyState } from "@/components/ui/primitives";

type PlayMode = "listen" | "shadow";

export function ReadingPractice() {
  const { language, level, readings } = useLearningStore(
    useShallow((s) => ({ language: s.language, level: s.level, readings: s.practice.readings })),
  );
  const passages = useMemo(() => content.getReadingPassages(language, level), [language, level]);
  const [selected, setSelected] = useState(0);
  const passage = passages[Math.min(selected, passages.length - 1)];

  if (!passage) {
    return (
      <Card>
        <EmptyState icon={<BookOpenCheck size={22} />} title="Aún no hay lecturas" body="Este nivel todavía no tiene textos disponibles." />
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <ul className="flex flex-col gap-1">
        {passages.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition",
                passage.id === p.id ? "bg-accent-soft text-accent" : "hover:bg-surface-2",
              )}
            >
              {readings[p.id] ? (
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
              ) : p.kind === "diálogo" ? (
                <Users size={15} className="mt-0.5 shrink-0" />
              ) : (
                <BookOpenCheck size={15} className="mt-0.5 shrink-0" />
              )}
              <span className="min-w-0">
                <span className={cn("block font-medium", language === "zh" && "font-cjk")}>{p.title}</span>
                <span className="block truncate text-xs text-muted">{p.source}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <PassageReader key={passage.id} passage={passage} language={language} />
    </div>
  );
}

function PassageReader({ passage, language }: { passage: ReadingPassage; language: LanguageCode }) {
  const globalTranslation = useLearningStore((s) => s.preferences.showTranslation);
  const recordReading = useLearningStore((s) => s.recordReading);
  const done = useLearningStore((s) => !!s.practice.readings[passage.id]);
  const { speak, speakSequence, stop, speaking } = useSpeech();

  const [active, setActive] = useState<number | null>(null);
  const [yourTurn, setYourTurn] = useState<number | null>(null);
  const [hideText, setHideText] = useState(false);
  const [showTranslation, setShowTranslation] = useState(globalTranslation);
  const [justFinished, setJustFinished] = useState(false);
  const recorded = useRef(false);

  const texts = passage.sentences.map((s) => plainText(s.text));

  const play = (mode: PlayMode) => {
    setJustFinished(false);
    setYourTurn(null);
    speakSequence(texts, language, {
      onIndex: (i) => {
        setActive(i);
        setYourTurn(null);
      },
      // Sombra: pausa proporcional a la longitud para que el alumno repita.
      gapMs:
        mode === "shadow"
          ? (i, t) => {
              setYourTurn(i);
              const units = language === "zh" ? Array.from(t.replace(/[^㐀-鿿]/g, "")).length : t.split(/\s+/).length;
              return 900 + units * (language === "zh" ? 380 : 420);
            }
          : () => 300,
      onDone: () => {
        setActive(null);
        setYourTurn(null);
        setJustFinished(true);
        if (!recorded.current) {
          recorded.current = true;
          recordReading(passage.id);
        }
      },
    });
  };

  const halt = () => {
    stop();
    setActive(null);
    setYourTurn(null);
  };

  return (
    <Card className="p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted">{passage.source}</p>
          <h2 className={cn("text-xl font-semibold", language === "zh" && "font-cjk")}>{passage.title}</h2>
        </div>
        {done && (
          <Badge tone="success">
            <CheckCircle2 size={12} /> Leído
          </Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {speaking ? (
          <Button variant="secondary" onClick={halt}>
            <Square size={14} /> Detener
          </Button>
        ) : (
          <>
            <Button onClick={() => play("listen")}>
              <Play size={14} /> Escuchar y leer
            </Button>
            <Button variant="secondary" onClick={() => play("shadow")} title="Escucha cada frase y repítela en la pausa">
              <Mic size={14} /> Modo sombra
            </Button>
          </>
        )}
        <Button variant={hideText ? "primary" : "ghost"} size="sm" className="h-10" onClick={() => setHideText((h) => !h)} title="Primero escucha sin leer">
          <EyeOff size={14} /> {hideText ? "Mostrar texto" : "Solo audio"}
        </Button>
        <Button variant="ghost" size="sm" className="h-10" onClick={() => setShowTranslation((t) => !t)}>
          {showTranslation ? "Ocultar traducción" : "Ver traducción"}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted">Toca una frase para escucharla, o una palabra para oírla sola.</p>

      <ol className="mt-5 flex flex-col gap-2">
        {passage.sentences.map((s, i) => (
          <li
            key={i}
            className={cn(
              "rounded-xl border px-4 py-3 transition",
              active === i ? "border-accent bg-accent-soft" : yourTurn === i ? "border-warning bg-warning-soft" : "border-transparent hover:bg-surface-2",
            )}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => speak(texts[i], language)}
                className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-xs text-muted hover:border-accent hover:text-accent"
                aria-label={`Escuchar frase ${i + 1}`}
              >
                {i + 1}
              </button>
              <div className="min-w-0 flex-1">
                {s.speaker && <p className={cn("text-xs font-semibold text-muted", language === "zh" && "font-cjk")}>{s.speaker}</p>}
                <div className={cn("transition", hideText && active !== i && "select-none blur-sm")}>
                  <ClickableText text={s.text} onWord={(w) => speak(w, language, { track: false })} />
                </div>
                {yourTurn === i && <p className="mt-1 text-sm font-medium text-warning">🎙️ ¡Tu turno! Repite la frase en voz alta</p>}
                {showTranslation && s.translation && <p className="mt-1 text-sm text-muted">{s.translation}</p>}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {showTranslation && passage.translation && (
        <p className="mt-4 rounded-xl bg-surface-2 p-4 text-sm text-muted">{passage.translation}</p>
      )}

      {justFinished && (
        <div className="mt-5 rounded-2xl border border-success/30 bg-success-soft p-4 text-sm">
          <p className="font-semibold text-success">¡Lectura completada! +{XP.readingCompleted} XP</p>
          <p className="text-muted">Siguiente paso: prueba el modo sombra o practica las frases en «Pronunciación».</p>
        </div>
      )}
    </Card>
  );
}

/** Texto donde cada palabra se puede tocar para escucharla. */
function ClickableText({ text, onWord }: { text: RichText; onWord: (w: string) => void }) {
  if (isRichTokens(text)) {
    return (
      <span className="font-cjk">
        {text.map((t, i) =>
          t.pinyin ? (
            <button key={i} type="button" onClick={() => onWord(t.text)} className="rounded transition hover:bg-accent/10">
              <RichTextView text={[t]} size="lg" />
            </button>
          ) : (
            <RichTextView key={i} text={[t]} size="lg" />
          ),
        )}
      </span>
    );
  }
  return (
    <p className="text-lg leading-relaxed">
      {text.split(/(\s+)/).map((w, i) =>
        /^\s+$/.test(w) ? (
          w
        ) : (
          <button key={i} type="button" onClick={() => onWord(w.replace(/[^\w'-]/g, ""))} className="rounded hover:bg-accent/10">
            {w}
          </button>
        ),
      )}
    </p>
  );
}
