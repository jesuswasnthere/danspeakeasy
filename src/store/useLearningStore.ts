"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  ClassroomPost,
  ClassroomReply,
  DailyActivity,
  Exercise,
  ExerciseAttempt,
  ExerciseEvaluation,
  LanguageCode,
  LessonProgress,
  LevelCode,
  LevelsByLanguage,
  MistakeEntry,
  StudyPreferences,
  VocabCard,
  WeeklyRecord,
} from "@/types/learning";
import { LEVELS } from "@/data/levels";
import { addDays, dayKey, weekKey } from "@/lib/dates";

// ─── Constantes de gamificación / repaso ──────────────────────────────────────

export const XP = {
  correctExercise: 10,
  lessonCompleted: 50,
  wordReviewed: 2,
  post: 5,
  characterWritten: 5,
  characterPerfect: 5,
  pronunciationGood: 5,
  readingCompleted: 15,
} as const;

/** Puntuación (0-100) a partir de la cual una pronunciación cuenta como buena. */
export const PRONUNCIATION_PASS = 70;

/** Días hasta el siguiente repaso según la caja Leitner. */
export const LEITNER_INTERVALS: Record<VocabCard["box"], number> = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };
export const MASTERED_BOX = 4;

export const ME = "me";

// ─── Estado ───────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  avatar: string;
}

export interface PracticeStats {
  /** Escritura de caracteres: por hanzi. */
  strokes: Record<string, { attempts: number; completions: number; bestMistakes: number; lastAt: string }>;
  /** Pronunciación: por id de ítem. */
  pronunciation: Record<string, { attempts: number; bestScore: number; lastScore: number; lastAt: string }>;
  /** Lecturas completadas: por id de texto. */
  readings: Record<string, { completions: number; lastAt: string }>;
}

export interface LearningData {
  onboarded: boolean;
  profile: Profile;
  language: LanguageCode;
  level: LevelCode;
  levelByLanguage: LevelsByLanguage;
  preferences: StudyPreferences;
  /** Última lección abierta por nivel, para retomar. */
  lastLessonByLevel: Partial<Record<LevelCode, string>>;
  completedLessons: Record<string, LessonProgress>;
  attempts: Record<string, ExerciseAttempt>;
  mistakes: Record<string, MistakeEntry>;
  vocabBank: Record<string, VocabCard>;
  activity: Record<string, DailyActivity>;
  weekly: Record<string, WeeklyRecord>;
  posts: ClassroomPost[];
  /** Respuestas del alumno a posts de compañeros (mock). */
  repliesByPost: Record<string, ClassroomReply[]>;
  likedPosts: string[];
  practice: PracticeStats;
}

export interface RecordExerciseInput {
  exercise: Exercise;
  lessonId: string;
  evaluation: ExerciseEvaluation;
  /** "review" = desde la bandeja de errores: un acierto resuelve el error. */
  source: "lesson" | "review";
}

export interface LearningActions {
  completeOnboarding(input: { name: string; avatar: string; language: LanguageCode; level: LevelCode }): void;
  setLanguage(language: LanguageCode): void;
  setLevel(level: LevelCode): void;
  togglePinyin(): void;
  toggleTranslation(): void;
  toggleToneColors(): void;
  setSpeechRate(rate: number): void;
  openLesson(lessonId: string): void;
  recordExercise(input: RecordExerciseInput): void;
  completeLesson(lessonId: string, score: number, vocabIds: string[]): void;
  addToBank(vocabIds: string[]): void;
  removeFromBank(vocabId: string): void;
  reviewWord(vocabId: string, remembered: boolean): void;
  dismissMistake(exerciseId: string): void;
  registerAudioPlay(): void;
  completeMission(missionId: string, xp: number): void;
  publishPost(input: { content: string; tag: ClassroomPost["tag"]; missionId?: string; missionXp?: number }): void;
  replyToPost(postId: string, content: string): void;
  toggleLike(postId: string): void;
  recordCharacterWriting(char: string, mistakes: number): void;
  recordPronunciation(itemId: string, score: number): void;
  recordReading(passageId: string): void;
  resetProgress(): void;
}

export type LearningStore = LearningData & LearningActions;

const initialData: LearningData = {
  onboarded: false,
  profile: { name: "", avatar: "🧑‍🎓" },
  language: "zh",
  level: "HSK2",
  levelByLanguage: { zh: "HSK2", en: "B1" },
  preferences: { showPinyin: true, showTranslation: true, toneColors: true, speechRate: 0.9 },
  lastLessonByLevel: {},
  completedLessons: {},
  attempts: {},
  mistakes: {},
  vocabBank: {},
  activity: {},
  weekly: {},
  posts: [],
  repliesByPost: {},
  likedPosts: [],
  practice: { strokes: {}, pronunciation: {}, readings: {} },
};

// ─── Helpers puros ────────────────────────────────────────────────────────────

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function bumpActivity(
  activity: Record<string, DailyActivity>,
  patch: Partial<Omit<DailyActivity, "date">>,
): Record<string, DailyActivity> {
  const key = dayKey();
  const cur = activity[key] ?? { date: key, exercises: 0, correct: 0, lessonsCompleted: 0, wordsReviewed: 0, xp: 0 };
  return {
    ...activity,
    [key]: {
      ...cur,
      exercises: cur.exercises + (patch.exercises ?? 0),
      correct: cur.correct + (patch.correct ?? 0),
      lessonsCompleted: cur.lessonsCompleted + (patch.lessonsCompleted ?? 0),
      wordsReviewed: cur.wordsReviewed + (patch.wordsReviewed ?? 0),
      xp: cur.xp + (patch.xp ?? 0),
    },
  };
}

function currentWeek(weekly: Record<string, WeeklyRecord>): WeeklyRecord {
  const key = weekKey();
  return weekly[key] ?? { weekKey: key, audioPlays: 0, completedMissions: [], correctByLevel: {} };
}

function newCard(vocabId: string, language: LanguageCode, level: LevelCode): VocabCard {
  const now = new Date();
  return {
    vocabId,
    language,
    level,
    box: 1,
    addedAt: now.toISOString(),
    nextReviewAt: now.toISOString(),
    reviews: 0,
    lapses: 0,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      ...initialData,

      completeOnboarding: ({ name, avatar, language, level }) =>
        set((s) => ({
          onboarded: true,
          profile: { name: name.trim() || "Estudiante", avatar },
          language,
          level,
          levelByLanguage: { ...s.levelByLanguage, [language]: level },
        })),

      setLanguage: (language) =>
        set((s) => ({ language, level: s.levelByLanguage[language] })),

      setLevel: (level) => {
        const language = LEVELS[level].language;
        set((s) => ({ level, language, levelByLanguage: { ...s.levelByLanguage, [language]: level } }));
      },

      togglePinyin: () => set((s) => ({ preferences: { ...s.preferences, showPinyin: !s.preferences.showPinyin } })),
      toggleTranslation: () =>
        set((s) => ({ preferences: { ...s.preferences, showTranslation: !s.preferences.showTranslation } })),
      toggleToneColors: () =>
        set((s) => ({ preferences: { ...s.preferences, toneColors: !s.preferences.toneColors } })),
      setSpeechRate: (rate) =>
        set((s) => ({ preferences: { ...s.preferences, speechRate: Math.min(1.5, Math.max(0.5, rate)) } })),

      openLesson: (lessonId) =>
        set((s) => ({ lastLessonByLevel: { ...s.lastLessonByLevel, [s.level]: lessonId } })),

      recordExercise: ({ exercise, lessonId, evaluation, source }) =>
        set((s) => {
          const now = new Date().toISOString();
          const prev = s.attempts[exercise.id];
          const attempt: ExerciseAttempt = {
            exerciseId: exercise.id,
            lessonId,
            attempts: (prev?.attempts ?? 0) + 1,
            correct: evaluation.correct || !!prev?.correct,
            firstTryCorrect: prev ? prev.firstTryCorrect : evaluation.correct,
            lastAttemptAt: now,
          };

          const mistakes = { ...s.mistakes };
          const existing = mistakes[exercise.id];
          if (!evaluation.correct) {
            mistakes[exercise.id] = {
              id: exercise.id,
              exerciseId: exercise.id,
              lessonId,
              language: s.language,
              level: s.level,
              skill: exercise.skill,
              userAnswer: evaluation.userAnswer,
              correctAnswer: evaluation.correctAnswer,
              explanation: exercise.explanation,
              count: (existing?.count ?? 0) + 1,
              lastAt: now,
              resolved: false,
            };
          } else if (existing && source === "review") {
            mistakes[exercise.id] = { ...existing, resolved: true, lastAt: now };
          }

          const week = currentWeek(s.weekly);
          const correctByLevel = evaluation.correct
            ? { ...week.correctByLevel, [s.level]: (week.correctByLevel[s.level] ?? 0) + 1 }
            : week.correctByLevel;

          return {
            attempts: { ...s.attempts, [exercise.id]: attempt },
            mistakes,
            weekly: { ...s.weekly, [week.weekKey]: { ...week, correctByLevel } },
            activity: bumpActivity(s.activity, {
              exercises: 1,
              correct: evaluation.correct ? 1 : 0,
              xp: evaluation.correct ? XP.correctExercise : 0,
            }),
          };
        }),

      completeLesson: (lessonId, score, vocabIds) => {
        const already = !!get().completedLessons[lessonId];
        set((s) => ({
          completedLessons: {
            ...s.completedLessons,
            [lessonId]: { lessonId, score: Math.max(score, s.completedLessons[lessonId]?.score ?? 0), completedAt: new Date().toISOString() },
          },
          activity: already ? s.activity : bumpActivity(s.activity, { lessonsCompleted: 1, xp: XP.lessonCompleted }),
        }));
        get().addToBank(vocabIds);
      },

      addToBank: (vocabIds) =>
        set((s) => {
          const bank = { ...s.vocabBank };
          for (const id of vocabIds) if (!bank[id]) bank[id] = newCard(id, s.language, s.level);
          return { vocabBank: bank };
        }),

      removeFromBank: (vocabId) =>
        set((s) => {
          const bank = { ...s.vocabBank };
          delete bank[vocabId];
          return { vocabBank: bank };
        }),

      reviewWord: (vocabId, remembered) =>
        set((s) => {
          const card = s.vocabBank[vocabId];
          if (!card) return {};
          const box = (remembered ? Math.min(5, card.box + 1) : 1) as VocabCard["box"];
          const now = new Date();
          return {
            vocabBank: {
              ...s.vocabBank,
              [vocabId]: {
                ...card,
                box,
                reviews: card.reviews + 1,
                lapses: card.lapses + (remembered ? 0 : 1),
                lastReviewedAt: now.toISOString(),
                nextReviewAt: addDays(now, LEITNER_INTERVALS[box]).toISOString(),
              },
            },
            activity: bumpActivity(s.activity, { wordsReviewed: 1, xp: XP.wordReviewed }),
          };
        }),

      dismissMistake: (exerciseId) =>
        set((s) => {
          const m = s.mistakes[exerciseId];
          return m ? { mistakes: { ...s.mistakes, [exerciseId]: { ...m, resolved: true } } } : {};
        }),

      registerAudioPlay: () =>
        set((s) => {
          const week = currentWeek(s.weekly);
          return { weekly: { ...s.weekly, [week.weekKey]: { ...week, audioPlays: week.audioPlays + 1 } } };
        }),

      completeMission: (missionId, xp) =>
        set((s) => {
          const week = currentWeek(s.weekly);
          if (week.completedMissions.includes(missionId)) return {};
          return {
            weekly: { ...s.weekly, [week.weekKey]: { ...week, completedMissions: [...week.completedMissions, missionId] } },
            activity: bumpActivity(s.activity, { xp }),
          };
        }),

      publishPost: ({ content, tag, missionId, missionXp }) => {
        const text = content.trim();
        if (!text) return;
        const post: ClassroomPost = {
          id: `me-${uid()}`,
          level: get().level,
          authorId: ME,
          content: text,
          createdAt: new Date().toISOString(),
          tag,
          missionId,
          likes: 0,
          replies: [],
        };
        set((s) => ({ posts: [post, ...s.posts], activity: bumpActivity(s.activity, { xp: XP.post }) }));
        if (missionId) get().completeMission(missionId, missionXp ?? 0);
      },

      replyToPost: (postId, content) => {
        const text = content.trim();
        if (!text) return;
        const reply: ClassroomReply = { id: `me-r-${uid()}`, authorId: ME, content: text, createdAt: new Date().toISOString() };
        set((s) => {
          const own = s.posts.find((p) => p.id === postId);
          if (own) {
            return { posts: s.posts.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, reply] } : p)) };
          }
          return { repliesByPost: { ...s.repliesByPost, [postId]: [...(s.repliesByPost[postId] ?? []), reply] } };
        });
      },

      toggleLike: (postId) =>
        set((s) => ({
          likedPosts: s.likedPosts.includes(postId)
            ? s.likedPosts.filter((id) => id !== postId)
            : [...s.likedPosts, postId],
        })),

      recordCharacterWriting: (char, mistakes) =>
        set((s) => {
          const prev = s.practice.strokes[char];
          return {
            practice: {
              ...s.practice,
              strokes: {
                ...s.practice.strokes,
                [char]: {
                  attempts: (prev?.attempts ?? 0) + 1,
                  completions: (prev?.completions ?? 0) + 1,
                  bestMistakes: Math.min(mistakes, prev?.bestMistakes ?? Infinity),
                  lastAt: new Date().toISOString(),
                },
              },
            },
            activity: bumpActivity(s.activity, {
              xp: XP.characterWritten + (mistakes === 0 ? XP.characterPerfect : 0),
            }),
          };
        }),

      recordPronunciation: (itemId, score) =>
        set((s) => {
          const prev = s.practice.pronunciation[itemId];
          return {
            practice: {
              ...s.practice,
              pronunciation: {
                ...s.practice.pronunciation,
                [itemId]: {
                  attempts: (prev?.attempts ?? 0) + 1,
                  bestScore: Math.max(score, prev?.bestScore ?? 0),
                  lastScore: score,
                  lastAt: new Date().toISOString(),
                },
              },
            },
            activity: bumpActivity(s.activity, { xp: score >= PRONUNCIATION_PASS ? XP.pronunciationGood : 0 }),
          };
        }),

      recordReading: (passageId) =>
        set((s) => {
          const prev = s.practice.readings[passageId];
          return {
            practice: {
              ...s.practice,
              readings: {
                ...s.practice.readings,
                [passageId]: { completions: (prev?.completions ?? 0) + 1, lastAt: new Date().toISOString() },
              },
            },
            activity: bumpActivity(s.activity, { xp: XP.readingCompleted }),
          };
        }),

      resetProgress: () => set({ ...initialData }),
    }),
    {
      name: "danspeakeasy-learning",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // La hidratación se dispara manualmente en <StoreHydration/> para evitar
      // desajustes SSR ↔ cliente.
      skipHydration: true,
      partialize: (s): LearningData => ({
        onboarded: s.onboarded,
        profile: s.profile,
        language: s.language,
        level: s.level,
        levelByLanguage: s.levelByLanguage,
        preferences: s.preferences,
        lastLessonByLevel: s.lastLessonByLevel,
        completedLessons: s.completedLessons,
        attempts: s.attempts,
        mistakes: s.mistakes,
        vocabBank: s.vocabBank,
        activity: s.activity,
        weekly: s.weekly,
        posts: s.posts,
        repliesByPost: s.repliesByPost,
        likedPosts: s.likedPosts,
        practice: s.practice,
      }),
      // Los datos guardados antes de añadir `practice` no lo traen: completamos con valores por defecto.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<LearningData>;
        return { ...current, ...p, practice: { ...initialData.practice, ...p.practice } };
      },
    },
  ),
);
