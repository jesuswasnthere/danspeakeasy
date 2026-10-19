/**
 * Aula de inglés por nivel: misiones semanales, compañeros y tablón (mock).
 * B1 vive en `src/data/classroom.ts`; aquí se añaden su tercer set y el resto de niveles.
 */
import type { CEFRLevel, Classmate, WeeklyMission } from "@/types/learning";
import type { MissionSet, MockPost } from "../classroom";

/** Lectura + escucha + gramática + participación, con los ids `<nivel>-w<set>-<tipo>`. */
function set(
  prefix: string,
  theme: string,
  reading: Omit<Extract<WeeklyMission, { kind: "reading" }>, "id" | "kind" | "description" | "xp">,
  listening: Omit<Extract<WeeklyMission, { kind: "listening" }>, "id" | "kind" | "description" | "xp" | "minPlays">,
  grammar: { targetCorrect: number; focus: string },
  participation: { prompt: string; promptTranslation: string; minLength: number; description: string },
): MissionSet {
  return {
    theme,
    missions: [
      { id: `${prefix}-reading`, kind: "reading", description: "Lee el texto y responde a la pregunta.", xp: 30, ...reading },
      { id: `${prefix}-listening`, kind: "listening", description: "Escucha el audio al menos 2 veces y responde.", xp: 30, minPlays: 2, ...listening },
      {
        id: `${prefix}-grammar`,
        kind: "grammar",
        title: `Grammar: ${grammar.targetCorrect} correct answers`,
        description: `Acierta ${grammar.targetCorrect} ejercicios del Libro de Clase esta semana.`,
        xp: 40,
        ...grammar,
      },
      { id: `${prefix}-participation`, kind: "participation", title: "Join the discussion", xp: 50, ...participation },
    ],
  };
}

export const EN_MISSION_SETS: Partial<Record<CEFRLevel, MissionSet[]>> = {
  // ── A1
  A1: [
    set(
      "a1-wA",
      "Nice to meet you",
      {
        title: "Reading: My new classmate",
        passage: {
          title: "My new classmate",
          text: "This is Yuki. She's twenty-two and she's from Osaka, in Japan. She's a student. Her brother is a doctor in Tokyo. Yuki's English is very good!",
          translation: "Esta es Yuki. Tiene veintidós años y es de Osaka, en Japón. Es estudiante. Su hermano es médico en Tokio. ¡El inglés de Yuki es muy bueno!",
        },
        question: {
          id: "a1-wA-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "How old is Yuki?",
          options: [
            { id: "a", text: "22", correct: true, feedback: "Correct: «she's twenty-two»." },
            { id: "b", text: "32", correct: false, feedback: "thirty-two would be 32." },
            { id: "c", text: "12", correct: false, feedback: "twelve would be 12." },
          ],
          explanation: "La edad se dice con be: she's twenty-two.",
        },
      },
      {
        title: "Listening: Spell it!",
        audioText: "Hi, my name's Peter. That's P, E, T, E, R. I'm from Ireland.",
        transcript: "Hi, my name's Peter. That's P, E, T, E, R. I'm from Ireland.",
        translation: "Hola, me llamo Peter. Se escribe P, E, T, E, R. Soy de Irlanda.",
        question: {
          id: "a1-wA-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "Where is Peter from?",
          options: [
            { id: "a", text: "Ireland", correct: true, feedback: "Yes: «I'm from Ireland»." },
            { id: "b", text: "Iceland", correct: false, feedback: "Listen again: Ireland." },
            { id: "c", text: "England", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "I'm from + país.",
        },
      },
      { targetCorrect: 5, focus: "Verbo to be y posesivos" },
      {
        description: "Preséntate a tus compañeros.",
        prompt: "Introduce yourself: your name, age, country and job.",
        promptTranslation: "Preséntate: nombre, edad, país y trabajo.",
        minLength: 25,
      },
    ),
    set(
      "a1-wB",
      "My family",
      {
        title: "Reading: Carlos's family",
        passage: {
          title: "Carlos's family",
          text: "Hi! I'm Carlos. I'm from Mexico. My wife is Ana. She's a teacher. Our children are Leo and Sara. Leo is eight and Sara is five. They aren't at school today.",
          translation: "¡Hola! Soy Carlos. Soy de México. Mi mujer es Ana. Es profesora. Nuestros hijos son Leo y Sara. Leo tiene ocho años y Sara cinco. Hoy no están en el colegio.",
        },
        question: {
          id: "a1-wB-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "What is Ana's job?",
          options: [
            { id: "a", text: "She's a teacher.", correct: true, feedback: "Correct." },
            { id: "b", text: "She's a doctor.", correct: false, feedback: "Not mentioned." },
            { id: "c", text: "She's a student.", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "My wife is Ana. She's a teacher.",
        },
      },
      {
        title: "Listening: phone number",
        audioText: "My phone number is six, five, oh, two, nine, eight, one.",
        transcript: "My phone number is six, five, oh, two, nine, eight, one.",
        translation: "Mi número de teléfono es seis, cinco, cero, dos, nueve, ocho, uno.",
        question: {
          id: "a1-wB-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "What's the number?",
          options: [
            { id: "a", text: "650 2981", correct: true, feedback: "Yes! «oh» = 0." },
            { id: "b", text: "655 2981", correct: false, feedback: "The third digit is «oh» (0)." },
            { id: "c", text: "650 2918", correct: false, feedback: "Listen to the end again." },
          ],
          explanation: "En los teléfonos el 0 se suele decir «oh».",
        },
      },
      { targetCorrect: 6, focus: "Números, edad y a / an" },
      {
        description: "Habla de tu familia.",
        prompt: "Write about two people in your family: their names, ages and jobs.",
        promptTranslation: "Escribe sobre dos personas de tu familia: nombre, edad y trabajo.",
        minLength: 30,
      },
    ),
  ],

  // ── A2
  A2: [
    set(
      "a2-wA",
      "Weekend stories",
      {
        title: "Reading: A rainy Saturday",
        passage: {
          title: "A rainy Saturday",
          text: "Last Saturday it rained all day, so I stayed in. In the morning I cleaned the flat. Then I watched two films. In the evening my friend Jo came round and we cooked pasta. It wasn't exciting, but I was very relaxed.",
          translation: "El sábado pasado llovió todo el día, así que me quedé en casa. Por la mañana limpié el piso. Luego vi dos películas. Por la noche vino mi amiga Jo y cocinamos pasta. No fue emocionante, pero estaba muy relajada.",
        },
        question: {
          id: "a2-wA-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "What did the writer do first?",
          options: [
            { id: "a", text: "Cleaned the flat", correct: true, feedback: "Correct: «In the morning I cleaned the flat»." },
            { id: "b", text: "Watched films", correct: false, feedback: "That came next (Then…)." },
            { id: "c", text: "Cooked pasta", correct: false, feedback: "That was in the evening." },
          ],
          explanation: "In the morning → Then → In the evening.",
        },
      },
      {
        title: "Listening: Where were you?",
        audioText: "I wasn't at work yesterday because I was at the dentist. It was horrible!",
        transcript: "I wasn't at work yesterday because I was at the dentist. It was horrible!",
        translation: "Ayer no estuve en el trabajo porque estaba en el dentista. ¡Fue horrible!",
        question: {
          id: "a2-wA-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "Where was the speaker yesterday?",
          options: [
            { id: "a", text: "At the dentist", correct: true, feedback: "Yes." },
            { id: "b", text: "At work", correct: false, feedback: "«I wasn't at work»." },
            { id: "c", text: "At home", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "wasn't = was not.",
        },
      },
      { targetCorrect: 6, focus: "Past simple y was / were" },
      {
        description: "Cuenta tu fin de semana.",
        prompt: "What did you do last weekend? Use at least three verbs in the past simple.",
        promptTranslation: "¿Qué hiciste el fin de semana pasado? Usa al menos tres verbos en pasado.",
        minLength: 35,
      },
    ),
    set(
      "a2-wB",
      "Holidays",
      {
        title: "Reading: Postcard from Lisbon",
        passage: {
          title: "Postcard from Lisbon",
          text: "Hi Mum! We arrived in Lisbon three days ago. First, we went sightseeing in the old town. Then we took a tram to Belém and ate the famous custard tarts. The weather was perfect. See you on Sunday!",
          translation: "¡Hola, mamá! Llegamos a Lisboa hace tres días. Primero hicimos turismo por el casco antiguo. Luego cogimos un tranvía a Belém y comimos los famosos pasteles de nata. El tiempo fue perfecto. ¡Nos vemos el domingo!",
        },
        question: {
          id: "a2-wB-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "How did they get to Belém?",
          options: [
            { id: "a", text: "By tram", correct: true, feedback: "Correct: «we took a tram»." },
            { id: "b", text: "On foot", correct: false, feedback: "Not mentioned." },
            { id: "c", text: "By car", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "take a tram = coger un tranvía.",
        },
      },
      {
        title: "Listening: How was the trip?",
        audioText: "The hotel was great, but the flight was terrible. We waited four hours at the airport!",
        transcript: "The hotel was great, but the flight was terrible. We waited four hours at the airport!",
        translation: "El hotel fue genial, pero el vuelo fue horrible. ¡Esperamos cuatro horas en el aeropuerto!",
        question: {
          id: "a2-wB-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "What was the problem?",
          options: [
            { id: "a", text: "The flight", correct: true, feedback: "Yes: they waited four hours." },
            { id: "b", text: "The hotel", correct: false, feedback: "The hotel was great." },
            { id: "c", text: "The food", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "but introduce el contraste: great ↔ terrible.",
        },
      },
      { targetCorrect: 8, focus: "Preguntas en pasado y secuenciadores" },
      {
        description: "Comparte tu mejor viaje.",
        prompt: "Describe your best trip. Use first, then and after that.",
        promptTranslation: "Describe tu mejor viaje. Usa first, then y after that.",
        minLength: 40,
      },
    ),
  ],

  // ── B2
  B2: [
    set(
      "b2-wA",
      "The future of work",
      {
        title: "Reading: The four-day week",
        passage: {
          title: "The four-day week",
          text: "Although many managers were sceptical, the trial was a success. Despite working fewer hours, employees completed the same amount of work. However, some departments, such as customer service, struggled to cover every shift, whereas office teams adapted easily.",
          translation: "Aunque muchos directivos eran escépticos, la prueba fue un éxito. A pesar de trabajar menos horas, los empleados completaron la misma cantidad de trabajo. Sin embargo, algunos departamentos, como atención al cliente, tuvieron dificultades para cubrir todos los turnos, mientras que los equipos de oficina se adaptaron con facilidad.",
        },
        question: {
          id: "b2-wA-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "Which teams found the change difficult?",
          options: [
            { id: "a", text: "Customer service", correct: true, feedback: "Correct: they «struggled to cover every shift»." },
            { id: "b", text: "Office teams", correct: false, feedback: "They «adapted easily»." },
            { id: "c", text: "Managers", correct: false, feedback: "They were sceptical, but the text doesn't say they struggled." },
          ],
          explanation: "whereas contrapone dos grupos: uno con dificultades y otro sin ellas.",
        },
      },
      {
        title: "Listening: a missed chance",
        audioText: "If I had accepted that job in Berlin, I would speak fluent German by now. But I wouldn't have met my wife.",
        transcript: "If I had accepted that job in Berlin, I would speak fluent German by now. But I wouldn't have met my wife.",
        translation: "Si hubiera aceptado aquel trabajo en Berlín, ahora hablaría alemán con fluidez. Pero no habría conocido a mi mujer.",
        question: {
          id: "b2-wA-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "What is true about the speaker?",
          options: [
            { id: "a", text: "He didn't take the job in Berlin.", correct: true, feedback: "Yes: «If I had accepted» = he didn't." },
            { id: "b", text: "He speaks fluent German.", correct: false, feedback: "That's hypothetical." },
            { id: "c", text: "He met his wife in Berlin.", correct: false, feedback: "He wouldn't have met her there." },
          ],
          explanation: "Condicional mixto: pasado imaginario → presente imaginario.",
        },
      },
      { targetCorrect: 8, focus: "Conectores de contraste y condicionales" },
      {
        description: "Debate con tus compañeros.",
        prompt: "Should companies adopt a four-day week? Give a balanced opinion using although, however and on balance.",
        promptTranslation: "¿Deberían las empresas adoptar la semana de cuatro días? Da una opinión equilibrada.",
        minLength: 60,
      },
    ),
    set(
      "b2-wB",
      "Cities of tomorrow",
      {
        title: "Reading: Car-free Sundays",
        passage: {
          title: "Car-free Sundays",
          text: "Admittedly, closing the city centre to cars every Sunday angered some shop owners at first. On the other hand, footfall rose by 20% within six months. On balance, the council considers the scheme a success and plans to extend it.",
          translation: "Hay que reconocer que cerrar el centro a los coches cada domingo enfadó al principio a algunos comerciantes. Por otro lado, la afluencia de peatones subió un 20 % en seis meses. Sopesándolo todo, el ayuntamiento considera el plan un éxito y prevé ampliarlo.",
        },
        question: {
          id: "b2-wB-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "What is the council's overall view?",
          options: [
            { id: "a", text: "It's a success.", correct: true, feedback: "Correct: «On balance, the council considers the scheme a success»." },
            { id: "b", text: "It's a failure.", correct: false, feedback: "Only some shop owners were angry at first." },
            { id: "c", text: "They haven't decided.", correct: false, feedback: "They plan to extend it." },
          ],
          explanation: "On balance introduce la conclusión final.",
        },
      },
      {
        title: "Listening: polite disagreement",
        audioText: "I see where you're coming from, but I'm not entirely convinced that more bike lanes will solve the traffic problem.",
        transcript: "I see where you're coming from, but I'm not entirely convinced that more bike lanes will solve the traffic problem.",
        translation: "Entiendo tu punto de vista, pero no estoy del todo convencido de que más carriles bici vayan a resolver el problema del tráfico.",
        question: {
          id: "b2-wB-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "What is the speaker's attitude?",
          options: [
            { id: "a", text: "Polite disagreement", correct: true, feedback: "Yes: partial agreement + «not entirely convinced»." },
            { id: "b", text: "Total agreement", correct: false, feedback: "He has doubts." },
            { id: "c", text: "Angry rejection", correct: false, feedback: "The tone is diplomatic." },
          ],
          explanation: "I see where you're coming from, but… = desacuerdo cortés.",
        },
      },
      { targetCorrect: 10, focus: "Opiniones matizadas y condicionales" },
      {
        description: "Propón una mejora para tu ciudad.",
        prompt: "What one change would make your city better? If it were up to you, what would you do?",
        promptTranslation: "¿Qué cambio mejoraría tu ciudad? Si dependiera de ti, ¿qué harías?",
        minLength: 60,
      },
    ),
  ],

  // ── C1
  C1: [
    set(
      "c1-wA",
      "Workplace research",
      {
        title: "Reading: Open-plan offices",
        passage: {
          title: "Open-plan offices",
          text: "It is widely assumed that open-plan offices foster collaboration. Recent studies, however, would appear to suggest the opposite: face-to-face interaction tends to decline, as employees retreat behind headphones. These findings should, nonetheless, be treated with caution, as the samples were relatively small.",
          translation: "Se suele dar por hecho que las oficinas diáfanas fomentan la colaboración. Sin embargo, estudios recientes parecerían sugerir lo contrario: la interacción cara a cara tiende a disminuir, ya que los empleados se refugian tras los auriculares. Aun así, estos resultados deben tomarse con cautela, ya que las muestras eran relativamente pequeñas.",
        },
        question: {
          id: "c1-wA-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "How certain is the writer about the studies' conclusions?",
          options: [
            { id: "a", text: "Cautious: the evidence is limited.", correct: true, feedback: "Correct: «would appear to suggest», «treated with caution»." },
            { id: "b", text: "Completely certain.", correct: false, feedback: "Note the hedging language." },
            { id: "c", text: "The writer rejects them.", correct: false, feedback: "The writer reports them, with reservations." },
          ],
          explanation: "would appear to suggest + treated with caution = hedging.",
        },
      },
      {
        title: "Listening: crisis statement",
        audioText: "Not until the audit was completed did we realise the scale of the problem. Under no circumstances will this be allowed to happen again.",
        transcript: "Not until the audit was completed did we realise the scale of the problem. Under no circumstances will this be allowed to happen again.",
        translation: "Hasta que no se completó la auditoría no nos dimos cuenta de la magnitud del problema. Bajo ningún concepto se permitirá que vuelva a ocurrir.",
        question: {
          id: "c1-wA-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "When did they understand the problem?",
          options: [
            { id: "a", text: "After the audit", correct: true, feedback: "Yes: «Not until the audit was completed did we realise…»." },
            { id: "b", text: "Before the audit", correct: false, feedback: "Not until = only after." },
            { id: "c", text: "They still don't understand it", correct: false, feedback: "They realised the scale of it." },
          ],
          explanation: "Not until X did we… = solo después de X.",
        },
      },
      { targetCorrect: 8, focus: "Hedging e inversión" },
      {
        description: "Escribe un resumen ejecutivo.",
        prompt: "Write a short, hedged summary of a trend you've noticed in your industry or studies.",
        promptTranslation: "Escribe un breve resumen, con lenguaje matizado, de una tendencia que hayas observado en tu sector o estudios.",
        minLength: 80,
      },
    ),
    set(
      "c1-wB",
      "Formal writing",
      {
        title: "Reading: A formal reply",
        passage: {
          title: "A formal reply",
          text: "Thank you for your proposal regarding the new training scheme. Having reviewed the figures, the committee recommends that the pilot be extended to two further departments. Should you require any additional information, please do not hesitate to contact me.",
          translation: "Gracias por su propuesta sobre el nuevo programa de formación. Tras revisar las cifras, el comité recomienda que el piloto se amplíe a otros dos departamentos. Si necesita información adicional, no dude en ponerse en contacto conmigo.",
        },
        question: {
          id: "c1-wB-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "What does the committee recommend?",
          options: [
            { id: "a", text: "Extending the pilot", correct: true, feedback: "Correct: «the pilot be extended to two further departments»." },
            { id: "b", text: "Cancelling the scheme", correct: false, feedback: "The response is positive." },
            { id: "c", text: "Rewriting the proposal", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "recommend that + subjuntivo (be extended).",
        },
      },
      {
        title: "Listening: voicemail",
        audioText: "Had I received your email earlier, I would have joined the call. Could we reschedule for Thursday?",
        transcript: "Had I received your email earlier, I would have joined the call. Could we reschedule for Thursday?",
        translation: "De haber recibido antes su correo, me habría unido a la llamada. ¿Podríamos pasarla al jueves?",
        question: {
          id: "c1-wB-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "Why did the speaker miss the call?",
          options: [
            { id: "a", text: "He received the email too late.", correct: true, feedback: "Yes: «Had I received your email earlier…»." },
            { id: "b", text: "He was ill.", correct: false, feedback: "Not mentioned." },
            { id: "c", text: "He forgot.", correct: false, feedback: "He didn't know in time." },
          ],
          explanation: "Had I + participio = If I had + participio.",
        },
      },
      { targetCorrect: 10, focus: "Registro formal y condicionales invertidos" },
      {
        description: "Redacta un párrafo formal.",
        prompt: "Write the «Proposal» section of a short business proposal: what do you recommend and why?",
        promptTranslation: "Redacta la sección «Proposal» de una propuesta breve: ¿qué recomiendas y por qué?",
        minLength: 80,
      },
    ),
  ],

  // ── C2
  C2: [
    set(
      "c2-wA",
      "Reading between the lines",
      {
        title: "Reading: The review",
        passage: {
          title: "The review",
          text: "The restaurant's new menu is, to put it mildly, ambitious. The beef was not without its charms, provided one enjoys chewing for some time. Dessert arrived forty minutes after it was ordered — a triumph of patience, if not of service.",
          translation: "El nuevo menú del restaurante es, por decirlo suavemente, ambicioso. La ternera no carecía de encanto, siempre que a uno le guste masticar un buen rato. El postre llegó cuarenta minutos después de pedirlo: un triunfo de la paciencia, aunque no del servicio.",
        },
        question: {
          id: "c2-wA-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "What is the critic's real opinion?",
          options: [
            { id: "a", text: "Negative, expressed ironically.", correct: true, feedback: "Correct: understatement and irony throughout." },
            { id: "b", text: "Enthusiastic.", correct: false, feedback: "Read between the lines: tough beef, slow service." },
            { id: "c", text: "Neutral.", correct: false, feedback: "The irony carries a clear judgement." },
          ],
          explanation: "«to put it mildly», «not without its charms»: atenuación irónica.",
        },
      },
      {
        title: "Listening: office chat",
        audioText: "Another meeting that could have been an email. What a wonderful use of everyone's afternoon.",
        transcript: "Another meeting that could have been an email. What a wonderful use of everyone's afternoon.",
        translation: "Otra reunión que podría haber sido un correo. Qué manera tan maravillosa de aprovechar la tarde de todos.",
        question: {
          id: "c2-wA-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "How does the speaker feel about the meeting?",
          options: [
            { id: "a", text: "It was a waste of time.", correct: true, feedback: "Yes: «wonderful use» is sarcastic." },
            { id: "b", text: "It was very productive.", correct: false, feedback: "Take the tone into account." },
            { id: "c", text: "It was too short.", correct: false, feedback: "Not suggested." },
          ],
          explanation: "Sarcasmo: el elogio literal contradice el contexto.",
        },
      },
      { targetCorrect: 8, focus: "Modismos e ironía" },
      {
        description: "Juega con el registro.",
        prompt: "Describe a recent minor disaster using British-style understatement.",
        promptTranslation: "Describe un pequeño desastre reciente usando el understatement británico.",
        minLength: 80,
      },
    ),
    set(
      "c2-wB",
      "Close reading",
      {
        title: "Reading: Opening lines",
        passage: {
          title: "Opening lines",
          text: "The town had been dying for years, though nobody had told it. Its clock still struck the hours faithfully, as if punctuality alone could keep the end at bay.",
          translation: "El pueblo llevaba años muriéndose, aunque nadie se lo había dicho. Su reloj seguía dando las horas fielmente, como si la puntualidad bastara para mantener a raya el final.",
        },
        question: {
          id: "c2-wB-reading-q",
          type: "multiple-choice",
          skill: "Reading comprehension",
          instruction: "Responde según el texto.",
          question: "Which device dominates the passage?",
          options: [
            { id: "a", text: "Personification", correct: true, feedback: "Correct: the town is «dying» and nobody «told it»." },
            { id: "b", text: "Alliteration", correct: false, feedback: "There's no notable repetition of initial sounds." },
            { id: "c", text: "Juxtaposition", correct: false, feedback: "There's contrast, but the town is treated as a living being." },
          ],
          explanation: "Personificación: el pueblo y el reloj actúan como seres vivos.",
        },
      },
      {
        title: "Listening: a lecture excerpt",
        audioText: "What makes the novel so unsettling is not the violence itself, but the narrator's calm, almost cheerful tone.",
        transcript: "What makes the novel so unsettling is not the violence itself, but the narrator's calm, almost cheerful tone.",
        translation: "Lo que hace tan inquietante la novela no es la violencia en sí, sino el tono sereno, casi alegre, del narrador.",
        question: {
          id: "c2-wB-listening-q",
          type: "multiple-choice",
          skill: "Listening comprehension",
          instruction: "Responde según el audio.",
          question: "According to the lecturer, what is most unsettling?",
          options: [
            { id: "a", text: "The narrator's tone", correct: true, feedback: "Yes: the cleft sentence puts the focus on it." },
            { id: "b", text: "The violence", correct: false, feedback: "«not the violence itself»." },
            { id: "c", text: "The ending", correct: false, feedback: "Not mentioned." },
          ],
          explanation: "What makes X so … is … = frase escindida que marca el foco.",
        },
      },
      { targetCorrect: 10, focus: "Análisis literario y frases escindidas" },
      {
        description: "Analiza un fragmento.",
        prompt: "Choose a line from a book, song or film you love and analyse its language using point–evidence–analysis.",
        promptTranslation: "Elige una frase de un libro, canción o película y analiza su lenguaje.",
        minLength: 100,
      },
    ),
  ],
};

/** Tercer set de B1 (Unidad 2: planes y condicionales). Se añade a los dos de `classroom.ts`. */
export const B1_PLANS_SET: MissionSet = set(
  "b1-wC",
  "Plans for the future",
  {
    title: "Reading: Gap year plans",
    passage: {
      title: "Gap year plans",
      text: "I'm going to take a gap year before university. I'm flying to Peru on 3 March and I'm volunteering at a school in Cusco for four months. If I save enough money, I'll travel around South America afterwards.",
      translation: "Voy a tomarme un año sabático antes de la universidad. Vuelo a Perú el 3 de marzo y voy a hacer voluntariado en una escuela de Cusco durante cuatro meses. Si ahorro suficiente dinero, después viajaré por Sudamérica.",
    },
    question: {
      id: "b1-wC-reading-q",
      type: "multiple-choice",
      skill: "Reading comprehension",
      instruction: "Responde según el texto.",
      question: "What depends on money?",
      options: [
        { id: "a", text: "Travelling around South America", correct: true, feedback: "Correct: «If I save enough money, I'll travel…»." },
        { id: "b", text: "The flight to Peru", correct: false, feedback: "That's already arranged (present continuous)." },
        { id: "c", text: "Volunteering in Cusco", correct: false, feedback: "That's arranged too." },
      ],
      explanation: "Primer condicional: la condición (if I save) determina la consecuencia (I'll travel).",
    },
  },
  {
    title: "Listening: an offer",
    audioText: "You look tired. Don't worry, I'll finish the report and send it as soon as it's ready.",
    transcript: "You look tired. Don't worry, I'll finish the report and send it as soon as it's ready.",
    translation: "Pareces cansado. Tranquilo, termino yo el informe y lo envío en cuanto esté listo.",
    question: {
      id: "b1-wC-listening-q",
      type: "multiple-choice",
      skill: "Listening comprehension",
      instruction: "Responde según el audio.",
      question: "What kind of sentence is «I'll finish the report»?",
      options: [
        { id: "a", text: "A spontaneous offer", correct: true, feedback: "Yes: will for offers decided on the spot." },
        { id: "b", text: "A fixed arrangement", correct: false, feedback: "That would be present continuous." },
        { id: "c", text: "A timetable", correct: false, feedback: "That would be present simple." },
      ],
      explanation: "will = decisión u oferta en el momento de hablar.",
    },
  },
  { targetCorrect: 8, focus: "Will, going to y primer condicional" },
  {
    description: "Comparte tus planes.",
    prompt: "What are you going to do next year? Add one thing you'll do if everything goes well.",
    promptTranslation: "¿Qué vas a hacer el año que viene? Añade algo que harás si todo sale bien.",
    minLength: 40,
  },
);

// ─── Compañeros y tablón ──────────────────────────────────────────────────────

export const EN_CLASSMATES: Classmate[] = [
  // A1
  { id: "c-a1-rocio", name: "Rocío B.", avatar: "🌻", country: "🇪🇸", level: "A1", streak: 6 },
  { id: "c-a1-hugo", name: "Hugo C.", avatar: "🐢", country: "🇵🇾", level: "A1", streak: 3 },
  { id: "c-a1-elena", name: "Elena D.", avatar: "🎨", country: "🇨🇷", level: "A1", streak: 11 },
  // A2
  { id: "c-a2-nicolas", name: "Nicolás A.", avatar: "🚲", country: "🇦🇷", level: "A2", streak: 15 },
  { id: "c-a2-carla", name: "Carla M.", avatar: "🌮", country: "🇲🇽", level: "A2", streak: 22 },
  { id: "c-a2-pablo", name: "Pablo E.", avatar: "🎧", country: "🇪🇸", level: "A2", streak: 4 },
  // B2
  { id: "c-b2-daniela", name: "Daniela O.", avatar: "🧭", country: "🇨🇱", level: "B2", streak: 31 },
  { id: "c-b2-sergio", name: "Sergio H.", avatar: "♟️", country: "🇪🇸", level: "B2", streak: 17 },
  { id: "c-b2-valeria", name: "Valeria Q.", avatar: "🌿", country: "🇵🇪", level: "B2", streak: 8 },
  // C1
  { id: "c-c1-ignacio", name: "Ignacio R.", avatar: "📈", country: "🇺🇾", level: "C1", streak: 40 },
  { id: "c-c1-ana", name: "Ana Belén S.", avatar: "🩺", country: "🇪🇸", level: "C1", streak: 13 },
  { id: "c-c1-felipe", name: "Felipe J.", avatar: "⚖️", country: "🇨🇴", level: "C1", streak: 27 },
  // C2
  { id: "c-c2-marina", name: "Marina L.", avatar: "🖋️", country: "🇦🇷", level: "C2", streak: 66 },
  { id: "c-c2-alvaro", name: "Álvaro P.", avatar: "🎭", country: "🇪🇸", level: "C2", streak: 24 },
];

export const EN_POSTS: MockPost[] = [
  // ── A1
  {
    id: "p-a1-1",
    level: "A1",
    authorId: "c-a1-elena",
    tag: "misión",
    missionId: "a1-wA-participation",
    content: "Hello! My name is Elena. I'm 29 and I'm from Costa Rica. I'm a nurse. Nice to meet you! 😊",
    likes: 5,
    hoursAgo: 4,
    replies: [{ id: "r-a1-1a", authorId: "c-a1-hugo", content: "Hi Elena! Nice to meet you too. I'm Hugo, from Paraguay.", hoursAgo: 3 }],
  },
  {
    id: "p-a1-2",
    level: "A1",
    authorId: "c-a1-hugo",
    tag: "misión",
    content: "I have 34 years and I am engineer.",
    likes: 2,
    hoursAgo: 20,
    replies: [
      {
        id: "r-a1-2a",
        authorId: "c-a1-rocio",
        content: "¡Bien! Dos detallitos 👇",
        hoursAgo: 18,
        correction: {
          original: "I have 34 years and I am engineer.",
          corrected: "I'm 34 and I'm an engineer.",
          note: "La edad va con be, y las profesiones llevan a/an (Lecciones 2 y 3).",
        },
      },
    ],
  },
  {
    id: "p-a1-3",
    level: "A1",
    authorId: "c-a1-rocio",
    tag: "recurso",
    content: "Truco: para no confundir thirteen y thirty, exagera el acento: thir-TEEN / THIR-ty. ¡Funciona! 🎯",
    likes: 7,
    hoursAgo: 46,
    replies: [],
  },
  // ── A2
  {
    id: "p-a2-1",
    level: "A2",
    authorId: "c-a2-carla",
    tag: "misión",
    missionId: "a2-wA-participation",
    content: "Last weekend I went to a wedding in Puebla. We danced all night and I ate too much cake! 🎂",
    likes: 6,
    hoursAgo: 5,
    replies: [{ id: "r-a2-1a", authorId: "c-a2-nicolas", content: "Sounds fun! Was it a big wedding?", hoursAgo: 4 }],
  },
  {
    id: "p-a2-2",
    level: "A2",
    authorId: "c-a2-pablo",
    tag: "misión",
    content: "Yesterday I didn't went to work because I was sick.",
    likes: 1,
    hoursAgo: 22,
    replies: [
      {
        id: "r-a2-2a",
        authorId: "c-a2-carla",
        content: "Hope you feel better! Small correction 👇",
        hoursAgo: 21,
        correction: {
          original: "I didn't went",
          corrected: "I didn't go",
          note: "Con didn't el verbo vuelve a su forma base (Lección 1).",
        },
      },
    ],
  },
  {
    id: "p-a2-3",
    level: "A2",
    authorId: "c-a2-nicolas",
    tag: "pregunta",
    content: "¿Por qué «watched» se pronuncia con una sílaba y «wanted» con dos? 🤔",
    likes: 4,
    hoursAgo: 50,
    replies: [
      {
        id: "r-a2-3a",
        authorId: "c-a2-carla",
        content: "Solo suena /ɪd/ (sílaba extra) cuando el verbo termina en t o d: wan-ted, nee-ded. Está en la Lección 2.",
        hoursAgo: 48,
      },
    ],
  },
  // ── B2
  {
    id: "p-b2-1",
    level: "B2",
    authorId: "c-b2-daniela",
    tag: "misión",
    missionId: "b2-wA-participation",
    content:
      "Although a four-day week sounds ideal, I'm not entirely convinced it works for every sector. Hospitals, for example, can't simply close on Fridays. On balance, I'd support it for office jobs only.",
    likes: 9,
    hoursAgo: 6,
    replies: [{ id: "r-b2-1a", authorId: "c-b2-sergio", content: "Fair point. That said, some hospitals have tried rotating shifts and it worked.", hoursAgo: 5 }],
  },
  {
    id: "p-b2-2",
    level: "B2",
    authorId: "c-b2-valeria",
    tag: "misión",
    content: "Despite it was raining, we went hiking. If we would have checked the forecast, we would have stayed at home.",
    likes: 3,
    hoursAgo: 26,
    replies: [
      {
        id: "r-b2-2a",
        authorId: "c-b2-daniela",
        content: "Great story! Two quick fixes 👇",
        hoursAgo: 24,
        correction: {
          original: "Despite it was raining… If we would have checked",
          corrected: "Although it was raining… If we had checked",
          note: "despite no va con cláusula (Lección 1) y tras if no se usa would (Lección 2).",
        },
      },
    ],
  },
  {
    id: "p-b2-3",
    level: "B2",
    authorId: "c-b2-sergio",
    tag: "recurso",
    content: "Tip: listen to a debate podcast and write down every phrase they use to disagree politely. You'll be surprised how rarely they say «you're wrong».",
    likes: 12,
    hoursAgo: 72,
    replies: [],
  },
  // ── C1
  {
    id: "p-c1-1",
    level: "C1",
    authorId: "c-c1-felipe",
    tag: "misión",
    missionId: "c1-wA-participation",
    content:
      "In the legal sector, AI tools appear to be reducing the time spent on document review, although it is too early to say whether this will translate into lower fees for clients.",
    likes: 8,
    hoursAgo: 7,
    replies: [{ id: "r-c1-1a", authorId: "c-c1-ignacio", content: "Nicely hedged! Same trend in finance, for what it's worth.", hoursAgo: 6 }],
  },
  {
    id: "p-c1-2",
    level: "C1",
    authorId: "c-c1-ana",
    tag: "misión",
    content: "Never I have seen so many patients in one week as during the flu season.",
    likes: 3,
    hoursAgo: 30,
    replies: [
      {
        id: "r-c1-2a",
        authorId: "c-c1-felipe",
        content: "Powerful sentence — just the word order 👇",
        hoursAgo: 28,
        correction: {
          original: "Never I have seen",
          corrected: "Never have I seen",
          note: "Adverbio negativo al principio → inversión (Lección 2).",
        },
      },
    ],
  },
  // ── C2
  {
    id: "p-c2-1",
    level: "C2",
    authorId: "c-c2-alvaro",
    tag: "misión",
    missionId: "c2-wA-participation",
    content:
      "Our flat flooded on Tuesday. The carpet is now, shall we say, a tad damp, and the sofa has embarked on a new career as a sponge. Not ideal.",
    likes: 14,
    hoursAgo: 9,
    replies: [{ id: "r-c2-1a", authorId: "c-c2-marina", content: "«A tad damp» — textbook understatement. Sorry about the sofa, though!", hoursAgo: 8 }],
  },
  {
    id: "p-c2-2",
    level: "C2",
    authorId: "c-c2-marina",
    tag: "recurso",
    content:
      "If you want to train your ear for irony, watch a British panel show with subtitles off. The jokes are rarely in the words alone — it's the timing and the deadpan delivery.",
    likes: 10,
    hoursAgo: 60,
    replies: [],
  },
];
