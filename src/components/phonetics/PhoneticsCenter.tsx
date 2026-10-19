"use client";

import { useState } from "react";
import { ArrowLeft, AudioLines, BookOpenText, CheckCircle2, Clock, Dumbbell, Target } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { LEVELS } from "@/data/levels";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { useLearningStore } from "@/store/useLearningStore";
import type { PhoneticsModule } from "@/types/learning";
import { RichTextView } from "@/components/text/RichTextView";
import { Badge, Button, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { PracticeSection } from "@/components/textbook/PracticeSection";
import { PhoneticsBlocks } from "./PhoneticsBlocks";

/**
 * Fonética del chino para HSK 1 y HSK 2: módulos con explicación interactiva y práctica.
 * La práctica reutiliza el motor del libro (`PracticeSection`): los aciertos cuentan en
 * la actividad y los fallos van a «Repaso → Errores».
 */
export function PhoneticsCenter() {
  const { language, level, setLevel, completed } = useLearningStore(
    useShallow((s) => ({ language: s.language, level: s.level, setLevel: s.setLevel, completed: s.completedLessons })),
  );
  const modules = content.getPhoneticsModules(level);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = modules.find((m) => m.id === openId);

  if (language !== "zh" || !modules.length) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Fonética</h1>
        <Card className="mt-6">
          <EmptyState
            icon={<AudioLines size={22} />}
            title="La fonética se trabaja en HSK 1 y HSK 2"
            body="Esta sección explica los tonos, el pinyin y los sonidos del chino mandarín para principiantes."
            action={
              <Button onClick={() => setLevel("HSK1")}>
                Ir a Fonética HSK 1
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  if (open) return <ModuleView key={open.id} module={open} onBack={() => setOpenId(null)} />;

  const done = modules.filter((m) => completed[m.id]).length;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Fonética · {LEVELS[level].label}</h1>
      <p className="mt-1 max-w-2xl text-muted">
        {level === "HSK1"
          ? "Los cimientos de la pronunciación: tonos, iniciales, finales, cómo se escribe el pinyin y los cambios de tono imprescindibles."
          : "Pronunciación dentro de palabras y frases: tono neutro, combinaciones de tonos, cadenas de terceros tonos, 儿化 y sonidos que se confunden."}
      </p>

      <div className="mt-5 flex max-w-md items-center gap-3">
        <ProgressBar value={done / modules.length} tone="success" />
        <span className="shrink-0 text-sm tabular-nums text-muted">
          {done}/{modules.length} módulos
        </span>
      </div>

      {level === "HSK2" && (
        <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">
          ¿Te faltan las bases (los cuatro tonos, iniciales y finales)?{" "}
          <button type="button" onClick={() => setLevel("HSK1")} className="font-medium text-accent hover:underline">
            Ve a la fonética de HSK 1
          </button>
          .
        </p>
      )}

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {modules.map((m) => {
          const result = completed[m.id];
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setOpenId(m.id);
                window.scrollTo({ top: 0 });
              }}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5 text-left transition hover:border-accent"
            >
              <span className="flex items-center justify-between gap-2 text-xs text-muted">
                <span>Módulo {m.order}</span>
                {result ? (
                  <Badge tone="success">
                    <CheckCircle2 size={12} /> {result.score}%
                  </Badge>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {m.estimatedMinutes} min
                  </span>
                )}
              </span>
              <span className="text-lg font-semibold leading-tight">{m.title}</span>
              {m.nativeTitle && <RichTextView text={m.nativeTitle} size="md" />}
              <span className="text-sm text-muted">{m.summary}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModuleView({ module, onBack }: { module: PhoneticsModule; onBack: () => void }) {
  const done = useLearningStore((s) => s.completedLessons[module.id]);
  const [section, setSection] = useState<"explicacion" | "practica">("explicacion");
  const lesson = content.getLesson(module.id)?.lesson;

  return (
    <article>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={15} /> Todos los módulos
      </button>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>
            Fonética {LEVELS[module.level].label} · Módulo {module.order}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {module.estimatedMinutes} min
          </span>
          {done && (
            <Badge tone="success">
              <CheckCircle2 size={12} /> Completado · {done.score}%
            </Badge>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{module.title}</h1>
        {module.nativeTitle && (
          <div className="mt-1">
            <RichTextView text={module.nativeTitle} size="xl" />
          </div>
        )}
        <p className="mt-2 text-muted">{module.summary}</p>
        <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
          {module.objectives.map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm">
              <Target size={15} className="mt-0.5 shrink-0 text-accent" /> <span>{o}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="sticky top-[57px] z-20 -mx-4 mt-8 border-b border-line bg-bg/95 px-4 backdrop-blur lg:top-0">
        <div className="flex gap-1 overflow-x-auto">
          {(
            [
              { id: "explicacion", label: "Explicación", icon: BookOpenText },
              { id: "practica", label: "Práctica", icon: Dumbbell, count: module.exercises.length },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition",
                section === s.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              <s.icon size={16} /> {s.label}
              {"count" in s && <span className="text-xs text-muted">{s.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="py-8">
        {section === "explicacion" && <PhoneticsBlocks blocks={module.blocks} />}
        {section === "practica" && lesson && <PracticeSection lesson={lesson} language="zh" />}
      </div>

      {section === "explicacion" && (
        <div className="flex justify-end border-t border-line pt-6">
          <Button
            onClick={() => {
              setSection("practica");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Siguiente: Práctica
          </Button>
        </div>
      )}
    </article>
  );
}
