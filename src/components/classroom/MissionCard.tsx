"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronDown, Ear, Headphones, MessageSquarePlus, PenLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLearningStore } from "@/store/useLearningStore";
import type { MissionStatus } from "@/store/selectors";
import type { LanguageCode, ListeningMission, ReadingMission, WeeklyMission } from "@/types/learning";
import { ExerciseRunner } from "@/components/exercises/ExerciseRunner";
import { RichTextView } from "@/components/text/RichTextView";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { Badge, Button, ProgressBar } from "@/components/ui/primitives";

const KIND_META: Record<WeeklyMission["kind"], { label: string; icon: typeof BookOpen }> = {
  reading: { label: "Lectura", icon: BookOpen },
  listening: { label: "Escucha", icon: Headphones },
  grammar: { label: "Gramática", icon: Sparkles },
  participation: { label: "Participación", icon: MessageSquarePlus },
};

export function MissionCard({
  status,
  language,
  onParticipate,
}: {
  status: MissionStatus;
  language: LanguageCode;
  onParticipate: (missionId: string) => void;
}) {
  const { mission, done, progress, progressLabel } = status;
  const [open, setOpen] = useState(false);
  const meta = KIND_META[mission.kind];
  const Icon = meta.icon;

  return (
    <div className={cn("rounded-2xl border bg-surface transition", done ? "border-success/40" : "border-line")}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 p-4 text-left">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            done ? "bg-success-soft text-success" : "bg-accent-soft text-accent",
          )}
        >
          {done ? <CheckCircle2 size={20} /> : <Icon size={19} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{mission.title}</span>
            <Badge>{meta.label}</Badge>
            <Badge tone="warning">+{mission.xp} XP</Badge>
          </span>
          <span className="mt-0.5 block text-sm text-muted">{mission.description}</span>
          <span className="mt-2 flex items-center gap-3">
            <ProgressBar value={progress} tone={done ? "success" : "accent"} className="max-w-48" />
            <span className="text-xs text-muted">{progressLabel}</span>
          </span>
        </span>
        <ChevronDown size={18} className={cn("mt-2 shrink-0 text-muted transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-line p-4">
          {mission.kind === "reading" && <ReadingBody mission={mission} language={language} done={done} />}
          {mission.kind === "listening" && <ListeningBody mission={mission} language={language} done={done} />}
          {mission.kind === "grammar" && (
            <div className="text-sm">
              <p>
                <span className="font-medium">Enfoque de la semana:</span> <span className="font-cjk">{mission.focus}</span>
              </p>
              <p className="mt-1 text-muted">Cada ejercicio que aciertes en el Libro de Clase (o en Repaso) suma automáticamente.</p>
              <Link href="/app/libro" className="mt-3 inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
                <PenLine size={14} /> Ir a practicar
              </Link>
            </div>
          )}
          {mission.kind === "participation" && (
            <div>
              <p className={cn("text-lg", language === "zh" && "font-cjk text-xl")}>{mission.prompt}</p>
              {mission.promptTranslation && <p className="mt-1 text-sm text-muted">{mission.promptTranslation}</p>}
              <p className="mt-2 text-xs text-muted">Mínimo {mission.minLength} caracteres.</p>
              {!done && (
                <Button className="mt-3" size="sm" onClick={() => onParticipate(mission.id)}>
                  <MessageSquarePlus size={14} /> Responder en el tablón
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReadingBody({ mission, language, done }: { mission: ReadingMission; language: LanguageCode; done: boolean }) {
  const completeMission = useLearningStore((s) => s.completeMission);
  const [showTr, setShowTr] = useState(false);

  return (
    <div>
      <div className="rounded-xl bg-surface-2 p-4">
        <p className={cn("mb-2 font-semibold", language === "zh" && "font-cjk")}>{mission.passage.title}</p>
        <RichTextView text={mission.passage.text} size="lg" className={language === "en" ? "text-base leading-relaxed" : ""} />
        <button type="button" onClick={() => setShowTr((s) => !s)} className="mt-3 text-xs font-medium text-accent">
          {showTr ? "Ocultar traducción" : "Ver traducción"}
        </button>
        {showTr && <p className="mt-1 text-sm text-muted">{mission.passage.translation}</p>}
      </div>
      <div className="mt-4">
        {done ? (
          <p className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 size={16} /> Misión completada esta semana.
          </p>
        ) : (
          <ExerciseRunner
            exercise={mission.question}
            lessonId={mission.id}
            language={language}
            record={false}
            onAnswered={(ev) => ev.correct && completeMission(mission.id, mission.xp)}
          />
        )}
      </div>
    </div>
  );
}

function ListeningBody({ mission, language, done }: { mission: ListeningMission; language: LanguageCode; done: boolean }) {
  const completeMission = useLearningStore((s) => s.completeMission);
  const [plays, setPlays] = useState(0);
  const unlocked = plays >= mission.minPlays || done;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-surface-2 p-4">
        <SpeakButton text={mission.audioText} language={language} size="lg" onPlay={() => setPlays((p) => p + 1)} />
        <SpeakButton text={mission.audioText} language={language} slow label="Lento" onPlay={() => setPlays((p) => p + 1)} />
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Ear size={15} /> Escuchado {plays}/{mission.minPlays}
        </span>
      </div>
      {done ? (
        <div className="mt-4">
          <RichTextView text={mission.transcript} size="lg" className={language === "en" ? "text-base" : ""} />
          <p className="mt-1 text-sm text-muted">{mission.translation}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-success">
            <CheckCircle2 size={16} /> Misión completada esta semana.
          </p>
        </div>
      ) : unlocked ? (
        <div className="mt-4">
          <ExerciseRunner
            exercise={mission.question}
            lessonId={mission.id}
            language={language}
            record={false}
            onAnswered={(ev) => ev.correct && completeMission(mission.id, mission.xp)}
          />
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">Escucha el audio {mission.minPlays} veces para desbloquear la pregunta. ¡Sin leer!</p>
      )}
    </div>
  );
}
