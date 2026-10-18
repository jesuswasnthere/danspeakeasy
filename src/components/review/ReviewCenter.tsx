"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Check, Layers, PartyPopper, Trash2, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { LEVELS } from "@/data/levels";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { plainText } from "@/lib/richText";
import { LEITNER_INTERVALS, MASTERED_BOX, useLearningStore } from "@/store/useLearningStore";
import { useOpenMistakes, useVocabStats } from "@/store/selectors";
import type { VocabCard } from "@/types/learning";
import { ExerciseRunner } from "@/components/exercises/ExerciseRunner";
import { RichTextView, ToneColoredTerm } from "@/components/text/RichTextView";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { Badge, Button, Card, EmptyState } from "@/components/ui/primitives";

type Tab = "tarjetas" | "errores";

export function ReviewCenter() {
  const level = useLearningStore((s) => s.level);
  const vocab = useVocabStats();
  const mistakes = useOpenMistakes();
  const [tab, setTab] = useState<Tab>(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === "errores"
      ? "errores"
      : "tarjetas",
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Repaso · {LEVELS[level].label}</h1>
      <p className="mt-1 text-muted">Repetición espaciada para el vocabulario y re-práctica de tus errores.</p>

      <div className="mt-6 inline-flex rounded-xl bg-surface-2 p-1">
        {(
          [
            ["tarjetas", `Tarjetas (${vocab.due.length})`, Layers],
            ["errores", `Errores (${mistakes.open.length})`, AlertCircle],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
              tab === id ? "bg-surface shadow-sm" : "text-muted hover:text-ink",
            )}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6">{tab === "tarjetas" ? <Flashcards key={level} /> : <MistakesPractice key={level} />}</div>
    </div>
  );
}

// ─── Tarjetas (Leitner) ───────────────────────────────────────────────────────

function Flashcards() {
  const vocab = useVocabStats();
  // La cola se fija al entrar para que las tarjetas no salten al responder.
  const [queue] = useState(() => vocab.due.map((c) => c.vocabId));
  const [index, setIndex] = useState(0);

  if (vocab.total === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Layers size={22} />}
          title="Tu banco de repaso está vacío"
          body="Completa una lección o guarda palabras desde la tabla de vocabulario del Libro de Clase."
        />
      </Card>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <EmptyState
            icon={<PartyPopper size={22} />}
            title={queue.length ? "¡Repaso del día completado!" : "Estás al día"}
            body={`Tienes ${vocab.mastered} palabras dominadas y ${vocab.learning} en proceso. Vuelve mañana para el siguiente repaso.`}
          />
        </Card>
        <BankList cards={vocab.cards} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-3 text-sm text-muted">
        Tarjeta {index + 1} de {queue.length}
      </p>
      <Flashcard key={queue[index]} vocabId={queue[index]} onDone={() => setIndex((i) => i + 1)} />
    </div>
  );
}

function Flashcard({ vocabId, onDone }: { vocabId: string; onDone: () => void }) {
  const { reviewWord, card, language, showPinyin } = useLearningStore(
    useShallow((s) => ({
      reviewWord: s.reviewWord,
      card: s.vocabBank[vocabId],
      language: s.language,
      showPinyin: s.preferences.showPinyin,
    })),
  );
  const [revealed, setRevealed] = useState(false);
  const item = content.getVocabulary(vocabId)?.item;
  if (!item || !card) return null;
  const isZh = language === "zh";

  const answer = (remembered: boolean) => {
    reviewWord(vocabId, remembered);
    onDone();
  };

  return (
    <Card className="p-8">
      <div className="flex items-start justify-between">
        <Badge>Caja {card.box}/5</Badge>
        <SpeakButton text={item.term.replace(/\s*\(.*\)/, "")} language={language} />
      </div>
      <div className="py-8 text-center">
        {isZh ? <ToneColoredTerm term={item.term} tones={item.tones} className="text-7xl" /> : <p className="text-4xl font-semibold">{item.term}</p>}
        {revealed && (
          <div className="mt-6 space-y-2">
            {isZh && <p className="text-xl font-medium">{item.pinyin}</p>}
            {!isZh && item.ipa && <p className="font-mono text-sm text-muted">{item.ipa}</p>}
            <p className="text-lg">{item.meaning}</p>
            {item.example && (
              <div className="mx-auto mt-4 max-w-md rounded-xl bg-surface-2 p-3">
                <div className="flex items-start justify-center gap-2">
                  <RichTextView text={item.example.text} size="md" pinyin={showPinyin} className={!isZh ? "text-base" : ""} />
                  <SpeakButton text={plainText(item.example.text)} language={language} size="sm" />
                </div>
                <p className="text-sm text-muted">{item.example.translation}</p>
              </div>
            )}
          </div>
        )}
      </div>
      {revealed ? (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => answer(false)}>
            <X size={16} /> No lo recordaba
          </Button>
          <Button variant="success" onClick={() => answer(true)}>
            <Check size={16} /> Lo sabía
          </Button>
        </div>
      ) : (
        <Button className="w-full" onClick={() => setRevealed(true)}>
          Mostrar respuesta
        </Button>
      )}
      {revealed && (
        <p className="mt-3 text-center text-xs text-muted">
          «Lo sabía» → caja {Math.min(5, card.box + 1)} (próximo repaso en {LEITNER_INTERVALS[Math.min(5, card.box + 1) as VocabCard["box"]]} días) ·
          «No» → vuelve a la caja 1
        </p>
      )}
    </Card>
  );
}

function BankList({ cards }: { cards: VocabCard[] }) {
  const language = useLearningStore((s) => s.language);
  const sorted = [...cards].sort((a, b) => a.box - b.box);
  return (
    <Card className="p-5">
      <p className="mb-3 font-semibold">Tu banco ({cards.length})</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {sorted.map((c) => {
          const item = content.getVocabulary(c.vocabId)?.item;
          if (!item) return null;
          return (
            <li key={c.vocabId} className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2">
              <span className="flex items-baseline gap-2">
                {language === "zh" ? <ToneColoredTerm term={item.term} tones={item.tones} className="text-xl" /> : <span className="font-medium">{item.term}</span>}
                <span className="text-sm text-muted">{item.meaning}</span>
              </span>
              <Badge tone={c.box >= MASTERED_BOX ? "success" : "neutral"}>caja {c.box}</Badge>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// ─── Errores ──────────────────────────────────────────────────────────────────

function MistakesPractice() {
  const { open } = useOpenMistakes();
  const { language, dismissMistake } = useLearningStore(useShallow((s) => ({ language: s.language, dismissMistake: s.dismissMistake })));
  // Cola fija al entrar: los errores resueltos desaparecen al volver a la pestaña.
  const [queue] = useState(() => open.map((m) => m.exerciseId));
  const [index, setIndex] = useState(0);

  if (!queue.length) {
    return (
      <Card>
        <EmptyState
          icon={<PartyPopper size={22} />}
          title="No tienes errores pendientes"
          body="Cuando falles un ejercicio del libro aparecerá aquí para que lo vuelvas a practicar hasta dominarlo."
        />
      </Card>
    );
  }

  if (index >= queue.length) {
    return (
      <Card>
        <EmptyState
          icon={<PartyPopper size={22} />}
          title="¡Ronda de errores terminada!"
          body={open.length ? `Te quedan ${open.length} errores abiertos. Vuelve a entrar para otra ronda.` : "Has resuelto todos tus errores."}
        />
      </Card>
    );
  }

  const ref = content.getExercise(queue[index]);
  const mistake = useLearningStore.getState().mistakes[queue[index]];
  if (!ref || !mistake) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>
          Error {index + 1} de {queue.length} · {ref.lesson.title} · fallado ×{mistake.count}
        </span>
        <button
          type="button"
          onClick={() => {
            dismissMistake(mistake.exerciseId);
            setIndex((i) => i + 1);
          }}
          className="flex items-center gap-1 hover:text-danger"
        >
          <Trash2 size={13} /> Descartar
        </button>
      </div>
      <Card className="p-5 sm:p-7">
        <ExerciseRunner
          key={ref.exercise.id}
          exercise={ref.exercise}
          lessonId={ref.lesson.id}
          language={language}
          source="review"
          footer={
            <Button size="sm" onClick={() => setIndex((i) => i + 1)}>
              Siguiente <ArrowRight size={14} />
            </Button>
          }
        />
      </Card>
    </div>
  );
}
