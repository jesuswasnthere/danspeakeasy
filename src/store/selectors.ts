"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useShallow } from "zustand/react/shallow";
import { content } from "@/lib/content";
import { addDays, dayKey, parseDayKey, startOfWeek, weekKey, WEEKDAY_SHORT } from "@/lib/dates";
import type { ClassroomPost, VocabCard, WeeklyMission } from "@/types/learning";
import { MASTERED_BOX, useLearningStore } from "./useLearningStore";

// ─── Hidratación ──────────────────────────────────────────────────────────────

const subscribeHydration = (cb: () => void) => useLearningStore.persist.onFinishHydration(cb);

/** true cuando el store ya leyó localStorage (solo en cliente). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useLearningStore.persist.hasHydrated(),
    () => false,
  );
}

// ─── Curso activo y progreso del libro ────────────────────────────────────────

export function useActiveCourse() {
  const level = useLearningStore((s) => s.level);
  return useMemo(() => content.getCourse(level), [level]);
}

export function useBookProgress() {
  const course = useActiveCourse();
  const completed = useLearningStore((s) => s.completedLessons);
  return useMemo(() => {
    const lessons = course.units.flatMap((u) => u.lessons);
    const done = lessons.filter((l) => completed[l.id]);
    const avgScore = done.length ? Math.round(done.reduce((a, l) => a + completed[l.id].score, 0) / done.length) : 0;
    return {
      total: lessons.length,
      completed: done.length,
      percent: lessons.length ? Math.round((done.length / lessons.length) * 100) : 0,
      avgScore,
      nextLesson: lessons.find((l) => !completed[l.id]),
    };
  }, [course, completed]);
}

// ─── Racha y actividad ────────────────────────────────────────────────────────

export function useStreak() {
  const activity = useLearningStore((s) => s.activity);
  return useMemo(() => {
    const active = (d: Date) => (activity[dayKey(d)]?.xp ?? 0) > 0;
    let cursor = new Date();
    // Si hoy aún no hay actividad, la racha cuenta hasta ayer (no se rompe todavía).
    if (!active(cursor)) cursor = addDays(cursor, -1);
    let current = 0;
    while (active(cursor)) {
      current++;
      cursor = addDays(cursor, -1);
    }
    // Racha más larga histórica.
    const days = Object.keys(activity).filter((k) => activity[k].xp > 0).sort();
    let best = 0;
    let run = 0;
    let prev: Date | null = null;
    for (const k of days) {
      const d = parseDayKey(k);
      run = prev && dayKey(addDays(prev, 1)) === k ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    }
    return { current, best, activeToday: active(new Date()) };
  }, [activity]);
}

export function useWeeklyActivity() {
  const activity = useLearningStore((s) => s.activity);
  return useMemo(() => {
    const monday = startOfWeek();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(monday, i);
      const a = activity[dayKey(d)];
      return {
        key: dayKey(d),
        label: WEEKDAY_SHORT[i],
        isToday: dayKey(d) === dayKey(),
        xp: a?.xp ?? 0,
        exercises: a?.exercises ?? 0,
        correct: a?.correct ?? 0,
        wordsReviewed: a?.wordsReviewed ?? 0,
      };
    });
    const prevMonday = addDays(monday, -7);
    const prevXp = Array.from({ length: 7 }, (_, i) => activity[dayKey(addDays(prevMonday, i))]?.xp ?? 0).reduce(
      (a, b) => a + b,
      0,
    );
    const xp = days.reduce((a, d) => a + d.xp, 0);
    const exercises = days.reduce((a, d) => a + d.exercises, 0);
    const correct = days.reduce((a, d) => a + d.correct, 0);
    return {
      days,
      xp,
      prevXp,
      exercises,
      accuracy: exercises ? Math.round((correct / exercises) * 100) : 0,
      totalXp: Object.values(activity).reduce((a, d) => a + d.xp, 0),
    };
  }, [activity]);
}

// ─── Vocabulario ──────────────────────────────────────────────────────────────

/** Tarjetas cuyo repaso ya venció (comparado con la hora actual). */
function dueCards(cards: VocabCard[], now: Date = new Date()): VocabCard[] {
  return cards.filter((c) => new Date(c.nextReviewAt).getTime() <= now.getTime());
}

export function useVocabStats() {
  const bank = useLearningStore((s) => s.vocabBank);
  const level = useLearningStore((s) => s.level);
  return useMemo(() => {
    const cards = Object.values(bank).filter((c) => c.level === level);
    return {
      total: cards.length,
      mastered: cards.filter((c) => c.box >= MASTERED_BOX).length,
      learning: cards.filter((c) => c.box < MASTERED_BOX).length,
      due: dueCards(cards),
      byBox: [1, 2, 3, 4, 5].map((b) => cards.filter((c) => c.box === b).length),
      cards,
    };
  }, [bank, level]);
}

// ─── Errores ──────────────────────────────────────────────────────────────────

export function useOpenMistakes() {
  const mistakes = useLearningStore((s) => s.mistakes);
  const level = useLearningStore((s) => s.level);
  return useMemo(() => {
    const open = Object.values(mistakes)
      .filter((m) => m.level === level && !m.resolved)
      .sort((a, b) => b.count - a.count || b.lastAt.localeCompare(a.lastAt));
    const bySkill = new Map<string, number>();
    for (const m of open) bySkill.set(m.skill, (bySkill.get(m.skill) ?? 0) + m.count);
    return {
      open,
      resolvedCount: Object.values(mistakes).filter((m) => m.level === level && m.resolved).length,
      weakSkills: [...bySkill.entries()].sort((a, b) => b[1] - a[1]).map(([skill, count]) => ({ skill, count })),
    };
  }, [mistakes, level]);
}

// ─── Aula y misiones ──────────────────────────────────────────────────────────

export function useWeeklyChallenge() {
  const { language, level } = useLearningStore(useShallow((s) => ({ language: s.language, level: s.level })));
  return useMemo(() => content.getWeeklyChallenge(language, level, new Date()), [language, level]);
}

export interface MissionStatus {
  mission: WeeklyMission;
  done: boolean;
  /** 0-1 */
  progress: number;
  progressLabel: string;
}

export function useMissionStatuses(): { statuses: MissionStatus[]; completed: number; xpEarned: number; xpTotal: number } {
  const challenge = useWeeklyChallenge();
  const level = useLearningStore((s) => s.level);
  const week = useLearningStore((s) => s.weekly[weekKey()]);
  return useMemo(() => {
    const completedIds = week?.completedMissions ?? [];
    const statuses = challenge.missions.map((mission): MissionStatus => {
      const done = completedIds.includes(mission.id);
      if (mission.kind === "grammar") {
        const n = week?.correctByLevel[level] ?? 0;
        return {
          mission,
          done,
          progress: done ? 1 : Math.min(1, n / mission.targetCorrect),
          progressLabel: `${Math.min(n, mission.targetCorrect)}/${mission.targetCorrect} aciertos`,
        };
      }
      return { mission, done, progress: done ? 1 : 0, progressLabel: done ? "Completada" : "Pendiente" };
    });
    const doneList = statuses.filter((s) => s.done);
    return {
      statuses,
      completed: doneList.length,
      xpEarned: doneList.reduce((a, s) => a + s.mission.xp, 0),
      xpTotal: statuses.reduce((a, s) => a + s.mission.xp, 0),
    };
  }, [challenge, week, level]);
}

/** Tablón del nivel activo: posts mock + posts y respuestas del alumno. */
export function useClassroomFeed(): ClassroomPost[] {
  const { language, level, posts, repliesByPost } = useLearningStore(
    useShallow((s) => ({ language: s.language, level: s.level, posts: s.posts, repliesByPost: s.repliesByPost })),
  );
  return useMemo(() => {
    const seed = content.getSeedPosts(language, level, new Date()).map((p) => ({
      ...p,
      replies: [...p.replies, ...(repliesByPost[p.id] ?? [])],
    }));
    const mine = posts.filter((p) => p.level === level);
    return [...mine, ...seed].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [language, level, posts, repliesByPost]);
}
