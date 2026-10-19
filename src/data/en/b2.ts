import { en } from "@/lib/richText";
import type { Unit } from "@/types/learning";

/**
 * Inglés B2 · Unidad 1 — Let's discuss
 * Conectores de contraste, segundo/tercer condicional (y mixtos) y opiniones matizadas.
 */
export const b2Unit1: Unit = {
  id: "en-b2-u1",
  language: "en",
  level: "B2",
  order: 1,
  title: "Opiniones y debate",
  nativeTitle: "Let's discuss",
  description:
    "Argumenta con conectores de contraste, imagina escenarios hipotéticos y defiende una postura sin sonar tajante.",
  status: "available",
  lessons: [
    // ─────────────────────────────────────────────────────────────── Lesson 1
    {
      id: "en-b2-u1-l1",
      unitId: "en-b2-u1",
      order: 1,
      title: "Aunque… sin embargo…",
      nativeTitle: "Linking contrast",
      summary: "Although, even though, despite, in spite of, however, whereas y nevertheless.",
      objectives: [
        "Elegir entre although / despite según lo que sigue (cláusula o sustantivo)",
        "Usar despite + -ing y despite the fact that",
        "Conectar oraciones con however y nevertheless (puntuación incluida)",
        "Comparar dos ideas con whereas / while",
      ],
      estimatedMinutes: 30,
      theory: [
        {
          kind: "table",
          title: "Qué va detrás de cada conector",
          headers: ["Conector", "Le sigue", "Ejemplo"],
          rows: [
            ["although / even though", "cláusula (sujeto + verbo)", "Although it was late, we kept working."],
            ["despite / in spite of", "sustantivo o -ing", "Despite the rain, the match went on."],
            ["despite the fact that", "cláusula", "Despite the fact that he was tired, he won."],
            ["however / nevertheless", "nueva oración (con coma)", "It's cheap. However, it isn't very good."],
            ["whereas / while", "cláusula que contrasta", "I love cities, whereas my wife prefers the countryside."],
          ],
          caption: "Even though es más enfático que although (≈ «aun cuando»).",
        },
        {
          kind: "grammar",
          title: "Despite / in spite of",
          pattern: "Despite / In spite of + noun / -ing, main clause",
          explanation:
            "Son preposiciones: no pueden ir seguidas directamente de sujeto + verbo. Si quieres una cláusula, usa although o añade the fact that. Ojo: es «despite» (sin of) pero «in spite of» (con of).",
          examples: [
            { text: "Despite having little experience, she got the job.", translation: "A pesar de tener poca experiencia, consiguió el trabajo." },
            { text: "In spite of the traffic, we arrived on time.", translation: "A pesar del tráfico, llegamos a tiempo." },
          ],
        },
        {
          kind: "grammar",
          title: "However: adverbio, no conjunción",
          pattern: "Sentence. However, sentence. / Sentence; however, sentence.",
          explanation:
            "However conecta dos ORACIONES, así que va tras punto o punto y coma, seguido de coma. No puede unir dos cláusulas con una simple coma como but. Nevertheless es más formal y subraya que algo ocurre «aun así».",
          examples: [
            { text: "The plan is ambitious. However, it's achievable.", translation: "El plan es ambicioso. Sin embargo, es alcanzable." },
            { text: "The risks were high; nevertheless, they invested.", translation: "Los riesgos eran altos; aun así, invirtieron." },
          ],
        },
        {
          kind: "note",
          variant: "warning",
          title: "Errores frecuentes",
          body:
            "*Despite of the rain* ✗ → Despite the rain ✓. *Although the rain* ✗ → Although it was raining ✓. *Although…, but…* ✗: en inglés no se combinan; elige uno de los dos.",
        },
      ],
      vocabulary: [
        { id: "en-b2-although", term: "although", ipa: "/ɔːlˈðoʊ/", meaning: "aunque", partOfSpeech: "conjunción", example: { text: "Although I agree in principle, I have some doubts.", translation: "Aunque en principio estoy de acuerdo, tengo algunas dudas." } },
        { id: "en-b2-despite", term: "despite", ipa: "/dɪˈspaɪt/", meaning: "a pesar de", partOfSpeech: "preposición", example: { text: "Despite the cost, it's worth it.", translation: "A pesar del coste, merece la pena." } },
        { id: "en-b2-whereas", term: "whereas", ipa: "/werˈæz/", meaning: "mientras que (contraste)", partOfSpeech: "conjunción", example: { text: "Some people save, whereas others spend everything.", translation: "Unos ahorran, mientras que otros lo gastan todo." } },
        { id: "en-b2-nevertheless", term: "nevertheless", ipa: "/ˌnevərðəˈles/", meaning: "no obstante, aun así", partOfSpeech: "adverbio", example: { text: "It was difficult. Nevertheless, we succeeded.", translation: "Fue difícil. Aun así, lo conseguimos." } },
        { id: "en-b2-drawback", term: "drawback", ipa: "/ˈdrɔːbæk/", meaning: "inconveniente, desventaja", partOfSpeech: "sustantivo", example: { text: "The main drawback is the price.", translation: "El principal inconveniente es el precio." } },
        { id: "en-b2-remote-work", term: "remote work", ipa: "/rɪˈmoʊt wɜːrk/", meaning: "teletrabajo", partOfSpeech: "sustantivo", example: { text: "Remote work has changed our cities.", translation: "El teletrabajo ha cambiado nuestras ciudades." } },
        { id: "en-b2-commute", term: "commute", ipa: "/kəˈmjuːt/", meaning: "trayecto al trabajo; desplazarse", partOfSpeech: "sustantivo", example: { text: "My commute takes an hour.", translation: "Tardo una hora en ir al trabajo." } },
        { id: "en-b2-isolated", term: "isolated", ipa: "/ˈaɪsəleɪtɪd/", meaning: "aislado", partOfSpeech: "adjetivo", example: { text: "Some remote workers feel isolated.", translation: "Algunos teletrabajadores se sienten aislados." } },
        { id: "en-b2-productivity", term: "productivity", ipa: "/ˌproʊdʌkˈtɪvəti/", meaning: "productividad", partOfSpeech: "sustantivo", example: { text: "Productivity actually went up.", translation: "De hecho, la productividad subió." } },
      ],
      dialogues: [
        {
          id: "en-b2-u1-l1-d1",
          title: "Back to the office?",
          context: "Dos compañeros debaten la nueva política de la empresa: volver a la oficina tres días por semana.",
          speakers: [
            { name: "Priya", role: "jefa de proyecto" },
            { name: "Marcos", role: "desarrollador" },
          ],
          lines: [
            { speaker: "Priya", text: "I know it's unpopular, but I think the new policy makes sense.", translation: "Sé que no es popular, pero creo que la nueva política tiene sentido." },
            { speaker: "Marcos", text: "Really? Despite all the time we'll waste commuting?", translation: "¿En serio? ¿A pesar de todo el tiempo que perderemos en desplazamientos?" },
            { speaker: "Priya", text: "Although the commute is a drawback, people collaborate much better face to face.", translation: "Aunque el trayecto es un inconveniente, la gente colabora mucho mejor cara a cara." },
            { speaker: "Marcos", text: "Maybe for your team. Our productivity went up when we worked from home, whereas meetings slow us down.", translation: "Quizá para tu equipo. Nuestra productividad subió cuando trabajábamos desde casa, mientras que las reuniones nos frenan." },
            { speaker: "Priya", text: "Fair point. However, a lot of new hires told me they felt isolated.", translation: "Buen argumento. Sin embargo, muchos recién contratados me dijeron que se sentían aislados." },
            { speaker: "Marcos", text: "Even though I'd rather stay home, I can see why juniors need the office. Nevertheless, three days feels like too many.", translation: "Aunque preferiría quedarme en casa, entiendo que los júniors necesiten la oficina. Aun así, tres días me parecen demasiados." },
          ],
        },
      ],
      exercises: [
        {
          id: "en-b2-u1-l1-e1",
          type: "fill-blank",
          skill: "Although vs despite",
          instruction: "Elige el conector correcto.",
          before: "",
          after: "the bad weather, the festival was a huge success.",
          translation: "A pesar del mal tiempo, el festival fue un éxito enorme.",
          options: [
            { value: "Despite", feedback: "¡Correcto! Le sigue un sustantivo (the bad weather)." },
            { value: "Although", feedback: "although necesita una cláusula: Although the weather was bad…" },
            { value: "However", feedback: "however conecta oraciones completas, no va delante de un sustantivo." },
          ],
          accepted: ["Despite"],
          explanation: "despite / in spite of + sustantivo o -ing · although + sujeto + verbo.",
        },
        {
          id: "en-b2-u1-l1-e2",
          type: "multiple-choice",
          skill: "Despite + -ing",
          instruction: "¿Qué oración es correcta?",
          question: "«A pesar de estar cansada, terminó el informe.»",
          options: [
            { id: "a", text: "Despite being tired, she finished the report.", correct: true, feedback: "Correcto: despite + -ing." },
            { id: "b", text: "Despite of being tired, she finished the report.", correct: false, feedback: "despite nunca lleva of (in spite of sí)." },
            { id: "c", text: "Despite she was tired, she finished the report.", correct: false, feedback: "despite no puede ir seguido de una cláusula; usa although." },
          ],
          explanation: "despite + -ing / sustantivo; para una cláusula, despite the fact that o although.",
        },
        {
          id: "en-b2-u1-l1-e3",
          type: "multiple-choice",
          skill: "However: puntuación",
          instruction: "Elige la versión bien puntuada.",
          question: "Une las ideas: «The flat is small» / «it's in a great location».",
          options: [
            { id: "a", text: "The flat is small. However, it's in a great location.", correct: true, feedback: "Correcto: however abre una nueva oración y va seguido de coma." },
            { id: "b", text: "The flat is small, however it's in a great location.", correct: false, feedback: "Comma splice: however no puede unir dos oraciones solo con coma." },
            { id: "c", text: "The flat is small however, it's in a great location.", correct: false, feedback: "La puntuación está descolocada." },
          ],
          explanation: "Oración. However, oración. — o con punto y coma: …small; however, it's…",
        },
        {
          id: "en-b2-u1-l1-e4",
          type: "sentence-builder",
          skill: "Whereas",
          instruction: "Ordena las palabras.",
          prompt: "Mi hermano es extrovertido, mientras que yo soy bastante tímido.",
          blocks: en("My", "brother", "is", "outgoing,", "whereas", "I'm", "quite", "shy"),
          solutions: [[0, 1, 2, 3, 4, 5, 6, 7]],
          explanation: "whereas contrasta dos hechos paralelos dentro de la misma oración.",
        },
        {
          id: "en-b2-u1-l1-e5",
          type: "fill-blank",
          skill: "In spite of",
          instruction: "Escribe la palabra que falta.",
          before: "In spite",
          after: "the high price, the tickets sold out in minutes.",
          translation: "A pesar del precio elevado, las entradas se agotaron en minutos.",
          accepted: ["of"],
          explanation: "in spite OF · despite (sin of).",
        },
        {
          id: "en-b2-u1-l1-e6",
          type: "multiple-choice",
          skill: "Comprensión oral",
          instruction: "Escucha y responde.",
          question: "¿Qué opina el hablante del coche eléctrico?",
          audioText: "Even though electric cars are still expensive, I'm convinced they'll pay for themselves in the long run.",
          options: [
            { id: "a", text: "Es caro, pero cree que compensa a largo plazo.", correct: true, feedback: "¡Exacto! Even though introduce la concesión." },
            { id: "b", text: "Es demasiado caro y no merece la pena.", correct: false, feedback: "Reconoce el precio, pero su conclusión es positiva." },
            { id: "c", text: "Ya es barato.", correct: false, feedback: "Dice «still expensive»." },
          ],
          explanation: "Even though + concesión, idea principal en la otra cláusula.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── Lesson 2
    {
      id: "en-b2-u1-l2",
      unitId: "en-b2-u1",
      order: 2,
      title: "Si hubiera sabido…",
      nativeTitle: "Second, third & mixed conditionals",
      summary: "Hipótesis presentes, arrepentimientos pasados y condicionales mixtos; I wish / if only.",
      objectives: [
        "Formar el segundo condicional para situaciones imaginarias",
        "Formar el tercer condicional para hablar de un pasado que no ocurrió",
        "Combinar tiempos en condicionales mixtos",
        "Expresar deseos y arrepentimientos con I wish / if only",
      ],
      estimatedMinutes: 35,
      theory: [
        {
          kind: "table",
          title: "Los condicionales de un vistazo",
          headers: ["Tipo", "If-clause", "Main clause", "Uso"],
          rows: [
            ["2.º", "past simple", "would + verb", "presente/futuro imaginario"],
            ["3.º", "past perfect", "would have + participio", "pasado imaginario (no ocurrió)"],
            ["mixto A", "past perfect", "would + verb", "pasado distinto → presente distinto"],
            ["mixto B", "past simple", "would have + participio", "rasgo actual → pasado distinto"],
          ],
        },
        {
          kind: "grammar",
          title: "Segundo condicional",
          pattern: "If + past simple, would / could / might + base verb",
          explanation:
            "Situaciones hipotéticas o poco probables en el presente o futuro. El pasado aquí no indica tiempo pasado sino «distancia de la realidad». Con be se prefiere were para todas las personas en registro cuidado: If I were you…",
          examples: [
            { text: "If I had more time, I'd learn to play the piano.", translation: "Si tuviera más tiempo, aprendería a tocar el piano." },
            { text: "If I were you, I'd accept the offer.", translation: "Yo que tú, aceptaría la oferta." },
          ],
        },
        {
          kind: "grammar",
          title: "Tercer condicional",
          pattern: "If + had + participle, would have + participle",
          explanation:
            "Imagina un pasado diferente al real: para arrepentimientos, críticas o alivio. En la lengua hablada would have se reduce a «would've» /ˈwʊdəv/.",
          examples: [
            { text: "If we had left earlier, we wouldn't have missed the flight.", translation: "Si hubiéramos salido antes, no habríamos perdido el vuelo." },
            { text: "She would have called if she'd known.", translation: "Habría llamado si lo hubiera sabido." },
          ],
        },
        {
          kind: "grammar",
          title: "Condicionales mixtos",
          pattern: "If + had + participle, would + verb (now)",
          explanation:
            "Mezclan tiempos cuando la condición y el resultado ocurren en momentos distintos. Lo más común: un pasado diferente con consecuencia en el presente.",
          examples: [
            { text: "If I had taken that job, I would live in New York now.", translation: "Si hubiera aceptado ese trabajo, ahora viviría en Nueva York." },
            { text: "If he weren't so shy, he would have spoken to her at the party.", translation: "Si no fuera tan tímido, le habría hablado en la fiesta." },
          ],
        },
        {
          kind: "note",
          variant: "tip",
          title: "I wish / If only",
          body:
            "Deseo sobre el presente → past simple: I wish I spoke Chinese. Arrepentimiento sobre el pasado → past perfect: I wish I hadn't said that. Queja sobre lo que otro hace → would: I wish you would stop interrupting. If only es igual, pero más enfático.",
        },
      ],
      vocabulary: [
        { id: "en-b2-regret", term: "regret", ipa: "/rɪˈɡret/", meaning: "arrepentirse; arrepentimiento", partOfSpeech: "verbo", example: { text: "I regret not studying abroad.", translation: "Me arrepiento de no haber estudiado en el extranjero." } },
        { id: "en-b2-turn-down", term: "turn down", ipa: "/tɜːrn daʊn/", meaning: "rechazar (una oferta)", partOfSpeech: "phrasal verb", example: { text: "She turned down a job at Google.", translation: "Rechazó un trabajo en Google." } },
        { id: "en-b2-in-hindsight", term: "in hindsight", ipa: "/ɪn ˈhaɪndsaɪt/", meaning: "visto en retrospectiva", partOfSpeech: "expresión", example: { text: "In hindsight, it was the right decision.", translation: "Visto en retrospectiva, fue la decisión correcta." } },
        { id: "en-b2-take-a-risk", term: "take a risk", ipa: "/teɪk ə rɪsk/", meaning: "arriesgarse", partOfSpeech: "expresión", example: { text: "If you never take risks, you'll never grow.", translation: "Si nunca te arriesgas, nunca crecerás." } },
        { id: "en-b2-opportunity", term: "opportunity", ipa: "/ˌɑːpərˈtuːnəti/", meaning: "oportunidad", partOfSpeech: "sustantivo", example: { text: "It was a once-in-a-lifetime opportunity.", translation: "Fue una oportunidad única en la vida." } },
        { id: "en-b2-afford", term: "afford", ipa: "/əˈfɔːrd/", meaning: "permitirse (pagar)", partOfSpeech: "verbo", example: { text: "If I could afford it, I'd buy a house by the sea.", translation: "Si pudiera permitírmelo, compraría una casa junto al mar." } },
        { id: "en-b2-make-up-mind", term: "make up your mind", ipa: "/meɪk ʌp jʊr maɪnd/", meaning: "decidirse", partOfSpeech: "expresión", example: { text: "I can't make up my mind.", translation: "No me decido." } },
        { id: "en-b2-lucky", term: "lucky", ipa: "/ˈlʌki/", meaning: "afortunado, con suerte", partOfSpeech: "adjetivo", example: { text: "We were lucky the bus was late.", translation: "Tuvimos suerte de que el autobús llegara tarde." } },
      ],
      dialogues: [
        {
          id: "en-b2-u1-l2-d1",
          title: "The road not taken",
          context: "Dos viejos amigos de la universidad recuerdan decisiones importantes de su vida.",
          speakers: [
            { name: "Elena", role: "arquitecta" },
            { name: "Ben", role: "profesor" },
          ],
          lines: [
            { speaker: "Ben", text: "Do you ever regret turning down that offer in Singapore?", translation: "¿Alguna vez te arrepientes de rechazar aquella oferta en Singapur?" },
            { speaker: "Elena", text: "Sometimes. If I had taken it, I'd probably be running my own studio now.", translation: "A veces. Si la hubiera aceptado, probablemente ahora tendría mi propio estudio." },
            { speaker: "Ben", text: "But you wouldn't have met Sam if you'd moved.", translation: "Pero no habrías conocido a Sam si te hubieras mudado." },
            { speaker: "Elena", text: "True. In hindsight, I was lucky. What about you? Any regrets?", translation: "Es verdad. Visto en retrospectiva, tuve suerte. ¿Y tú? ¿Algún arrepentimiento?" },
            { speaker: "Ben", text: "I wish I'd travelled more before having kids. If I had more free time now, I'd go back to Japan.", translation: "Ojalá hubiera viajado más antes de tener hijos. Si ahora tuviera más tiempo libre, volvería a Japón." },
            { speaker: "Elena", text: "If I were you, I'd plan a family trip. The kids would love it!", translation: "Yo que tú, planearía un viaje en familia. ¡A los niños les encantaría!" },
          ],
        },
      ],
      exercises: [
        {
          id: "en-b2-u1-l2-e1",
          type: "fill-blank",
          skill: "Tercer condicional",
          instruction: "Escribe la forma correcta (dos palabras).",
          before: "If I",
          after: "(know) about the strike, I would have taken a taxi.",
          translation: "Si hubiera sabido lo de la huelga, habría cogido un taxi.",
          accepted: ["had known", "'d known"],
          hint: "Pasado imaginario → past perfect.",
          explanation: "Tercer condicional: if + had + participio, would have + participio.",
        },
        {
          id: "en-b2-u1-l2-e2",
          type: "multiple-choice",
          skill: "Segundo condicional",
          instruction: "Elige la opción correcta.",
          question: "«Si fuera tú, hablaría con ella.»",
          options: [
            { id: "a", text: "If I were you, I'd talk to her.", correct: true, feedback: "Correcto: were + would para un consejo hipotético." },
            { id: "b", text: "If I would be you, I'd talk to her.", correct: false, feedback: "No se usa would en la cláusula con if." },
            { id: "c", text: "If I am you, I'll talk to her.", correct: false, feedback: "Es imposible ser otra persona: requiere segundo condicional." },
          ],
          explanation: "If I were you, I'd… es la fórmula fija para dar consejos.",
        },
        {
          id: "en-b2-u1-l2-e3",
          type: "multiple-choice",
          skill: "Condicionales mixtos",
          instruction: "Elige la oración que expresa: «no estudié medicina → hoy no soy médico».",
          question: "¿Cuál es correcta?",
          options: [
            { id: "a", text: "If I had studied medicine, I would be a doctor now.", correct: true, feedback: "¡Bien! Pasado distinto (had studied) → presente distinto (would be)." },
            { id: "b", text: "If I studied medicine, I would have been a doctor now.", correct: false, feedback: "Los tiempos están invertidos." },
            { id: "c", text: "If I had studied medicine, I would have been a doctor now.", correct: false, feedback: "«now» exige would + verbo, no would have." },
          ],
          explanation: "Mixto: if + past perfect, would + verbo (resultado actual).",
        },
        {
          id: "en-b2-u1-l2-e4",
          type: "fill-blank",
          skill: "I wish",
          instruction: "Completa con la forma correcta de say.",
          before: "I wish I",
          after: "that to my boss. It was a huge mistake.",
          translation: "Ojalá no le hubiera dicho eso a mi jefe. Fue un error enorme.",
          options: [
            { value: "hadn't said", feedback: "¡Correcto! Arrepentimiento del pasado → past perfect." },
            { value: "didn't say", feedback: "past simple tras wish se refiere al presente." },
            { value: "wouldn't say", feedback: "wish + would expresa queja sobre lo que otro hace." },
          ],
          accepted: ["hadn't said"],
          explanation: "wish + past perfect = arrepentimiento sobre algo pasado.",
        },
        {
          id: "en-b2-u1-l2-e5",
          type: "sentence-builder",
          skill: "Tercer condicional",
          instruction: "Ordena las palabras.",
          prompt: "No habríamos perdido el tren si hubiéramos salido antes.",
          blocks: en("We", "wouldn't", "have", "missed", "the", "train", "if", "we'd", "left", "earlier"),
          solutions: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
          explanation: "would have + participio en la principal; had (‘d) + participio tras if.",
        },
        {
          id: "en-b2-u1-l2-e6",
          type: "multiple-choice",
          skill: "Comprensión oral",
          instruction: "Escucha y responde.",
          question: "¿Qué ocurrió realmente?",
          audioText: "If she hadn't checked the weather forecast, they would have got stuck on the mountain.",
          options: [
            { id: "a", text: "Ella miró el pronóstico y no se quedaron atrapados.", correct: true, feedback: "¡Eso es! El tercer condicional describe lo contrario de la realidad." },
            { id: "b", text: "Se quedaron atrapados en la montaña.", correct: false, feedback: "Es lo que habría pasado, pero no pasó." },
            { id: "c", text: "Ella olvidó mirar el pronóstico.", correct: false, feedback: "hadn't checked es hipotético: en realidad sí lo miró." },
          ],
          explanation: "Tercer condicional = pasado imaginario; la realidad es la contraria.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── Lesson 3
    {
      id: "en-b2-u1-l3",
      unitId: "en-b2-u1",
      order: 3,
      title: "Opiniones con matices",
      nativeTitle: "Giving balanced opinions",
      summary: "Introducir opiniones, mostrar acuerdo parcial, rebatir con cortesía y concluir un argumento.",
      objectives: [
        "Introducir opiniones sin sonar tajante",
        "Mostrar acuerdo parcial y desacuerdo cortés",
        "Estructurar un argumento: on the one hand / on the other hand",
        "Usar adverbios de postura: arguably, admittedly, undoubtedly",
      ],
      estimatedMinutes: 30,
      theory: [
        {
          kind: "table",
          title: "Funciones y expresiones",
          headers: ["Función", "Expresiones"],
          rows: [
            ["Opinar", "As I see it, … · I'd say that… · It seems to me that…"],
            ["Acuerdo parcial", "I see your point, but… · That's true to some extent. · Up to a point, yes."],
            ["Desacuerdo cortés", "I'm not sure I agree. · I see it slightly differently. · With respect, …"],
            ["Equilibrar", "On the one hand, … On the other hand, … · That said, …"],
            ["Concluir", "All things considered, … · On balance, … · At the end of the day, …"],
          ],
        },
        {
          kind: "grammar",
          title: "Adverbios de postura",
          pattern: "Stance adverb, + clause",
          explanation:
            "Al principio de la frase indican tu actitud ante lo que dices. Admittedly concede un punto al otro; arguably presenta una opinión defendible; undoubtedly muestra certeza.",
          examples: [
            { text: "Admittedly, public transport isn't perfect.", translation: "Hay que reconocer que el transporte público no es perfecto." },
            { text: "It's arguably the best film of the decade.", translation: "Podría decirse que es la mejor película de la década." },
          ],
        },
        {
          kind: "note",
          variant: "culture",
          title: "Desacuerdo «a la inglesa»",
          body:
            "En inglés, sobre todo británico, un «No, you're wrong» suena muy brusco. Se suaviza con un acuerdo parcial previo («I see what you mean, but…»), preguntas («Don't you think that…?») o atenuadores («I'm not entirely convinced»).",
        },
        {
          kind: "note",
          variant: "warning",
          title: "Falsos amigos del debate",
          body:
            "actually = en realidad (no «actualmente» → currently) · discussion = debate, conversación (no «pelea» → argument) · sensible = sensato (no «sensible» → sensitive) · in my opinion (no «according to me»).",
        },
      ],
      vocabulary: [
        { id: "en-b2-to-some-extent", term: "to some extent", ipa: "/tə sʌm ɪkˈstent/", meaning: "hasta cierto punto", partOfSpeech: "expresión", example: { text: "I agree with you to some extent.", translation: "Estoy de acuerdo contigo hasta cierto punto." } },
        { id: "en-b2-admittedly", term: "admittedly", ipa: "/ədˈmɪtɪdli/", meaning: "hay que reconocer que", partOfSpeech: "adverbio", example: { text: "Admittedly, it's expensive.", translation: "Hay que reconocer que es caro." } },
        { id: "en-b2-arguably", term: "arguably", ipa: "/ˈɑːrɡjuəbli/", meaning: "posiblemente, podría decirse", partOfSpeech: "adverbio", example: { text: "She is arguably the best player.", translation: "Podría decirse que es la mejor jugadora." } },
        { id: "en-b2-on-balance", term: "on balance", ipa: "/ɑːn ˈbæləns/", meaning: "en general, sopesándolo todo", partOfSpeech: "expresión", example: { text: "On balance, the benefits outweigh the costs.", translation: "Sopesándolo todo, los beneficios superan a los costes." } },
        { id: "en-b2-outweigh", term: "outweigh", ipa: "/ˌaʊtˈweɪ/", meaning: "pesar más que, superar", partOfSpeech: "verbo", example: { text: "The risks outweigh the benefits.", translation: "Los riesgos superan a los beneficios." } },
        { id: "en-b2-actually", term: "actually", ipa: "/ˈæktʃuəli/", meaning: "en realidad, de hecho", partOfSpeech: "adverbio", example: { text: "Actually, I think you're right.", translation: "De hecho, creo que tienes razón." }, note: "Falso amigo: «actualmente» = currently / nowadays." },
        { id: "en-b2-sensible", term: "sensible", ipa: "/ˈsensəbl/", meaning: "sensato", partOfSpeech: "adjetivo", example: { text: "That's a sensible solution.", translation: "Es una solución sensata." }, note: "Falso amigo: «sensible» = sensitive." },
        { id: "en-b2-ban", term: "ban", ipa: "/bæn/", meaning: "prohibir; prohibición", partOfSpeech: "verbo", example: { text: "Should cities ban cars from the centre?", translation: "¿Deberían las ciudades prohibir los coches en el centro?" } },
      ],
      dialogues: [
        {
          id: "en-b2-u1-l3-d1",
          title: "Car-free city centre",
          context: "Un debate en la radio local sobre prohibir los coches en el centro de la ciudad.",
          speakers: [
            { name: "Host", role: "presentadora" },
            { name: "Dr Okafor", role: "urbanista" },
            { name: "Mr Lane", role: "comerciante" },
          ],
          lines: [
            { speaker: "Host", text: "Dr Okafor, should we ban cars from the city centre?", translation: "Dra. Okafor, ¿deberíamos prohibir los coches en el centro?" },
            { speaker: "Dr Okafor", text: "As I see it, it's arguably the most effective way to cut pollution.", translation: "A mi modo de ver, podría decirse que es la forma más eficaz de reducir la contaminación." },
            { speaker: "Mr Lane", text: "I see your point, but I'm not entirely convinced. Many of my customers drive in from villages.", translation: "Entiendo lo que dice, pero no estoy del todo convencido. Muchos de mis clientes vienen en coche desde los pueblos." },
            { speaker: "Dr Okafor", text: "Admittedly, that's a real concern. That said, cities that went car-free actually saw sales go up.", translation: "Hay que reconocer que es una preocupación real. Dicho esto, las ciudades que eliminaron los coches de hecho vieron subir las ventas." },
            { speaker: "Mr Lane", text: "To some extent, maybe. On the other hand, those cities had excellent public transport.", translation: "Quizá hasta cierto punto. Por otro lado, esas ciudades tenían un transporte público excelente." },
            { speaker: "Host", text: "So, on balance, is it a sensible idea?", translation: "Entonces, sopesándolo todo, ¿es una idea sensata?" },
            { speaker: "Dr Okafor", text: "I'd say yes — provided we invest in buses and park-and-ride first.", translation: "Yo diría que sí, siempre que primero invirtamos en autobuses y aparcamientos disuasorios." },
          ],
        },
      ],
      exercises: [
        {
          id: "en-b2-u1-l3-e1",
          type: "multiple-choice",
          skill: "Desacuerdo cortés",
          instruction: "Elige la respuesta más diplomática.",
          question: "Tu jefe propone una idea que no te convence.",
          options: [
            { id: "a", text: "I see your point, but I'm not sure it'll work for our clients.", correct: true, feedback: "Perfecto: acuerdo parcial + desacuerdo suavizado." },
            { id: "b", text: "No, that's wrong.", correct: false, feedback: "Gramaticalmente bien, pero demasiado directo en un contexto profesional." },
            { id: "c", text: "According to me, this idea is bad.", correct: false, feedback: "«According to me» no es natural; además suena brusco." },
          ],
          explanation: "Suaviza el desacuerdo: I see your point, but… / I'm not entirely convinced.",
        },
        {
          id: "en-b2-u1-l3-e2",
          type: "fill-blank",
          skill: "Falsos amigos",
          instruction: "Elige la palabra correcta.",
          before: "Everyone thinks he's lazy, but",
          after: "he works really hard.",
          translation: "Todos creen que es vago, pero en realidad trabaja muchísimo.",
          options: [
            { value: "actually", feedback: "¡Correcto! actually = en realidad." },
            { value: "currently", feedback: "currently = actualmente, en este momento." },
            { value: "nowadays", feedback: "nowadays = hoy en día; no corrige una idea equivocada." },
          ],
          accepted: ["actually"],
          explanation: "actually corrige una suposición: «en realidad».",
        },
        {
          id: "en-b2-u1-l3-e3",
          type: "sentence-builder",
          skill: "Estructurar un argumento",
          instruction: "Ordena las palabras.",
          prompt: "Sopesándolo todo, los beneficios superan a los riesgos.",
          blocks: en("On", "balance,", "the", "benefits", "outweigh", "the", "risks"),
          solutions: [[0, 1, 2, 3, 4, 5, 6]],
          explanation: "On balance introduce la conclusión tras valorar pros y contras.",
        },
        {
          id: "en-b2-u1-l3-e4",
          type: "multiple-choice",
          skill: "Adverbios de postura",
          instruction: "¿Qué adverbio concede un punto al oponente?",
          question: "«…, the new system has some bugs. But it's still faster.»",
          options: [
            { id: "a", text: "Admittedly", correct: true, feedback: "Correcto: admittedly reconoce un punto débil antes de defender tu idea." },
            { id: "b", text: "Undoubtedly", correct: false, feedback: "undoubtedly expresa certeza, no concesión." },
            { id: "c", text: "Eventually", correct: false, feedback: "eventually = finalmente." },
          ],
          explanation: "Admittedly, X. But Y. = concedo X, pero defiendo Y.",
        },
        {
          id: "en-b2-u1-l3-e5",
          type: "fill-blank",
          skill: "Acuerdo parcial",
          instruction: "Completa la expresión (una palabra).",
          before: "I agree with you to some",
          after: ", but not completely.",
          translation: "Estoy de acuerdo contigo hasta cierto punto, pero no del todo.",
          accepted: ["extent"],
          explanation: "to some extent = hasta cierto punto.",
        },
        {
          id: "en-b2-u1-l3-e6",
          type: "multiple-choice",
          skill: "Comprensión oral",
          instruction: "Escucha y responde.",
          question: "¿Cuál es la postura final del hablante?",
          audioText: "On the one hand, tourism creates jobs. On the other hand, it pushes up rents. All things considered, I think we need limits.",
          options: [
            { id: "a", text: "Está a favor de limitar el turismo.", correct: true, feedback: "¡Bien! All things considered introduce la conclusión." },
            { id: "b", text: "Quiere más turismo para crear empleo.", correct: false, feedback: "Ese es solo uno de los argumentos que sopesa." },
            { id: "c", text: "No tiene una opinión clara.", correct: false, feedback: "Concluye con «I think we need limits»." },
          ],
          explanation: "On the one hand… On the other hand… All things considered… = estructura de un argumento equilibrado.",
        },
      ],
    },
  ],
};

export const b2Units: Unit[] = [b2Unit1];
