"use client";

import { useState, type ReactNode } from "react";
import { AudioLines, CheckCircle2, Lightbulb, ListChecks, PenLine, RotateCcw, Shuffle, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { evaluateExercise, type ExerciseAnswer } from "@/lib/exercises/evaluate";
import { useLearningStore } from "@/store/useLearningStore";
import type { Exercise, ExerciseEvaluation, ExerciseType, LanguageCode } from "@/types/learning";
import { Badge, Button } from "@/components/ui/primitives";
import { FillBlankInput, MultipleChoiceInput, SentenceBuilderInput, TonePracticeInput } from "./inputs";

export const EXERCISE_META: Record<ExerciseType, { label: string; icon: typeof Shuffle }> = {
  "sentence-builder": { label: "Constructor de oraciones", icon: Shuffle },
  "fill-blank": { label: "Completar el hueco", icon: PenLine },
  "multiple-choice": { label: "Opción múltiple", icon: ListChecks },
  "tone-practice": { label: "Práctica de tonos", icon: AudioLines },
};

/**
 * Ejecuta un ejercicio: muestra el input adecuado, evalúa, registra el resultado
 * en el store (progreso, errores, racha) y da feedback pedagógico.
 */
export function ExerciseRunner({
  exercise,
  lessonId,
  language,
  source = "lesson",
  onAnswered,
  footer,
  record = true,
}: {
  exercise: Exercise;
  lessonId: string;
  language: LanguageCode;
  source?: "lesson" | "review";
  onAnswered?: (evaluation: ExerciseEvaluation) => void;
  /** Acciones extra bajo el feedback (p. ej. «Siguiente»). */
  footer?: ReactNode;
  /** false = no registrar en el progreso (misiones del aula). */
  record?: boolean;
}) {
  const recordExercise = useLearningStore((s) => s.recordExercise);
  const solvedBefore = useLearningStore((s) => !!s.attempts[exercise.id]?.correct);
  const [evaluation, setEvaluation] = useState<ExerciseEvaluation | null>(null);
  const [attemptKey, setAttemptKey] = useState(0);
  const meta = EXERCISE_META[exercise.type];
  const Icon = meta.icon;

  const submit = (answer: ExerciseAnswer) => {
    const result = evaluateExercise(exercise, answer);
    if (record) recordExercise({ exercise, lessonId, evaluation: result, source });
    setEvaluation(result);
    onAnswered?.(result);
  };

  const inputProps = { language, locked: !!evaluation, onSubmit: submit };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone="accent">
          <Icon size={13} /> {meta.label}
        </Badge>
        <Badge>{exercise.skill}</Badge>
        {solvedBefore && !evaluation && (
          <Badge tone="success">
            <CheckCircle2 size={13} /> Resuelto antes
          </Badge>
        )}
      </div>
      <p className="mb-4 text-sm text-muted">{exercise.instruction}</p>

      <div key={attemptKey}>
        {exercise.type === "sentence-builder" && <SentenceBuilderInput exercise={exercise} {...inputProps} />}
        {exercise.type === "fill-blank" && <FillBlankInput exercise={exercise} {...inputProps} />}
        {exercise.type === "multiple-choice" && <MultipleChoiceInput exercise={exercise} {...inputProps} />}
        {exercise.type === "tone-practice" && <TonePracticeInput exercise={exercise} {...inputProps} />}
      </div>

      {evaluation && (
        <div
          role="status"
          className={cn(
            "mt-6 rounded-2xl border p-4",
            evaluation.correct ? "border-success/30 bg-success-soft" : "border-danger/30 bg-danger-soft",
          )}
        >
          <div className="flex items-start gap-3">
            {evaluation.correct ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={20} />
            ) : (
              <XCircle className="mt-0.5 shrink-0 text-danger" size={20} />
            )}
            <div className="min-w-0 flex-1">
              <p className={cn("font-semibold", evaluation.correct ? "text-success" : "text-danger")}>
                {evaluation.correct ? "¡Correcto!" : "Todavía no"}
              </p>
              {evaluation.feedback && <p className="mt-1 text-sm">{evaluation.feedback}</p>}
              {!evaluation.correct && (
                <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-3">
                  <dt className="text-muted">Tu respuesta</dt>
                  <dd className="font-cjk line-through decoration-danger/60">{evaluation.userAnswer}</dd>
                  <dt className="text-muted">Respuesta correcta</dt>
                  <dd className="font-cjk font-semibold">{evaluation.correctAnswer}</dd>
                </dl>
              )}
              <div className="mt-3 flex gap-2 rounded-xl bg-surface/70 p-3 text-sm">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-warning" />
                <p>
                  <span className="font-medium">¿Por qué? </span>
                  {exercise.explanation}
                </p>
              </div>
              {!evaluation.correct && record && (
                <p className="mt-2 text-xs text-muted">Guardado en tu bandeja de «Errores para repasar».</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {!evaluation.correct && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEvaluation(null);
                  setAttemptKey((k) => k + 1);
                }}
              >
                <RotateCcw size={14} /> Reintentar
              </Button>
            )}
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}
