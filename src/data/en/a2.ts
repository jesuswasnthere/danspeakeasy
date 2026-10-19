import { en } from "@/lib/richText";
import type { Unit } from "@/types/learning";

/**
 * Inglés A2 · Unidad 1 — My weekend
 * Past simple (regular, irregular, was/were) y contar un viaje con secuenciadores.
 */
export const a2Unit1: Unit = {
  id: "en-a2-u1",
  language: "en",
  level: "A2",
  order: 1,
  title: "Mi fin de semana",
  nativeTitle: "My weekend",
  description: "Cuenta qué hiciste el fin de semana, dónde estabas y cómo fue tu último viaje.",
  status: "available",
  lessons: [
    // ─────────────────────────────────────────────────────────────── Lesson 1
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

    // ─────────────────────────────────────────────────────────────── Lesson 2
    {
      id: "en-a2-u1-l2",
      unitId: "en-a2-u1",
      order: 2,
      title: "¿Dónde estabas?",
      nativeTitle: "Where were you?",
      summary: "Was / were, expresiones de tiempo pasado (ago, last, yesterday) y la pronunciación de -ed.",
      objectives: [
        "Usar was / were en afirmativa, negativa y pregunta",
        "Situar acciones con ago, last, yesterday",
        "Pronunciar bien la terminación -ed (/t/, /d/, /ɪd/)",
        "Describir cómo fue algo: It was great / boring",
      ],
      estimatedMinutes: 20,
      theory: [
        {
          kind: "grammar",
          title: "Past simple de to be",
          pattern: "I / he / she / it was · you / we / they were",
          explanation:
            "To be no usa did: forma sus preguntas y negativas por sí mismo, igual que en presente. Negativas: wasn't, weren't. Preguntas: Was she…? Were you…?",
          examples: [
            { text: "I was at home last night.", translation: "Anoche estuve en casa." },
            { text: "Were you at the party? — No, I wasn't.", translation: "¿Estuviste en la fiesta? — No." },
            { text: "The tickets weren't expensive.", translation: "Las entradas no eran caras." },
          ],
        },
        {
          kind: "note",
          variant: "warning",
          title: "Nunca «did + be»",
          body:
            "*Did you be tired?* ✗ → Were you tired? ✓. *I didn't was there* ✗ → I wasn't there ✓. Con be no hay auxiliar did.",
        },
        {
          kind: "table",
          title: "Expresiones de tiempo pasado",
          headers: ["Inglés", "Español", "Posición"],
          rows: [
            ["yesterday / yesterday morning", "ayer / ayer por la mañana", "sin preposición"],
            ["last night / week / year", "anoche / la semana pasada / el año pasado", "sin the ni in"],
            ["three days ago", "hace tres días", "ago va DETRÁS"],
            ["in 2020 / in July", "en 2020 / en julio", "con in"],
            ["on Monday", "el lunes", "con on"],
          ],
          caption: "*the last week* o *ago three days* son errores típicos.",
        },
        {
          kind: "table",
          title: "Pronunciación de -ed",
          headers: ["Sonido", "Cuándo", "Ejemplos"],
          rows: [
            ["/t/", "tras sonido sordo (p, k, s, sh, ch, f)", "walked, stopped, watched"],
            ["/d/", "tras sonido sonoro o vocal", "played, lived, cleaned"],
            ["/ɪd/", "tras t o d (sílaba extra)", "wanted, visited, needed"],
          ],
          caption: "Solo /ɪd/ añade una sílaba: «watched» es UNA sílaba, no «wat-ched».",
        },
      ],
      vocabulary: [
        { id: "en-a2-yesterday", term: "yesterday", ipa: "/ˈjestərdeɪ/", meaning: "ayer", partOfSpeech: "adverbio", example: { text: "Where were you yesterday?", translation: "¿Dónde estuviste ayer?" } },
        { id: "en-a2-ago", term: "ago", ipa: "/əˈɡoʊ/", meaning: "hace (tiempo)", partOfSpeech: "adverbio", example: { text: "I started this job two years ago.", translation: "Empecé en este trabajo hace dos años." } },
        { id: "en-a2-last-night", term: "last night", ipa: "/læst naɪt/", meaning: "anoche", partOfSpeech: "expresión", example: { text: "Last night was fun.", translation: "Anoche fue divertido." } },
        { id: "en-a2-party", term: "party", ipa: "/ˈpɑːrti/", meaning: "fiesta", partOfSpeech: "sustantivo", example: { text: "The party was at Mia's house.", translation: "La fiesta fue en casa de Mia." } },
        { id: "en-a2-tired", term: "tired", ipa: "/taɪərd/", meaning: "cansado/a", partOfSpeech: "adjetivo", example: { text: "I was very tired after work.", translation: "Estaba muy cansado después del trabajo." } },
        { id: "en-a2-boring", term: "boring", ipa: "/ˈbɔːrɪŋ/", meaning: "aburrido (que aburre)", partOfSpeech: "adjetivo", example: { text: "The film was boring.", translation: "La película fue aburrida." }, note: "bored = aburrido (que se aburre): I was bored." },
        { id: "en-a2-crowded", term: "crowded", ipa: "/ˈkraʊdɪd/", meaning: "abarrotado, lleno de gente", partOfSpeech: "adjetivo", example: { text: "The bar was really crowded.", translation: "El bar estaba llenísimo." } },
        { id: "en-a2-stay-in", term: "stay in", ipa: "/steɪ ɪn/", meaning: "quedarse en casa", partOfSpeech: "phrasal verb", example: { text: "I stayed in and watched TV.", translation: "Me quedé en casa viendo la tele." } },
      ],
      dialogues: [
        {
          id: "en-a2-u1-l2-d1",
          title: "I called you!",
          context: "Jake intentó llamar a su amiga Nora el viernes y ella no contestó.",
          speakers: [
            { name: "Jake", role: "amigo" },
            { name: "Nora", role: "amiga" },
          ],
          lines: [
            { speaker: "Jake", text: "Where were you on Friday night? I called you three times!", translation: "¿Dónde estabas el viernes por la noche? ¡Te llamé tres veces!" },
            { speaker: "Nora", text: "Sorry! I was at a concert with my sister.", translation: "¡Perdona! Estaba en un concierto con mi hermana." },
            { speaker: "Jake", text: "Oh, nice. Was it good?", translation: "Ah, qué bien. ¿Estuvo bien?" },
            { speaker: "Nora", text: "The band was amazing, but the place was really crowded.", translation: "El grupo fue increíble, pero el sitio estaba abarrotado." },
            { speaker: "Jake", text: "Were the tickets expensive?", translation: "¿Las entradas eran caras?" },
            { speaker: "Nora", text: "No, they weren't. I bought them two months ago. And you? Did you go out?", translation: "No. Las compré hace dos meses. ¿Y tú? ¿Saliste?" },
            { speaker: "Jake", text: "No, I stayed in. I was too tired after work.", translation: "No, me quedé en casa. Estaba demasiado cansado después del trabajo." },
          ],
        },
      ],
      exercises: [
        {
          id: "en-a2-u1-l2-e1",
          type: "fill-blank",
          skill: "Was / were",
          instruction: "Elige was o were.",
          before: "My parents",
          after: "in Italy last summer.",
          translation: "Mis padres estuvieron en Italia el verano pasado.",
          options: [
            { value: "were", feedback: "¡Correcto! my parents = they → were." },
            { value: "was", feedback: "was va con I, he, she, it. Mis padres son plural." },
          ],
          accepted: ["were"],
          explanation: "I / he / she / it → was · you / we / they → were.",
        },
        {
          id: "en-a2-u1-l2-e2",
          type: "multiple-choice",
          skill: "Was / were: preguntas",
          instruction: "¿Qué pregunta es correcta?",
          question: "«¿Estabas cansado?»",
          options: [
            { id: "a", text: "Were you tired?", correct: true, feedback: "Correcto: be forma la pregunta sin did." },
            { id: "b", text: "Did you be tired?", correct: false, feedback: "be nunca usa did." },
            { id: "c", text: "Was you tired?", correct: false, feedback: "Con you siempre were." },
          ],
          explanation: "Pregunta con be en pasado: Was/Were + sujeto…?",
        },
        {
          id: "en-a2-u1-l2-e3",
          type: "sentence-builder",
          skill: "Ago",
          instruction: "Ordena las palabras.",
          prompt: "Llegué hace tres días.",
          blocks: en("I", "arrived", "three", "days", "ago"),
          solutions: [[0, 1, 2, 3, 4]],
          explanation: "ago va DETRÁS de la cantidad de tiempo: three days ago.",
        },
        {
          id: "en-a2-u1-l2-e4",
          type: "multiple-choice",
          skill: "Expresiones de tiempo",
          instruction: "Elige la opción correcta.",
          question: "«Fui a Londres la semana pasada.»",
          options: [
            { id: "a", text: "I went to London last week.", correct: true, feedback: "¡Bien! last week, sin artículo ni preposición." },
            { id: "b", text: "I went to London the last week.", correct: false, feedback: "No se usa the con last week en este sentido." },
            { id: "c", text: "I went to London in last week.", correct: false, feedback: "last + tiempo no lleva preposición." },
          ],
          explanation: "last night / last week / last year: sin the ni in.",
        },
        {
          id: "en-a2-u1-l2-e5",
          type: "multiple-choice",
          skill: "Pronunciación de -ed",
          instruction: "Escucha. ¿Qué verbo tiene una sílaba extra /ɪd/?",
          question: "Elige el verbo que suena con /ɪd/.",
          audioText: "walked. played. visited.",
          options: [
            { id: "a", text: "visited", correct: true, feedback: "¡Eso es! Termina en t → /ɪd/: vi-si-ted." },
            { id: "b", text: "walked", correct: false, feedback: "walked suena /wɔːkt/: una sola sílaba." },
            { id: "c", text: "played", correct: false, feedback: "played suena /pleɪd/: una sola sílaba." },
          ],
          explanation: "-ed suena /ɪd/ solo tras t o d: wanted, visited, needed.",
        },
        {
          id: "en-a2-u1-l2-e6",
          type: "fill-blank",
          skill: "Boring / bored",
          instruction: "Elige el adjetivo correcto.",
          before: "The film was so long. I was really",
          after: ".",
          translation: "La película era muy larga. Estaba muy aburrido.",
          options: [
            { value: "bored", feedback: "¡Correcto! -ed describe cómo te sientes tú." },
            { value: "boring", feedback: "-ing describe la cosa que aburre (the film was boring)." },
          ],
          accepted: ["bored"],
          explanation: "bored = cómo me siento · boring = cómo es algo.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── Lesson 3
    {
      id: "en-a2-u1-l3",
      unitId: "en-a2-u1",
      order: 3,
      title: "Mi último viaje",
      nativeTitle: "My last trip",
      summary: "Preguntas con wh- en pasado y secuenciadores para contar un viaje en orden.",
      objectives: [
        "Hacer preguntas en pasado: Where did you go? How long did you stay?",
        "Ordenar un relato con first, then, after that, finally",
        "Hablar de transporte y alojamiento",
        "Distinguir preguntas de sujeto (Who called?) de las de objeto",
      ],
      estimatedMinutes: 25,
      theory: [
        {
          kind: "grammar",
          title: "Preguntas wh- en pasado",
          pattern: "Wh- word + did + subject + base verb?",
          explanation:
            "La palabra interrogativa va primero, luego did, el sujeto y el verbo en forma base. Con was/were no hay did: Where were you? How was the hotel?",
          examples: [
            { text: "Where did you go on holiday?", translation: "¿Adónde fuiste de vacaciones?" },
            { text: "How long did you stay?", translation: "¿Cuánto tiempo te quedaste?" },
            { text: "How was the food?", translation: "¿Qué tal la comida?" },
          ],
        },
        {
          kind: "note",
          variant: "grammar",
          title: "Preguntas de sujeto: sin did",
          body:
            "Si who o what es el SUJETO (la persona o cosa que hace la acción), no se usa did: Who called you? (¿Quién te llamó?) · What happened? (¿Qué pasó?). Compara: Who did you call? (¿A quién llamaste?).",
        },
        {
          kind: "grammar",
          title: "Secuenciadores",
          pattern: "First, … · Then, … · After that, … · Finally, …",
          explanation:
            "Ayudan a contar una historia en orden. Suelen ir al principio de la frase seguidos de coma. Finally indica la última acción; para «por fin» después de esperar, se usa también finally o at last.",
          examples: [
            { text: "First, we flew to Rome. Then, we took a train to Florence.", translation: "Primero volamos a Roma. Luego tomamos un tren a Florencia." },
            { text: "After that, we rented a car. Finally, we drove back to the airport.", translation: "Después alquilamos un coche. Finalmente volvimos al aeropuerto." },
          ],
        },
        {
          kind: "table",
          title: "Transporte: preposiciones",
          headers: ["Medio", "Expresión", "Ojo"],
          rows: [
            ["avión", "by plane / fly", "We flew to Lima."],
            ["tren / autobús", "by train / by bus", "take the train"],
            ["coche", "by car / drive", "We drove to the coast."],
            ["a pie", "on foot / walk", "¡no «by foot»!"],
          ],
        },
      ],
      vocabulary: [
        { id: "en-a2-trip", term: "trip", ipa: "/trɪp/", meaning: "viaje", partOfSpeech: "sustantivo", example: { text: "How was your trip?", translation: "¿Qué tal tu viaje?" } },
        { id: "en-a2-holiday", term: "holiday", ipa: "/ˈhɑːlədeɪ/", meaning: "vacaciones", partOfSpeech: "sustantivo", example: { text: "We went on holiday to Portugal.", translation: "Fuimos de vacaciones a Portugal." }, note: "En EE. UU. se dice vacation." },
        { id: "en-a2-fly", term: "fly (flew)", ipa: "/flaɪ/ · /fluː/", meaning: "volar, ir en avión", partOfSpeech: "verbo", example: { text: "We flew to Cancún.", translation: "Volamos a Cancún." } },
        { id: "en-a2-stay", term: "stay", ipa: "/steɪ/", meaning: "alojarse, quedarse", partOfSpeech: "verbo", example: { text: "We stayed in a small hotel.", translation: "Nos alojamos en un hotel pequeño." } },
        { id: "en-a2-rent", term: "rent", ipa: "/rent/", meaning: "alquilar", partOfSpeech: "verbo", example: { text: "They rented a car.", translation: "Alquilaron un coche." } },
        { id: "en-a2-sightseeing", term: "go sightseeing", ipa: "/ɡoʊ ˈsaɪtsiːɪŋ/", meaning: "hacer turismo", partOfSpeech: "expresión", example: { text: "We went sightseeing in the old town.", translation: "Hicimos turismo por el casco antiguo." } },
        { id: "en-a2-take-photos", term: "take photos", ipa: "/teɪk ˈfoʊtoʊz/", meaning: "hacer fotos", partOfSpeech: "expresión", example: { text: "I took a lot of photos.", translation: "Hice muchas fotos." } },
        { id: "en-a2-finally", term: "finally", ipa: "/ˈfaɪnəli/", meaning: "finalmente, por fin", partOfSpeech: "adverbio", example: { text: "Finally, we got home at midnight.", translation: "Finalmente llegamos a casa a medianoche." } },
      ],
      dialogues: [
        {
          id: "en-a2-u1-l3-d1",
          title: "Back from Scotland",
          context: "Irene vuelve de vacaciones y su compañero Raj le pregunta por el viaje.",
          speakers: [
            { name: "Raj", role: "compañero" },
            { name: "Irene", role: "compañera" },
          ],
          lines: [
            { speaker: "Raj", text: "Welcome back! Where did you go?", translation: "¡Bienvenida! ¿Adónde fuiste?" },
            { speaker: "Irene", text: "We went to Scotland. First, we flew to Edinburgh and went sightseeing.", translation: "Fuimos a Escocia. Primero volamos a Edimburgo e hicimos turismo." },
            { speaker: "Raj", text: "How long did you stay there?", translation: "¿Cuánto tiempo os quedasteis allí?" },
            { speaker: "Irene", text: "Three days. Then we rented a car and drove to the Highlands.", translation: "Tres días. Luego alquilamos un coche y fuimos a las Tierras Altas." },
            { speaker: "Raj", text: "Wow! How was the weather?", translation: "¡Hala! ¿Qué tal el tiempo?" },
            { speaker: "Irene", text: "Terrible! It rained every day. But the views were beautiful, and I took hundreds of photos.", translation: "¡Horrible! Llovió todos los días. Pero las vistas eran preciosas e hice cientos de fotos." },
            { speaker: "Raj", text: "Who went with you?", translation: "¿Quién fue contigo?" },
            { speaker: "Irene", text: "My boyfriend. After that, we visited his family in Glasgow.", translation: "Mi novio. Después visitamos a su familia en Glasgow." },
          ],
        },
      ],
      exercises: [
        {
          id: "en-a2-u1-l3-e1",
          type: "sentence-builder",
          skill: "Preguntas wh- en pasado",
          instruction: "Ordena la pregunta. Sobra una palabra.",
          prompt: "¿Dónde te alojaste?",
          blocks: en("Where", "did", "you", "stay", "stayed"),
          solutions: [[0, 1, 2, 3]],
          explanation: "Wh- + did + sujeto + verbo base. stayed sobra: did ya marca el pasado.",
        },
        {
          id: "en-a2-u1-l3-e2",
          type: "multiple-choice",
          skill: "Preguntas de sujeto",
          instruction: "Elige la pregunta correcta.",
          question: "«¿Qué pasó?»",
          options: [
            { id: "a", text: "What happened?", correct: true, feedback: "Correcto: what es el sujeto, así que no hay did." },
            { id: "b", text: "What did happen?", correct: false, feedback: "Solo se usaría para dar énfasis; la pregunta neutra no lleva did." },
            { id: "c", text: "What did happened?", correct: false, feedback: "Doble pasado: did + happened es siempre incorrecto." },
          ],
          explanation: "Cuando who/what es el sujeto, el verbo va en pasado directamente: Who called? What happened?",
        },
        {
          id: "en-a2-u1-l3-e3",
          type: "fill-blank",
          skill: "Transporte",
          instruction: "Completa con la preposición correcta.",
          before: "The hotel was close, so we went",
          after: "foot.",
          translation: "El hotel estaba cerca, así que fuimos a pie.",
          options: [
            { value: "on", feedback: "¡Bien! on foot = a pie." },
            { value: "by", feedback: "by se usa con vehículos (by car, by bus), pero a pie es on foot." },
            { value: "with", feedback: "with no se usa para medios de transporte." },
          ],
          accepted: ["on"],
          explanation: "by car / by train / by plane… pero on foot.",
        },
        {
          id: "en-a2-u1-l3-e4",
          type: "fill-blank",
          skill: "Past simple irregular",
          instruction: "Escribe el past simple de take.",
          before: "I",
          after: "a lot of photos in Edinburgh.",
          translation: "Hice muchas fotos en Edimburgo.",
          accepted: ["took"],
          hint: "Irregular: t-o-o-…",
          explanation: "take → took. Otros: fly → flew, drive → drove.",
        },
        {
          id: "en-a2-u1-l3-e5",
          type: "multiple-choice",
          skill: "Secuenciadores",
          instruction: "Escucha y responde.",
          question: "¿Qué hicieron justo después de llegar?",
          audioText: "First, we checked into the hotel. Then, we had lunch by the river. Finally, we went to a museum.",
          options: [
            { id: "a", text: "Comer junto al río", correct: true, feedback: "¡Eso es! Then, we had lunch by the river." },
            { id: "b", text: "Ir a un museo", correct: false, feedback: "Eso fue lo último (finally)." },
            { id: "c", text: "Alquilar un coche", correct: false, feedback: "No se menciona." },
          ],
          explanation: "First → Then → Finally marcan el orden de las acciones.",
        },
        {
          id: "en-a2-u1-l3-e6",
          type: "multiple-choice",
          skill: "Was / were en preguntas",
          instruction: "Elige la pregunta correcta.",
          question: "«¿Qué tal fue el hotel?»",
          options: [
            { id: "a", text: "How was the hotel?", correct: true, feedback: "Correcto: How + was + sujeto." },
            { id: "b", text: "How did the hotel be?", correct: false, feedback: "be nunca va con did." },
            { id: "c", text: "How the hotel was?", correct: false, feedback: "En la pregunta el verbo va antes del sujeto." },
          ],
          explanation: "How was…? es la forma natural de preguntar por una experiencia pasada.",
        },
      ],
    },
  ],
};

export const a2Units: Unit[] = [a2Unit1];
