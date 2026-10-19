import type {
  Classmate,
  ClassroomPost,
  Course,
  LanguageCode,
  LevelCode,
  PhoneticsModule,
  PracticeCharacter,
  PronunciationItem,
  ReadingPassage,
  WeeklyChallenge,
} from "@/types/learning";
import {
  SYLLABUS,
  findExercise,
  findLesson,
  findVocab,
  type ExerciseRef,
  type LessonRef,
  type VocabRef,
} from "@/data/mockSyllabus";
import { classmatesFor, missionSetsFor, seedPostsFor } from "@/data/classroom";
import { PHONETICS_BY_LEVEL } from "@/data/zh/phonetics";
import { practiceCharactersFor, pronunciationItemsFor, readingPassagesFor } from "@/data/practice";
import { isoWeek, weekKey } from "@/lib/dates";

/**
 * Contrato de acceso a contenido. La UI NUNCA importa `src/data` directamente:
 * pasa siempre por aquí. En la Fase 2 basta con crear otra implementación
 * (Supabase, Postgres + Prisma, un CMS…) y cambiarla en `src/lib/content/index.ts`.
 *
 * Nota: la versión mock es síncrona. Una implementación remota expondrá estos
 * mismos métodos como `async` y se consumirá vía hooks con caché (SWR / React Query)
 * o Server Components, sin tocar los componentes de presentación.
 */
export interface ContentRepository {
  getCourse(level: LevelCode): Course;
  getLesson(lessonId: string): LessonRef | undefined;
  getExercise(exerciseId: string): ExerciseRef | undefined;
  getVocabulary(vocabId: string): VocabRef | undefined;
  getWeeklyChallenge(language: LanguageCode, level: LevelCode, date: Date): WeeklyChallenge;
  getClassmates(level: LevelCode): Classmate[];
  getSeedPosts(language: LanguageCode, level: LevelCode, now: Date): ClassroomPost[];
  getPracticeCharacters(level: LevelCode): PracticeCharacter[];
  getReadingPassages(language: LanguageCode, level: LevelCode): ReadingPassage[];
  getPronunciationItems(level: LevelCode): PronunciationItem[];
  /** Módulos de fonética del nivel (solo chino HSK 1–2; vacío en el resto). */
  getPhoneticsModules(level: LevelCode): PhoneticsModule[];
}

export const mockContentRepository: ContentRepository = {
  getCourse: (level) => SYLLABUS[level],
  getLesson: findLesson,
  getExercise: findExercise,
  getVocabulary: findVocab,
  getWeeklyChallenge(language, level, date) {
    const sets = missionSetsFor(language, level);
    // Rotación determinista: cada semana ISO toca un set distinto.
    const set = sets[isoWeek(date).week % sets.length];
    return { weekKey: weekKey(date), level, theme: set.theme, missions: set.missions };
  },
  getClassmates: classmatesFor,
  getSeedPosts: seedPostsFor,
  getPracticeCharacters: practiceCharactersFor,
  getReadingPassages: readingPassagesFor,
  getPronunciationItems: pronunciationItemsFor,
  getPhoneticsModules: (level) => PHONETICS_BY_LEVEL[level as keyof typeof PHONETICS_BY_LEVEL] ?? [],
};
