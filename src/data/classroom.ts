import { zh } from "@/lib/richText";
import type {
  Classmate,
  ClassroomPost,
  LanguageCode,
  LevelCode,
  WeeklyMission,
} from "@/types/learning";

// ─── Retos semanales ──────────────────────────────────────────────────────────

export interface MissionSet {
  theme: string;
  missions: WeeklyMission[];
}

const hsk2Sets: MissionSet[] = [
  {
    theme: "Mi rutina en chino",
    missions: [
      {
        id: "hsk2-wA-reading",
        kind: "reading",
        title: "Lectura: 小王的一天",
        description: "Lee el texto sobre la rutina de Xiǎo Wáng y responde a la pregunta.",
        xp: 30,
        passage: {
          title: "小王的一天",
          text: zh(
            "小王:Xiǎo-Wáng 每天:měi-tiān 早上:zǎo-shang 七:qī 点:diǎn 起床:qǐ-chuáng 。 他:tā 八:bā 点:diǎn 坐:zuò 公共汽车:gōng-gòng-qì-chē 去:qù 公司:gōng-sī ， 从:cóng 九:jiǔ 点:diǎn 到:dào 五:wǔ 点:diǎn 工作:gōng-zuò 。 晚上:wǎn-shang 他:tā 喜欢:xǐ-huan 跑步:pǎo-bù ， 十一:shí-yī 点:diǎn 睡觉:shuì-jiào 。",
          ),
          translation:
            "Xiǎo Wáng se levanta todos los días a las siete. A las ocho toma el autobús a la empresa y trabaja de nueve a cinco. Por la noche le gusta correr y se duerme a las once.",
        },
        question: {
          id: "hsk2-wA-reading-q",
          type: "multiple-choice",
          skill: "Comprensión lectora",
          instruction: "Responde según el texto.",
          question: "¿A qué hora empieza a trabajar Xiǎo Wáng?",
          options: [
            { id: "a", text: "九点", pinyin: "jiǔ diǎn", correct: true, feedback: "Correcto: 从九点到五点工作." },
            { id: "b", text: "八点", pinyin: "bā diǎn", correct: false, feedback: "A las ocho toma el autobús, todavía no trabaja." },
            { id: "c", text: "七点", pinyin: "qī diǎn", correct: false, feedback: "A las siete se levanta." },
          ],
          explanation: "La clave está en 从九点到五点工作: el intervalo de trabajo empieza a las nueve.",
        },
      },
      {
        id: "hsk2-wA-listening",
        kind: "listening",
        title: "Escucha: una llamada",
        description: "Escucha el audio al menos 2 veces sin leer y responde.",
        xp: 30,
        audioText: "喂，我正在等公共汽车呢。你在做什么？",
        transcript: zh("喂:wéi ， 我:wǒ 正在:zhèng-zài 等:děng 公共汽车:gōng-gòng-qì-chē 呢:ne 。 你:nǐ 在:zài 做:zuò 什么:shén-me ？"),
        translation: "¿Aló? Estoy esperando el autobús. ¿Qué estás haciendo tú?",
        minPlays: 2,
        question: {
          id: "hsk2-wA-listening-q",
          type: "multiple-choice",
          skill: "Comprensión auditiva",
          instruction: "Responde según el audio.",
          question: "¿Qué está haciendo la persona que habla?",
          options: [
            { id: "a", text: "Esperando el autobús", correct: true, feedback: "¡Bien! 正在等公共汽车呢." },
            { id: "b", text: "Lavando la ropa", correct: false, feedback: "Eso sería 洗衣服." },
            { id: "c", text: "Cantando", correct: false, feedback: "Eso sería 唱歌." },
          ],
          explanation: "等 = esperar · 公共汽车 = autobús.",
        },
      },
      {
        id: "hsk2-wA-grammar",
        kind: "grammar",
        title: "Gramática: 8 aciertos",
        description: "Acierta 8 ejercicios del Libro de Clase esta semana.",
        xp: 40,
        targetCorrect: 8,
        focus: "Expresiones de tiempo y (正)在……呢",
      },
      {
        id: "hsk2-wA-participation",
        kind: "participation",
        title: "Participa en el aula",
        description: "Publica en el tablón respondiendo a la consigna.",
        xp: 50,
        prompt: "用「因为……所以……」写两句话，说说你这个星期的生活。",
        promptTranslation: "Escribe dos frases con 因为……所以…… sobre tu vida esta semana.",
        minLength: 10,
      },
    ],
  },
  {
    theme: "El tiempo y la salud",
    missions: [
      {
        id: "hsk2-wB-reading",
        kind: "reading",
        title: "Lectura: 小李生病了",
        description: "Lee el texto y responde a la pregunta de comprensión.",
        xp: 30,
        passage: {
          title: "小李生病了",
          text: zh(
            "今天:jīn-tiān 下雨:xià-yǔ 了:le ， 天气:tiān-qì 很:hěn 冷:lěng 。 因为:yīn-wèi 小李:Xiǎo-Lǐ 生病:shēng-bìng 了:le ， 所以:suǒ-yǐ 他:tā 没:méi 去:qù 上课:shàng-kè 。 他:tā 吃:chī 了:le 药:yào ， 现在:xiàn-zài 在:zài 家:jiā 休息:xiū-xi 。",
          ),
          translation:
            "Hoy ha llovido y hace mucho frío. Como Xiǎo Lǐ se ha puesto enfermo, no ha ido a clase. Se tomó la medicina y ahora está descansando en casa.",
        },
        question: {
          id: "hsk2-wB-reading-q",
          type: "multiple-choice",
          skill: "Comprensión lectora",
          instruction: "Responde según el texto.",
          question: "¿Por qué Xiǎo Lǐ no fue a clase?",
          options: [
            { id: "a", text: "Porque se puso enfermo", correct: true, feedback: "Correcto: 因为小李生病了." },
            { id: "b", text: "Porque llovía", correct: false, feedback: "Llovía, pero la causa (因为) es otra." },
            { id: "c", text: "Porque tenía que trabajar", correct: false, feedback: "El texto no menciona trabajo." },
          ],
          explanation: "Busca lo que sigue a 因为: es la causa.",
        },
      },
      {
        id: "hsk2-wB-listening",
        kind: "listening",
        title: "Escucha: un consejo",
        description: "Escucha el audio al menos 2 veces y responde.",
        xp: 30,
        audioText: "外面下雨了，天气很冷，你多穿衣服。",
        transcript: zh("外面:wài-miàn 下雨:xià-yǔ 了:le ， 天气:tiān-qì 很:hěn 冷:lěng ， 你:nǐ 多:duō 穿:chuān 衣服:yī-fu 。"),
        translation: "Afuera está lloviendo y hace frío, abrígate.",
        minPlays: 2,
        question: {
          id: "hsk2-wB-listening-q",
          type: "multiple-choice",
          skill: "Comprensión auditiva",
          instruction: "Responde según el audio.",
          question: "¿Qué te recomienda?",
          options: [
            { id: "a", text: "Abrigarte", correct: true, feedback: "¡Eso es! 多穿衣服." },
            { id: "b", text: "Beber agua caliente", correct: false, feedback: "Buen consejo, pero no aparece en el audio." },
            { id: "c", text: "Quedarte en casa", correct: false, feedback: "No lo dice." },
          ],
          explanation: "多 + verbo = hacer más de algo: 多穿衣服 = ponte más ropa.",
        },
      },
      {
        id: "hsk2-wB-grammar",
        kind: "grammar",
        title: "Gramática: 10 aciertos",
        description: "Acierta 10 ejercicios del Libro de Clase esta semana.",
        xp: 40,
        targetCorrect: 10,
        focus: "因为……所以…… y 了 de cambio de estado",
      },
      {
        id: "hsk2-wB-participation",
        kind: "participation",
        title: "Participa en el aula",
        description: "Publica tu horario en el tablón.",
        xp: 50,
        prompt: "你每天几点起床？几点睡觉？写写你的作息时间。",
        promptTranslation: "¿A qué hora te levantas y te acuestas? Describe tu horario.",
        minLength: 10,
      },
    ],
  },
];

const b1Sets: MissionSet[] = [
  {
    theme: "Travel experiences",
    missions: [
      {
        id: "b1-wA-reading",
        kind: "reading",
        title: "Reading: A year abroad",
        description: "Lee el texto y responde a la pregunta.",
        xp: 30,
        passage: {
          title: "A year abroad",
          text:
            "I have lived in Dublin for almost a year now. Before I came here, I had never travelled alone. At first, everything was difficult: I got lost twice on my first day! But I have made great friends, and I have visited more than ten Irish towns so far.",
          translation:
            "Llevo casi un año viviendo en Dublín. Antes de venir, nunca había viajado sola. Al principio todo era difícil: ¡me perdí dos veces el primer día! Pero he hecho grandes amigos y hasta ahora he visitado más de diez pueblos irlandeses.",
        },
        question: {
          id: "b1-wA-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "What was new for the writer before moving to Dublin?",
          options: [
            { id: "a", text: "Travelling alone", correct: true, feedback: "Correct: «I had never travelled alone»." },
            { id: "b", text: "Getting lost", correct: false, feedback: "She got lost in Dublin, but the text doesn't say it was new." },
            { id: "c", text: "Living with friends", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "«had never travelled» (past perfect) = algo que no había hecho antes de ese momento.",
        },
      },
      {
        id: "b1-wA-listening",
        kind: "listening",
        title: "Listening: then and now",
        description: "Escucha el audio al menos 2 veces y responde.",
        xp: 30,
        audioText: "I used to live near the sea, but now I live in the city and I really miss the beach.",
        transcript: "I used to live near the sea, but now I live in the city and I really miss the beach.",
        translation: "Antes vivía cerca del mar, pero ahora vivo en la ciudad y extraño mucho la playa.",
        minPlays: 2,
        question: {
          id: "b1-wA-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "Where does the speaker live now?",
          options: [
            { id: "a", text: "In the city", correct: true, feedback: "Yes: «now I live in the city»." },
            { id: "b", text: "Near the sea", correct: false, feedback: "That's where she used to live." },
            { id: "c", text: "On the beach", correct: false, feedback: "She misses the beach; she doesn't live there." },
          ],
          explanation: "used to = antes (ya no). now = situación actual.",
        },
      },
      {
        id: "b1-wA-grammar",
        kind: "grammar",
        title: "Grammar: 8 correct answers",
        description: "Acierta 8 ejercicios del Libro de Clase esta semana.",
        xp: 40,
        targetCorrect: 8,
        focus: "Present perfect vs past simple",
      },
      {
        id: "b1-wA-participation",
        kind: "participation",
        title: "Join the discussion",
        description: "Publica en el tablón respondiendo a la consigna.",
        xp: 50,
        prompt: "Write about something you have never done but would love to do. Use the present perfect.",
        promptTranslation: "Escribe sobre algo que nunca has hecho y te encantaría hacer.",
        minLength: 40,
      },
    ],
  },
  {
    theme: "Childhood memories",
    missions: [
      {
        id: "b1-wB-reading",
        kind: "reading",
        title: "Reading: Summers at Grandpa's",
        description: "Lee el texto y responde.",
        xp: 30,
        passage: {
          title: "Summers at Grandpa's",
          text:
            "When I was a child, I used to spend every summer at my grandpa's farm. We would wake up at six and feed the animals. I didn't use to like getting up early, but I loved the fresh bread he would bake every morning.",
          translation:
            "De niño pasaba todos los veranos en la granja de mi abuelo. Nos levantábamos a las seis y dábamos de comer a los animales. No me gustaba madrugar, pero me encantaba el pan recién hecho que él horneaba cada mañana.",
        },
        question: {
          id: "b1-wB-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "What didn't the writer like?",
          options: [
            { id: "a", text: "Getting up early", correct: true, feedback: "Correct: «I didn't use to like getting up early»." },
            { id: "b", text: "The fresh bread", correct: false, feedback: "He loved the bread." },
            { id: "c", text: "The animals", correct: false, feedback: "Not stated." },
          ],
          explanation: "didn't use to like = antes no le gustaba.",
        },
      },
      {
        id: "b1-wB-listening",
        kind: "listening",
        title: "Listening: a short story",
        description: "Escucha el audio al menos 2 veces y responde.",
        xp: 30,
        audioText: "I was waiting for the bus when I realized I had left my wallet at home.",
        transcript: "I was waiting for the bus when I realized I had left my wallet at home.",
        translation: "Estaba esperando el autobús cuando me di cuenta de que me había dejado la cartera en casa.",
        minPlays: 2,
        question: {
          id: "b1-wB-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "What happened first?",
          options: [
            { id: "a", text: "He left his wallet at home.", correct: true, feedback: "Yes: «had left» = past perfect, the earlier action." },
            { id: "b", text: "He waited for the bus.", correct: false, feedback: "That was the background, after leaving the wallet." },
            { id: "c", text: "He realized the problem.", correct: false, feedback: "That happened last." },
          ],
          explanation: "El past perfect (had left) señala la acción más antigua.",
        },
      },
      {
        id: "b1-wB-grammar",
        kind: "grammar",
        title: "Grammar: 10 correct answers",
        description: "Acierta 10 ejercicios del Libro de Clase esta semana.",
        xp: 40,
        targetCorrect: 10,
        focus: "Used to, would y tiempos narrativos",
      },
      {
        id: "b1-wB-participation",
        kind: "participation",
        title: "Join the discussion",
        description: "Comparte un recuerdo de tu infancia.",
        xp: 50,
        prompt: "Describe something you used to do as a child that you don't do anymore. Use used to and would.",
        promptTranslation: "Describe algo que solías hacer de niño y ya no haces.",
        minLength: 40,
      },
    ],
  },
];

function genericSet(language: LanguageCode, level: LevelCode): MissionSet {
  if (language === "zh") {
    return {
      theme: "Presentarte en chino",
      missions: [
        {
          id: `${level}-gen-reading`,
          kind: "reading",
          title: "Lectura: 我的朋友",
          description: "Lee el texto y responde.",
          xp: 30,
          passage: {
            title: "我的朋友",
            text: zh("我:wǒ 的:de 朋友:péng-you 叫:jiào 大卫:Dà-wèi 。 他:tā 是:shì 学生:xué-sheng ， 他:tā 喜欢:xǐ-huan 学习:xué-xí 汉语:Hàn-yǔ 。"),
            translation: "Mi amigo se llama David. Es estudiante y le gusta estudiar chino.",
          },
          question: {
            id: `${level}-gen-reading-q`,
            type: "multiple-choice",
            skill: "Comprensión lectora",
            instruction: "Responde según el texto.",
            question: "¿Qué le gusta a David?",
            options: [
              { id: "a", text: "Estudiar chino", correct: true, feedback: "Correcto: 喜欢学习汉语." },
              { id: "b", text: "Trabajar", correct: false, feedback: "Es estudiante." },
              { id: "c", text: "Cantar", correct: false, feedback: "No se menciona." },
            ],
            explanation: "喜欢 + verbo = gustar hacer algo.",
          },
        },
        {
          id: `${level}-gen-listening`,
          kind: "listening",
          title: "Escucha: un saludo",
          description: "Escucha 2 veces y responde.",
          xp: 30,
          audioText: "你好，我叫安娜，我是老师。",
          transcript: zh("你好:nǐ-hǎo ， 我:wǒ 叫:jiào 安娜:Ān-nà ， 我:wǒ 是:shì 老师:lǎo-shī 。"),
          translation: "Hola, me llamo Ana y soy profesora.",
          minPlays: 2,
          question: {
            id: `${level}-gen-listening-q`,
            type: "multiple-choice",
            skill: "Comprensión auditiva",
            instruction: "Responde según el audio.",
            question: "¿A qué se dedica Ana?",
            options: [
              { id: "a", text: "Es profesora", correct: true, feedback: "Sí: 我是老师." },
              { id: "b", text: "Es estudiante", correct: false, feedback: "Estudiante sería 学生." },
              { id: "c", text: "Es médica", correct: false, feedback: "Médica sería 医生." },
            ],
            explanation: "老师 = profesor/a.",
          },
        },
        {
          id: `${level}-gen-grammar`,
          kind: "grammar",
          title: "Gramática: 5 aciertos",
          description: "Acierta 5 ejercicios del Libro de Clase esta semana.",
          xp: 40,
          targetCorrect: 5,
          focus: "Estructuras básicas del nivel",
        },
        {
          id: `${level}-gen-participation`,
          kind: "participation",
          title: "Participa en el aula",
          description: "Preséntate a tus compañeros de nivel.",
          xp: 50,
          prompt: "用中文介绍一下你自己。",
          promptTranslation: "Preséntate en chino.",
          minLength: 6,
        },
      ],
    };
  }
  return {
    theme: "Getting to know your classmates",
    missions: [
      {
        id: `${level}-gen-reading`,
        kind: "reading",
        title: "Reading: My new job",
        description: "Lee el texto y responde.",
        xp: 30,
        passage: {
          title: "My new job",
          text: "Last month I started a new job at a hotel. I work from Monday to Friday and I meet people from all over the world. It's hard work, but I love it.",
          translation: "El mes pasado empecé un trabajo nuevo en un hotel. Trabajo de lunes a viernes y conozco gente de todo el mundo. Es duro, pero me encanta.",
        },
        question: {
          id: `${level}-gen-reading-q`,
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "Where does the writer work?",
          options: [
            { id: "a", text: "At a hotel", correct: true, feedback: "Correct." },
            { id: "b", text: "At a school", correct: false, feedback: "Not mentioned." },
            { id: "c", text: "At home", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "«a new job at a hotel».",
        },
      },
      {
        id: `${level}-gen-listening`,
        kind: "listening",
        title: "Listening: introductions",
        description: "Escucha 2 veces y responde.",
        xp: 30,
        audioText: "Hi, I'm Tom. I'm from Canada and I'm a nurse.",
        transcript: "Hi, I'm Tom. I'm from Canada and I'm a nurse.",
        translation: "Hola, soy Tom. Soy de Canadá y soy enfermero.",
        minPlays: 2,
        question: {
          id: `${level}-gen-listening-q`,
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "What is Tom's job?",
          options: [
            { id: "a", text: "Nurse", correct: true, feedback: "Yes." },
            { id: "b", text: "Teacher", correct: false, feedback: "No." },
            { id: "c", text: "Doctor", correct: false, feedback: "Close, but no." },
          ],
          explanation: "nurse = enfermero/a.",
        },
      },
      {
        id: `${level}-gen-grammar`,
        kind: "grammar",
        title: "Grammar: 5 correct answers",
        description: "Acierta 5 ejercicios del Libro de Clase esta semana.",
        xp: 40,
        targetCorrect: 5,
        focus: "Estructuras clave del nivel",
      },
      {
        id: `${level}-gen-participation`,
        kind: "participation",
        title: "Join the discussion",
        description: "Preséntate a tus compañeros.",
        xp: 50,
        prompt: "Introduce yourself: where are you from and why are you learning English?",
        promptTranslation: "Preséntate: de dónde eres y por qué aprendes inglés.",
        minLength: 25,
      },
    ],
  };
}

export const MISSION_SETS: Partial<Record<LevelCode, MissionSet[]>> = {
  HSK2: hsk2Sets,
  B1: b1Sets,
};

export function missionSetsFor(language: LanguageCode, level: LevelCode): MissionSet[] {
  return MISSION_SETS[level] ?? [genericSet(language, level)];
}

// ─── Compañeros y tablón (mock) ───────────────────────────────────────────────

const CLASSMATES: Classmate[] = [
  // HSK 2
  { id: "c-valentina", name: "Valentina R.", avatar: "🦊", country: "🇨🇴", level: "HSK2", streak: 34 },
  { id: "c-diego", name: "Diego M.", avatar: "🐼", country: "🇲🇽", level: "HSK2", streak: 12 },
  { id: "c-camila", name: "Camila S.", avatar: "🌸", country: "🇦🇷", level: "HSK2", streak: 7 },
  { id: "c-andres", name: "Andrés P.", avatar: "🐉", country: "🇪🇸", level: "HSK2", streak: 58 },
  { id: "c-lucia", name: "Lucía F.", avatar: "🍵", country: "🇵🇪", level: "HSK2", streak: 21 },
  // B1
  { id: "c-martina", name: "Martina G.", avatar: "🌊", country: "🇺🇾", level: "B1", streak: 19 },
  { id: "c-javier", name: "Javier L.", avatar: "🎸", country: "🇨🇱", level: "B1", streak: 45 },
  { id: "c-sofia", name: "Sofía T.", avatar: "📚", country: "🇪🇨", level: "B1", streak: 9 },
  { id: "c-mateo", name: "Mateo V.", avatar: "⚽", country: "🇻🇪", level: "B1", streak: 26 },
];

interface MockPost extends Omit<ClassroomPost, "createdAt" | "replies"> {
  hoursAgo: number;
  replies: (Omit<ClassroomPost["replies"][number], "createdAt"> & { hoursAgo: number })[];
}

const MOCK_POSTS: MockPost[] = [
  // ── HSK 2
  {
    id: "p-hsk2-1",
    level: "HSK2",
    authorId: "c-valentina",
    tag: "misión",
    missionId: "hsk2-wA-participation",
    content: "因为我这个星期很忙，所以每天晚上十二点才睡觉。😴 大家几点睡觉？",
    likes: 6,
    hoursAgo: 5,
    replies: [
      { id: "r-hsk2-1a", authorId: "c-diego", content: "我十一点睡觉。你太忙了！多休息！", hoursAgo: 4 },
      { id: "r-hsk2-1b", authorId: "c-lucia", content: "多喝热水 😂 加油！", hoursAgo: 2 },
    ],
  },
  {
    id: "p-hsk2-2",
    level: "HSK2",
    authorId: "c-diego",
    tag: "misión",
    content: "我每天睡觉十一点，七点起床。",
    likes: 3,
    hoursAgo: 20,
    replies: [
      {
        id: "r-hsk2-2a",
        authorId: "c-andres",
        content: "¡Muy bien! Solo un detalle de orden 👇",
        hoursAgo: 18,
        correction: {
          original: "我每天睡觉十一点",
          corrected: "我每天十一点睡觉",
          note: "La hora va antes del verbo (Lección 1: posición de las expresiones de tiempo).",
        },
      },
      { id: "r-hsk2-2b", authorId: "c-diego", content: "啊，对！谢谢！🙏", hoursAgo: 17 },
    ],
  },
  {
    id: "p-hsk2-3",
    level: "HSK2",
    authorId: "c-camila",
    tag: "pregunta",
    content: "「在」和「正在」有什么区别？¿Alguien me explica cuándo usar cada uno?",
    likes: 4,
    hoursAgo: 30,
    replies: [
      {
        id: "r-hsk2-3a",
        authorId: "c-valentina",
        content: "正在 enfatiza «justo en este momento»; 在 es más neutro. Los dos pueden llevar 呢 al final. ¡Está en la Lección 2!",
        hoursAgo: 28,
      },
    ],
  },
  {
    id: "p-hsk2-4",
    level: "HSK2",
    authorId: "c-andres",
    tag: "recurso",
    content: "Truco de tonos: 3.er tono + 3.er tono → el primero suena como 2.º. 你好 = ní hǎo · 所以 = suóyǐ. Practicad leyendo en voz alta con el botón de audio 🎧",
    likes: 11,
    hoursAgo: 52,
    replies: [],
  },
  // ── B1
  {
    id: "p-b1-1",
    level: "B1",
    authorId: "c-martina",
    tag: "misión",
    missionId: "b1-wA-participation",
    content: "I have never seen the northern lights, but it's been on my bucket list for years! Has anyone here seen them?",
    likes: 7,
    hoursAgo: 3,
    replies: [
      { id: "r-b1-1a", authorId: "c-javier", content: "Yes! I saw them in Norway in 2023. It was unforgettable.", hoursAgo: 2 },
    ],
  },
  {
    id: "p-b1-2",
    level: "B1",
    authorId: "c-mateo",
    tag: "misión",
    content: "I have been to Cusco last year and I have climbed Machu Picchu.",
    likes: 2,
    hoursAgo: 16,
    replies: [
      {
        id: "r-b1-2a",
        authorId: "c-sofia",
        content: "Sounds amazing! Small correction 👇",
        hoursAgo: 15,
        correction: {
          original: "I have been to Cusco last year",
          corrected: "I went to Cusco last year",
          note: "«last year» es un momento concreto → past simple (Lesson 1).",
        },
      },
    ],
  },
  {
    id: "p-b1-3",
    level: "B1",
    authorId: "c-sofia",
    tag: "pregunta",
    content: "What's the difference between «used to» and «be used to»? I always mix them up 🤔",
    likes: 5,
    hoursAgo: 40,
    replies: [
      {
        id: "r-b1-3a",
        authorId: "c-javier",
        content: "used to + verb = something you did in the past (not anymore). be used to + -ing = you're accustomed to it. «I used to smoke» vs «I'm used to working at night».",
        hoursAgo: 38,
      },
    ],
  },
  {
    id: "p-b1-4",
    level: "B1",
    authorId: "c-javier",
    tag: "recurso",
    content: "Tip: every night, retell one thing that happened during your day out loud using past continuous + past simple. It really helps with fluency!",
    likes: 9,
    hoursAgo: 70,
    replies: [],
  },
];

function genericClassmates(level: LevelCode): Classmate[] {
  return [
    { id: `c-${level}-1`, name: "Paula N.", avatar: "🌱", country: "🇲🇽", level, streak: 5 },
    { id: `c-${level}-2`, name: "Tomás R.", avatar: "🚀", country: "🇦🇷", level, streak: 14 },
  ];
}

function genericPosts(language: LanguageCode, level: LevelCode): MockPost[] {
  const [a, b] = genericClassmates(level);
  return [
    {
      id: `p-${level}-1`,
      level,
      authorId: a.id,
      tag: "pregunta",
      content:
        language === "zh"
          ? "¡Hola a todos! ¿Alguien quiere hacer intercambio para practicar los tonos? 一起学习吧！"
          : "Hi everyone! Does anyone want to practise speaking once a week?",
      likes: 3,
      hoursAgo: 8,
      replies: [{ id: `r-${level}-1a`, authorId: b.id, content: language === "zh" ? "好啊！我也想练习。" : "Sure! Count me in.", hoursAgo: 6 }],
    },
  ];
}

export function classmatesFor(level: LevelCode): Classmate[] {
  const list = CLASSMATES.filter((c) => c.level === level);
  return list.length ? list : genericClassmates(level);
}

/** Posts mock del nivel, con fechas relativas a `now`. */
export function seedPostsFor(language: LanguageCode, level: LevelCode, now: Date): ClassroomPost[] {
  const posts = MOCK_POSTS.filter((p) => p.level === level);
  const source = posts.length ? posts : genericPosts(language, level);
  const at = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();
  return source.map(({ hoursAgo, replies, ...p }) => ({
    ...p,
    createdAt: at(hoursAgo),
    replies: replies.map(({ hoursAgo: rh, ...r }) => ({ ...r, createdAt: at(rh) })),
  }));
}
