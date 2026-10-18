import { zh } from "@/lib/richText";
import type { HSKLevel, Unit } from "@/types/learning";

/** HSK 1 · Unidad 1 — lección introductoria (estructura base). */
const hsk1Unit1: Unit = {
  id: "zh-hsk1-u1",
  language: "zh",
  level: "HSK1",
  order: 1,
  title: "Primeros pasos",
  nativeTitle: zh("你好:nǐ-hǎo ！"),
  description: "Saluda, preséntate y pregunta el nombre.",
  status: "available",
  lessons: [
    {
      id: "zh-hsk1-u1-l1",
      unitId: "zh-hsk1-u1",
      order: 1,
      title: "¿Cómo te llamas?",
      nativeTitle: zh("你:nǐ 叫:jiào 什么:shén-me 名字:míng-zi ？"),
      summary: "Saludos básicos, 是 y la pregunta 叫什么名字.",
      objectives: ["Saludar con 你好 y 您好", "Decir tu nombre con 我叫……", "Preguntar con 什么"],
      estimatedMinutes: 15,
      theory: [
        {
          kind: "grammar",
          title: "Presentarse: 我叫……",
          pattern: "我 + 叫 + nombre",
          explanation: "叫 (jiào) significa «llamarse». Para preguntar, coloca 什么名字 donde iría la respuesta: el orden de la pregunta es igual al de la afirmación.",
          examples: [
            { text: zh("我:wǒ 叫:jiào 安娜:Ān-nà 。"), translation: "Me llamo Ana." },
            { text: zh("你:nǐ 叫:jiào 什么:shén-me 名字:míng-zi ？"), translation: "¿Cómo te llamas?" },
          ],
        },
        {
          kind: "note",
          variant: "tip",
          title: "Sandhi del 3.er tono",
          body: "你 (nǐ) y 好 (hǎo) son ambos de 3.er tono. Cuando van seguidos, el primero se pronuncia como 2.º: ní hǎo.",
        },
      ],
      vocabulary: [
        { id: "zh-nihao", term: "你好", pinyin: "nǐ hǎo", tones: [3, 3], meaning: "hola", partOfSpeech: "expresión", example: { text: zh("你好:nǐ-hǎo ！"), translation: "¡Hola!" } },
        { id: "zh-wo", term: "我", pinyin: "wǒ", tones: [3], meaning: "yo", partOfSpeech: "pronombre", example: { text: zh("我:wǒ 是:shì 学生:xué-sheng 。"), translation: "Soy estudiante." } },
        { id: "zh-jiao", term: "叫", pinyin: "jiào", tones: [4], meaning: "llamarse", partOfSpeech: "verbo", example: { text: zh("他:tā 叫:jiào 大卫:Dà-wèi 。"), translation: "Él se llama David." } },
        { id: "zh-shenme", term: "什么", pinyin: "shénme", tones: [2, 5], meaning: "qué", partOfSpeech: "pronombre", example: { text: zh("这:zhè 是:shì 什么:shén-me ？"), translation: "¿Qué es esto?" } },
        { id: "zh-mingzi", term: "名字", pinyin: "míngzi", tones: [2, 5], meaning: "nombre", partOfSpeech: "sustantivo", example: { text: zh("我的:wǒ-de 名字:míng-zi"), translation: "Mi nombre" } },
        { id: "zh-xiexie", term: "谢谢", pinyin: "xièxie", tones: [4, 5], meaning: "gracias", partOfSpeech: "expresión", example: { text: zh("谢谢:xiè-xie 你:nǐ ！"), translation: "¡Gracias!" } },
      ],
      dialogues: [
        {
          id: "zh-hsk1-u1-l1-d1",
          title: "En la primera clase",
          context: "Dos estudiantes se conocen en la puerta del aula.",
          speakers: [
            { name: "大卫", role: "Dàwèi" },
            { name: "安娜", role: "Ānnà" },
          ],
          lines: [
            { speaker: "大卫", text: zh("你好:nǐ-hǎo ！ 我:wǒ 叫:jiào 大卫:Dà-wèi 。"), translation: "¡Hola! Me llamo David." },
            { speaker: "安娜", text: zh("你好:nǐ-hǎo ！ 我:wǒ 叫:jiào 安娜:Ān-nà 。"), translation: "¡Hola! Me llamo Ana." },
            { speaker: "大卫", text: zh("你:nǐ 是:shì 老师:lǎo-shī 吗:ma ？"), translation: "¿Eres profesora?" },
            { speaker: "安娜", text: zh("不:bú 是:shì ， 我:wǒ 是:shì 学生:xué-sheng 。"), translation: "No, soy estudiante." },
          ],
        },
      ],
      characters: [
        {
          char: "好",
          pinyin: "hǎo",
          meaning: "bueno, bien",
          strokes: 6,
          radical: { char: "女", name: "nǚ", meaning: "mujer" },
          components: [{ char: "子", meaning: "niño" }],
          mnemonic: "Una mujer (女) con su hijo (子): algo bueno.",
          usedIn: ["你好"],
        },
      ],
      exercises: [
        {
          id: "zh-hsk1-u1-l1-e1",
          type: "sentence-builder",
          skill: "Preguntas con 什么",
          instruction: "Ordena los bloques.",
          prompt: "¿Cómo te llamas?",
          blocks: zh("你:nǐ 叫:jiào 什么:shén-me 名字:míng-zi"),
          solutions: [[0, 1, 2, 3]],
          explanation: "La palabra interrogativa (什么名字) ocupa el lugar de la respuesta: 我叫安娜 → 你叫什么名字？",
        },
        {
          id: "zh-hsk1-u1-l1-e2",
          type: "tone-practice",
          skill: "Tonos",
          instruction: "Marca el tono original de cada sílaba.",
          word: "你好",
          meaning: "hola",
          syllables: [
            { base: "ni", marked: "nǐ", tone: 3 },
            { base: "hao", marked: "hǎo", tone: 3 },
          ],
          explanation: "Ambas son de 3.er tono. Al hablar, el primero suena como 2.º (sandhi): ní hǎo.",
        },
        {
          id: "zh-hsk1-u1-l1-e3",
          type: "multiple-choice",
          skill: "Negación con 不",
          instruction: "Elige la respuesta correcta.",
          question: "«No soy profesor.»",
          options: [
            { id: "a", text: "我不是老师。", pinyin: "Wǒ bú shì lǎoshī.", correct: true, feedback: "Correcto: 不 delante del verbo 是." },
            { id: "b", text: "我是不老师。", pinyin: "Wǒ shì bù lǎoshī.", correct: false, feedback: "不 niega el verbo, por eso va antes de 是." },
            { id: "c", text: "我没是老师。", pinyin: "Wǒ méi shì lǎoshī.", correct: false, feedback: "是 nunca se niega con 没." },
          ],
          explanation: "是 se niega siempre con 不: 不是 (bú shì, 不 cambia a 2.º tono delante de 4.º).",
        },
      ],
    },
  ],
};

const COMING_SOON: Record<Exclude<HSKLevel, "HSK1" | "HSK2">, Omit<Unit, "language" | "level" | "status" | "lessons" | "order">> = {
  HSK3: {
    id: "zh-hsk3-u1",
    title: "Viajes y planes",
    nativeTitle: zh("旅行:lǚ-xíng"),
    description: "Complementos de resultado, 把 y planes futuros.",
    plannedLessons: ["我把作业做完了 — Construcción con 把", "你听得懂吗？ — Complemento potencial", "我打算去北京 — Planes y deseos"],
  },
  HSK4: {
    id: "zh-hsk4-u1",
    title: "Trabajo y estudios",
    nativeTitle: zh("工作:gōng-zuò 和:hé 学习:xué-xí"),
    description: "Entrevistas, opiniones y conectores avanzados.",
    plannedLessons: ["不但……而且…… — Sumar argumentos", "被 — La voz pasiva", "Entrevista de trabajo"],
  },
  HSK5: {
    id: "zh-hsk5-u1",
    title: "Sociedad y medios",
    nativeTitle: zh("社会:shè-huì"),
    description: "Prensa, redes sociales y debate.",
    plannedLessons: ["Leer una noticia", "Expresar desacuerdo con matices", "Chengyu de uso frecuente"],
  },
  HSK6: {
    id: "zh-hsk6-u1",
    title: "Cultura y pensamiento",
    nativeTitle: zh("文化:wén-huà"),
    description: "Textos literarios, registro formal y chengyu.",
    plannedLessons: ["Registro formal y escrito", "Ensayo argumentativo", "Literatura contemporánea"],
  },
};

export const zhOtherUnits: Partial<Record<HSKLevel, Unit[]>> = {
  HSK1: [hsk1Unit1],
  ...Object.fromEntries(
    Object.entries(COMING_SOON).map(([level, u]) => [
      level,
      [{ ...u, language: "zh", level: level as HSKLevel, order: 1, status: "coming-soon", lessons: [] } satisfies Unit],
    ]),
  ),
};
