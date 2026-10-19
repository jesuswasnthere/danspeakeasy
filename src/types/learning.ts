/**
 * Modelos de dominio de la plataforma.
 *
 * Estas interfaces son el contrato entre la capa de contenido (hoy: mocks en
 * `src/data`, mañana: base de datos / CMS) y la UI. Todo lo que se persiste del
 * alumno vive en `StudentState` (ver `src/store/useLearningStore.ts`).
 */

// ─── Idiomas y niveles ────────────────────────────────────────────────────────

export type LanguageCode = "zh" | "en";

export type HSKLevel = "HSK1" | "HSK2" | "HSK3" | "HSK4" | "HSK5" | "HSK6";
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type LevelCode = HSKLevel | CEFRLevel;

/** Mapea cada idioma a su familia de niveles, para tipar `levelByLanguage`. */
export interface LevelsByLanguage {
  zh: HSKLevel;
  en: CEFRLevel;
}

export interface LanguageInfo {
  code: LanguageCode;
  name: string; // nombre en español
  nativeName: string;
  flag: string;
  /** Código BCP-47 para Web Speech API y atributos `lang`. */
  speechLang: string;
  framework: "HSK" | "MCER";
}

export interface LevelInfo {
  code: LevelCode;
  language: LanguageCode;
  label: string; // "HSK 2", "B1"
  name: string; // "Básico", "Intermedio"
  description: string;
  order: number;
  /** Vocabulario acumulado orientativo del nivel. */
  targetVocabulary?: number;
}

// ─── Texto enriquecido (soporte CJK) ──────────────────────────────────────────

/**
 * Un token de texto. En chino, cada palabra lleva su pinyin para poder
 * renderizarse con `<ruby>`. La puntuación no lleva pinyin.
 */
export interface TextToken {
  text: string;
  pinyin?: string;
}

/** Texto plano (inglés / español) o lista de tokens (chino con pinyin). */
export type RichText = string | TextToken[];

// ─── Vocabulario y caracteres ─────────────────────────────────────────────────

export type PartOfSpeech =
  | "sustantivo"
  | "verbo"
  | "adjetivo"
  | "adverbio"
  | "pronombre"
  | "preposición"
  | "conjunción"
  | "partícula"
  | "clasificador"
  | "numeral"
  | "expresión"
  | "phrasal verb";

export interface VocabularyItem {
  id: string;
  /** Hanzi en chino, palabra/expresión en inglés. */
  term: string;
  /** Pinyin con marcas tonales (solo chino). */
  pinyin?: string;
  /** Tonos de cada sílaba (1-4, 5 = neutro). Solo chino. */
  tones?: number[];
  /** Transcripción IPA (solo inglés). */
  ipa?: string;
  meaning: string;
  partOfSpeech: PartOfSpeech;
  example?: {
    text: RichText;
    translation: string;
  };
  note?: string;
}

export interface CharacterBreakdown {
  char: string;
  pinyin: string;
  meaning: string;
  strokes: number;
  radical: {
    char: string;
    name: string;
    meaning: string;
  };
  /** Otros componentes además del radical. */
  components: { char: string; meaning: string }[];
  mnemonic: string;
  /** Palabras de la lección donde aparece. */
  usedIn: string[];
}

// ─── Teoría ───────────────────────────────────────────────────────────────────

export interface GrammarExample {
  text: RichText;
  translation: string;
}

export type TheoryBlock =
  | {
      kind: "paragraph";
      title?: string;
      body: string;
    }
  | {
      kind: "grammar";
      title: string;
      /** Patrón estructural, p. ej. "Sujeto + 正在 + Verbo + (Objeto) + 呢". */
      pattern: string;
      explanation: string;
      examples: GrammarExample[];
    }
  | {
      kind: "table";
      title: string;
      headers: string[];
      rows: string[][];
      caption?: string;
    }
  | {
      kind: "note";
      variant: "culture" | "grammar" | "tip" | "warning";
      title: string;
      body: string;
    };

// ─── Diálogos ─────────────────────────────────────────────────────────────────

export interface DialogueLine {
  speaker: string;
  text: RichText;
  translation: string;
}

export interface Dialogue {
  id: string;
  title: string;
  context: string;
  speakers: { name: string; role: string }[];
  lines: DialogueLine[];
}

// ─── Ejercicios ───────────────────────────────────────────────────────────────

interface ExerciseBase {
  id: string;
  /** Enunciado en español. */
  instruction: string;
  /** Explicación pedagógica mostrada tras responder (siempre). */
  explanation: string;
  /** Puntos de gramática relacionados, para agrupar errores. */
  skill: string;
}

/** Ordenar bloques para construir una oración. */
export interface SentenceBuilderExercise extends ExerciseBase {
  type: "sentence-builder";
  /** Lo que el alumno debe expresar (en español). */
  prompt: string;
  /** Bloques disponibles (incluye distractores si los hay). */
  blocks: TextToken[];
  /** Cada solución es una lista de índices de `blocks` en orden. */
  solutions: number[][];
}

export interface BlankOption {
  value: string;
  pinyin?: string;
  /** Por qué esta opción es correcta o incorrecta. */
  feedback: string;
}

/** Completar el hueco. `before` y `after` rodean el hueco. */
export interface FillBlankExercise extends ExerciseBase {
  type: "fill-blank";
  before: RichText;
  after: RichText;
  translation: string;
  /** Si hay opciones, se muestran como botones; si no, campo de texto libre. */
  options?: BlankOption[];
  /** Respuestas aceptadas (se normalizan mayúsculas/espacios). */
  accepted: string[];
  hint?: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  pinyin?: string;
  correct: boolean;
  feedback: string;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multiple-choice";
  question: string;
  /** Texto opcional que se puede escuchar con TTS. */
  audioText?: string;
  options: ChoiceOption[];
}

/** Identificar el tono de cada sílaba (exclusivo de chino). */
export interface TonePracticeExercise extends ExerciseBase {
  type: "tone-practice";
  word: string;
  meaning: string;
  syllables: {
    /** Sílaba sin marca tonal, p. ej. "qi". */
    base: string;
    /** Sílaba con marca tonal, p. ej. "qǐ". */
    marked: string;
    tone: 1 | 2 | 3 | 4 | 5;
  }[];
}

export type Exercise =
  | SentenceBuilderExercise
  | FillBlankExercise
  | MultipleChoiceExercise
  | TonePracticeExercise;

export type ExerciseType = Exercise["type"];

/** Resultado normalizado de evaluar un ejercicio (ver `lib/exercises`). */
export interface ExerciseEvaluation {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  feedback: string;
}

// ─── Libro de clase ───────────────────────────────────────────────────────────

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  /** Título en el idioma objetivo. */
  nativeTitle?: RichText;
  summary: string;
  objectives: string[];
  estimatedMinutes: number;
  theory: TheoryBlock[];
  vocabulary: VocabularyItem[];
  dialogues: Dialogue[];
  /** Desglose de caracteres (solo chino). */
  characters?: CharacterBreakdown[];
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  language: LanguageCode;
  level: LevelCode;
  order: number;
  title: string;
  nativeTitle?: RichText;
  description: string;
  status: "available" | "coming-soon";
  lessons: Lesson[];
  /** Lecciones planificadas (para unidades "coming-soon"). */
  plannedLessons?: string[];
}

export interface Course {
  language: LanguageCode;
  level: LevelCode;
  title: string;
  units: Unit[];
}

// ─── Aula virtual y retos semanales ───────────────────────────────────────────

export type MissionKind = "reading" | "listening" | "grammar" | "participation";

interface MissionBase {
  id: string;
  kind: MissionKind;
  title: string;
  description: string;
  xp: number;
}

/** Lectura corta + pregunta de comprensión. */
export interface ReadingMission extends MissionBase {
  kind: "reading";
  passage: { title: string; text: RichText; translation: string };
  question: MultipleChoiceExercise;
}

/** Audio (TTS) + pregunta. El texto se oculta hasta responder. */
export interface ListeningMission extends MissionBase {
  kind: "listening";
  audioText: string;
  transcript: RichText;
  translation: string;
  minPlays: number;
  question: MultipleChoiceExercise;
}

/** Acertar N ejercicios del libro durante la semana. */
export interface GrammarMission extends MissionBase {
  kind: "grammar";
  targetCorrect: number;
  focus: string;
}

/** Publicar en el aula respondiendo a una consigna. */
export interface ParticipationMission extends MissionBase {
  kind: "participation";
  prompt: string;
  promptTranslation?: string;
  minLength: number;
}

export type WeeklyMission =
  | ReadingMission
  | ListeningMission
  | GrammarMission
  | ParticipationMission;

export interface WeeklyChallenge {
  /** Clave ISO de semana: "2026-W42". */
  weekKey: string;
  level: LevelCode;
  theme: string;
  missions: WeeklyMission[];
}

export interface Classmate {
  id: string;
  name: string;
  avatar: string; // emoji o iniciales
  country: string;
  level: LevelCode;
  streak: number;
}

export interface ClassroomReply {
  id: string;
  authorId: string;
  content: string;
  createdAt: string; // ISO
  /** Corrección sugerida a otro compañero (feedback entre pares). */
  correction?: { original: string; corrected: string; note: string };
}

export interface ClassroomPost {
  id: string;
  level: LevelCode;
  authorId: string;
  content: string;
  createdAt: string; // ISO
  missionId?: string;
  tag: "misión" | "pregunta" | "recurso" | "logro";
  likes: number;
  replies: ClassroomReply[];
}

// ─── Práctica de habilidades (escritura, lectura, pronunciación) ─────────────

export interface PracticeCharacter {
  char: string;
  pinyin?: string;
  meaning?: string;
  /** Desglose completo si la lección lo incluye. */
  breakdown?: CharacterBreakdown;
  /** Palabras del nivel donde aparece. */
  words: string[];
  lessonId: string;
}

export interface ReadingSentence {
  text: RichText;
  translation?: string;
  speaker?: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  /** De dónde sale el texto (lección, misión…). */
  source: string;
  kind: "diálogo" | "lectura";
  sentences: ReadingSentence[];
  /** Traducción completa cuando no hay traducción por frase. */
  translation?: string;
}

export interface PronunciationItem {
  id: string;
  kind: "palabra" | "frase";
  text: RichText;
  /** Texto plano para TTS y para comparar con el reconocimiento de voz. */
  plain: string;
  translation: string;
  source: string;
  /** Solo palabras en chino: pinyin y tonos para mostrarlas grandes y coloreadas. */
  pinyin?: string;
  tones?: number[];
  ipa?: string;
}

// ─── Fonética (chino, HSK 1–2) ───────────────────────────────────────────────

/** Ejemplo que se puede escuchar: el audio se genera a partir del hanzi. */
export interface SoundExample {
  hanzi: string;
  /** Pinyin con marcas tonales, tal y como se escribe. */
  pinyin: string;
  meaning: string;
}

export interface PhoneticSound {
  /** Grafía en pinyin: "zh", "ü", "ian"… */
  symbol: string;
  /** Transcripción AFI aproximada, sin corchetes. */
  ipa?: string;
  /** Cómo se articula, comparado con el español. */
  hint: string;
  example: SoundExample;
}

export type PhoneticsBlock =
  | TheoryBlock
  | {
      kind: "tones";
      title: string;
      intro?: string;
      tones: {
        tone: 1 | 2 | 3 | 4 | 5;
        name: string;
        /** Contorno en la escala de 5 niveles de Chao (p. ej. [2, 1, 4]); vacío = neutro. */
        contour: number[];
        description: string;
        example: SoundExample;
      }[];
    }
  | {
      kind: "sounds";
      title: string;
      intro?: string;
      groups: { name: string; note?: string; sounds: PhoneticSound[] }[];
    }
  | {
      kind: "tone-changes";
      title: string;
      intro?: string;
      /** `written`: pinyin del diccionario; `spoken`: cómo se pronuncia en la frase. */
      rows: { example: SoundExample; written: string; spoken: string; note?: string }[];
    }
  | {
      kind: "minimal-pairs";
      title: string;
      intro?: string;
      pairs: { contrast: string; a: SoundExample; b: SoundExample }[];
    }
  | {
      kind: "tone-grid";
      title: string;
      intro?: string;
      /** Filas = tono de la 1.ª sílaba (1–4); columnas = tono de la 2.ª (1–4 y neutro). */
      rows: SoundExample[][];
    };

/** Módulo de fonética: explicación interactiva + práctica con el motor de ejercicios. */
export interface PhoneticsModule {
  id: string;
  level: HSKLevel;
  order: number;
  title: string;
  nativeTitle?: RichText;
  summary: string;
  objectives: string[];
  estimatedMinutes: number;
  blocks: PhoneticsBlock[];
  exercises: Exercise[];
}

// ─── Estado del alumno (persistido) ──────────────────────────────────────────

export interface StudyPreferences {
  showPinyin: boolean;
  showTranslation: boolean;
  toneColors: boolean;
  /** 0.5 – 1.5 */
  speechRate: number;
}

export interface LessonProgress {
  lessonId: string;
  completedAt: string;
  /** 0-100 */
  score: number;
}

export interface ExerciseAttempt {
  exerciseId: string;
  lessonId: string;
  attempts: number;
  correct: boolean;
  firstTryCorrect: boolean;
  lastAttemptAt: string;
}

export interface MistakeEntry {
  id: string; // = exerciseId
  exerciseId: string;
  lessonId: string;
  language: LanguageCode;
  level: LevelCode;
  skill: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  count: number;
  lastAt: string;
  resolved: boolean;
}

/** Sistema Leitner simple: caja 1 (nuevo) a 5 (dominado). */
export interface VocabCard {
  vocabId: string;
  language: LanguageCode;
  level: LevelCode;
  box: 1 | 2 | 3 | 4 | 5;
  addedAt: string;
  lastReviewedAt?: string;
  nextReviewAt: string;
  reviews: number;
  lapses: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD local
  exercises: number;
  correct: number;
  lessonsCompleted: number;
  wordsReviewed: number;
  xp: number;
}

export interface WeeklyRecord {
  weekKey: string;
  audioPlays: number;
  completedMissions: string[];
  /** Ejercicios correctos durante la semana, por nivel. */
  correctByLevel: Partial<Record<LevelCode, number>>;
}
