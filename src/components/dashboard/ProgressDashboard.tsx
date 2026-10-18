"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  CalendarCheck,
  Flame,
  Repeat2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { LANGUAGES, LEVELS } from "@/data/levels";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { MASTERED_BOX, useLearningStore } from "@/store/useLearningStore";
import {
  useActiveCourse,
  useBookProgress,
  useMissionStatuses,
  useOpenMistakes,
  useStreak,
  useVocabStats,
  useWeeklyActivity,
} from "@/store/selectors";
import { Badge, Card, CardHeader, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { ToneColoredTerm } from "@/components/text/RichTextView";

const BOX_LABELS = ["Nueva", "Aprendiendo", "Consolidando", "Dominada", "Experta"];

export function ProgressDashboard() {
  const { profile, language, level } = useLearningStore(
    useShallow((s) => ({ profile: s.profile, language: s.language, level: s.level })),
  );
  const book = useBookProgress();
  const streak = useStreak();
  const weekly = useWeeklyActivity();
  const vocab = useVocabStats();
  const mistakes = useOpenMistakes();
  const missions = useMissionStatuses();
  const greeting = language === "zh" ? "你好" : "Hi";
  const xpDelta = weekly.prevXp ? Math.round(((weekly.xp - weekly.prevXp) / weekly.prevXp) * 100) : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {LANGUAGES[language].flag} {LANGUAGES[language].name} · {LEVELS[level].label} {LEVELS[level].name}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            <span className={cn(language === "zh" && "font-cjk")}>{greeting}</span>, {profile.name} {profile.avatar}
          </h1>
          <p className="mt-1 text-muted">
            {streak.activeToday
              ? "¡Ya estudiaste hoy! Mantén el ritmo."
              : streak.current
                ? `Estudia hoy para mantener tu racha de ${streak.current} días.`
                : "Cada día cuenta: empieza tu racha hoy."}
          </p>
        </div>
        {book.nextLesson && (
          <Link
            href="/libro"
            onClick={() => useLearningStore.getState().openLesson(book.nextLesson!.id)}
            className="flex items-center gap-3 rounded-2xl bg-accent px-5 py-3 text-accent-ink transition hover:opacity-90"
          >
            <BookOpen size={18} />
            <span>
              <span className="block text-xs opacity-80">Continuar</span>
              <span className="block text-sm font-semibold">{book.nextLesson.title}</span>
            </span>
            <ArrowRight size={16} />
          </Link>
        )}
      </header>

      {/* Métricas principales */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<BookOpen size={18} />} label="Avance del libro" value={`${book.percent}%`}>
          <ProgressBar value={book.percent / 100} tone="success" className="mt-3" />
          <p className="mt-2 text-xs text-muted">
            {book.completed}/{book.total} lecciones · nota media {book.avgScore}%
          </p>
        </StatCard>
        <StatCard
          icon={<Flame size={18} className={streak.current ? "text-danger" : ""} />}
          label="Racha"
          value={`${streak.current} ${streak.current === 1 ? "día" : "días"}`}
        >
          <p className="mt-3 text-xs text-muted">Mejor racha: {streak.best} días</p>
          <p className="text-xs text-muted">{streak.activeToday ? "✅ Hoy completado" : "⏳ Hoy pendiente"}</p>
        </StatCard>
        <StatCard icon={<Brain size={18} />} label="Vocabulario dominado" value={`${vocab.mastered}/${vocab.total}`}>
          <p className="mt-3 text-xs text-muted">
            {vocab.learning} en repaso · {vocab.due.length} pendientes hoy
          </p>
          {LEVELS[level].targetVocabulary && (
            <p className="text-xs text-muted">Meta del nivel: ~{LEVELS[level].targetVocabulary} palabras</p>
          )}
        </StatCard>
        <StatCard icon={<CalendarCheck size={18} />} label="XP esta semana" value={`${weekly.xp}`}>
          <p className="mt-3 flex items-center gap-1 text-xs text-muted">
            {xpDelta === null ? (
              "Primera semana registrada"
            ) : xpDelta >= 0 ? (
              <>
                <TrendingUp size={13} className="text-success" /> +{xpDelta}% vs. semana pasada
              </>
            ) : (
              <>
                <TrendingDown size={13} className="text-danger" /> {xpDelta}% vs. semana pasada
              </>
            )}
          </p>
          <p className="text-xs text-muted">
            {weekly.exercises} ejercicios · {weekly.accuracy}% acierto
          </p>
        </StatCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Actividad semanal */}
        <Card>
          <CardHeader icon={<TrendingUp size={18} />} title="Progreso semanal" subtitle={`${weekly.totalXp} XP acumulados en total`} />
          <WeekChart days={weekly.days} />
        </Card>

        {/* Misiones */}
        <Card>
          <CardHeader
            icon={<Users size={18} />}
            title={`Misiones · Aula ${LEVELS[level].label}`}
            subtitle={`${missions.completed}/${missions.statuses.length} completadas · ${missions.xpEarned}/${missions.xpTotal} XP`}
            action={
              <Link href="/aula" className="text-sm font-medium text-accent hover:underline">
                Ir al aula
              </Link>
            }
          />
          <ul className="flex flex-col gap-3 px-5 pb-5 pt-4">
            {missions.statuses.map((m) => (
              <li key={m.mission.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className={cn(m.done && "text-muted line-through")}>{m.mission.title}</span>
                  <span className="text-xs text-muted">{m.progressLabel}</span>
                </div>
                <ProgressBar value={m.progress} tone={m.done ? "success" : "accent"} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Errores para repasar */}
        <Card>
          <CardHeader
            icon={<AlertCircle size={18} />}
            title="Errores para repasar"
            subtitle="Tu antídoto contra el estancamiento: practica justo lo que fallas."
            action={
              mistakes.open.length > 0 && (
                <Link href="/repaso?tab=errores" className="text-sm font-medium text-accent hover:underline">
                  Repasar todo
                </Link>
              )
            }
          />
          {mistakes.open.length === 0 ? (
            <EmptyState
              icon={<Trophy size={22} />}
              title="Sin errores pendientes"
              body={
                mistakes.resolvedCount
                  ? `Has corregido ${mistakes.resolvedCount} errores. ¡Sigue así!`
                  : "Cuando falles un ejercicio aparecerá aquí, con su explicación, para que vuelvas a practicarlo."
              }
            />
          ) : (
            <ul className="divide-y divide-line px-5 pb-3">
              {mistakes.open.slice(0, 5).map((m) => {
                const ref = content.getExercise(m.exerciseId);
                return (
                  <li key={m.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="danger">{m.skill}</Badge>
                      <span className="text-xs text-muted">
                        ×{m.count} · {ref?.lesson.title}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">
                      <span className="font-cjk text-muted line-through">{m.userAnswer}</span>
                      <ArrowRight size={13} className="mx-1.5 inline text-muted" />
                      <span className="font-cjk font-medium">{m.correctAnswer}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Debilidades + banco de vocabulario */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader icon={<Repeat2 size={18} />} title="Banco de vocabulario" subtitle="Sistema Leitner de 5 cajas" />
            <div className="px-5 pb-5 pt-4">
              <div className="flex h-24 items-end gap-2">
                {vocab.byBox.map((n, i) => {
                  const max = Math.max(1, ...vocab.byBox);
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-xs tabular-nums text-muted">{n}</span>
                      <div
                        className={cn("w-full rounded-t-md", i + 1 >= MASTERED_BOX ? "bg-success" : "bg-accent/60")}
                        style={{ height: `${Math.max(4, (n / max) * 64)}px` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-1 flex gap-2">
                {BOX_LABELS.map((l) => (
                  <span key={l} className="flex-1 text-center text-[10px] leading-tight text-muted">
                    {l}
                  </span>
                ))}
              </div>
              {vocab.due.length > 0 && (
                <Link
                  href="/repaso"
                  className="mt-4 flex items-center justify-between rounded-xl bg-accent-soft px-3 py-2 text-sm font-medium text-accent"
                >
                  {vocab.due.length} tarjetas para repasar hoy <ArrowRight size={15} />
                </Link>
              )}
              <RecentWords />
            </div>
          </Card>

          <Card>
            <CardHeader icon={<AlertCircle size={18} />} title="Puntos débiles" subtitle="Habilidades con más errores abiertos" />
            <div className="px-5 pb-5 pt-4">
              {mistakes.weakSkills.length === 0 ? (
                <p className="text-sm text-muted">Aún no hay datos suficientes.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {mistakes.weakSkills.slice(0, 4).map((w) => (
                    <li key={w.skill}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-cjk">{w.skill}</span>
                        <span className="text-xs text-muted">{w.count} fallos</span>
                      </div>
                      <ProgressBar value={w.count / mistakes.weakSkills[0].count} tone="warning" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>

      <UnitBreakdown />
    </div>
  );
}

function StatCard({ icon, label, value, children }: { icon: ReactNode; label: string; value: string; children?: ReactNode }) {
  return (
    <Card className="p-5">
      <p className="flex items-center gap-2 text-sm text-muted">
        {icon} {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
      {children}
    </Card>
  );
}

function WeekChart({ days }: { days: ReturnType<typeof useWeeklyActivity>["days"] }) {
  const max = Math.max(50, ...days.map((d) => d.xp));
  return (
    <div className="px-5 pb-5 pt-6">
      <div className="flex h-40 items-end gap-3">
        {days.map((d) => (
          <div key={d.key} className="group flex flex-1 flex-col items-center gap-1.5">
            <span className="text-xs tabular-nums text-muted opacity-0 transition group-hover:opacity-100">{d.xp} XP</span>
            <div
              title={`${d.exercises} ejercicios · ${d.correct} correctos · ${d.wordsReviewed} palabras repasadas`}
              className={cn(
                "w-full rounded-lg transition-all",
                d.xp ? (d.isToday ? "bg-accent" : "bg-accent/50") : "bg-surface-2",
              )}
              style={{ height: `${Math.max(6, (d.xp / max) * 120)}px` }}
            />
            <span className={cn("text-xs", d.isToday ? "font-semibold text-ink" : "text-muted")}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentWords() {
  const vocab = useVocabStats();
  const language = useLearningStore((s) => s.language);
  const recent = [...vocab.cards].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 8);
  if (!recent.length) {
    return <p className="mt-4 text-sm text-muted">Completa una lección o guarda palabras del vocabulario para empezar.</p>;
  }
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {recent.map((c) => {
        const item = content.getVocabulary(c.vocabId)?.item;
        if (!item) return null;
        return (
          <span
            key={c.vocabId}
            title={`${item.meaning} · caja ${c.box}`}
            className={cn(
              "rounded-lg border px-2 py-0.5 text-sm",
              c.box >= MASTERED_BOX ? "border-success/40 bg-success-soft" : "border-line",
            )}
          >
            {language === "zh" ? <ToneColoredTerm term={item.term} tones={item.tones} /> : item.term}
          </span>
        );
      })}
    </div>
  );
}

function UnitBreakdown() {
  const course = useActiveCourse();
  const completed = useLearningStore((s) => s.completedLessons);
  const attempts = useLearningStore((s) => s.attempts);
  const units = course.units.filter((u) => u.status === "available");
  if (!units.length) return null;

  return (
    <Card>
      <CardHeader icon={<BookOpen size={18} />} title="Detalle por lección" subtitle="Puntuación a la primera y ejercicios resueltos" />
      <div className="overflow-x-auto px-5 pb-5 pt-4">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="pb-2 font-medium">Lección</th>
              <th className="pb-2 font-medium">Ejercicios</th>
              <th className="pb-2 font-medium">Puntuación</th>
              <th className="pb-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {units.flatMap((u) =>
              u.lessons.map((l) => {
                const solved = l.exercises.filter((e) => attempts[e.id]?.correct).length;
                const p = completed[l.id];
                return (
                  <tr key={l.id}>
                    <td className="py-2.5 pr-3">
                      <span className="text-muted">U{u.order}·L{l.order}</span> {l.title}
                    </td>
                    <td className="py-2.5 pr-3 tabular-nums">
                      {solved}/{l.exercises.length}
                    </td>
                    <td className="py-2.5 pr-3 tabular-nums">{p ? `${p.score}%` : "—"}</td>
                    <td className="py-2.5">
                      {p ? <Badge tone="success">Completada</Badge> : solved ? <Badge tone="accent">En curso</Badge> : <Badge>Sin empezar</Badge>}
                    </td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
