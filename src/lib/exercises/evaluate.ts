import type {
  Exercise,
  ExerciseEvaluation,
  FillBlankExercise,
  MultipleChoiceExercise,
  SentenceBuilderExercise,
  TextToken,
  TonePracticeExercise,
} from "@/types/learning";

/** Respuesta cruda del alumno según el tipo de ejercicio. */
export type ExerciseAnswer =
  | { type: "sentence-builder"; order: number[] }
  | { type: "fill-blank"; value: string }
  | { type: "multiple-choice"; optionId: string }
  | { type: "tone-practice"; tones: number[] };

const CJK = /[㐀-鿿]/;

/** Une bloques: sin espacios en chino, con espacios en inglés. */
export function joinBlocks(blocks: TextToken[]): string {
  const isCjk = blocks.some((b) => CJK.test(b.text));
  return blocks.map((b) => b.text).join(isCjk ? "" : " ");
}

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.!?。！？]+$/u, "");
}

function evaluateSentence(ex: SentenceBuilderExercise, order: number[]): ExerciseEvaluation {
  const pick = (idx: number[]) => joinBlocks(idx.map((i) => ex.blocks[i]));
  const user = pick(order);
  const solutions = ex.solutions.map(pick);
  const correct = solutions.includes(user);
  return {
    correct,
    userAnswer: user || "—",
    correctAnswer: solutions[0],
    feedback: correct ? "¡Orden perfecto!" : "El orden no es correcto todavía.",
  };
}

function evaluateBlank(ex: FillBlankExercise, value: string): ExerciseEvaluation {
  const user = normalizeAnswer(value);
  const correct = ex.accepted.some((a) => normalizeAnswer(a) === user);
  const option = ex.options?.find((o) => normalizeAnswer(o.value) === user);
  return {
    correct,
    userAnswer: value.trim() || "—",
    correctAnswer: ex.accepted[0],
    feedback:
      option?.feedback ??
      (correct ? "" : `No es «${value.trim()}». La respuesta esperada es «${ex.accepted[0]}».`),
  };
}

function evaluateChoice(ex: MultipleChoiceExercise, optionId: string): ExerciseEvaluation {
  const chosen = ex.options.find((o) => o.id === optionId);
  const right = ex.options.find((o) => o.correct)!;
  return {
    correct: !!chosen?.correct,
    userAnswer: chosen?.text ?? "—",
    correctAnswer: right.text,
    feedback: chosen?.feedback ?? "",
  };
}

function evaluateTones(ex: TonePracticeExercise, tones: number[]): ExerciseEvaluation {
  const correct = ex.syllables.every((s, i) => s.tone === tones[i]);
  const label = (t: number) => (t === 5 ? "neutro" : `${t}`);
  return {
    correct,
    userAnswer: tones.map(label).join(" · "),
    correctAnswer: ex.syllables.map((s) => `${s.marked} (${label(s.tone)})`).join(" · "),
    feedback: correct ? "¡Oído fino! Todos los tonos son correctos." : "Algún tono no coincide; escucha otra vez.",
  };
}

/**
 * Evaluación local y determinista. Es el punto de extensión para la Fase 2:
 * un `FeedbackProvider` basado en LLM podrá enriquecer `feedback` (por ejemplo,
 * explicar el error concreto del alumno) sin cambiar la firma.
 */
export function evaluateExercise(exercise: Exercise, answer: ExerciseAnswer): ExerciseEvaluation {
  switch (exercise.type) {
    case "sentence-builder":
      if (answer.type !== "sentence-builder") break;
      return evaluateSentence(exercise, answer.order);
    case "fill-blank":
      if (answer.type !== "fill-blank") break;
      return evaluateBlank(exercise, answer.value);
    case "multiple-choice":
      if (answer.type !== "multiple-choice") break;
      return evaluateChoice(exercise, answer.optionId);
    case "tone-practice":
      if (answer.type !== "tone-practice") break;
      return evaluateTones(exercise, answer.tones);
  }
  throw new Error(`Respuesta de tipo ${answer.type} no válida para el ejercicio ${exercise.id}`);
}

/** Contrato para la Fase 2 (tutor IA). */
export interface FeedbackProvider {
  enrich(exercise: Exercise, evaluation: ExerciseEvaluation): Promise<ExerciseEvaluation>;
}

export const localFeedbackProvider: FeedbackProvider = {
  enrich: async (_exercise, evaluation) => evaluation,
};
