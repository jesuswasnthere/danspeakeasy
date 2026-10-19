"use client";

import { useState } from "react";
import { ArrowRight, PartyPopper, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLearningStore, XP } from "@/store/useLearningStore";
import type { LanguageCode, Lesson } from "@/types/learning";
import { ExerciseRunner } from "@/components/exercises/ExerciseRunner";
import { Button, ProgressBar } from "@/components/ui/primitives";

/** Motor de práctica de la lección: un ejercicio cada vez, con resumen final. */
export function PracticeSection({ lesson, language, onFinish }: { lesson: Lesson; language: LanguageCode; onFinish?: () => void }) {
  const completeLesson = useLearningStore((s) => s.completeLesson);
  const completed = useLearningStore((s) => s.completedLessons[lesson.id]);
  const [index, setIndex] = useState(0);
  /** Resultado del PRIMER intento de cada ejercicio en esta sesión. */
  const [firstTry, setFirstTry] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  const total = lesson.exercises.length;
  const exercise = lesson.exercises[index];
  const answered = Object.keys(firstTry).length;
  const correctFirst = Object.values(firstTry).filter(Boolean).length;
  const isLast = index === total - 1;

  const finish = () => {
    const score = Math.round((correctFirst / total) * 100);
    completeLesson(lesson.id, score, lesson.vocabulary.map((v) => v.id));
    setFinished(true);
    onFinish?.();
  };

  const restart = () => {
    setIndex(0);
    setFirstTry({});
    setFinished(false);
  };

  if (finished) {
    const score = Math.round((correctFirst / total) * 100);
    return (
      <div className="rounded-3xl border border-line bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-soft text-success">
          {score >= 80 ? <Trophy size={30} /> : <PartyPopper size={30} />}
        </div>
        <h3 className="text-xl font-semibold">¡Lección completada!</h3>
        <p className="mt-1 text-muted">
          {correctFirst} de {total} a la primera · puntuación {score}%
        </p>
        <p className="mt-3 text-sm text-muted">
          +{XP.lessonCompleted} XP
          {lesson.vocabulary.length > 0 && ` · ${lesson.vocabulary.length} palabras añadidas a tu banco de repaso`}.
          {score < 100 && " Los fallos están en «Repaso → Errores» para que los practiques."}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="secondary" onClick={restart}>
            <RotateCcw size={15} /> Repetir práctica
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-4">
        <ProgressBar value={answered / total} className="flex-1" />
        <span className="text-sm tabular-nums text-muted">
          {index + 1}/{total}
        </span>
      </div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {lesson.exercises.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ejercicio ${i + 1}`}
            className={cn(
              "h-2.5 w-8 rounded-full transition",
              i === index && "ring-2 ring-accent ring-offset-2 ring-offset-bg",
              firstTry[ex.id] === true ? "bg-success" : firstTry[ex.id] === false ? "bg-danger" : "bg-line",
            )}
          />
        ))}
      </div>

      <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
        <ExerciseRunner
          key={exercise.id}
          exercise={exercise}
          lessonId={lesson.id}
          language={language}
          onAnswered={(ev) => setFirstTry((f) => (exercise.id in f ? f : { ...f, [exercise.id]: ev.correct }))}
          footer={
            isLast ? (
              answered < total ? (
                <Button size="sm" variant="secondary" onClick={() => setIndex(lesson.exercises.findIndex((ex) => !(ex.id in firstTry)))}>
                  Te faltan {total - answered} · ir al pendiente <ArrowRight size={14} />
                </Button>
              ) : (
                <Button size="sm" onClick={finish}>
                  Terminar lección <ArrowRight size={14} />
                </Button>
              )
            ) : (
              <Button size="sm" onClick={() => setIndex((i) => i + 1)}>
                Siguiente <ArrowRight size={14} />
              </Button>
            )
          }
        />
      </div>

      {answered === total && !isLast && (
        <div className="mt-4 flex justify-end">
          <Button variant="success" onClick={finish}>
            Terminar lección
          </Button>
        </div>
      )}
      {completed && (
        <p className="mt-4 text-center text-xs text-muted">Ya completaste esta lección (mejor puntuación: {completed.score}%).</p>
      )}
    </div>
  );
}
