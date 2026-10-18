"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, Flame, Lock, Send, Trophy, Users } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { LANGUAGES, LEVELS } from "@/data/levels";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { daysUntilNextWeek } from "@/lib/dates";
import { useLearningStore } from "@/store/useLearningStore";
import { useClassroomFeed, useMissionStatuses, useWeeklyChallenge } from "@/store/selectors";
import type { ClassroomPost, ParticipationMission } from "@/types/learning";
import { Badge, Button, Card, ProgressBar } from "@/components/ui/primitives";
import { MissionCard } from "./MissionCard";
import { PostCard } from "./PostCard";

const TAGS: ClassroomPost["tag"][] = ["pregunta", "recurso", "logro"];
type Filter = "todos" | ClassroomPost["tag"];

/** Aula virtual exclusiva del nivel activo: retos semanales + tablón de pares. */
export function LevelClassroom() {
  const { language, level, profile, publishPost } = useLearningStore(
    useShallow((s) => ({ language: s.language, level: s.level, profile: s.profile, publishPost: s.publishPost })),
  );
  const challenge = useWeeklyChallenge();
  const { statuses, completed, xpEarned, xpTotal } = useMissionStatuses();
  const feed = useClassroomFeed();
  const classmates = useMemo(() => content.getClassmates(level), [level]);
  const classmateMap = useMemo(() => new Map(classmates.map((c) => [c.id, c])), [classmates]);

  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState<ClassroomPost["tag"]>("pregunta");
  const [missionId, setMissionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("todos");
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const participation = statuses.find((s) => s.mission.kind === "participation");
  const linkedMission = missionId
    ? (statuses.find((s) => s.mission.id === missionId)?.mission as ParticipationMission | undefined)
    : undefined;
  const tooShort = !!linkedMission && draft.trim().length < linkedMission.minLength;
  const visibleFeed = filter === "todos" ? feed : feed.filter((p) => p.tag === filter);

  const startParticipation = (id: string) => {
    setMissionId(id);
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const submit = () => {
    if (!draft.trim() || tooShort) return;
    publishPost({
      content: draft,
      tag: linkedMission ? "misión" : tag,
      missionId: linkedMission?.id,
      missionXp: linkedMission?.xp,
    });
    setDraft("");
    setMissionId(null);
  };

  const label = LEVELS[level].label;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Lock size={13} /> Espacio exclusivo para estudiantes de {LANGUAGES[language].name} {label}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Aula {LANGUAGES[language].flag} {label}
          </h1>
          <p className="mt-1 text-muted">Solo ves y hablas con compañeros de tu mismo nivel exacto.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {classmates.slice(0, 5).map((c) => (
              <span
                key={c.id}
                title={`${c.name} ${c.country} · racha ${c.streak} días`}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-bg bg-surface-2 text-lg"
              >
                {c.avatar}
              </span>
            ))}
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-bg bg-accent-soft text-lg">
              {profile.avatar}
            </span>
          </div>
          <span className="text-sm text-muted">{classmates.length + 1} en el aula</span>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        {/* Retos semanales */}
        <section className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">Misiones de la semana · {challenge.weekKey}</p>
                <h2 className="mt-1 text-xl font-semibold">{challenge.theme}</h2>
              </div>
              <Badge tone="warning">
                <CalendarClock size={13} /> Se renuevan en {daysUntilNextWeek()} {daysUntilNextWeek() === 1 ? "día" : "días"}
              </Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar value={completed / statuses.length} tone={completed === statuses.length ? "success" : "accent"} />
              <span className="shrink-0 text-sm tabular-nums text-muted">
                {completed}/{statuses.length}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              {xpEarned}/{xpTotal} XP {completed === statuses.length && "· 🎉 ¡Semana completada!"}
            </p>
          </Card>
          {statuses.map((s) => (
            <MissionCard key={s.mission.id} status={s} language={language} onParticipate={startParticipation} />
          ))}

          <Card className="p-5">
            <p className="flex items-center gap-2 font-semibold">
              <Trophy size={17} className="text-warning" /> Constancia en el aula
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {[...classmates]
                .sort((a, b) => b.streak - a.streak)
                .map((c, i) => (
                  <li key={c.id} className="flex items-center gap-3 text-sm">
                    <span className="w-4 text-xs text-muted">{i + 1}</span>
                    <span className="text-lg">{c.avatar}</span>
                    <span className="flex-1">
                      {c.name} {c.country}
                    </span>
                    <span className="flex items-center gap-1 text-muted">
                      <Flame size={14} className="text-danger" /> {c.streak}
                    </span>
                  </li>
                ))}
            </ul>
          </Card>
        </section>

        {/* Tablón */}
        <section className="flex flex-col gap-4">
          <Card className="p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Users size={16} /> Tablón del aula {label}
            </p>
            {linkedMission && (
              <div className="mb-2 flex items-start justify-between gap-2 rounded-xl bg-accent-soft p-3 text-sm">
                <div>
                  <p className="font-medium text-accent">Respondiendo a la misión</p>
                  <p className={cn(language === "zh" && "font-cjk")}>{linkedMission.prompt}</p>
                </div>
                <button type="button" onClick={() => setMissionId(null)} className="text-xs text-muted hover:text-ink">
                  Quitar
                </button>
              </div>
            )}
            <textarea
              ref={composerRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder={
                language === "zh"
                  ? "用中文写点什么吧！También puedes preguntar en español."
                  : "Write something in English! También puedes preguntar en español."
              }
              className={cn(
                "w-full resize-y rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-accent",
                language === "zh" && "font-cjk",
              )}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {!linkedMission &&
                  TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(t)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium capitalize transition",
                        tag === t ? "bg-ink text-bg" : "bg-surface-2 text-muted hover:text-ink",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                {!linkedMission && participation && !participation.done && (
                  <button
                    type="button"
                    onClick={() => setMissionId(participation.mission.id)}
                    className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
                  >
                    + Vincular a misión
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {linkedMission && (
                  <span className={cn("text-xs tabular-nums", tooShort ? "text-danger" : "text-success")}>
                    {draft.trim().length}/{linkedMission.minLength}
                  </span>
                )}
                <Button size="sm" onClick={submit} disabled={!draft.trim() || tooShort}>
                  <Send size={14} /> Publicar
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex gap-1 overflow-x-auto">
            {(["todos", "misión", ...TAGS] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-sm capitalize transition",
                  filter === f ? "bg-surface font-medium shadow-sm ring-1 ring-line" : "text-muted hover:text-ink",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {visibleFeed.map((post) => (
            <PostCard key={post.id} post={post} classmates={classmateMap} />
          ))}
          {visibleFeed.length === 0 && <p className="py-6 text-center text-sm text-muted">No hay publicaciones con este filtro.</p>}
        </section>
      </div>
    </div>
  );
}

/**
 * Completa automáticamente las misiones medibles (gramática) cuando se alcanza
 * el objetivo, esté el alumno donde esté. Se monta una vez en el AppShell.
 */
export function MissionWatcher() {
  const { statuses } = useMissionStatuses();
  const completeMission = useLearningStore((s) => s.completeMission);
  useEffect(() => {
    for (const s of statuses) {
      if (s.mission.kind === "grammar" && !s.done && s.progress >= 1) completeMission(s.mission.id, s.mission.xp);
    }
  }, [statuses, completeMission]);
  return null;
}
