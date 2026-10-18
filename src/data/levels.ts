import type {
  CEFRLevel,
  HSKLevel,
  LanguageCode,
  LanguageInfo,
  LevelCode,
  LevelInfo,
} from "@/types/learning";

export const LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  zh: {
    code: "zh",
    name: "Chino Mandarín",
    nativeName: "中文",
    flag: "🇨🇳",
    speechLang: "zh-CN",
    framework: "HSK",
  },
  en: {
    code: "en",
    name: "Inglés",
    nativeName: "English",
    flag: "🇺🇸",
    speechLang: "en-US",
    framework: "MCER",
  },
};

export const HSK_LEVELS: HSKLevel[] = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"];
export const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const LEVELS: Record<LevelCode, LevelInfo> = {
  HSK1: {
    code: "HSK1",
    language: "zh",
    label: "HSK 1",
    name: "Iniciación",
    description: "Saludos, números, presentarte y frases muy básicas. ~150 palabras.",
    order: 1,
    targetVocabulary: 150,
  },
  HSK2: {
    code: "HSK2",
    language: "zh",
    label: "HSK 2",
    name: "Básico",
    description: "Rutinas diarias, horarios, acciones en progreso y causas simples. ~300 palabras.",
    order: 2,
    targetVocabulary: 300,
  },
  HSK3: {
    code: "HSK3",
    language: "zh",
    label: "HSK 3",
    name: "Pre-intermedio",
    description: "Conversaciones cotidianas, complementos verbales y comparaciones. ~600 palabras.",
    order: 3,
    targetVocabulary: 600,
  },
  HSK4: {
    code: "HSK4",
    language: "zh",
    label: "HSK 4",
    name: "Intermedio",
    description: "Debatir temas generales con fluidez y leer textos sencillos. ~1200 palabras.",
    order: 4,
    targetVocabulary: 1200,
  },
  HSK5: {
    code: "HSK5",
    language: "zh",
    label: "HSK 5",
    name: "Intermedio alto",
    description: "Leer prensa, ver series y dar discursos completos. ~2500 palabras.",
    order: 5,
    targetVocabulary: 2500,
  },
  HSK6: {
    code: "HSK6",
    language: "zh",
    label: "HSK 6",
    name: "Avanzado",
    description: "Comprender y expresarte con soltura en cualquier contexto. ~5000 palabras.",
    order: 6,
    targetVocabulary: 5000,
  },
  A1: {
    code: "A1",
    language: "en",
    label: "A1",
    name: "Acceso",
    description: "Presentarte, datos personales y necesidades inmediatas.",
    order: 1,
  },
  A2: {
    code: "A2",
    language: "en",
    label: "A2",
    name: "Plataforma",
    description: "Rutinas, compras, pasado simple y planes cercanos.",
    order: 2,
  },
  B1: {
    code: "B1",
    language: "en",
    label: "B1",
    name: "Umbral",
    description: "Contar experiencias, hábitos pasados y narrar historias con coherencia.",
    order: 3,
  },
  B2: {
    code: "B2",
    language: "en",
    label: "B2",
    name: "Avanzado",
    description: "Argumentar, matizar opiniones y entender textos complejos.",
    order: 4,
  },
  C1: {
    code: "C1",
    language: "en",
    label: "C1",
    name: "Dominio operativo eficaz",
    description: "Expresión fluida y espontánea en contextos académicos y profesionales.",
    order: 5,
  },
  C2: {
    code: "C2",
    language: "en",
    label: "C2",
    name: "Maestría",
    description: "Comprender prácticamente todo y expresarte con precisión total.",
    order: 6,
  },
};

export const LEVELS_BY_LANGUAGE: Record<LanguageCode, LevelCode[]> = {
  zh: HSK_LEVELS,
  en: CEFR_LEVELS,
};

export function levelsFor(language: LanguageCode): LevelInfo[] {
  return LEVELS_BY_LANGUAGE[language].map((code) => LEVELS[code]);
}
