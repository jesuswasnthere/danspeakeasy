import { zh } from "@/lib/richText";
import type {
  ChoiceOption,
  Course,
  HSKLevel,
  Lesson,
  MultipleChoiceExercise,
  PhoneticsModule,
  SoundExample,
  Unit,
} from "@/types/learning";

/**
 * Fonética del chino mandarín para principiantes (HSK 1 y HSK 2).
 *
 * - HSK 1: la sílaba y los tonos, iniciales, finales, ortografía del pinyin y los
 *   cambios de tono imprescindibles (3.º + 3.º, 不 y 一).
 * - HSK 2: medio tercer tono y tono neutro, las 20 combinaciones de tonos, cadenas de
 *   terceros tonos, 儿化 y pares de sonidos que se confunden.
 *
 * El audio se genera con TTS a partir del hanzi de cada ejemplo, así que los ejemplos
 * deben ser caracteres o palabras reales. La AFI es aproximada (pedagógica).
 */

const ex = (hanzi: string, pinyin: string, meaning: string): SoundExample => ({ hanzi, pinyin, meaning });

const opt = (id: string, text: string, correct: boolean, feedback: string, pinyin?: string): ChoiceOption => ({
  id,
  text,
  pinyin,
  correct,
  feedback,
});

/** Ejercicio «escucha y elige»: el audio sale de `audioText` (hanzi). */
function listen(
  id: string,
  skill: string,
  audioText: string,
  question: string,
  options: ChoiceOption[],
  explanation: string,
): MultipleChoiceExercise {
  return { id, type: "multiple-choice", skill, instruction: "Escucha el audio y elige la opción correcta.", audioText, question, options, explanation };
}

// ─── HSK 1 ────────────────────────────────────────────────────────────────────

const hsk1Tones: PhoneticsModule = {
  id: "zh-phon-hsk1-m1",
  level: "HSK1",
  order: 1,
  title: "La sílaba y los cuatro tonos",
  nativeTitle: zh("声调:shēng-diào"),
  summary: "Cómo está hecha una sílaba china y por qué el tono cambia el significado.",
  objectives: [
    "Reconocer las tres partes de una sílaba: inicial, final y tono",
    "Distinguir de oído los cuatro tonos y el tono neutro",
    "Leer las marcas tonales del pinyin",
  ],
  estimatedMinutes: 15,
  blocks: [
    {
      kind: "paragraph",
      title: "Inicial + final + tono",
      body: "Cada carácter chino se pronuncia como una sola sílaba. La sílaba tiene una inicial (consonante del principio, que puede faltar), una final (la parte vocálica, que puede acabar en -n o -ng) y un tono. En 妈 mā, la inicial es m, la final es a y el tono es el primero. El mandarín tiene solo unas 400 sílabas distintas sin contar el tono: por eso el tono es imprescindible para diferenciar palabras.",
    },
    {
      kind: "tones",
      title: "Los cuatro tonos y el tono neutro",
      intro: "Pulsa cada tono para escucharlo. El gráfico usa la escala de cinco alturas: 5 es la voz más aguda y 1 la más grave de tu registro.",
      tones: [
        { tone: 1, name: "Primer tono", contour: [5, 5], description: "Alto y sostenido, como cantar una nota larga. Marca: ā.", example: ex("妈", "mā", "madre") },
        { tone: 2, name: "Segundo tono", contour: [3, 5], description: "Sube de medio a alto, como al preguntar «¿sí?» con sorpresa. Marca: á.", example: ex("麻", "má", "cáñamo; entumecido") },
        { tone: 3, name: "Tercer tono", contour: [2, 1, 4], description: "Bajo: baja hasta lo más grave y, si va aislado o al final, vuelve a subir. Lo esencial es la parte baja. Marca: ǎ.", example: ex("马", "mǎ", "caballo") },
        { tone: 4, name: "Cuarto tono", contour: [5, 1], description: "Cae con fuerza de arriba abajo, como una orden tajante: «¡ya!». Marca: à.", example: ex("骂", "mà", "regañar") },
        { tone: 5, name: "Tono neutro", contour: [], description: "Corto y ligero, sin contorno propio. Aparece en partículas y en la segunda sílaba de algunas palabras. No lleva marca.", example: ex("吗", "ma", "partícula de pregunta") },
      ],
    },
    {
      kind: "table",
      title: "Mismo sonido, distinto significado",
      headers: ["Tono", "Pinyin", "Hanzi", "Significado"],
      rows: [
        ["1.º", "mā", "妈", "madre"],
        ["2.º", "má", "麻", "cáñamo"],
        ["3.º", "mǎ", "马", "caballo"],
        ["4.º", "mà", "骂", "regañar"],
        ["neutro", "ma", "吗", "¿…? (pregunta)"],
      ],
      caption: "妈妈骂马吗？ Māma mà mǎ ma? — «¿Regaña mamá al caballo?»",
    },
    {
      kind: "note",
      variant: "tip",
      title: "Tu voz, tu escala",
      body: "Los tonos son alturas relativas a tu propia voz, no notas fijas. Exagéralos al principio: los hablantes nativos te entenderán mejor con tonos exagerados que con tonos planos.",
    },
  ],
  exercises: [
    listen("zh-phon-hsk1-m1-e1", "Tonos", "马", "¿Qué tono oyes?", [
      opt("a", "mā (1.º)", false, "El 1.º es alto y plano; lo que suena baja y vuelve a subir."),
      opt("b", "má (2.º)", false, "El 2.º solo sube; aquí la voz primero baja."),
      opt("c", "mǎ (3.º)", true, "Exacto: baja a lo más grave y remonta."),
      opt("d", "mà (4.º)", false, "El 4.º cae y no vuelve a subir."),
    ], "马 mǎ «caballo» es 3.er tono (2-1-4): baja y, aislado, vuelve a subir."),
    listen("zh-phon-hsk1-m1-e2", "Tonos", "骂", "¿Qué tono oyes?", [
      opt("a", "mā (1.º)", false, "El 1.º se mantiene alto, no cae."),
      opt("b", "má (2.º)", false, "El 2.º sube; este cae."),
      opt("c", "mǎ (3.º)", false, "El 3.º es bajo y no empieza arriba."),
      opt("d", "mà (4.º)", true, "Sí: empieza arriba y cae con fuerza."),
    ], "骂 mà «regañar» es 4.º tono (5-1): una caída rápida y enérgica."),
    listen("zh-phon-hsk1-m1-e3", "Tonos", "麻", "¿Qué tono oyes?", [
      opt("a", "mā (1.º)", false, "El 1.º no sube: se queda arriba."),
      opt("b", "má (2.º)", true, "Correcto: sube de medio a alto, como una pregunta."),
      opt("c", "mǎ (3.º)", false, "El 3.º baja primero; el 2.º sube desde el principio."),
      opt("d", "mà (4.º)", false, "El 4.º cae; este sube."),
    ], "麻 má es 2.º tono (3-5). Truco: suena como «¿eh?» cuando no has oído algo."),
    {
      id: "zh-phon-hsk1-m1-e4",
      type: "tone-practice",
      skill: "Tonos",
      instruction: "Escucha y marca el tono de cada sílaba.",
      word: "中国",
      meaning: "China",
      syllables: [
        { base: "zhong", marked: "zhōng", tone: 1 },
        { base: "guo", marked: "guó", tone: 2 },
      ],
      explanation: "Zhōngguó: 1.º + 2.º. La primera sílaba se queda arriba y la segunda sube.",
    },
    {
      id: "zh-phon-hsk1-m1-e5",
      type: "multiple-choice",
      skill: "Tonos",
      instruction: "Elige la respuesta correcta.",
      question: "¿Cuál de estas sílabas está en tono neutro?",
      options: [
        opt("a", "ma", true, "Sí: sin marca tonal significa tono neutro."),
        opt("b", "mā", false, "La raya plana ( ˉ ) es el 1.er tono."),
        opt("c", "mǎ", false, "La marca en «v» ( ˇ ) es el 3.er tono."),
      ],
      explanation: "El tono neutro no lleva marca. Es corto y ligero, como el de 吗 ma o el segundo 妈 de 妈妈 māma.",
    },
  ],
};

const hsk1Initials: PhoneticsModule = {
  id: "zh-phon-hsk1-m2",
  level: "HSK1",
  order: 2,
  title: "Las iniciales (consonantes)",
  nativeTitle: zh("声母:shēng-mǔ"),
  summary: "Las 21 consonantes iniciales del pinyin y las trampas para hispanohablantes.",
  objectives: [
    "Distinguir consonantes aspiradas (con soplo) y no aspiradas",
    "Diferenciar las series j q x, zh ch sh r y z c s",
    "Saber que b, d, g no suenan como en español",
  ],
  estimatedMinutes: 20,
  blocks: [
    {
      kind: "note",
      variant: "warning",
      title: "b no es b, p no es p",
      body: "En pinyin la diferencia entre b/p, d/t, g/k, j/q, zh/ch y z/c NO es de sonoridad, como en español, sino de aspiración: la segunda de cada pareja se pronuncia con un soplo de aire. La b del pinyin suena como la p española; la p del pinyin es una p con soplo. Pon la mano delante de la boca: con p, t, k, q, ch y c debes notar el aire.",
    },
    {
      kind: "sounds",
      title: "Tabla de iniciales",
      intro: "Pulsa cada consonante para escuchar su ejemplo. Entre corchetes, la AFI aproximada.",
      groups: [
        {
          name: "Labiales",
          sounds: [
            { symbol: "b", ipa: "p", hint: "Como la p española, sin soplo.", example: ex("爸", "bà", "papá") },
            { symbol: "p", ipa: "pʰ", hint: "p con un soplo de aire.", example: ex("朋", "péng", "amigo (en 朋友)") },
            { symbol: "m", ipa: "m", hint: "Como en español.", example: ex("妈", "mā", "madre") },
            { symbol: "f", ipa: "f", hint: "Como en español.", example: ex("飞", "fēi", "volar") },
          ],
        },
        {
          name: "Alveolares",
          sounds: [
            { symbol: "d", ipa: "t", hint: "Como la t española, sin soplo.", example: ex("大", "dà", "grande") },
            { symbol: "t", ipa: "tʰ", hint: "t con un soplo de aire.", example: ex("他", "tā", "él") },
            { symbol: "n", ipa: "n", hint: "Como en español.", example: ex("你", "nǐ", "tú") },
            { symbol: "l", ipa: "l", hint: "Como en español.", example: ex("来", "lái", "venir") },
          ],
        },
        {
          name: "Velares",
          sounds: [
            { symbol: "g", ipa: "k", hint: "Como la c de «casa», sin soplo.", example: ex("哥", "gē", "hermano mayor") },
            { symbol: "k", ipa: "kʰ", hint: "k con un soplo de aire.", example: ex("看", "kàn", "mirar") },
            { symbol: "h", ipa: "x", hint: "Parecida a la j española, pero más suave.", example: ex("好", "hǎo", "bueno") },
          ],
        },
        {
          name: "Palatales",
          note: "Lengua plana, con la punta detrás de los dientes inferiores. Solo van delante de i y ü.",
          sounds: [
            { symbol: "j", ipa: "tɕ", hint: "Una «ch» suave con la lengua plana, sin soplo.", example: ex("家", "jiā", "casa; familia") },
            { symbol: "q", ipa: "tɕʰ", hint: "Como j, pero con soplo. ¡No es la q española!", example: ex("去", "qù", "ir") },
            { symbol: "x", ipa: "ɕ", hint: "Entre s y sh, con la lengua plana.", example: ex("小", "xiǎo", "pequeño") },
          ],
        },
        {
          name: "Retroflejas",
          note: "La punta de la lengua se curva hacia atrás, hacia el paladar.",
          sounds: [
            { symbol: "zh", ipa: "ʈʂ", hint: "«ch» con la lengua curvada hacia atrás, sin soplo.", example: ex("中", "zhōng", "medio") },
            { symbol: "ch", ipa: "ʈʂʰ", hint: "Como zh, pero con soplo.", example: ex("吃", "chī", "comer") },
            { symbol: "sh", ipa: "ʂ", hint: "«sh» con la lengua curvada hacia atrás.", example: ex("是", "shì", "ser") },
            { symbol: "r", ipa: "ʐ", hint: "Entre la r inglesa de «run» y la j francesa de «je». Nunca vibra.", example: ex("人", "rén", "persona") },
          ],
        },
        {
          name: "Dentales",
          note: "La punta de la lengua toca la parte de atrás de los dientes superiores.",
          sounds: [
            { symbol: "z", ipa: "ts", hint: "«ts» como en «tsunami», sin soplo.", example: ex("在", "zài", "estar en") },
            { symbol: "c", ipa: "tsʰ", hint: "«ts» con soplo. ¡No es la c española!", example: ex("菜", "cài", "plato; verdura") },
            { symbol: "s", ipa: "s", hint: "Como la s española.", example: ex("四", "sì", "cuatro") },
          ],
        },
      ],
    },
    {
      kind: "table",
      title: "Parejas sin soplo / con soplo",
      headers: ["Sin soplo", "Con soplo", "Ejemplo"],
      rows: [
        ["b", "p", "爸 bà / 怕 pà"],
        ["d", "t", "大 dà / 他 tā"],
        ["g", "k", "哥 gē / 课 kè"],
        ["j", "q", "家 jiā / 去 qù"],
        ["zh", "ch", "中 zhōng / 吃 chī"],
        ["z", "c", "在 zài / 菜 cài"],
      ],
    },
    {
      kind: "note",
      variant: "grammar",
      title: "¿Y la y y la w?",
      body: "y y w no son iniciales de verdad: son la forma de escribir i, u y ü cuando la sílaba no tiene consonante (yī, wǔ, yú). Lo verás en el módulo de ortografía.",
    },
  ],
  exercises: [
    listen("zh-phon-hsk1-m2-e1", "Iniciales", "他", "¿Qué sílaba oyes?", [
      opt("a", "tā", true, "Sí: se nota el soplo de aire de la t."),
      opt("b", "dā", false, "La d del pinyin no lleva soplo; aquí sí hay aire."),
    ], "他 tā «él»: t es aspirada (con soplo). La d sería como la t española, sin aire."),
    listen("zh-phon-hsk1-m2-e2", "Iniciales", "去", "¿Qué sílaba oyes?", [
      opt("a", "jù", false, "La j no lleva soplo."),
      opt("b", "qù", true, "Correcto: q es la versión con soplo de j."),
      opt("c", "xù", false, "La x es continua, como una s suave, sin oclusión."),
    ], "去 qù «ir». j, q y x se articulan con la lengua plana; q es la aspirada."),
    listen("zh-phon-hsk1-m2-e3", "Iniciales", "是", "¿Qué sílaba oyes?", [
      opt("a", "shì", true, "Sí: sh retrofleja, con la lengua curvada."),
      opt("b", "sì", false, "La s es dental y suena más aguda; aquí la lengua va hacia atrás."),
      opt("c", "xì", false, "La x se hace con la lengua plana y suena como «si» suave."),
    ], "是 shì «ser»: sh es retrofleja. Compara con 四 sì «cuatro», dental."),
    {
      id: "zh-phon-hsk1-m2-e4",
      type: "multiple-choice",
      skill: "Iniciales",
      instruction: "Elige la respuesta correcta.",
      question: "¿Cuál es la diferencia entre b y p en pinyin?",
      options: [
        opt("a", "b es sonora (vibran las cuerdas) y p es sorda, como en español", false, "Es la intuición del español, pero en chino las dos son sordas."),
        opt("b", "b no lleva soplo de aire y p sí", true, "Exacto: la diferencia es la aspiración."),
        opt("c", "No hay diferencia, son variantes", false, "Sí la hay: cambia el significado (爸 bà / 怕 pà)."),
      ],
      explanation: "b [p] y p [pʰ] son sordas; p se pronuncia con un soplo. Lo mismo pasa con d/t, g/k, j/q, zh/ch y z/c.",
    },
    listen("zh-phon-hsk1-m2-e5", "Iniciales", "菜", "¿Qué sílaba oyes?", [
      opt("a", "zài", false, "La z no lleva soplo."),
      opt("b", "cài", true, "Sí: c suena «ts» con soplo."),
      opt("c", "sài", false, "La s no tiene la oclusión de «t»."),
    ], "菜 cài «plato, verdura». La c del pinyin suena «ts» aspirada, nunca como la c española."),
  ],
};

const hsk1Finals: PhoneticsModule = {
  id: "zh-phon-hsk1-m3",
  level: "HSK1",
  order: 3,
  title: "Las finales (vocales y nasales)",
  nativeTitle: zh("韵母:yùn-mǔ"),
  summary: "Vocales simples, diptongos, finales nasales y las vocales que no existen en español.",
  objectives: [
    "Pronunciar ü y la e del pinyin",
    "Diferenciar las finales en -n y en -ng",
    "Saber cómo suena la i después de z c s y zh ch sh r",
  ],
  estimatedMinutes: 20,
  blocks: [
    {
      kind: "sounds",
      title: "Tabla de finales",
      intro: "Pulsa cada final para escuchar su ejemplo. Entre corchetes, la AFI aproximada.",
      groups: [
        {
          name: "Vocales simples",
          sounds: [
            { symbol: "a", ipa: "a", hint: "Como la a española.", example: ex("八", "bā", "ocho") },
            { symbol: "o", ipa: "uo", hint: "Solo tras b p m f, y suena casi «uo».", example: ex("波", "bō", "ola") },
            { symbol: "e", ipa: "ɤ", hint: "Vocal de garganta: di «o» sin redondear los labios. No es la e española.", example: ex("喝", "hē", "beber") },
            { symbol: "i", ipa: "i", hint: "Como la i española.", example: ex("你", "nǐ", "tú") },
            { symbol: "u", ipa: "u", hint: "Como la u española.", example: ex("不", "bù", "no") },
            { symbol: "ü", ipa: "y", hint: "Di «i» con los labios redondeados como para «u» (la u francesa).", example: ex("女", "nǚ", "mujer") },
          ],
        },
        {
          name: "Diptongos",
          sounds: [
            { symbol: "ai", ipa: "ai", hint: "Como «hay».", example: ex("爱", "ài", "amar") },
            { symbol: "ei", ipa: "ei", hint: "Como «rey».", example: ex("北", "běi", "norte") },
            { symbol: "ao", ipa: "au", hint: "Suena «au», como en «aula».", example: ex("好", "hǎo", "bueno") },
            { symbol: "ou", ipa: "ou", hint: "Una o que se cierra hacia u.", example: ex("狗", "gǒu", "perro") },
          ],
        },
        {
          name: "Nasales",
          note: "-n: la lengua toca detrás de los dientes. -ng: la lengua se queda atrás y el sonido sale por la nariz, como en «tengo».",
          sounds: [
            { symbol: "an", ipa: "an", hint: "Como «pan».", example: ex("看", "kàn", "mirar") },
            { symbol: "en", ipa: "ən", hint: "La e es neutra y breve.", example: ex("人", "rén", "persona") },
            { symbol: "ang", ipa: "aŋ", hint: "a + ng, con la boca abierta.", example: ex("忙", "máng", "ocupado") },
            { symbol: "eng", ipa: "əŋ", hint: "e neutra + ng.", example: ex("冷", "lěng", "frío") },
            { symbol: "ong", ipa: "ʊŋ", hint: "Una u abierta + ng (nunca «ong» española).", example: ex("中", "zhōng", "medio") },
          ],
        },
        {
          name: "Empiezan por i",
          sounds: [
            { symbol: "ia", ipa: "ja", hint: "«ia» como en «piano».", example: ex("家", "jiā", "casa") },
            { symbol: "ie", ipa: "jɛ", hint: "La e suena como la española: «ie».", example: ex("谢", "xiè", "agradecer") },
            { symbol: "iao", ipa: "jau", hint: "«iau».", example: ex("小", "xiǎo", "pequeño") },
            { symbol: "iu", ipa: "jou", hint: "Forma corta de iou: suena «iou».", example: ex("六", "liù", "seis") },
            { symbol: "ian", ipa: "jɛn", hint: "¡Suena «ien», no «ian»!", example: ex("天", "tiān", "cielo; día") },
            { symbol: "in", ipa: "in", hint: "i + n.", example: ex("今", "jīn", "hoy (en 今天)") },
            { symbol: "iang", ipa: "jaŋ", hint: "«ia» + ng.", example: ex("想", "xiǎng", "querer; pensar") },
            { symbol: "ing", ipa: "iŋ", hint: "i + ng.", example: ex("名", "míng", "nombre (en 名字)") },
            { symbol: "iong", ipa: "jʊŋ", hint: "«i» + ong.", example: ex("熊", "xióng", "oso") },
          ],
        },
        {
          name: "Empiezan por u",
          sounds: [
            { symbol: "ua", ipa: "wa", hint: "«ua» como en «agua».", example: ex("花", "huā", "flor") },
            { symbol: "uo", ipa: "wo", hint: "«uo».", example: ex("多", "duō", "mucho") },
            { symbol: "uai", ipa: "wai", hint: "«uai».", example: ex("快", "kuài", "rápido") },
            { symbol: "ui", ipa: "wei", hint: "Forma corta de uei: suena «uei».", example: ex("对", "duì", "correcto") },
            { symbol: "uan", ipa: "wan", hint: "«uan».", example: ex("欢", "huān", "alegre (en 喜欢)") },
            { symbol: "un", ipa: "wən", hint: "Forma corta de uen: suena «uen» con e breve.", example: ex("春", "chūn", "primavera") },
            { symbol: "uang", ipa: "waŋ", hint: "«ua» + ng.", example: ex("黄", "huáng", "amarillo") },
          ],
        },
        {
          name: "Empiezan por ü",
          note: "Tras j, q, x e y, la ü se escribe sin puntos (ju, que, xuan, yun), pero sigue sonando ü.",
          sounds: [
            { symbol: "üe", ipa: "ɥɛ", hint: "ü + e española.", example: ex("学", "xué", "estudiar") },
            { symbol: "üan", ipa: "ɥɛn", hint: "ü + «en».", example: ex("远", "yuǎn", "lejos") },
            { symbol: "ün", ipa: "yn", hint: "ü + n.", example: ex("云", "yún", "nube") },
          ],
        },
        {
          name: "Finales especiales",
          sounds: [
            { symbol: "-i (z c s)", ipa: "ɹ̩", hint: "Tras z, c, s la i NO suena i: es un zumbido que prolonga la consonante.", example: ex("字", "zì", "carácter") },
            { symbol: "-i (zh ch sh r)", ipa: "ɻ̩", hint: "Tras zh, ch, sh, r, la i también es un zumbido, con la lengua curvada.", example: ex("是", "shì", "ser") },
            { symbol: "er", ipa: "ɚ", hint: "Una vocal con la lengua curvada hacia atrás, como «er» del inglés americano.", example: ex("二", "èr", "dos") },
          ],
        },
      ],
    },
    {
      kind: "note",
      variant: "warning",
      title: "-n y -ng cambian el significado",
      body: "山 shān «montaña» y 商 shāng «comercio» solo se distinguen por la nasal final. Para -ng, deja la boca abierta y no toques los dientes con la lengua.",
    },
  ],
  exercises: [
    listen("zh-phon-hsk1-m3-e1", "Finales", "女", "¿Qué sílaba oyes?", [
      opt("a", "nǚ", true, "Sí: labios redondeados y lengua de «i»."),
      opt("b", "nǔ", false, "La u se pronuncia con la lengua atrás; la ü suena más aguda."),
    ], "女 nǚ «mujer» lleva ü [y]. Con u sería 努 nǔ «esforzarse»."),
    listen("zh-phon-hsk1-m3-e2", "Finales", "商", "¿Qué sílaba oyes?", [
      opt("a", "shān", false, "Con -n, la lengua tocaría los dientes al final."),
      opt("b", "shāng", true, "Correcto: termina en -ng, nasal y abierta."),
    ], "商 shāng «comercio» acaba en -ng. 山 shān «montaña» acaba en -n."),
    {
      id: "zh-phon-hsk1-m3-e3",
      type: "multiple-choice",
      skill: "Finales",
      instruction: "Elige la respuesta correcta.",
      question: "¿Cómo suena la final -ian de 天 tiān?",
      options: [
        opt("a", "«tian», con a abierta", false, "Es el error más común: la a se cierra por influencia de la i."),
        opt("b", "«tien», con una e", true, "Exacto: ian suena [jɛn]."),
        opt("c", "«tin»", false, "Esa sería la final -in."),
      ],
      explanation: "-ian se pronuncia [jɛn]: 天 tiān suena «tien», 见 jiàn suena «chien» suave.",
    },
    {
      id: "zh-phon-hsk1-m3-e4",
      type: "multiple-choice",
      skill: "Finales",
      instruction: "Elige la respuesta correcta.",
      question: "¿Cómo suena la i de 四 sì?",
      options: [
        opt("a", "Como la i española: «si»", false, "Tras z, c, s la i no suena i."),
        opt("b", "Como un zumbido que prolonga la s", true, "Sí: es una vocal especial [ɹ̩]."),
        opt("c", "Como «sei»", false, "No hay diptongo."),
      ],
      explanation: "Después de z, c, s (y de zh, ch, sh, r), la i del pinyin es un zumbido. 四 sì no suena «si» español.",
    },
    listen("zh-phon-hsk1-m3-e5", "Finales", "喝", "¿Qué sílaba oyes?", [
      opt("a", "hē", true, "Sí: la e del pinyin es una vocal de garganta."),
      opt("b", "hā", false, "La a es abierta y clara."),
      opt("c", "hū", false, "La u redondea los labios."),
    ], "喝 hē «beber»: la e del pinyin [ɤ] se dice como una «o» sin redondear los labios."),
  ],
};

const hsk1Spelling: PhoneticsModule = {
  id: "zh-phon-hsk1-m4",
  level: "HSK1",
  order: 4,
  title: "Cómo se escribe el pinyin",
  nativeTitle: zh("拼音:pīn-yīn"),
  summary: "Las reglas de ortografía que hacen que el pinyin escrito no siempre se lea como parece.",
  objectives: [
    "Usar y y w en sílabas sin consonante",
    "Saber cuándo ü pierde los puntos",
    "Colocar bien la marca tonal",
  ],
  estimatedMinutes: 15,
  blocks: [
    {
      kind: "table",
      title: "Sílabas sin consonante: y y w",
      headers: ["Final", "Se escribe", "Ejemplo"],
      rows: [
        ["i", "yi", "一 yī «uno»"],
        ["in / ing", "yin / ying", "音 yīn «sonido» · 英 yīng (英语 «inglés»)"],
        ["ia, ie, iao…", "ya, ye, yao…", "也 yě «también» · 要 yào «querer»"],
        ["iou", "you", "有 yǒu «tener»"],
        ["u", "wu", "五 wǔ «cinco»"],
        ["ua, uo, uai…", "wa, wo, wai…", "我 wǒ «yo» · 外 wài «fuera»"],
        ["uei / uen", "wei / wen", "喂 wèi «¿diga?» · 问 wèn «preguntar»"],
        ["ü, üe, üan, ün", "yu, yue, yuan, yun", "鱼 yú «pez» · 月 yuè «mes»"],
      ],
    },
    {
      kind: "paragraph",
      title: "La ü y sus puntos",
      body: "Tras j, q, x e y nunca puede ir u, así que la ü se escribe sin puntos: 去 qù, 学 xué, 鱼 yú siguen sonando ü. Tras n y l sí pueden ir las dos, así que se mantienen los puntos: 女 nǚ «mujer» frente a 努 nǔ «esforzarse», 绿 lǜ «verde» frente a 路 lù «camino».",
    },
    {
      kind: "paragraph",
      title: "Formas abreviadas: iu, ui, un",
      body: "Con consonante delante, iou, uei y uen se escriben iu, ui y un: 六 liù (l + iou), 对 duì (d + uei), 春 chūn (ch + uen). Se escriben más cortas, pero se pronuncian completas.",
    },
    {
      kind: "table",
      title: "¿Dónde va la marca tonal?",
      headers: ["Regla", "Ejemplos"],
      rows: [
        ["Si hay a, va sobre la a", "hǎo, kuài, tiān"],
        ["Si no hay a, va sobre o o e", "gǒu, xiè, duō"],
        ["En iu y ui, sobre la segunda vocal", "liù, duì"],
        ["Si solo hay una vocal, sobre ella", "nǐ, lǜ, rén"],
      ],
    },
    {
      kind: "note",
      variant: "tip",
      title: "El apóstrofo",
      body: "Cuando una sílaba que empieza por a, o, e sigue a otra, se separan con apóstrofo para evitar ambigüedad: 西安 Xī'ān (dos sílabas, la ciudad) frente a 先 xiān (una sílaba, «primero»). También 女儿 nǚ'ér «hija».",
    },
  ],
  exercises: [
    {
      id: "zh-phon-hsk1-m4-e1",
      type: "fill-blank",
      skill: "Ortografía del pinyin",
      instruction: "Escribe la sílaba en pinyin, sin marca tonal.",
      before: "j + ü =",
      after: "",
      translation: "Une la inicial j con la final ü.",
      accepted: ["ju"],
      hint: "Tras j, la ü pierde los puntos.",
      explanation: "j + ü se escribe ju (como en 句 jù «frase»), pero se pronuncia con ü.",
    },
    {
      id: "zh-phon-hsk1-m4-e2",
      type: "fill-blank",
      skill: "Ortografía del pinyin",
      instruction: "Escribe la sílaba en pinyin, sin marca tonal.",
      before: "(sin consonante) + iou =",
      after: "",
      translation: "La final iou sin inicial delante.",
      accepted: ["you"],
      hint: "La i inicial se convierte en y.",
      explanation: "Sin consonante, iou se escribe you, como en 有 yǒu «tener».",
    },
    {
      id: "zh-phon-hsk1-m4-e3",
      type: "multiple-choice",
      skill: "Ortografía del pinyin",
      instruction: "Elige la forma correcta.",
      question: "d + uei con 4.º tono se escribe…",
      options: [
        opt("a", "duèi", false, "Con consonante delante, uei se abrevia a ui."),
        opt("b", "duì", true, "Sí: forma abreviada y marca sobre la segunda vocal."),
        opt("c", "dùi", false, "En ui la marca va sobre la i."),
      ],
      explanation: "d + uei → dui, y en ui la marca va sobre la segunda vocal: 对 duì «correcto».",
    },
    {
      id: "zh-phon-hsk1-m4-e4",
      type: "multiple-choice",
      skill: "Ortografía del pinyin",
      instruction: "Elige la forma correcta.",
      question: "«hao» en 3.er tono se escribe…",
      options: [
        opt("a", "hǎo", true, "Correcto: si hay a, la marca va sobre la a."),
        opt("b", "haǒ", false, "La a tiene prioridad sobre la o."),
      ],
      explanation: "La marca tonal va sobre la a siempre que la haya: 好 hǎo.",
    },
    {
      id: "zh-phon-hsk1-m4-e5",
      type: "multiple-choice",
      skill: "Ortografía del pinyin",
      instruction: "Elige la respuesta correcta.",
      question: "¿Qué sonido tiene la u de 去 qù?",
      options: [
        opt("a", "u, como en español", false, "Tras j, q, x, y no existe la u."),
        opt("b", "ü, aunque se escriba sin puntos", true, "Exacto."),
      ],
      explanation: "Tras j, q, x e y la u escrita es siempre ü: 去 qù, 学 xué, 鱼 yú.",
    },
  ],
};

const hsk1Sandhi: PhoneticsModule = {
  id: "zh-phon-hsk1-m5",
  level: "HSK1",
  order: 5,
  title: "Cambios de tono imprescindibles",
  nativeTitle: zh("变调:biàn-diào"),
  summary: "El tercer tono ante otro tercero, y los cambios de 不 y 一.",
  objectives: [
    "Pronunciar 3.º + 3.º como 2.º + 3.º",
    "Saber cuándo 不 se pronuncia bú",
    "Aplicar las tres pronunciaciones de 一",
  ],
  estimatedMinutes: 15,
  blocks: [
    {
      kind: "paragraph",
      title: "El pinyin del diccionario no siempre es lo que se oye",
      body: "Algunas sílabas cambian de tono según la sílaba que las sigue. Es obligatorio en el habla normal: si no lo haces, sonarás raro aunque cada tono sea correcto.",
    },
    {
      kind: "tone-changes",
      title: "3.er tono + 3.er tono → 2.º + 3.º",
      intro: "Cuando dos terceros tonos van seguidos, el primero se pronuncia como segundo. Se sigue escribiendo con 3.er tono.",
      rows: [
        { example: ex("你好", "nǐ hǎo", "hola"), written: "nǐ hǎo", spoken: "ní hǎo" },
        { example: ex("很好", "hěn hǎo", "muy bien"), written: "hěn hǎo", spoken: "hén hǎo" },
        { example: ex("可以", "kěyǐ", "poder"), written: "kěyǐ", spoken: "kéyǐ" },
        { example: ex("水果", "shuǐguǒ", "fruta"), written: "shuǐguǒ", spoken: "shuíguǒ" },
      ],
    },
    {
      kind: "tone-changes",
      title: "不 bù → bú ante 4.º tono",
      intro: "不 es 4.º tono, pero delante de otro 4.º se pronuncia en 2.º. Delante de 1.º, 2.º y 3.º no cambia.",
      rows: [
        { example: ex("不是", "bù shì", "no ser"), written: "bù shì", spoken: "bú shì", note: "ante 4.º" },
        { example: ex("不去", "bù qù", "no ir"), written: "bù qù", spoken: "bú qù", note: "ante 4.º" },
        { example: ex("不喝", "bù hē", "no beber"), written: "bù hē", spoken: "bù hē", note: "ante 1.º: sin cambio" },
        { example: ex("不忙", "bù máng", "no estar ocupado"), written: "bù máng", spoken: "bù máng", note: "ante 2.º: sin cambio" },
        { example: ex("不好", "bù hǎo", "no estar bien"), written: "bù hǎo", spoken: "bù hǎo", note: "ante 3.º: sin cambio" },
      ],
    },
    {
      kind: "tone-changes",
      title: "Las tres pronunciaciones de 一",
      intro: "一 es yī cuando va solo, al contar o al final. Delante de 4.º tono se dice yí, y delante de 1.º, 2.º y 3.º se dice yì.",
      rows: [
        { example: ex("一", "yī", "uno"), written: "yī", spoken: "yī", note: "solo o contando" },
        { example: ex("十一", "shíyī", "once"), written: "shíyī", spoken: "shíyī", note: "número" },
        { example: ex("一个", "yī gè", "uno (+ clasificador)"), written: "yī gè", spoken: "yí ge", note: "ante 4.º (个 gè)" },
        { example: ex("一天", "yī tiān", "un día"), written: "yī tiān", spoken: "yì tiān", note: "ante 1.º" },
        { example: ex("一年", "yī nián", "un año"), written: "yī nián", spoken: "yì nián", note: "ante 2.º" },
        { example: ex("一起", "yīqǐ", "juntos"), written: "yīqǐ", spoken: "yìqǐ", note: "ante 3.º" },
      ],
    },
    {
      kind: "note",
      variant: "tip",
      title: "¿Cómo lo verás escrito?",
      body: "El cambio 3.º + 3.º nunca se escribe. En cambio, muchos libros de texto y diccionarios escriben 一 y 不 con el tono ya cambiado (bú shì, yí ge, yì tiān). En el libro de clase de DanSpeakeasy los verás así, con el tono ya cambiado.",
    },
    {
      kind: "paragraph",
      title: "El tono neutro en palabras de HSK 1",
      body: "Las partículas 吗 ma, 呢 ne, 的 de y 了 le van siempre en tono neutro, igual que la segunda sílaba de los términos de parentesco repetidos: 爸爸 bàba, 妈妈 māma. En 个 el tono neutro también es habitual: 一个 yí ge.",
    },
  ],
  exercises: [
    {
      id: "zh-phon-hsk1-m5-e1",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "你好 (nǐ hǎo) se pronuncia…",
      audioText: "你好",
      options: [
        opt("a", "nǐ hǎo", false, "Así se escribe, pero dos 3.os seguidos no se pronuncian así."),
        opt("b", "ní hǎo", true, "Correcto: el primer 3.º pasa a 2.º."),
        opt("c", "nǐ hāo", false, "Es la segunda sílaba la que se mantiene en 3.º."),
      ],
      explanation: "3.º + 3.º → 2.º + 3.º. Se escribe nǐ hǎo y se pronuncia ní hǎo.",
    },
    {
      id: "zh-phon-hsk1-m5-e2",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "不是 (no ser) se pronuncia…",
      audioText: "不是",
      options: [
        opt("a", "bù shì", false, "Ante otro 4.º, 不 cambia."),
        opt("b", "bú shì", true, "Sí: 是 es 4.º tono, así que 不 pasa a 2.º."),
      ],
      explanation: "不 bù + 4.º tono → bú. 是 shì es 4.º, así que 不是 se dice bú shì.",
    },
    {
      id: "zh-phon-hsk1-m5-e3",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "不忙 (no estar ocupado) se pronuncia…",
      options: [
        opt("a", "bù máng", true, "Correcto: 忙 es 2.º tono, así que 不 no cambia."),
        opt("b", "bú máng", false, "不 solo cambia delante de 4.º tono."),
      ],
      explanation: "不 solo pasa a bú delante de un 4.º tono. Ante 忙 máng (2.º) se mantiene bù.",
    },
    {
      id: "zh-phon-hsk1-m5-e4",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "一天 (un día) se pronuncia…",
      audioText: "一天",
      options: [
        opt("a", "yī tiān", false, "Delante de otra sílaba, 一 cambia."),
        opt("b", "yí tiān", false, "yí es solo delante de 4.º tono."),
        opt("c", "yì tiān", true, "Sí: ante 1.º, 2.º o 3.º, 一 se dice yì."),
      ],
      explanation: "天 tiān es 1.er tono, así que 一 se pronuncia yì: yì tiān.",
    },
    {
      id: "zh-phon-hsk1-m5-e5",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "一个 (uno + clasificador) se pronuncia…",
      audioText: "一个",
      options: [
        opt("a", "yí ge", true, "Correcto: 个 es originalmente 4.º tono."),
        opt("b", "yì ge", false, "Ante un 4.º tono (aunque se neutralice), 一 se dice yí."),
        opt("c", "yī ge", false, "yī es para 一 solo, al contar o al final."),
      ],
      explanation: "个 es gè (4.º tono, a menudo neutro). Delante de 4.º, 一 pasa a yí: yí ge.",
    },
  ],
};

// ─── HSK 2 ────────────────────────────────────────────────────────────────────

const hsk2Neutral: PhoneticsModule = {
  id: "zh-phon-hsk2-m1",
  level: "HSK2",
  order: 1,
  title: "Medio tercer tono y tono neutro",
  nativeTitle: zh("轻声:qīng-shēng"),
  summary: "Cómo suena el 3.er tono dentro de una palabra y a qué altura va el tono neutro.",
  objectives: [
    "Usar el medio tercer tono (2-1) delante de 1.º, 2.º, 4.º y neutro",
    "Ajustar la altura del tono neutro según el tono anterior",
    "Reconocer palabras con tono neutro de HSK 1–2",
  ],
  estimatedMinutes: 15,
  blocks: [
    {
      kind: "paragraph",
      title: "El tercer tono casi nunca sube",
      body: "El contorno completo del 3.er tono (2-1-4) solo aparece aislado o al final de una frase. Delante de 1.º, 2.º, 4.º o neutro se dice un medio tercer tono: solo la parte baja (2-1), sin remontar. Delante de otro 3.º, ya lo sabes, pasa a 2.º.",
    },
    {
      kind: "tone-changes",
      title: "Medio tercer tono",
      intro: "Escucha cómo la primera sílaba se queda abajo y no sube.",
      rows: [
        { example: ex("老师", "lǎoshī", "profesor"), written: "lǎoshī", spoken: "lǎoshī", note: "3.º bajo + 1.º" },
        { example: ex("很忙", "hěn máng", "muy ocupado"), written: "hěn máng", spoken: "hěn máng", note: "3.º bajo + 2.º" },
        { example: ex("好看", "hǎokàn", "bonito"), written: "hǎokàn", spoken: "hǎokàn", note: "3.º bajo + 4.º" },
        { example: ex("我们", "wǒmen", "nosotros"), written: "wǒmen", spoken: "wǒmen", note: "3.º bajo + neutro" },
      ],
    },
    {
      kind: "table",
      title: "¿A qué altura va el tono neutro?",
      headers: ["Tono anterior", "Altura del neutro", "Ejemplo"],
      rows: [
        ["1.º", "media-baja", "妈妈 māma · 桌子 zhuōzi"],
        ["2.º", "media", "朋友 péngyou · 爷爷 yéye"],
        ["3.º", "media-alta (¡sube!)", "我们 wǒmen · 姐姐 jiějie"],
        ["4.º", "baja", "爸爸 bàba · 谢谢 xièxie"],
      ],
      caption: "El neutro es corto y su altura la decide la sílaba anterior. Tras el 3.º es donde más se nota.",
    },
    {
      kind: "paragraph",
      title: "Dónde aparece el tono neutro",
      body: "En las partículas (吗, 呢, 吧, 的, 了, 着, 过), en sufijos como 子 y 们 (桌子 zhuōzi, 我们 wǒmen), en términos de parentesco repetidos (哥哥 gēge) y en verbos repetidos para suavizar: 看看 kànkan «echar un vistazo», 试试 shìshi «probar». También en muchas palabras que hay que memorizar: 朋友 péngyou, 东西 dōngxi «cosa», 认识 rènshi «conocer».",
    },
  ],
  exercises: [
    {
      id: "zh-phon-hsk2-m1-e1",
      type: "multiple-choice",
      skill: "Tono neutro",
      instruction: "Elige la respuesta correcta.",
      question: "En 老师 lǎoshī, ¿cómo se pronuncia lǎo?",
      audioText: "老师",
      options: [
        opt("a", "Bajo y sin subir (medio tercer tono)", true, "Exacto: ante 1.º tono, el 3.º se queda en 2-1."),
        opt("b", "Bajando y subiendo del todo (2-1-4)", false, "El contorno completo solo aparece aislado o al final."),
        opt("c", "Como 2.º tono", false, "Eso solo pasa delante de otro 3.º."),
      ],
      explanation: "Delante de 1.º, 2.º, 4.º y neutro, el 3.º tono es un «medio tercer tono»: solo la parte baja.",
    },
    {
      id: "zh-phon-hsk2-m1-e2",
      type: "tone-practice",
      skill: "Tono neutro",
      instruction: "Escucha y marca el tono de cada sílaba.",
      word: "朋友",
      meaning: "amigo",
      syllables: [
        { base: "peng", marked: "péng", tone: 2 },
        { base: "you", marked: "you", tone: 5 },
      ],
      explanation: "péngyou: 2.º + neutro. 友 es yǒu por separado, pero en 朋友 va en tono neutro.",
    },
    {
      id: "zh-phon-hsk2-m1-e3",
      type: "multiple-choice",
      skill: "Tono neutro",
      instruction: "Elige la respuesta correcta.",
      question: "¿Tras qué tono el tono neutro suena más alto?",
      options: [
        opt("a", "Tras el 1.º", false, "Tras el 1.º el neutro baja un poco."),
        opt("b", "Tras el 3.º", true, "Sí: después de la parte baja del 3.º, el neutro sube (我们 wǒmen)."),
        opt("c", "Tras el 4.º", false, "Tras el 4.º el neutro queda muy bajo."),
      ],
      explanation: "El 3.º tono acaba abajo (medio tercer tono) y el neutro siguiente rebota hacia arriba: wǒmen, jiějie.",
    },
    {
      id: "zh-phon-hsk2-m1-e4",
      type: "tone-practice",
      skill: "Tono neutro",
      instruction: "Escucha y marca el tono de cada sílaba.",
      word: "谢谢",
      meaning: "gracias",
      syllables: [
        { base: "xie", marked: "xiè", tone: 4 },
        { base: "xie", marked: "xie", tone: 5 },
      ],
      explanation: "xièxie: 4.º + neutro. La segunda sílaba es corta y baja.",
    },
  ],
};

const hsk2Pairs: PhoneticsModule = {
  id: "zh-phon-hsk2-m2",
  level: "HSK2",
  order: 2,
  title: "Las 20 combinaciones de tonos",
  nativeTitle: zh("声调:shēng-diào 组合:zǔ-hé"),
  summary: "La mayoría de palabras tienen dos sílabas: entrena todas las parejas de tonos.",
  objectives: [
    "Pronunciar las 20 combinaciones de dos tonos",
    "Identificar de oído los tonos de palabras de dos sílabas",
  ],
  estimatedMinutes: 20,
  blocks: [
    {
      kind: "paragraph",
      body: "Practicar tonos con sílabas sueltas no basta: en una palabra cada tono se ajusta al de al lado. Con estas 20 parejas (4 × 4 tonos más el neutro) cubres todas las combinaciones posibles de dos sílabas.",
    },
    {
      kind: "tone-grid",
      title: "Tabla de combinaciones",
      intro: "Filas: tono de la primera sílaba. Columnas: tono de la segunda. Pulsa cada palabra para escucharla.",
      rows: [
        [ex("飞机", "fēijī", "avión"), ex("中国", "Zhōngguó", "China"), ex("喝水", "hē shuǐ", "beber agua"), ex("商店", "shāngdiàn", "tienda"), ex("桌子", "zhuōzi", "mesa")],
        [ex("明天", "míngtiān", "mañana"), ex("同学", "tóngxué", "compañero"), ex("没有", "méiyǒu", "no tener"), ex("学校", "xuéxiào", "escuela"), ex("朋友", "péngyou", "amigo")],
        [ex("老师", "lǎoshī", "profesor"), ex("女儿", "nǚ'ér", "hija"), ex("你好", "nǐ hǎo", "hola"), ex("米饭", "mǐfàn", "arroz"), ex("椅子", "yǐzi", "silla")],
        [ex("汽车", "qìchē", "coche"), ex("大学", "dàxué", "universidad"), ex("电脑", "diànnǎo", "ordenador"), ex("再见", "zàijiàn", "adiós"), ex("谢谢", "xièxie", "gracias")],
      ],
    },
    {
      kind: "note",
      variant: "tip",
      title: "Cómo practicar la tabla",
      body: "Recorre una fila entera repitiendo en voz alta, luego una columna. Recuerda: en la fila del 3.º tono, la primera sílaba es un medio tercer tono, y 你好 se pronuncia ní hǎo.",
    },
  ],
  exercises: [
    {
      id: "zh-phon-hsk2-m2-e1",
      type: "tone-practice",
      skill: "Combinaciones de tonos",
      instruction: "Escucha y marca el tono de cada sílaba.",
      word: "学校",
      meaning: "escuela",
      syllables: [
        { base: "xue", marked: "xué", tone: 2 },
        { base: "xiao", marked: "xiào", tone: 4 },
      ],
      explanation: "xuéxiào: 2.º + 4.º. Sube y después cae.",
    },
    {
      id: "zh-phon-hsk2-m2-e2",
      type: "tone-practice",
      skill: "Combinaciones de tonos",
      instruction: "Escucha y marca el tono de cada sílaba.",
      word: "电脑",
      meaning: "ordenador",
      syllables: [
        { base: "dian", marked: "diàn", tone: 4 },
        { base: "nao", marked: "nǎo", tone: 3 },
      ],
      explanation: "diànnǎo: 4.º + 3.º. Cae desde arriba y la segunda sílaba toca fondo.",
    },
    {
      id: "zh-phon-hsk2-m2-e3",
      type: "tone-practice",
      skill: "Combinaciones de tonos",
      instruction: "Escucha y marca el tono de cada sílaba.",
      word: "明天",
      meaning: "mañana",
      syllables: [
        { base: "ming", marked: "míng", tone: 2 },
        { base: "tian", marked: "tiān", tone: 1 },
      ],
      explanation: "míngtiān: 2.º + 1.º. Sube y se queda arriba.",
    },
    {
      id: "zh-phon-hsk2-m2-e4",
      type: "tone-practice",
      skill: "Combinaciones de tonos",
      instruction: "Escucha y marca el tono de cada sílaba.",
      word: "米饭",
      meaning: "arroz",
      syllables: [
        { base: "mi", marked: "mǐ", tone: 3 },
        { base: "fan", marked: "fàn", tone: 4 },
      ],
      explanation: "mǐfàn: 3.º + 4.º. El 3.º se queda abajo (medio tercer tono) y el 4.º cae desde arriba.",
    },
    {
      id: "zh-phon-hsk2-m2-e5",
      type: "tone-practice",
      skill: "Combinaciones de tonos",
      instruction: "Escucha y marca el tono de cada sílaba.",
      word: "商店",
      meaning: "tienda",
      syllables: [
        { base: "shang", marked: "shāng", tone: 1 },
        { base: "dian", marked: "diàn", tone: 4 },
      ],
      explanation: "shāngdiàn: 1.º + 4.º. Alto y plano, y luego una caída.",
    },
  ],
};

const hsk2Sandhi: PhoneticsModule = {
  id: "zh-phon-hsk2-m3",
  level: "HSK2",
  order: 3,
  title: "Cadenas de terceros tonos, 一 y 不 en frases",
  nativeTitle: zh("变调:biàn-diào"),
  summary: "Qué pasa con tres terceros tonos seguidos y con 一 y 不 dentro de estructuras.",
  objectives: [
    "Agrupar terceros tonos seguidos según el sentido",
    "Pronunciar 一 en verbos repetidos y 不 en preguntas V不V",
  ],
  estimatedMinutes: 15,
  blocks: [
    {
      kind: "paragraph",
      title: "Tres terceros tonos seguidos",
      body: "Con tres o más terceros tonos, se agrupan las sílabas según el sentido y la regla 3.º + 3.º → 2.º + 3.º se aplica dentro de cada grupo. El último 3.º de la frase se mantiene. Hablando deprisa, a menudo todos menos el último pasan a 2.º.",
    },
    {
      kind: "tone-changes",
      title: "Ejemplos de cadenas",
      rows: [
        { example: ex("我很好", "wǒ hěn hǎo", "estoy muy bien"), written: "wǒ hěn hǎo", spoken: "wǒ hén hǎo", note: "我 | 很好; deprisa: wó hén hǎo" },
        { example: ex("展览馆", "zhǎnlǎnguǎn", "sala de exposiciones"), written: "zhǎnlǎnguǎn", spoken: "zhánlánguǎn", note: "展览 | 馆" },
        { example: ex("我也很好", "wǒ yě hěn hǎo", "yo también estoy bien"), written: "wǒ yě hěn hǎo", spoken: "wó yě hén hǎo", note: "我也 | 很好" },
      ],
    },
    {
      kind: "tone-changes",
      title: "一 y 不 en tono neutro",
      intro: "Entre un verbo repetido, 一 se vuelve neutro. En las preguntas «verbo + 不 + verbo», 不 también se dice en neutro.",
      rows: [
        { example: ex("看一看", "kàn yī kàn", "echar un vistazo"), written: "kàn yī kàn", spoken: "kàn yi kàn" },
        { example: ex("想一想", "xiǎng yī xiǎng", "pensarlo un poco"), written: "xiǎng yī xiǎng", spoken: "xiǎng yi xiǎng" },
        { example: ex("好不好", "hǎo bù hǎo", "¿vale?"), written: "hǎo bù hǎo", spoken: "hǎo bu hǎo" },
        { example: ex("是不是", "shì bù shì", "¿es o no es?"), written: "shì bù shì", spoken: "shì bu shì" },
        { example: ex("去不去", "qù bù qù", "¿vas o no?"), written: "qù bù qù", spoken: "qù bu qù" },
      ],
    },
    {
      kind: "tone-changes",
      title: "Cuando 一 no cambia",
      intro: "En números, fechas y ordinales, 一 mantiene yī.",
      rows: [
        { example: ex("第一", "dì-yī", "primero"), written: "dì-yī", spoken: "dì-yī", note: "ordinal" },
        { example: ex("一月", "yīyuè", "enero"), written: "yīyuè", spoken: "yīyuè", note: "mes" },
        { example: ex("十一", "shíyī", "once"), written: "shíyī", spoken: "shíyī", note: "número" },
      ],
    },
  ],
  exercises: [
    {
      id: "zh-phon-hsk2-m3-e1",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "我很好 se pronuncia (a velocidad normal)…",
      audioText: "我很好",
      options: [
        opt("a", "wǒ hěn hǎo", false, "Tres 3.os seguidos no se pronuncian tal cual."),
        opt("b", "wǒ hén hǎo", true, "Sí: 很好 forma un grupo y 很 pasa a 2.º. (Deprisa también vale wó hén hǎo.)"),
        opt("c", "wǒ hěn háo", false, "El último 3.º de la frase nunca cambia."),
      ],
      explanation: "Agrupación 我 | 很好: dentro de 很好 se aplica 3.º + 3.º → 2.º + 3.º.",
    },
    {
      id: "zh-phon-hsk2-m3-e2",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "好不好 (¿vale?) se pronuncia…",
      audioText: "好不好",
      options: [
        opt("a", "hǎo bù hǎo", false, "En la pregunta V不V, 不 pierde el tono."),
        opt("b", "hǎo bu hǎo", true, "Correcto: 不 en tono neutro."),
        opt("c", "hǎo bú hǎo", false, "bú solo aparece delante de 4.º tono."),
      ],
      explanation: "En las preguntas «verbo/adjetivo + 不 + verbo/adjetivo», 不 suele ir en tono neutro.",
    },
    {
      id: "zh-phon-hsk2-m3-e3",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "第一 (primero) se pronuncia…",
      options: [
        opt("a", "dì yí", false, "En ordinales, 一 no cambia."),
        opt("b", "dì yī", true, "Sí: en números y ordinales se mantiene yī."),
        opt("c", "dì yì", false, "En ordinales, 一 no cambia."),
      ],
      explanation: "Al contar, en números, fechas y ordinales, 一 se pronuncia siempre yī.",
    },
    {
      id: "zh-phon-hsk2-m3-e4",
      type: "multiple-choice",
      skill: "Cambios de tono",
      instruction: "Elige cómo se pronuncia.",
      question: "看一看 (echar un vistazo) se pronuncia…",
      audioText: "看一看",
      options: [
        opt("a", "kàn yí kàn", false, "Entre verbos repetidos, 一 se neutraliza."),
        opt("b", "kàn yi kàn", true, "Correcto: 一 en tono neutro."),
      ],
      explanation: "En «verbo + 一 + verbo», 一 se pronuncia en tono neutro: kàn yi kàn.",
    },
  ],
};

const hsk2Erhua: PhoneticsModule = {
  id: "zh-phon-hsk2-m4",
  level: "HSK2",
  order: 4,
  title: "儿化: la -r del norte",
  nativeTitle: zh("儿化:ér-huà"),
  summary: "Por qué 哪儿 se lee nǎr y qué cambia en 一点儿 o 一会儿.",
  objectives: [
    "Leer las palabras con 儿 de HSK 1–2",
    "Saber cuándo 儿 es sílaba propia y cuándo es solo una -r",
  ],
  estimatedMinutes: 10,
  blocks: [
    {
      kind: "paragraph",
      title: "Un 儿 que no es sílaba",
      body: "En el norte de China (y en el chino estándar), muchas palabras añaden 儿 al final. No se pronuncia como sílaba aparte: la sílaba anterior termina con la lengua curvada hacia atrás, como una -r. En pinyin se escribe solo la r: 哪儿 nǎr.",
    },
    {
      kind: "tone-changes",
      title: "Palabras con 儿化",
      intro: "Columna «escrito»: pinyin; columna «suena»: aproximación de lo que se oye.",
      rows: [
        { example: ex("哪儿", "nǎr", "¿dónde?"), written: "nǎr", spoken: "nǎr" },
        { example: ex("这儿", "zhèr", "aquí"), written: "zhèr", spoken: "zhèr" },
        { example: ex("那儿", "nàr", "allí"), written: "nàr", spoken: "nàr" },
        { example: ex("一点儿", "yìdiǎnr", "un poco"), written: "yìdiǎnr", spoken: "yìdiǎr", note: "la -n desaparece" },
        { example: ex("一会儿", "yíhuìr", "un rato"), written: "yíhuìr", spoken: "yíhuèr", note: "la -i desaparece" },
        { example: ex("玩儿", "wánr", "jugar; divertirse"), written: "wánr", spoken: "wár", note: "la -n desaparece" },
      ],
    },
    {
      kind: "note",
      variant: "warning",
      title: "儿 como sílaba propia",
      body: "En 儿子 érzi «hijo» y 女儿 nǚ'ér «hija», 儿 es una palabra con significado y sí se pronuncia como sílaba: ér.",
    },
    {
      kind: "note",
      variant: "culture",
      title: "Norte y sur",
      body: "En el sur de China y en Taiwán casi no se usa el 儿化: se dice 这里 zhèlǐ, 那里 nàlǐ y 哪里 nǎlǐ en lugar de 这儿, 那儿 y 哪儿. Las dos formas son correctas.",
    },
  ],
  exercises: [
    {
      id: "zh-phon-hsk2-m4-e1",
      type: "multiple-choice",
      skill: "Erhua",
      instruction: "Elige la respuesta correcta.",
      question: "¿Cómo se escribe en pinyin 哪儿?",
      audioText: "哪儿",
      options: [
        opt("a", "nǎ ér", false, "Aquí 儿 no es una sílaba aparte."),
        opt("b", "nǎr", true, "Correcto: solo se añade -r."),
        opt("c", "nǎ'er", false, "El apóstrofo indicaría dos sílabas."),
      ],
      explanation: "El 儿化 se escribe añadiendo r a la sílaba anterior: 哪儿 nǎr, 这儿 zhèr.",
    },
    {
      id: "zh-phon-hsk2-m4-e2",
      type: "multiple-choice",
      skill: "Erhua",
      instruction: "Elige la respuesta correcta.",
      question: "En 一点儿 yìdiǎnr, ¿qué pasa con la -n de diǎn?",
      audioText: "一点儿",
      options: [
        opt("a", "Se pronuncia y luego viene la r", false, "La -n y la -r no se pronuncian juntas."),
        opt("b", "Desaparece: suena «yìdiǎr»", true, "Sí: la -n se pierde ante la -r."),
      ],
      explanation: "Con 儿化, las finales en -n y en -i pierden esa última consonante o vocal: diǎnr → «diǎr», huìr → «huèr».",
    },
    {
      id: "zh-phon-hsk2-m4-e3",
      type: "multiple-choice",
      skill: "Erhua",
      instruction: "Elige la respuesta correcta.",
      question: "¿En qué palabra 儿 se pronuncia como sílaba propia?",
      options: [
        opt("a", "这儿 (aquí)", false, "Aquí 儿 es solo una -r: zhèr."),
        opt("b", "儿子 (hijo)", true, "Correcto: érzi, 儿 significa «hijo»."),
        opt("c", "一会儿 (un rato)", false, "Aquí es 儿化: yíhuìr."),
      ],
      explanation: "En 儿子 érzi y 女儿 nǚ'ér, 儿 tiene significado propio y es una sílaba completa.",
    },
  ],
};

const hsk2Minimal: PhoneticsModule = {
  id: "zh-phon-hsk2-m5",
  level: "HSK2",
  order: 5,
  title: "Pares de sonidos que se confunden",
  nativeTitle: zh("辨音:biàn-yīn"),
  summary: "Entrena el oído con parejas que solo se diferencian en un rasgo.",
  objectives: [
    "Distinguir aspiradas y no aspiradas",
    "Diferenciar retroflejas, dentales y palatales",
    "Distinguir ü/u y -n/-ng",
  ],
  estimatedMinutes: 15,
  blocks: [
    {
      kind: "minimal-pairs",
      title: "Pares mínimos",
      intro: "Escucha las dos palabras de cada pareja varias veces y repítelas exagerando la diferencia.",
      pairs: [
        { contrast: "b / p (soplo)", a: ex("包", "bāo", "bolsa"), b: ex("抛", "pāo", "lanzar") },
        { contrast: "d / t (soplo)", a: ex("肚", "dù", "barriga"), b: ex("兔", "tù", "conejo") },
        { contrast: "z / c (soplo)", a: ex("早", "zǎo", "temprano"), b: ex("草", "cǎo", "hierba") },
        { contrast: "zh / ch (soplo)", a: ex("知", "zhī", "saber"), b: ex("吃", "chī", "comer") },
        { contrast: "sh / s (retrofleja / dental)", a: ex("是", "shì", "ser"), b: ex("四", "sì", "cuatro") },
        { contrast: "zh / j (retrofleja / palatal)", a: ex("知", "zhī", "saber"), b: ex("鸡", "jī", "pollo") },
        { contrast: "sh / x (retrofleja / palatal)", a: ex("诗", "shī", "poema"), b: ex("西", "xī", "oeste") },
        { contrast: "u / ü", a: ex("路", "lù", "camino"), b: ex("绿", "lǜ", "verde") },
        { contrast: "-n / -ng", a: ex("山", "shān", "montaña"), b: ex("商", "shāng", "comercio") },
        { contrast: "-in / -ing", a: ex("金", "jīn", "oro"), b: ex("京", "jīng", "capital") },
      ],
    },
    {
      kind: "note",
      variant: "tip",
      title: "Trucos rápidos",
      body: "Soplo: pon un papel delante de la boca; con p, t, k, q, ch y c debe moverse. Retroflejas: curva la punta de la lengua hacia el paladar. Palatales (j q x): sonríe un poco y apoya la punta de la lengua detrás de los dientes inferiores.",
    },
  ],
  exercises: [
    listen("zh-phon-hsk2-m5-e1", "Pares mínimos", "四", "¿Qué palabra oyes?", [
      opt("a", "是", false, "是 shì es retrofleja (lengua curvada); lo que suena es dental.", "shì"),
      opt("b", "四", true, "Correcto: s dental, lengua detrás de los dientes.", "sì"),
    ], "四 sì «cuatro» (dental) frente a 是 shì «ser» (retrofleja). Los dos son 4.º tono: solo cambia la consonante."),
    listen("zh-phon-hsk2-m5-e2", "Pares mínimos", "吃", "¿Qué palabra oyes?", [
      opt("a", "知", false, "知 zhī no lleva soplo.", "zhī"),
      opt("b", "吃", true, "Sí: ch es la retrofleja con soplo.", "chī"),
    ], "吃 chī «comer» lleva soplo; 知 zhī «saber» no."),
    listen("zh-phon-hsk2-m5-e3", "Pares mínimos", "西", "¿Qué palabra oyes?", [
      opt("a", "西", true, "Correcto: x, con la lengua plana.", "xī"),
      opt("b", "诗", false, "诗 shī se hace con la lengua curvada hacia atrás.", "shī"),
    ], "西 xī «oeste» (palatal, lengua plana) frente a 诗 shī «poema» (retrofleja)."),
    listen("zh-phon-hsk2-m5-e4", "Pares mínimos", "绿", "¿Qué palabra oyes?", [
      opt("a", "路", false, "路 lù lleva u, más grave.", "lù"),
      opt("b", "绿", true, "Sí: ü, labios redondeados y lengua de «i».", "lǜ"),
    ], "绿 lǜ «verde» lleva ü; 路 lù «camino» lleva u."),
    listen("zh-phon-hsk2-m5-e5", "Pares mínimos", "京", "¿Qué palabra oyes?", [
      opt("a", "金", false, "金 jīn termina en -n.", "jīn"),
      opt("b", "京", true, "Correcto: termina en -ng (como en 北京 Běijīng).", "jīng"),
    ], "京 jīng «capital» acaba en -ng; 金 jīn «oro» acaba en -n."),
    listen("zh-phon-hsk2-m5-e6", "Pares mínimos", "草", "¿Qué palabra oyes?", [
      opt("a", "早", false, "早 zǎo no lleva soplo.", "zǎo"),
      opt("b", "草", true, "Sí: c es «ts» con soplo.", "cǎo"),
    ], "草 cǎo «hierba» (con soplo) frente a 早 zǎo «temprano» (sin soplo)."),
  ],
};

// ─── Registro ─────────────────────────────────────────────────────────────────

export const PHONETICS_BY_LEVEL: Partial<Record<HSKLevel, PhoneticsModule[]>> = {
  HSK1: [hsk1Tones, hsk1Initials, hsk1Finals, hsk1Spelling, hsk1Sandhi],
  HSK2: [hsk2Neutral, hsk2Pairs, hsk2Sandhi, hsk2Erhua, hsk2Minimal],
};

/**
 * Vista de un módulo como `Lesson` (sin teoría ni vocabulario) para reutilizar el
 * motor de práctica, el registro de errores y el repaso del libro.
 */
export function phoneticsLesson(module: PhoneticsModule): Lesson {
  return {
    id: module.id,
    unitId: `zh-phon-${module.level.toLowerCase()}`,
    order: module.order,
    title: `Fonética: ${module.title}`,
    nativeTitle: module.nativeTitle,
    summary: module.summary,
    objectives: module.objectives,
    estimatedMinutes: module.estimatedMinutes,
    theory: [],
    vocabulary: [],
    dialogues: [],
    exercises: module.exercises,
  };
}

/** Unidad y curso sintéticos de fonética (no forman parte del libro de clase). */
export function phoneticsCourse(level: HSKLevel): Course | undefined {
  const modules = PHONETICS_BY_LEVEL[level];
  if (!modules) return undefined;
  const unit: Unit = {
    id: `zh-phon-${level.toLowerCase()}`,
    language: "zh",
    level,
    order: 0,
    title: "Fonética",
    description: "Pronunciación y pinyin para principiantes.",
    status: "available",
    lessons: modules.map(phoneticsLesson),
  };
  return { language: "zh", level, title: `Fonética · ${level}`, units: [unit] };
}
