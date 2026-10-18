"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Clock,
  Dumbbell,
  Languages,
  Lock,
  MessagesSquare,
  PenTool,
  Target,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { LANGUAGES, LEVELS } from "@/data/levels";
import { cn } from "@/lib/cn";
import { useLearningStore } from "@/store/useLearningStore";
import { useActiveCourse, useBookProgress } from "@/store/selectors";
import type { LanguageCode, Lesson } from "@/types/learning";
import { RichTextView } from "@/components/text/RichTextView";
import { Badge, Button, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { TheoryBlocks } from "./TheoryBlocks";
import { VocabularyTable } from "./VocabularyTable";
import { DialogueView } from "./DialogueView";
import { HanziCards } from "./HanziCards";
import { PracticeSection } from "./PracticeSection";

type SectionId = "theory" | "vocabulary" | "dialogue" | "hanzi" | "practice";

/** Libro de Clase Digital: índice de unidades + lección con secciones guiadas. */
export function InteractiveTextbook() {
  const course = useActiveCourse();
  const progress = useBookProgress();
  const { level, language, lastLesson, completed, openLesson } = useLearningStore(
    useShallow((s) => ({
      level: s.level,
      language: s.language,
      lastLesson: s.lastLessonByLevel[s.level],
      completed: s.completedLessons,
      openLesson: s.openLesson,
    })),
  );

  const lessons = course.units.flatMap((u) => u.lessons);
  const current = lessons.find((l) => l.id === lastLesson) ?? progress.nextLesson ?? lessons[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Índice */}
      <aside className="lg:sticky lg:top-10 lg:self-start">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {LANGUAGES[language].flag} {course.title}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={progress.percent / 100} tone="success" />
          <span className="text-xs tabular-nums text-muted">{progress.percent}%</span>
        </div>
        <nav className="mt-5 flex flex-col gap-5">
          {course.units.map((unit) => (
            <div key={unit.id}>
              <p className="text-sm font-semibold">
                Unidad {unit.order} · {unit.title}
              </p>
              {unit.nativeTitle && (
                <RichTextView text={unit.nativeTitle} size="sm" pinyin={false} className="text-muted" />
              )}
              {unit.status === "coming-soon" ? (
                <ul className="mt-2 flex flex-col gap-1">
                  {unit.plannedLessons?.map((p) => (
                    <li key={p} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted">
                      <Lock size={13} className="shrink-0" /> <span className="font-cjk">{p}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-2 flex flex-col gap-1">
                  {unit.lessons.map((l) => {
                    const done = !!completed[l.id];
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          onClick={() => openLesson(l.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition",
                            current?.id === l.id ? "bg-accent-soft font-medium text-accent" : "hover:bg-surface-2",
                          )}
                        >
                          {done ? (
                            <CheckCircle2 size={15} className="shrink-0 text-success" />
                          ) : (
                            <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border border-current text-[9px]">
                              {l.order}
                            </span>
                          )}
                          <span className="truncate">{l.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Lección */}
      <div className="min-w-0">
        {current ? (
          <LessonView key={current.id} lesson={current} language={language} />
        ) : (
          <EmptyState
            icon={<BookOpenText size={22} />}
            title={`El libro de ${LEVELS[level].label} está en preparación`}
            body="Ya puedes ver el índice de unidades planificadas. Mientras tanto, prueba HSK 2 o Inglés B1, que tienen la unidad completa."
          />
        )}
      </div>
    </div>
  );
}

function LessonView({ lesson, language }: { lesson: Lesson; language: LanguageCode }) {
  const done = useLearningStore((s) => s.completedLessons[lesson.id]);
  const isZh = language === "zh";

  const sections: { id: SectionId; label: string; icon: typeof BookOpenText; count?: number; show: boolean }[] = [
    { id: "theory", label: "Teoría", icon: BookOpenText, show: true },
    { id: "vocabulary", label: "Vocabulario", icon: Languages, count: lesson.vocabulary.length, show: true },
    { id: "dialogue", label: "Diálogo", icon: MessagesSquare, show: lesson.dialogues.length > 0 },
    { id: "hanzi", label: "Hanzi", icon: PenTool, count: lesson.characters?.length, show: isZh && !!lesson.characters?.length },
    { id: "practice", label: "Práctica", icon: Dumbbell, count: lesson.exercises.length, show: true },
  ];
  const visible = sections.filter((s) => s.show);
  const [section, setSection] = useState<SectionId>("theory");
  const pos = visible.findIndex((s) => s.id === section);
  const next = visible[pos + 1];

  return (
    <article>
      <header>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>Lección {lesson.order}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {lesson.estimatedMinutes} min
          </span>
          {done && (
            <Badge tone="success">
              <CheckCircle2 size={12} /> Completada · {done.score}%
            </Badge>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{lesson.title}</h1>
        {lesson.nativeTitle && (
          <div className="mt-1">
            <RichTextView text={lesson.nativeTitle} size="xl" className={!isZh ? "text-2xl text-muted" : ""} />
          </div>
        )}
        <p className="mt-2 text-muted">{lesson.summary}</p>
        <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
          {lesson.objectives.map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm">
              <Target size={15} className="mt-0.5 shrink-0 text-accent" /> <span className="font-cjk">{o}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="sticky top-[57px] z-20 -mx-4 mt-8 border-b border-line bg-bg/95 px-4 backdrop-blur lg:top-0">
        <div className="flex gap-1 overflow-x-auto">
          {visible.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition",
                  section === s.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                <Icon size={16} /> {s.label}
                {s.count ? <span className="text-xs text-muted">{s.count}</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="py-8">
        {section === "theory" && <TheoryBlocks blocks={lesson.theory} language={language} />}
        {section === "vocabulary" && <VocabularyTable items={lesson.vocabulary} language={language} />}
        {section === "dialogue" && (
          <div className="flex flex-col gap-6">
            {lesson.dialogues.map((d) => (
              <DialogueView key={d.id} dialogue={d} language={language} />
            ))}
          </div>
        )}
        {section === "hanzi" && lesson.characters && <HanziCards characters={lesson.characters} />}
        {section === "practice" && <PracticeSection lesson={lesson} language={language} />}
      </div>

      {next && (
        <div className="flex justify-end border-t border-line pt-6">
          <Button
            onClick={() => {
              setSection(next.id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Siguiente: {next.label} <ArrowRight size={15} />
          </Button>
        </div>
      )}
    </article>
  );
}
