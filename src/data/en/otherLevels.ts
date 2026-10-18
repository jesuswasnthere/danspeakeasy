import { en } from "@/lib/richText";
import type { CEFRLevel, Unit } from "@/types/learning";

/** A2 · Unidad 1 — lección base para probar el cambio de nivel. */
const a2Unit1: Unit = {
  id: "en-a2-u1",
  language: "en",
  level: "A2",
  order: 1,
  title: "Mi fin de semana",
  nativeTitle: "My weekend",
  description: "Cuenta qué hiciste el fin de semana con el past simple.",
  status: "available",
  lessons: [
    {
      id: "en-a2-u1-l1",
      unitId: "en-a2-u1",
      order: 1,
      title: "¿Qué hiciste el sábado?",
      nativeTitle: "What did you do on Saturday?",
      summary: "Past simple regular e irregular, y preguntas con did.",
      objectives: ["Formar el past simple regular (-ed)", "Memorizar irregulares frecuentes", "Preguntar con Did…?"],
      estimatedMinutes: 15,
      theory: [
        {
          kind: "grammar",
          title: "Past simple",
          pattern: "Subject + verb-ed / irregular · didn't + base · Did + subject + base?",
          explanation:
            "Para acciones terminadas en el pasado. Los verbos regulares añaden -ed; los irregulares tienen forma propia (go → went). En negativas y preguntas, did lleva el pasado y el verbo vuelve a su forma base.",
          examples: [
            { text: "I watched a movie on Saturday.", translation: "Vi una película el sábado." },
            { text: "Did you go out? — No, I didn't.", translation: "¿Saliste? — No." },
          ],
        },
        {
          kind: "table",
          title: "Irregulares frecuentes",
          headers: ["Base", "Past simple", "Español"],
          rows: [
            ["go", "went", "ir"],
            ["have", "had", "tener"],
            ["see", "saw", "ver"],
            ["eat", "ate", "comer"],
            ["buy", "bought", "comprar"],
          ],
        },
      ],
      vocabulary: [
        { id: "en-weekend", term: "weekend", ipa: "/ˈwiːkend/", meaning: "fin de semana", partOfSpeech: "sustantivo", example: { text: "How was your weekend?", translation: "¿Qué tal tu fin de semana?" } },
        { id: "en-go-out", term: "go out", ipa: "/ɡoʊ aʊt/", meaning: "salir", partOfSpeech: "phrasal verb", example: { text: "We went out for dinner.", translation: "Salimos a cenar." } },
        { id: "en-relax", term: "relax", ipa: "/rɪˈlæks/", meaning: "relajarse", partOfSpeech: "verbo", example: { text: "I relaxed at home.", translation: "Me relajé en casa." } },
        { id: "en-visit", term: "visit", ipa: "/ˈvɪzɪt/", meaning: "visitar", partOfSpeech: "verbo", example: { text: "I visited my cousins.", translation: "Visité a mis primos." } },
      ],
      dialogues: [
        {
          id: "en-a2-u1-l1-d1",
          title: "Monday morning",
          context: "Dos compañeros comentan el fin de semana.",
          speakers: [
            { name: "Ana", role: "compañera" },
            { name: "Tom", role: "compañero" },
          ],
          lines: [
            { speaker: "Tom", text: "Hi Ana! How was your weekend?", translation: "¡Hola Ana! ¿Qué tal el fin de semana?" },
            { speaker: "Ana", text: "Great! I visited my cousins and we went to the beach.", translation: "¡Genial! Visité a mis primos y fuimos a la playa." },
            { speaker: "Tom", text: "Nice! Did you swim?", translation: "¡Qué bien! ¿Nadaste?" },
            { speaker: "Ana", text: "No, I didn't. The water was too cold!", translation: "No. ¡El agua estaba demasiado fría!" },
          ],
        },
      ],
      exercises: [
        {
          id: "en-a2-u1-l1-e1",
          type: "fill-blank",
          skill: "Past simple irregular",
          instruction: "Escribe el past simple de go.",
          before: "Last Sunday we",
          after: "to the beach.",
          translation: "El domingo pasado fuimos a la playa.",
          accepted: ["went"],
          hint: "Es irregular.",
          explanation: "go → went. Es uno de los irregulares más frecuentes.",
        },
        {
          id: "en-a2-u1-l1-e2",
          type: "sentence-builder",
          skill: "Preguntas con did",
          instruction: "Ordena las palabras.",
          prompt: "¿Viste la película?",
          blocks: en("Did", "you", "see", "the", "movie", "saw"),
          solutions: [[0, 1, 2, 3, 4]],
          explanation: "Did + sujeto + verbo base. saw sobra porque did ya marca el pasado.",
        },
        {
          id: "en-a2-u1-l1-e3",
          type: "multiple-choice",
          skill: "Past simple negativo",
          instruction: "Elige la correcta.",
          question: "«No compré nada.»",
          options: [
            { id: "a", text: "I didn't buy anything.", correct: true, feedback: "Correcto: didn't + verbo base." },
            { id: "b", text: "I didn't bought anything.", correct: false, feedback: "Con didn't el verbo va en base: buy." },
            { id: "c", text: "I not bought anything.", correct: false, feedback: "Falta el auxiliar did." },
          ],
          explanation: "Negativa en pasado: didn't + verbo base.",
        },
      ],
    },
  ],
};

const COMING_SOON: Record<Exclude<CEFRLevel, "A2" | "B1">, Omit<Unit, "language" | "level" | "status" | "lessons" | "order">> = {
  A1: {
    id: "en-a1-u1",
    title: "Hola, mundo",
    nativeTitle: "Hello!",
    description: "Presentaciones, verbo to be y números.",
    plannedLessons: ["Verb to be", "Numbers & the alphabet", "Introducing yourself"],
  },
  B2: {
    id: "en-b2-u1",
    title: "Opiniones y debate",
    nativeTitle: "Let's discuss",
    description: "Argumentar, conectores de contraste y segundo/tercer condicional.",
    plannedLessons: ["Linking contrast: although, despite", "Second & third conditional", "Giving balanced opinions"],
  },
  C1: {
    id: "en-c1-u1",
    title: "Inglés profesional",
    nativeTitle: "Professional English",
    description: "Registro formal, inversión y hedging.",
    plannedLessons: ["Hedging language", "Inversion for emphasis", "Writing a formal proposal"],
  },
  C2: {
    id: "en-c2-u1",
    title: "Matices y estilo",
    nativeTitle: "Nuance & style",
    description: "Expresiones idiomáticas, ironía y estilo literario.",
    plannedLessons: ["Idioms in context", "Irony & understatement", "Literary analysis"],
  },
};

export const enOtherUnits: Partial<Record<CEFRLevel, Unit[]>> = {
  A2: [a2Unit1],
  ...Object.fromEntries(
    Object.entries(COMING_SOON).map(([level, u]) => [
      level,
      [{ ...u, language: "en", level: level as CEFRLevel, order: 1, status: "coming-soon", lessons: [] } satisfies Unit],
    ]),
  ),
};
