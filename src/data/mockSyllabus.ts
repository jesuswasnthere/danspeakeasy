/**
 * Syllabus mock completo: une las unidades de cada nivel en cursos.
 *
 * Contenido profundo: HSK 2 (unidad 1, 3 lecciones) e Inglés B1 (unidad 1, 3 lecciones).
 * Estructura base: HSK 1 y A2 (una lección), resto de niveles con unidades planificadas.
 *
 * En la Fase 2 este archivo se sustituye por una implementación de
 * `ContentRepository` (ver `src/lib/content`) que lea de base de datos / CMS.
 */
import type { Course, Exercise, HSKLevel, Lesson, LevelCode, Unit, VocabularyItem } from "@/types/learning";
import { LEVELS } from "./levels";
import { hsk2Units } from "./zh/hsk2";
import { zhOtherUnits } from "./zh/otherLevels";
import { b1Units } from "./en/b1";
import { enOtherUnits } from "./en/otherLevels";
import { PHONETICS_BY_LEVEL, phoneticsCourse } from "./zh/phonetics";

const UNITS_BY_LEVEL: Record<LevelCode, Unit[]> = {
  HSK1: zhOtherUnits.HSK1 ?? [],
  HSK2: hsk2Units,
  HSK3: zhOtherUnits.HSK3 ?? [],
  HSK4: zhOtherUnits.HSK4 ?? [],
  HSK5: zhOtherUnits.HSK5 ?? [],
  HSK6: zhOtherUnits.HSK6 ?? [],
  A1: enOtherUnits.A1 ?? [],
  A2: enOtherUnits.A2 ?? [],
  B1: b1Units,
  B2: enOtherUnits.B2 ?? [],
  C1: enOtherUnits.C1 ?? [],
  C2: enOtherUnits.C2 ?? [],
};

export const SYLLABUS: Record<LevelCode, Course> = Object.fromEntries(
  (Object.keys(UNITS_BY_LEVEL) as LevelCode[]).map((level) => {
    const info = LEVELS[level];
    return [
      level,
      {
        language: info.language,
        level,
        title: `Libro de clase · ${info.label}`,
        units: [...UNITS_BY_LEVEL[level]].sort((a, b) => a.order - b.order),
      } satisfies Course,
    ];
  }),
) as Record<LevelCode, Course>;

// ─── Índices para búsquedas O(1) ──────────────────────────────────────────────

export interface LessonRef {
  lesson: Lesson;
  unit: Unit;
  course: Course;
}

export interface ExerciseRef extends LessonRef {
  exercise: Exercise;
}

export interface VocabRef extends LessonRef {
  item: VocabularyItem;
}

const lessonIndex = new Map<string, LessonRef>();
const exerciseIndex = new Map<string, ExerciseRef>();
const vocabIndex = new Map<string, VocabRef>();

// Los módulos de fonética no son parte del libro (no cuentan en su progreso), pero se
// indexan para que sus errores aparezcan y se puedan re-practicar en Repaso.
const phoneticsCourses = (Object.keys(PHONETICS_BY_LEVEL) as HSKLevel[])
  .map(phoneticsCourse)
  .filter((c): c is Course => !!c);

for (const course of [...Object.values(SYLLABUS), ...phoneticsCourses]) {
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      const ref = { lesson, unit, course };
      lessonIndex.set(lesson.id, ref);
      for (const exercise of lesson.exercises) exerciseIndex.set(exercise.id, { ...ref, exercise });
      for (const item of lesson.vocabulary) vocabIndex.set(item.id, { ...ref, item });
    }
  }
}

export const findLesson = (id: string) => lessonIndex.get(id);
export const findExercise = (id: string) => exerciseIndex.get(id);
export const findVocab = (id: string) => vocabIndex.get(id);

export function lessonsOf(course: Course): Lesson[] {
  return course.units.flatMap((u) => u.lessons);
}
